import os
from tensorflow.keras.applications import MobileNetV2
from tensorflow.keras.layers import Dense, GlobalAveragePooling2D
from tensorflow.keras.models import Model
from tensorflow.keras.preprocessing.image import ImageDataGenerator

# 프로젝트 루트 경로 계산
BASE_DIR = os.path.dirname(os.path.abspath(__file__))  # AI 폴더 경로
DATA_DIR = os.path.join(BASE_DIR, "data", "images_fixeds")  # 데이터 경로
MODEL_PATH = os.path.join(BASE_DIR, "recycling_model.h5")  # 모델 저장 경로

IMG_SIZE = (224, 224)  # 이미지 크기
BATCH_SIZE = 32  # 배치 사이즈

# 데이터 전처리
datagen = ImageDataGenerator(validation_split=0.2, rescale=1.0 / 255)
train_gen = datagen.flow_from_directory(
    DATA_DIR, target_size=IMG_SIZE, batch_size=BATCH_SIZE, subset="training"
)
val_gen = datagen.flow_from_directory(
    DATA_DIR, target_size=IMG_SIZE, batch_size=BATCH_SIZE, subset="validation"
)

# 사전 학습된 모델 불러오기
base_model = MobileNetV2(weights="imagenet", include_top=False, input_shape=(224, 224, 3))
base_model.trainable = False  # 사전 학습된 가중치 고정

# 커스텀 분류기 추가
x = base_model.output
x = GlobalAveragePooling2D()(x)
x = Dense(128, activation="relu")(x)
predictions = Dense(len(train_gen.class_indices), activation="softmax")(x)

model = Model(inputs=base_model.input, outputs=predictions)
model.compile(optimizer="adam", loss="categorical_crossentropy", metrics=["accuracy"])

# 학습
model.fit(train_gen, validation_data=val_gen, epochs=10)

# 모델 저장
model.save(MODEL_PATH)
