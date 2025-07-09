import cv2

def extract_frames_from_video(video_path, interval_seconds=10, start_time=0.0, end_time=None):
    """
    Extract frames at fixed intervals from a video.

    Returns:
        List of (frame_image, timestamp)
    """
    cap = cv2.VideoCapture(video_path)
    if not cap.isOpened():
        raise ValueError(f"Could not open video: {video_path}")

    fps = cap.get(cv2.CAP_PROP_FPS)
    total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
    duration = total_frames / fps

    start_frame = int(start_time * fps)
    end_frame = int(end_time * fps) if end_time else total_frames
    frame_interval = int(interval_seconds * fps)

    frames = []
    cap.set(cv2.CAP_PROP_POS_FRAMES, start_frame)

    current_frame = start_frame
    while current_frame < end_frame:
        ret, frame = cap.read()
        if not ret:
            break
        if current_frame % frame_interval == 0:
            timestamp = current_frame / fps
            frames.append((frame.copy(), timestamp))
        current_frame += 1

    cap.release()
    return frames


def crop_frame_by_coords(frame, coords):
    """
    Crop a rectangular region from the frame.

    Args:
        coords: (x, y, width, height)
    """
    x, y, w, h = coords
    return frame[y:y+h, x:x+w]


def process_video_to_crops(video_path, coords, interval_seconds=1):
    """
    Full pipeline: extract frames and crop by coords.

    Returns:
        List of (cropped_frame, timestamp)
    """
    frames = extract_frames_from_video(video_path, interval_seconds)
    return [(crop_frame_by_coords(f, coords), ts) for f, ts in frames]
