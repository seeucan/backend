import express from "express";
import pool from "../lib/db.js";
import jwt from "jsonwebtoken";
import auth from "../middlewares/auth.js"
const router = express.Router();

//회원가입
router.post('/sign-up', async (req, res) => {
    const db = await pool.getConnection();
    try {
        const {id, password} = req.body;
        if ((await db.query('select user_id from user where user_id = ?', [id]))[0].length > 0) {
            res.status(400).send({ message: "ID is already in use" })
        }
        else {
            await db.query('INSERT INTO user (user_id, password, point) VALUES (?, ?, 0)', [id, password]); 
            res.status(200).send({ message: "success" })
        }
    } catch(err) {
        res.status(500).send({ message : "500 Internet Server Error"})
        console.log(err)
    } finally {
        db.release();        
    }
})

//로그인
router.post('/sign-in', async (req, res) => {
    const db = await pool.getConnection();
    try {
        const { id , password } = req.body;
        const [ result ] = await db.query('select * from user where user_id = ? AND password = ?', [id, password]);
        if (result.length > 0) {
            const token = jwt.sign(
                { 
                    id: id
                },   
                process.env.JWT_SECRET_KEY,             
                { 
                    expiresIn: process.env.JWT_EXPIRE_TIME
                }
            );
            res.status(200).send({ message: "success", token })
        }
        else {
            res.status(400).send({ message: "fail" });
        }
    } catch(err) {
        res.status(500).send({ message : "500 Internet Server Error"})
        console.log(err)
    } finally {
        db.release();
    }
})

//회원탈퇴
router.delete('/delete', auth, async (req, res) => {
    const db = await pool.getConnection();
    try {
        await db.query('delete from user where user_id = ?', [req.user.id]);
        res.status(200).send({ message: "success"})
    } catch(err) {
        res.status(500).send({ message : "500 Internet Server Error"})
        console.log(err)
    } finally {
        db.release();
    }
});

//정보조회 (포인트)
router.get('/get-info', auth,  async (req, res) => {
    const db = await pool.getConnection();
    try {
        const [ data ] = await db.query('select user_id, point from user where user_id = ?', [req.user.id]);
        res.status(200).send(data[0]);
    } catch(err) {
        res.status(500).send({ message : "500 Internet Server Error"})
        console.log(err)
    } finally {
        db.release();
    }
})

//포인트 적립
router.post('/add-point', async (req, res) => {
    const db = await pool.getConnection();
    try {
        //읽어들인 QR을 통해 포인트를 적립하는 로직
    } catch (err) {
        res.status(500).send({ message : "500 Internet Server Error"})
        console.log(err)
    } finally {
        db.release();
    }
})

export default router;