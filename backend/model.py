import os
import requests
from bs4 import BeautifulSoup
from urllib.parse import urljoin
import cv2
from io import BytesIO
import numpy as np

def download_images(search_query, num_images, output_dir):
    url = f'https://www.bing.com/images/search?q={search_query}&form=HDRSC2'
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/64.0.3282.140 Safari/537.36 Edge/17.17134'
    }

    response = requests.get(url, headers=headers)
    soup = BeautifulSoup(response.text, 'html.parser')
    image_tags = soup.find_all('img', {'class': 'mimg'})

    if not os.path.exists(output_dir):
        os.makedirs(output_dir)

    i = 0
    face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')

    for img_tag in image_tags:

        img_url = img_tag.get('src') or img_tag.get('data-src')

        # Ignore data URL
        if img_url.startswith('data:image'):
            continue

        img_data = requests.get(img_url).content
        img = np.asarray(bytearray(img_data), dtype="uint8")
        img = cv2.imdecode(img, cv2.IMREAD_COLOR)
        gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
        faces = face_cascade.detectMultiScale(gray, scaleFactor=1.05, minNeighbors=5, minSize=(40, 40))

        if len(faces) == 1:
            with open(os.path.join(output_dir, f'{search_query}_{i}.jpg'), 'wb') as f:
                f.write(img_data)
            print(f'Downloaded {i + 1}/{num_images} images')

            i += 1
            if i >= num_images:
                break

if __name__ == '__main__':
    politician_names = ["伊藤博文"]
    num_images = 10
    base_output_dir = './politicians'

    for name in politician_names:
        output_dir = os.path.join(base_output_dir, name)
        download_images(name, num_images, output_dir)
