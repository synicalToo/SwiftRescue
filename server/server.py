from flask import Flask, request, jsonify
from flask_socketio import SocketIO, emit
from flask_cors import CORS

from geopy.geocoders import Nominatim

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})
socketio = SocketIO(app, cors_allowed_origins="*")

geolocator = Nominatim(user_agent="SwiftRescue")

@app.route("/api/v1/testFetchData", methods=["GET"])
def fetch():
    return jsonify({"message": "Hello, successfully return message."})

@app.route("/api/v1/detect", methods=["POST"])
def detect():
    data = request.json

    image = data.get("image")
    location = data.get("location")
    
    print(location)
    
    retrieved_location = geolocator.reverse(f"{location.get("coords").get("latitude")}, {location.get("coords").get("longitude")}")

    return jsonify({"message": f"Your current location: {retrieved_location}"})


if __name__ == "__main__":
    socketio.run(app, debug=True, port=5000, host="0.0.0.0")
