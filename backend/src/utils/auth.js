import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const JWT_SECRET =
  process.env.JWT_SECRET ||
  "jdWz4nMrfjLXLnrI6Ewm45NXMyq1IraOZEsdR6nVrnDTCmdo32BV6b";

// Generate JWT Token
export const generateToken = (user) => {
  return jwt.sign(
    {
      userId: user._id,
      isAdmin: user.isAdmin,
    },
    JWT_SECRET, 
    {
      expiresIn: "7d",
    }
  );
};

// Verify JWT Token
export const verifyToken = (token) => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
};