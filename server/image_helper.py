import os
import time
import cv2
import numpy as np
import base64


def base64_to_cv2_image(base64_string: str):
    image_bytes = base64.b64decode(base64_string)
    np_array = np.frombuffer(image_bytes, np.uint8)
    image = cv2.imdecode(np_array, cv2.IMREAD_COLOR)

    return image


def ndarray_to_base64(image):
    _, buffer = cv2.imencode(".jpg", image)
    base64_string = base64.b64encode(buffer).decode("utf-8")

    return base64_string


def save_base64_image(base64_string: str):
    """Convert base64 string to PNG file."""
    # Decode base64 string
    img_data = base64.b64decode(base64_string)

    # Create directory if it doesn't exist
    if not os.path.exists("processed_image"):
        os.makedirs("processed_image")

    # Generate filename with timestamp
    timestamp = round(time.time())
    file_path = os.path.join("processed_image", f"{timestamp}.png")

    # Write binary data to file
    with open(file_path, "wb") as f:
        f.write(img_data)
