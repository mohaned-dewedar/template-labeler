import cv2
import numpy as np
import matplotlib.pyplot as plt

def sift_match_and_crop(img, template, show_plot=False):
    """
    Match template in image using SIFT, return cropped region and match metadata.
    
    Returns:
        cropped: Cropped matched region from original image
        coordinates: (x, y, w, h)
        score: float confidence score
    """
    sift = cv2.SIFT_create()
    kp1, des1 = sift.detectAndCompute(template, None)
    kp2, des2 = sift.detectAndCompute(img, None)

    if des1 is None or des2 is None:
        raise ValueError("Descriptors not found")

    bf = cv2.BFMatcher()
    matches = bf.knnMatch(des1, des2, k=2)

    # Lowe’s ratio test
    good = [m for m, n in matches if m.distance < 0.75 * n.distance]
    if len(good) < 10:
        raise ValueError("Not enough good matches")

    src_pts = np.float32([kp1[m.queryIdx].pt for m in good]).reshape(-1, 1, 2)
    dst_pts = np.float32([kp2[m.trainIdx].pt for m in good]).reshape(-1, 1, 2)

    M, _ = cv2.findHomography(src_pts, dst_pts, cv2.RANSAC, 5.0)
    if M is None:
        raise ValueError("Homography could not be computed")

    h, w = template.shape[:2]
    corners = np.float32([[0, 0], [w, 0], [w, h], [0, h]]).reshape(-1, 1, 2)
    transformed = cv2.perspectiveTransform(corners, M)

    x_coords = transformed[:, 0, 0]
    y_coords = transformed[:, 0, 1]
    x_min, x_max = int(x_coords.min()), int(x_coords.max())
    y_min, y_max = int(y_coords.min()), int(y_coords.max())

    x_min = max(x_min, 0)
    y_min = max(y_min, 0)
    x_max = min(x_max, img.shape[1])
    y_max = min(y_max, img.shape[0])

    cropped = img[y_min:y_max, x_min:x_max]
    coordinates = (x_min, y_min, x_max - x_min, y_max - y_min)
    score = 1.0 - np.mean([m.distance for m in good[:20]]) / 100

    if show_plot:
        img_draw = img.copy()
        cv2.polylines(img_draw, [np.int32(transformed)], True, (0, 255, 0), 2)
        plt.figure(figsize=(15, 6))
        plt.subplot(121)
        plt.imshow(cv2.cvtColor(img_draw, cv2.COLOR_BGR2RGB))
        plt.title("Matched Area")
        plt.axis("off")
        plt.subplot(122)
        plt.imshow(cv2.cvtColor(cropped, cv2.COLOR_BGR2RGB))
        plt.title("Cropped Region")
        plt.axis("off")
        plt.show()

    return cropped, coordinates, score
