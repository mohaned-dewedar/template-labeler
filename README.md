# Sift Cropper

Sift Cropper
🧠 Why Am I Creating This?
This project is a personal learning exercise in image processing, web development, and machine learning. The core motivation is to automatically crop maps from recorded gameplay videos using the SIFT (Scale-Invariant Feature Transform) algorithm.

Instead of manually cropping the map or relying on users to provide coordinates (which may not be feasible if HUDs are customized), this tool helps automate the cropping process. Over time, I realized this could also serve as a semi-automatic object detection/labelling tool, where users review and accept or reject SIFT-detected bounding boxes—reducing manual annotation work.

🚀 Features
Upload videos or ZIP files containing images

Extract frames and apply SIFT-based image processing

Visual review and accept/reject interface for cropped results

Download processed and accepted images

🛠️ Installation
Backend Setup
bash
Copy
Edit
git clone <your-repo-url>
cd Sift_Cropper
pip install -r requirements.txt
python run.py
Frontend Setup
bash
Copy
Edit
cd frontend
npm install
npm start
💻 Usage
Open your browser and go to http://localhost:3000

Upload a video or ZIP file containing images

Review automatically cropped images

Accept or reject each cropped image

Download the processed (accepted) results



# Work In Progress
Dockerize Application and convert to executable/bash file.








