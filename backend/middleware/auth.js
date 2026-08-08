import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || "jdWz4nMrfjLXLnrI6Ewm45NXMyq1IraOZEsdR6nVrnDTCmdo32BV6b";

// Helper to manually parse cookies if cookie-parser is not populated
const parseCookies = (cookieHeader) => {
    if (!cookieHeader) return {};
    return cookieHeader.split(';').reduce((acc, cookie) => {
        const [key, value] = cookie.split('=').map(c => c.trim());
        if (key) acc[key] = decodeURIComponent(value);
        return acc;
    }, {});
};

const authenticate = (req, res, next) => {
    let token = null;

    // 1. Read from Authorization Header
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer ")) {
        token = req.headers.authorization.split(" ")[1];
    }

    // 2. Read from cookies (express cookie-parser)
    if (!token && req.cookies && req.cookies.token) {
        token = req.cookies.token;
    }

    // 3. Read from cookies (fallback header check)
    if (!token && req.headers.cookie) {
        const cookies = parseCookies(req.headers.cookie);
        if (cookies.token) {
            token = cookies.token;
        }
    }

    if (!token) {
        return res.status(401).json({ error: "Access denied. No token provided." });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        
        // Normalize payload: attach user to req.user with proper _id field
        req.user = {
            _id: decoded.userId || decoded._id || decoded.id,
            isAdmin: decoded.isAdmin || false,
            ...decoded
        };
        
        next();
    } catch (error) {
        return res.status(401).json({ error: "Invalid or expired token." });
    }
};

export default authenticate;
