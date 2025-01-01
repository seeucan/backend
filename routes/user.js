import express from "express";
import pool from "../lib/db.js";
const router = express.Router();

router.post('/sign-up', async (req, res) => {
    const db = await pool.getConnection();
    try {
        console.log(await db.query('show tables'));
        res.status(200).send("success")
    } catch {
        res.status(500).send("500 Internet Server Error")
    } finally {
        db.release();        
    }
})

router.post('/sign-in', async (req, res) => {
    const db = await pool.getConnection();
    try {

    } catch {

    } finally {
        db.release();
    }
})

router.put('/edit', async (req, res) => {
    const db = await pool.getConnection();
    try {

    } catch {

    } finally {
        db.release();
    }
});

router.delete('/delete', async (req, res) => {
    const db = await pool.getConnection();
    try {

    } catch {

    } finally {
        db.release();
    }
});

export default router;