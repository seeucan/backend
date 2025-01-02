import express from "express";
import multer from "multer";
import { spawn } from "child_process";
import path from "path";

const router = express.Router();

// 프로젝트 루트 경로 계산
const BASE_DIR = path.resolve();
const AI_DIR = path.join(BASE_DIR, "AI"); // AI 폴더 경로
const MODEL_DIR = path.join(AI_DIR, "model"); // 모델 폴더 경로
const UPLOAD_DIR = path.join(AI_DIR, "uploads"); // 업로드 폴더 경로
const PREDICT_SCRIPT = path.join(MODEL_DIR, "predict.py"); // predict.py 경로

// Multer 설정
const upload = multer({ dest: UPLOAD_DIR });

router.post("/", upload.single("image"), (req, res) => {
    const imagePath = req.file.path;

    const pythonProcess = spawn("python", [PREDICT_SCRIPT, "--image", imagePath], {
        cwd: MODEL_DIR, // Python 실행 디렉토리를 model로 설정
    });

    let predictionResult = "";

    pythonProcess.stdout.on("data", (data) => {
        predictionResult += data.toString().trim();
    });

    pythonProcess.stderr.on("data", (data) => {
        console.error(`stderr: ${data}`);
    });

    pythonProcess.on("close", (code) => {
        if (code !== 0) {
            return res.status(500).json({ error: "Error during prediction" });
        }

        // 응답을 보내기 전에 업로드된 파일 삭제
        res.json({ prediction: predictionResult });
    });
});

export default router;
