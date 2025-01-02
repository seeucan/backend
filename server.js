import express from "express";
import path from "path";
import multer from "multer";
import predictRoute from "./routes/predict.js";
import userRoute from "./routes/user.js";

const app = express();
const PORT = 3000;

const BASE_DIR = path.resolve();
const AI_DIR = path.join(BASE_DIR, "AI");
const UPLOAD_DIR = path.join(AI_DIR, "uploads");

// Multer 설정 (업로드 파일 저장 디렉토리)
const upload = multer({ dest: UPLOAD_DIR });

// 미들웨어 설정
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 라우트 설정
app.use("/predict", predictRoute);
app.use("/user", userRoute);

// 404 에러 핸들링
app.use((req, res) => {
    res.status(404).send("404 Not Found");
});

// 서버 실행
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
