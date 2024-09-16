import os
from flask_cors import CORS
from flask_socketio import SocketIO
from flask import Flask, request, jsonify
from pose_detection import PoseEstimator
from fire_detection import process_fire_detection
from aed_detection import process_aed_detection

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})
socketio = SocketIO(app, cors_allowed_origins="*")

pose_detector = PoseEstimator()

def create_directories() -> None:
    if not os.path.exists("uploads"):
        os.makedirs("uploads/processed-image-fire")
        os.makedirs("uploads/processed-image-pose")
        
    if not os.path.exists("uploads/processed-image-fire"):
        os.makedirs("uploads/processed-image-fire")
        
    if not os.path.exists("uploads/processed-image-pose"):
        os.makedirs("uploads/processed-image-pose")

@app.route("/api/v1/testFetchData", methods=["GET"])
def fetch():
    return jsonify({"message": "Hello, successfully return message."})

@app.route("/api/v1/fire-detection", methods=["POST"])
def fire_detection() -> None:
    data = request.json

    image = data.get("image")
    location = data.get("location")
    
    message, code = process_fire_detection(image, location)
    
    return jsonify({"message": message}, code)

@app.route("/api/v1/aed-detection", methods=["POST"])
def aed_detection():
    data = request.json
    
    image = data.get("image")
    
    message, code = process_aed_detection(image)
    
    return jsonify({"message": message}, code)

@app.route("/api/v1/pose-detection", methods=["POST"])
def pose_detection() -> None:
    data = request.json
    
    image = data.get("image")
    
    output_image = pose_detector.process_image(image)
    
    return jsonify({"message": "Landmark detection successful.", "processed_image": output_image})

if __name__ == "__main__":
    create_directories()
    socketio.run(app, debug=True, port=5000, host="0.0.0.0")
