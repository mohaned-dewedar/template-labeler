# Endpoints for upload, frame-action, and download 
from backend.utils.video_utils import extract_frames_from_video
from backend.utils.matching import sift_match_and_crop
from backend.services.review_session import FrameReviewSession
from backend.config import Config
from backend.routes import review_bp

import base64
import shutil
import zipfile
from pathlib import Path
import json
import uuid

import cv2
from flask import (
    Flask,
    render_template,
    request,
    redirect,
    url_for,
    send_file,
    session,
    jsonify,
    send_from_directory,
)



REVIEW_METADATA = []

UPLOAD_FOLDER = Config.UPLOAD_FOLDER
REVIEW_FOLDER = Config.REVIEW_FOLDER
ACCEPT_DIR = Config.ACCEPT_DIR
PASS_DIR = Config.PASS_DIR
TEMP_DIR = Config.TEMP_DIR
DECLINE_DIR = Config.DECLINE_DIR
REVIEW_DATA_DIR = Config.REVIEW_DATA_DIR



FRAME_PATHS = []
ORIG_PATHS = []

for d in [UPLOAD_FOLDER, ACCEPT_DIR, PASS_DIR, TEMP_DIR]:
    d.mkdir(parents=True, exist_ok=True)


# @app.route("/")
# def index():
#     return app.send_static_file("index.html")




@review_bp.route('/api/upload', methods=['POST'])
def api_upload():
    input_type = request.form.get('inputType', 'video')
    template_file = request.files.get('template')

    if not template_file:
        return jsonify({'error': 'Missing template file'}), 400

    review_id = str(uuid.uuid4())
    session['review_id'] = review_id

    template_path = UPLOAD_FOLDER / (template_file.filename or 'template')
    template_file.save(template_path)

    review = FrameReviewSession(template_path=template_path, temp_dir=TEMP_DIR)

    if input_type == 'video':
        video_file = request.files.get('video')
        if not video_file:
            return jsonify({'error': 'Missing video file'}), 400
        video_path = UPLOAD_FOLDER / (video_file.filename or 'video.mp4')
        video_file.save(video_path)
        review.prepare_from_video(video_path)

    elif input_type == 'zip':
        zip_file = request.files.get('zip')
        if not zip_file:
            return jsonify({'error': 'Missing zip file'}), 400
        zip_path = UPLOAD_FOLDER / (zip_file.filename or 'upload.zip')
        zip_file.save(zip_path)
        review.prepare_from_zip(zip_path)

    else:
        return jsonify({'error': 'Invalid input type'}), 400

    # Save review metadata to disk
    data = {
        "index": 0,
        "frame_paths": [str(p) for p in review.frame_paths],
        "orig_paths": [str(p) for p in review.orig_paths],
        "metadata": review.metadata,
    }

    with open(REVIEW_DATA_DIR / f"{review_id}.json", "w") as f:
        json.dump(data, f)

    return jsonify({'total': len(review.frame_paths)})



@review_bp.route('/api/frame')
def api_frame():
    review_id = session.get('review_id')
    if not review_id:
        return jsonify({'done': True})

    data_file = REVIEW_DATA_DIR / f"{review_id}.json"
    if not data_file.exists():
        return jsonify({'done': True})

    with open(data_file, "r") as f:
        data = json.load(f)

    idx = data["index"]
    frame_paths = data["frame_paths"]
    if idx >= len(frame_paths):
        return jsonify({'done': True})

    # Load image
    img_path = frame_paths[idx]
    _, buffer = cv2.imencode(".jpg", cv2.imread(img_path))
    img_data = base64.b64encode(buffer).decode("utf-8")

    return jsonify({
        "index": idx,
        "img_data": img_data,
        "total": len(frame_paths),
        "done": False
    })



@review_bp.route('/api/action', methods=['POST'])
def api_action():
    review_id = session.get('review_id')
    if not review_id:
        return jsonify({'error': 'No session'}), 400

    data_file = REVIEW_DATA_DIR / f"{review_id}.json"
    if not data_file.exists():
        return jsonify({'error': 'Session expired'}), 400

    with open(data_file, "r") as f:
        data = json.load(f)

    idx = data["index"]
    frame_paths = data["frame_paths"]
    orig_paths = data["orig_paths"]
    metadata = data["metadata"]

    if idx >= len(frame_paths):
        return jsonify({'error': 'No more frames'}), 400

    action = request.json.get("action")
    # (perform action: copy or discard image)

    # Advance index
    data["index"] += 1
    with open(data_file, "w") as f:
        json.dump(data, f)

    return jsonify({"ok": True})

@review_bp.route('/api/metadata')
def api_metadata():
    metadata = session.get('metadata', [])
    return jsonify(metadata)


@review_bp.route('/api/download')
def api_download():
    review_id = session.get('review_id')
    zip_path = shutil.make_archive("accepted_images", "zip", ACCEPT_DIR)
    
    # Clean up
    try:
        (REVIEW_DATA_DIR / f"{review_id}.json").unlink()
    except:
        pass

    return send_file(zip_path, as_attachment=True)


def prepare_frames(input_path: Path, template_path: Path, input_type: str = 'video', interval: float = 1.0, metadata: list = []):
    metadata.clear()
    template = cv2.imread(str(template_path))
    
    FRAME_PATHS.clear()
    ORIG_PATHS.clear()
    
    # Clean up temp directory more carefully
    for f in TEMP_DIR.glob("*"):
        try:
            if f.is_dir():
                shutil.rmtree(f)
            else:
                f.unlink()
        except (PermissionError, OSError) as e:
            print(f"Warning: Could not delete {f}: {e}")
            # Continue anyway - this is just cleanup
    
    if input_type == 'video':
        # Original video processing
        frames = extract_frames_from_video(str(input_path), interval_seconds=int(interval))
        frame_data = [(frame, ts) for frame, ts in frames]
    
    elif input_type == 'zip':
        # New ZIP processing
        frame_data = []
        extract_dir = TEMP_DIR / "extracted"
        
        try:
            with zipfile.ZipFile(input_path, 'r') as zip_ref:
                # Extract ZIP to a temporary directory
                extract_dir.mkdir(exist_ok=True)
                zip_ref.extractall(extract_dir)
                
                # Find all image files
                image_extensions = {'.jpg', '.jpeg', '.png', '.bmp', '.tiff', '.webp'}
                image_files = []
                
                for ext in image_extensions:
                    image_files.extend(extract_dir.rglob(f"*{ext}"))
                    image_files.extend(extract_dir.rglob(f"*{ext.upper()}"))
                
                # Sort files by name for consistent ordering
                image_files.sort()
                
                # Load images
                for img_path in image_files:
                    try:
                        frame = cv2.imread(str(img_path))
                        if frame is not None:
                            frame_data.append((frame, img_path.name))
                    except Exception as e:
                        print(f"Error loading image {img_path}: {e}")
                        continue
        
        except Exception as e:
            print(f"Error processing ZIP file: {e}")
            return
        
        finally:
            # Clean up extracted files
            if extract_dir.exists():
                try:
                    shutil.rmtree(extract_dir)
                except (PermissionError, OSError) as e:
                    print(f"Warning: Could not clean up extracted directory: {e}")
    
        for idx, (frame, identifier) in enumerate(frame_data):
            display = frame.copy()
            frame_file = TEMP_DIR / f"frame_{idx:04d}.jpg"
            orig_file = TEMP_DIR / f"orig_{idx:04d}.jpg"

            try:
                _, box, score = sift_match_and_crop(frame, template, show_plot=False)
                x, y, w, h = box
                cv2.rectangle(display, (x, y), (x + w, y + h), (0, 255, 0), 2)
                cv2.putText(display, f"Score: {score:.2f}", (10, 30), cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 255, 0), 2)

                REVIEW_METADATA.append({
                    "frame": frame_file.name,
                    "bbox": [x, y, w, h],
                    "score": round(score, 4),
                    "status": "pending"
                })

            except Exception as e:
                # Still render 'no match' image
                cv2.putText(display, "No match", (10, 30), cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 0, 255), 2)

                # Save null metadata
                REVIEW_METADATA.append({
                    "frame": frame_file.name,
                    "bbox": None,
                    "score": None,
                    "status": "pending"
                })

            cv2.imwrite(str(frame_file), display)
            cv2.imwrite(str(orig_file), frame)
            FRAME_PATHS.append(frame_file)
            ORIG_PATHS.append(orig_file)

@review_bp.route('/legacy', methods=['GET', 'POST'])
def legacy_upload():
    if request.method == 'POST':
        video = request.files['video']
        template = request.files['template']
        if not video or not template:
            return "Missing files", 400
        video_path = UPLOAD_FOLDER / (video.filename or 'video')
        template_path = UPLOAD_FOLDER / (template.filename or 'template')
        video.save(video_path)
        template.save(template_path)
        prepare_frames(video_path, template_path)
        session['idx'] = 0
        return redirect(url_for('review'))
    return render_template('upload.html')

@review_bp.route('/review', methods=['GET'])
def review():
    idx = session.get('idx', 0)
    if idx >= len(FRAME_PATHS):
        return redirect(url_for('complete'))
    img_path = FRAME_PATHS[idx]
    with open(img_path, 'rb') as f:
        img_data = base64.b64encode(f.read()).decode('utf-8')
    return render_template('review.html', index=idx, total=len(FRAME_PATHS), img_data=img_data)

@review_bp.route('/action', methods=['POST'])
def action():
    action = request.form.get('action')
    idx = session.get('idx', 0)
    if idx >= len(ORIG_PATHS):
        return redirect(url_for('complete'))
    src = ORIG_PATHS[idx]
    if action == 'accept':
        dest = ACCEPT_DIR / src.name
        shutil.copy(src, dest)
    elif action == 'pass':
        dest = PASS_DIR / src.name
        shutil.copy(src, dest)
    session['idx'] = idx + 1
    if session['idx'] >= len(FRAME_PATHS):
        return redirect(url_for('complete'))
    return redirect(url_for('review'))

@review_bp.route('/complete')
def complete():
    zip_path = REVIEW_FOLDER / 'accepted_images.zip'
    with zipfile.ZipFile(zip_path, 'w') as zf:
        for img_path in ACCEPT_DIR.glob('*.jpg'):
            zf.write(img_path, img_path.name)
    return render_template('complete.html')

@review_bp.route('/download')
def download_zip():
    zip_path = REVIEW_FOLDER / 'accepted_images.zip'
    return send_file(zip_path, as_attachment=True)

if __name__ == '__main__':
    review_bp.run()
