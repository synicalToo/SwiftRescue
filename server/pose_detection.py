import cv2
import numpy as np
import mediapipe as mp
from image_helper import *


class PoseEstimator:
    def __init__(self, detection_confidence=0.5, tracking_confidence=0.5):
        # Initialize MediaPipe Pose and Drawing utils
        self.mp_pose = mp.solutions.pose
        self.mp_drawing = mp.solutions.drawing_utils
        self.pose = self.mp_pose.Pose(
            min_detection_confidence=detection_confidence,
            min_tracking_confidence=tracking_confidence,
        )

    def calculate_angle(self, a, b, c):
        """Calculate the angle between three points"""
        a = np.array(a)  # First
        b = np.array(b)  # Mid
        c = np.array(c)  # End

        radians = np.arctan2(c[1] - b[1], c[0] - b[0]) - np.arctan2(
            a[1] - b[1], a[0] - b[0]
        )
        angle = np.abs(radians * 180.0 / np.pi)

        if angle > 180.0:
            angle = 360 - angle

        return angle

    def process_image(self, image):
        """Process the input image and return it with pose landmarks and feedback"""
        image = base64_to_cv2_image(image)

        if image is None:
            print("Error: Image conversion failed.")
            return None
        # Recolor image to RGB
        image_rgb = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
        image_rgb.flags.writeable = False
        bend_elbow=False
        backward=False
        forward=False
        # Make detection
        results = self.pose.process(image_rgb)
        # Recolor back to BGR
        image_rgb.flags.writeable = True
        image_bgr = cv2.cvtColor(image_rgb, cv2.COLOR_RGB2BGR)
        # Extract landmarks and provide feedback
        try:
            landmarks = results.pose_landmarks.landmark
            # Get coordinates
            coordinates = {
                "left_shoulder": [
                    landmarks[self.mp_pose.PoseLandmark.LEFT_SHOULDER.value].x,
                    landmarks[self.mp_pose.PoseLandmark.LEFT_SHOULDER.value].y,
                ],
                "left_elbow": [
                    landmarks[self.mp_pose.PoseLandmark.LEFT_ELBOW.value].x,
                    landmarks[self.mp_pose.PoseLandmark.LEFT_ELBOW.value].y,
                ],
                "left_wrist": [
                    landmarks[self.mp_pose.PoseLandmark.LEFT_WRIST.value].x,
                    landmarks[self.mp_pose.PoseLandmark.LEFT_WRIST.value].y,
                ],
                "right_shoulder": [
                    landmarks[self.mp_pose.PoseLandmark.RIGHT_SHOULDER.value].x,
                    landmarks[self.mp_pose.PoseLandmark.RIGHT_SHOULDER.value].y,
                ],
                "right_elbow": [
                    landmarks[self.mp_pose.PoseLandmark.RIGHT_ELBOW.value].x,
                    landmarks[self.mp_pose.PoseLandmark.RIGHT_ELBOW.value].y,
                ],
                "right_wrist": [
                    landmarks[self.mp_pose.PoseLandmark.RIGHT_WRIST.value].x,
                    landmarks[self.mp_pose.PoseLandmark.RIGHT_WRIST.value].y,
                ],
                "right_hip": [
                    landmarks[self.mp_pose.PoseLandmark.RIGHT_HIP.value].x,
                    landmarks[self.mp_pose.PoseLandmark.RIGHT_HIP.value].y,
                ],
                "right_knee": [
                    landmarks[self.mp_pose.PoseLandmark.RIGHT_KNEE.value].x,
                    landmarks[self.mp_pose.PoseLandmark.RIGHT_KNEE.value].y,
                ],
                "right_ankle": [
                    landmarks[self.mp_pose.PoseLandmark.RIGHT_ANKLE.value].x,
                    landmarks[self.mp_pose.PoseLandmark.RIGHT_ANKLE.value].y,
                ],
                "left_hip": [
                    landmarks[self.mp_pose.PoseLandmark.LEFT_HIP.value].x,
                    landmarks[self.mp_pose.PoseLandmark.LEFT_HIP.value].y,
                ],
                "left_knee": [
                    landmarks[self.mp_pose.PoseLandmark.LEFT_KNEE.value].x,
                    landmarks[self.mp_pose.PoseLandmark.LEFT_KNEE.value].y,
                ],
                "left_ankle": [
                    landmarks[self.mp_pose.PoseLandmark.LEFT_ANKLE.value].x,
                    landmarks[self.mp_pose.PoseLandmark.LEFT_ANKLE.value].y,
                ],
            }

            # Calculate angles
            right_elbow_angle = self.calculate_angle(
                coordinates["right_shoulder"],
                coordinates["right_elbow"],
                coordinates["right_wrist"],
            )
            left_elbow_angle = self.calculate_angle(
                coordinates["left_shoulder"],
                coordinates["left_elbow"],
                coordinates["left_wrist"],
            )
            right_knee_angle = self.calculate_angle(
                coordinates["right_hip"],
                coordinates["right_knee"],
                coordinates["right_ankle"],
            )
            left_knee_angle = self.calculate_angle(
                coordinates["left_hip"],
                coordinates["left_knee"],
                coordinates["left_ankle"],
            )

            # Visualize angles and provide feedback
            for angle_name, angle_value in [
                ("right_elbow_angle", right_elbow_angle),
                ("left_elbow_angle", left_elbow_angle),
                ("right_knee_angle", right_knee_angle),
                ("left_knee_angle", left_knee_angle),
            ]:
                cv2.putText(
                    image_bgr,
                    f"{angle_name.replace('_', ' ').capitalize()}: {angle_value:.2f}",
                    tuple(
                        np.multiply(
                            coordinates[angle_name.replace("_angle", "")],
                            [image.shape[1], image.shape[0]],
                        ).astype(int)
                    ),
                    cv2.FONT_HERSHEY_SIMPLEX,
                    0.7,
                    (255, 255, 255),
                    2,
                    cv2.LINE_AA,
                )

            # Provide specific feedback based on angles
            feedback = []
            if left_elbow_angle <= 150:
                feedback.append("Don't bend your left elbow")
                bend_elbow=True
            if left_knee_angle <= 40:
                feedback.append("Move forward")
                forward=True
            if left_knee_angle >= 70:
                feedback.append("Move backward")
                backward=True
            if right_elbow_angle <= 150:
                feedback.append("Don't bend your right elbow")
                bend_elbow=True
            if right_knee_angle <= 40:
                feedback.append("Move forward")
                forward=True
            if right_knee_angle > 70:
                feedback.append("Move backward")
                backward=True
            # Visualize angles and provide feedback
            feedback = []
            if left_elbow_angle <= 150:
                feedback.append("Don't bend your left elbow")
            if left_knee_angle <= 40:
                feedback.append("Move forward")
            if left_knee_angle >= 70:
                feedback.append("Move backward")
            if right_elbow_angle <= 150:
                feedback.append("Don't bend your right elbow")
            if right_knee_angle <= 40:
                feedback.append("Move forward")
            if right_knee_angle > 70:
                feedback.append("Move backward")
            for i, text in enumerate(feedback):
                cv2.putText(
                    image_bgr,
                    text,
                    (10, 30 + i * 30),
                    cv2.FONT_HERSHEY_SIMPLEX,
                    0.7,
                    (0, 0, 255),
                    2,
                    cv2.LINE_AA,
                )
        except Exception as e:
            print(f"Error processing landmarks: {e}")
        # Draw pose landmarks
        if results.pose_landmarks:
            self.mp_drawing.draw_landmarks(
                image_bgr,
                results.pose_landmarks,
                self.mp_pose.POSE_CONNECTIONS,
                self.mp_drawing.DrawingSpec(
                    color=(245, 117, 66), thickness=2, circle_radius=2
                ),
                self.mp_drawing.DrawingSpec(
                    color=(245, 66, 230), thickness=2, circle_radius=2
                ),
            )
        processed_image = ndarray_to_base64(image_bgr)
        if processed_image is None:
            print("Error: Image encoding failed.")

        save_base64_image(processed_image)
        return processed_image,bend_elbow,forward,backward
