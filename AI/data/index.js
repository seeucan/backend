const express = require("express");
const multer = require("multer");
const { spawn } = require("child_process");
const path = require("path");

const app = express();
const PORT = 3000;

// 프로젝트 루트 경로 계산
const BASE_DIR = path.resolve(__dirname, "..");
const MODEL_DIR = path.join(BASE_DIR, "model");
const UPLOAD_DIR = path.join(BASE_DIR, "uploads");

// Multer 설정
const upload = multer({ dest: UPLOAD_DIR });

app.post("/predict", upload.single("image"), (req, res) => {
    const imagePath = req.file.path;

    // Python 프로세스 실행
    const pythonProcess = spawn("python", ["predict.py", "--image", imagePath], {
        cwd: MODEL_DIR, // Python 스크립트 실행 디렉토리 설정
    });

    let predictionResult = '';  // 예측 결과를 저장할 변수

    pythonProcess.stdout.on("data", (data) => {
        predictionResult += data.toString().trim();  // 예측 결과를 이어서 저장
    });

    pythonProcess.stderr.on("data", (data) => {
        console.error(`stderr: ${data}`);
    });

    pythonProcess.on("close", (code) => {
        if (code !== 0) {
            return res.status(500).json({ error: "Error during prediction" });
        }

        // 예측 결과를 한 번만 응답
        res.json({ prediction: predictionResult });
    });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
