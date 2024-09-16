from flask import Flask, request, jsonify
from flask_socketio import SocketIO
from flask_cors import CORS
from pose_detection import PoseEstimator
from ultralytics import YOLO
import base64

from geopy.geocoders import Nominatim

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})
socketio = SocketIO(app, cors_allowed_origins="*")

geolocator = Nominatim(user_agent="SwiftRescue")
pose_detector = PoseEstimator()

@app.route("/api/v1/testFetchData", methods=["GET"])
def fetch():
    return jsonify({"message": "Hello, successfully return message."})

@app.route("/api/v1/fire-detection", methods=["POST"])
def fire_detection():
    data = request.json

    image = data.get("image")
    location = data.get("location")
    
    print(location)
    
    retrieved_location = geolocator.reverse(f"{location.get("coords").get("latitude")}, {location.get("coords").get("longitude")}")

    return jsonify({"message": f"Your current location: {retrieved_location}"})

@app.route("/api/v1/pose-detection", methods=["POST"])
def pose_detection():
    data = request.json
    
    image = data.get("image")
    
    output_image = pose_detector.process_image(image)
    
    return jsonify({"message": "Landmark detection successful.", "processed_image": output_image})

aed_model = YOLO("./aed_ai/runs/detect/train2/weights/best.pt")

@app.route("/aed_detection", methods=["POST"])
def upload_aed_image():
    try:
        data = request.json

        image_data_base64 = data.get("image")
        image_data_binary = base64.b64decode(image_data_base64)

        results = aed_model.predict(
            source=image_data_binary, save=True, conf=0.65
        )
        result = results[0]

        if result:
            return jsonify({"message": "AED detected"}), 200
        else:
            return jsonify({"message": "No AED detected"}), 200
    except Exception as e:
        return jsonify({"error": str(e)})

if __name__ == "__main__":
    socketio.run(app, debug=True, port=5000, host="0.0.0.0")
