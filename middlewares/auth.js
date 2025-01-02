import jwt from "jsonwebtoken"

const auth = (req, res, next) => {
    const token = req.headers['token'];
    if (!token) {
        return res.status(403).send({ message: "Access denied" });
    }
    jwt.verify(token, process.env.JWT_SECRET_KEY, (err, decoded) => {
        if (err) {
            console.log(err);
            return res.status(403).send({ message: "Invalid token" });
        }
        req.user = decoded;
        next();
    });
}

export default auth;