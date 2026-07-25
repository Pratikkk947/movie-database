import { verifyToken } from "../auth.js";

const authenticate = (req, res, next) => {
    console.log("Authorization Header:", req.headers.authorization);

    const token = req.headers.authorization;

    if (!token || !token.startsWith("Bearer ")) {
        return res.status(401).json({ error: "Unauthorized" });
    }

    const isValid = verifyToken(token.split(" ")[1]);
    console.log("Decoded Token:", isValid);

    if (!isValid) {
        return res.status(401).json({ error: "Invalid Token" });
    }

    req.user = isValid;
    next();
};

export default authenticate;