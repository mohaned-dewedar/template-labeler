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
    REVIEW_DATA_DIR = Path("backend/review_data")
    
    REVIEW_DATA_DIR.mkdir(parents=True, exist_ok=True)
    UPLOAD_FOLDER.mkdir(parents=True, exist_ok=True)
    REVIEW_FOLDER.mkdir(parents=True, exist_ok=True)    
    ACCEPT_DIR.mkdir(parents=True, exist_ok=True)
    PASS_DIR.mkdir(parents=True, exist_ok=True) 
    TEMP_DIR.mkdir(parents=True, exist_ok=True)
    DECLINE_DIR.mkdir(parents=True, exist_ok=True)

