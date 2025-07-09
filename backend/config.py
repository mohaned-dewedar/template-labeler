# Configuration classes and settings 
from pathlib import Path

class Config:
    SECRET_KEY = "review-secret"
    UPLOAD_FOLDER = Path("uploads")
    REVIEW_FOLDER = Path("reviewed")
    ACCEPT_DIR = REVIEW_FOLDER / "accepted"
    PASS_DIR = REVIEW_FOLDER / "passed"
    TEMP_DIR = REVIEW_FOLDER / "temp"
    DECLINE_DIR = REVIEW_FOLDER / "declined"
