import express from "express";
import { spawn } from "child_process";
import path from "path";
import multer from "multer";

const router = express.Router();

const BASE_DIR = path.resolve();
const MODEL_SCRIPT_PATH = path.join(BASE_DIR, "backend", "AI", "model", "predict.py");
const UPLOAD_DIR = path.join(BASE_DIR, "backend", "AI", "uploads");

// Multer 설정
const upload = multer({ dest: UPLOAD_DIR });

// 이미지 예측 라우트
router.post("/", upload.single("image"), (req, res) => {
    const imagePath = req.file.path;

    // Python 프로세스 실행
    const pythonProcess = spawn("python", [MODEL_SCRIPT_PATH, "--image", imagePath]);

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
        res.json({ prediction: predictionResult });
    });
});

export default router;
