import os
import argparse
import numpy as np
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing.image import load_img, img_to_array

# TensorFlow 로그 숨기기
os.environ['TF_CPP_MIN_LOG_LEVEL'] = '3'

# 클래스 이름 정의
CLASS_NAMES = ["can", "glass", "paper", "plastic", "plastic_bag", "styrofoam"]

# 모델 경로 설정
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))  # 상위 디렉토리(AI)로 이동
MODEL_PATH = os.path.join(BASE_DIR, "model", "recycling_model.h5")  # model 폴더 안의 모델 파일

model = load_model(MODEL_PATH)

def predict(image_path):
    image = load_img(image_path, target_size=(224, 224))
    image = img_to_array(image) / 255.0
    image = np.expand_dims(image, axis=0)
    predictions = model.predict(image, verbose=0)  # 출력 비활성화
    predicted_class = CLASS_NAMES[np.argmax(predictions)]
    return predicted_class

if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--image", required=True, help="Path to the image file")
    args = parser.parse_args()

    result = predict(args.image)
    print(result)