import os
import base64
import time
from typing import Tuple
from ultralytics import YOLO

UPLOAD_DIRECTORY = "uploads"

# Load the AED detection model from the specified path
aed_detection_model = YOLO("./computer-vision/aed-detection/models/yolov8n.pt")

def process_aed_detection(base64_image: str) -> Tuple[str, int]:
    """
    Process the given image to detect an AED (Automated External Defibrillator) using a pre-trained YOLO model.
    
    Parameters:
    base64_image (str): A Base64-encoded string representation of the image to be processed.
    
    Returns:
    Tuple[str, int]: A message indicating whether an AED was detected, and a corresponding HTTP status code.
                     - If an AED is detected, returns "AED detected" with a 200 status code.
                     - If no AED is detected, returns "No AED detected" with a 200 status code.
    """
    
    # Generate a timestamp to create a unique filename for the image
    timestamp = time.time()
    filename = f"preprocessed_image_aed_{timestamp}.png"
    
    # Decode the Base64 image and save it as a PNG file in the UPLOAD_DIRECTORY
    with open(os.path.join(UPLOAD_DIRECTORY, filename), "wb") as f:
        f.write(base64.b64decode(base64_image))

    # Run the AED detection model on the saved image with a confidence threshold of 0.65
    results = aed_detection_model.predict(
        source=os.path.join(UPLOAD_DIRECTORY, filename), save=True, conf=0.65
    )
    
    # Extract the first result from the model's predictions
    result = results[0]
    
    # Return appropriate messages based on the detection results
    if result:
        return "AED detected", 200
    else:
        return "No AED detected", 200
