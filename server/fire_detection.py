import os
import time
import base64
import telebot
from ultralytics import YOLO
from geopy.geocoders import Nominatim
from typing import Tuple

UPLOAD_DIRECTORY = "uploads"

# Fail-safe for environment variables
TELEGRAM_BOT_API_KEY = os.getenv("TELEGRAM_BOT_API_KEY")
TELEGRAM_BOT_CHAT_ID = os.getenv("TELEGRAM_BOT_CHAT_ID")

if TELEGRAM_BOT_API_KEY and TELEGRAM_BOT_CHAT_ID:
    telegram_bot = telebot.TeleBot(TELEGRAM_BOT_API_KEY)
else:
    telegram_bot = None

# Initialize models
fire_detection_model = YOLO("./computer-vision/fire-detection/models/fire_best.pt")
dustbin_detection_model = YOLO(
    "./computer-vision/fire-detection/models/dustbin_best.pt"
)

geolocator = Nominatim(user_agent="SwiftRescue")


# Function to send messages only if bot is initialized
def send_telegram_message(message: str) -> None:
    if telegram_bot:
        telegram_bot.send_message(TELEGRAM_BOT_CHAT_ID, message)


def send_telegram_location(latitude: float, longitude: float) -> None:
    if telegram_bot:
        telegram_bot.send_location(
            TELEGRAM_BOT_CHAT_ID, latitude=latitude, longitude=longitude
        )


def process_fire_detection(base64_image: str, location: dict) -> Tuple[str, int]:
    """
    Process the image for fire detection and send alerts if a fire or dustbin fire is detected.

    Parameters:
    base64_image (str): Base64-encoded image data.
    location (dict): Dictionary containing location information with latitude and longitude.

    Returns:
    Tuple[str, int]: A message and a status code.
    """

    timestamp = time.time()
    latitude = location.get("coords").get("latitude")
    longitude = location.get("coords").get("longitude")

    user_location = geolocator.reverse(f"{latitude}, {longitude}")

    filename = f"preprocessed_image_fire_{timestamp}.png"

    # Save the image
    with open(
        os.path.join(UPLOAD_DIRECTORY, "preprocessed-image-fire", filename), "wb"
    ) as f:
        f.write(base64.b64decode(base64_image))

    # Run fire detection
    results_fire = fire_detection_model.predict(
        source=os.path.join(UPLOAD_DIRECTORY, "preprocessed-image-fire", filename),
        save=True,
        conf=0.5,
    )

    # Run dustbin detection
    results_dustbin = dustbin_detection_model.predict(
        source=os.path.join(UPLOAD_DIRECTORY, "preprocessed-image-fire", filename),
        save=True,
    )

    result_fire = results_fire[0]
    result_dustbin = results_dustbin[0]

    # Handle detection results
    if result_dustbin:
        send_telegram_message(
            f"A dustbin fire has been detected at {user_location.address}"
        )
        send_telegram_location(latitude, longitude)
        return (
            "Dustbin fire has been detected, emergency services have been contacted. Please stay clear.",
            200,
        )
    elif result_fire:
        send_telegram_message(f"A fire has been detected at {user_location.address}")
        send_telegram_location(latitude, longitude)
        return (
            "Fire has been detected, emergency services have been contacted. Please move to a safe distance.",
            200,
        )
    else:
        return "No fire detected.", 200
