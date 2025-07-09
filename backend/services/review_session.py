# FrameReviewSession class and related logic 
from backend.utils.video_utils import extract_frames_from_video
from backend.utils.matching import sift_match_and_crop
import cv2, shutil, zipfile
from pathlib import Path

class FrameReviewSession:
    def __init__(self, template_path: Path, temp_dir: Path):
        self.template = cv2.imread(str(template_path))
        self.temp_dir = temp_dir
        self.frame_paths = []
        self.orig_paths = []
        self.metadata = []

        self._clean_temp_dir()

    def prepare_from_video(self, video_path: Path, interval: float = 1.0):
        frames = extract_frames_from_video(str(video_path), interval_seconds=int(interval))
        self._process_frames([(f, str(idx)) for idx, (f, _) in enumerate(frames)])

    def prepare_from_zip(self, zip_path: Path):
        extracted = self._extract_images(zip_path)
        self._process_frames(extracted)

    def _clean_temp_dir(self):
        for f in self.temp_dir.glob("*"):
            try:
                if f.is_dir():
                    shutil.rmtree(f)
                else:
                    f.unlink()
            except Exception as e:
                print(f"[WARN] Could not delete {f}: {e}")

    def _extract_images(self, zip_path: Path):
        extract_dir = self.temp_dir / "extracted"
        extract_dir.mkdir(exist_ok=True)
        image_data = []

        try:
            with zipfile.ZipFile(zip_path, 'r') as zip_ref:
                zip_ref.extractall(extract_dir)

            image_extensions = {'.jpg', '.jpeg', '.png', '.bmp', '.tiff', '.webp'}
            image_files = []
            for ext in image_extensions:
                image_files += list(extract_dir.rglob(f"*{ext}")) + list(extract_dir.rglob(f"*{ext.upper()}"))
            image_files.sort()

            for img_path in image_files:
                frame = cv2.imread(str(img_path))
                if frame is not None:
                    image_data.append((frame, img_path.name))
        finally:
            try:
                shutil.rmtree(extract_dir)
            except Exception as e:
                print(f"[WARN] Could not clean extracted dir: {e}")

        return image_data

    def _process_frames(self, frame_data):
        for idx, (frame, identifier) in enumerate(frame_data):
            display = frame.copy()
            frame_file = self.temp_dir / f"frame_{idx:04d}.jpg"
            orig_file = self.temp_dir / f"orig_{idx:04d}.jpg"

            try:
                _, box, score = sift_match_and_crop(frame, self.template)
                x, y, w, h = box
                cv2.rectangle(display, (x, y), (x + w, y + h), (0, 255, 0), 2)
                cv2.putText(display, f"Score: {score:.2f}", (10, 30), cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 255, 0), 2)
                self.metadata.append({
                    "frame": frame_file.name,
                    "bbox": [x, y, w, h],
                    "score": round(score, 4),
                    "status": "pending"
                })
            except Exception:
                cv2.putText(display, "No match", (10, 30), cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 0, 255), 2)
                self.metadata.append({
                    "frame": frame_file.name,
                    "bbox": None,
                    "score": None,
                    "status": "pending"
                })

            cv2.imwrite(str(frame_file), display)
            cv2.imwrite(str(orig_file), frame)
            self.frame_paths.append(frame_file)
            self.orig_paths.append(orig_file)
