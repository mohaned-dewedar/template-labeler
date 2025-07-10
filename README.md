# 🗺️ Sift Cropper

**Sift Cropper** is a personal project exploring the intersection of **image processing**, **web development**, and **machine learning**. Its primary goal is to automatically **crop maps from recorded gameplay videos** using the SIFT (Scale-Invariant Feature Transform) algorithm.

Beyond automated map cropping, this tool is evolving into a **semi-automatic object detection and labeling utility**. Users can quickly review and decide to accept or reject SIFT-detected bounding boxes, significantly reducing the manual effort typically required for image annotation.

---

## 🚀 Features

- **Flexible Uploads**: Upload videos or ZIP archives containing images.
- **Intelligent Processing**: Automatically extracts frames and applies SIFT-based image processing to detect and crop relevant sections.
- **Interactive Review**: Provides a visual interface where users can easily accept or reject each automatically cropped result.
- **Downloadable Results**: Download only the images that have been reviewed and accepted.

---

## 🛠️ Installation

### 🔧 Backend Setup

```bash
git clone <your-repo-url>   # Replace with your actual repository URL
cd Sift_Cropper
pip install -r requirements.txt
python run.py
```

### 🌐 Frontend Setup

```bash
cd frontend
npm install
npm start
```


## 💻 Usage

Once both the backend and frontend are running:

1. Open your web browser and navigate to `http://localhost:5000`
2. Upload a video file or a ZIP file containing images
3. Review the automatically cropped images presented in the interface
4. Accept or reject each cropped image based on your needs
5. Download the folder containing all your processed and accepted images

## 🚧 Work In Progress

- **Dockerization**: Packaging the application into Docker containers for easier deployment and portability
- **Executable/Bash Conversion**: Converting the application into a standalone executable or a simple bash script for streamlined execution