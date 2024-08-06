from flask import Flask, request, jsonify
from flask_socketio import SocketIO, emit
from flask_cors import CORS

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})
socketio = SocketIO(app, cors_allowed_origins="*")


@app.route("/api/v1/detect", methods=["POST"])
def detect():
    data = request.json

    image = data.get("image")
    location = data.get("location")
    print(location)

    return jsonify({"message": "This is a test response"})


if __name__ == "__main__":
    socketio.run(app, debug=True, port=5000, host="0.0.0.0")
