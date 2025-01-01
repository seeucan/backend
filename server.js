import express from "express";
import user from "./routes/user.js"; 
const app = express();

app.use(express.json());
app.use('/user', user);
app.use((req, res) => {
    res.status(404).send("404 Not Found")
});

app.listen(3000);