import cv2
import urllib.request
import numpy as np


def url_to_image(url):
    with urllib.request.urlopen(url) as resp:
        image = np.asarray(bytearray(resp.read()), dtype="uint8")
        image = cv2.imdecode(image, cv2.IMREAD_COLOR)
    return image


def extract_face_icon_from_url(image_url, casc_path="haarcascade_frontalface_default.xml", padding_ratio=0.7):
    face_cascade = cv2.CascadeClassifier(casc_path)

    image = url_to_image(image_url)
    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)

    faces = face_cascade.detectMultiScale(
        gray, scaleFactor=1.1, minNeighbors=5, minSize=(30, 30))

    if len(faces) == 0:
        return None

    x, y, w, h = faces[0]
    center_x = x + w // 2
    center_y = y + h // 2

    square_length = min(w, h) * (1 + padding_ratio)

    start_x = int(center_x - square_length // 2)
    start_y = int(center_y - square_length // 2)
    end_x = int(start_x + square_length)
    end_y = int(start_y + square_length)

    start_x = max(0, start_x)
    start_y = max(0, start_y)
    end_x = min(image.shape[1], end_x)
    end_y = min(image.shape[0], end_y)

    icon = image[start_y:end_y, start_x:end_x]

    return icon
