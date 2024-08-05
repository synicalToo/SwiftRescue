from flask import Flask, request, jsonify
from flask_socketio import SocketIO, emit
from flask_cors import CORS

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})
socketio = SocketIO(app, cors_allowed_origins="*")


@app.route("/api/v1/detect", methods=["POST"])
def detect():
    data = request.json

    area = data.get("area")
    print(area)

    return jsonify({"message": "Hello, World!"})


if __name__ == "__main__":
    socketio.run(app, debug=True, port=5000, host="0.0.0.0")
