import User from '../models/User.js';
import bcrypt from 'bcrypt';
import { generateToken } from '../utils/auth.js';

export const registerUser = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        if (!username || !email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const newUser = await User.create({ username, email, password });

        const token = generateToken(newUser);

        // Store token in cookie
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        });

        return res.status(201).json({
            message: "User registered successfully",
            data: {
                _id: newUser._id,
                username: newUser.username,
                email: newUser.email,
                isAdmin: newUser.isAdmin,
                watchlist: newUser.watchlist || [],
                token: token
            }
        });

    } catch (error) {
        // Handle duplicate key error from MongoDB (code 11000)
        if (error.code === 11000) {
            const field = Object.keys(error.keyPattern || error.keyValue)[0];
            return res.status(400).json({
                message: `${field.charAt(0).toUpperCase() + field.slice(1)} is already registered.`
            });
        }
        return res.status(400).json({
            message: error.message
        });
    }
};

export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" });
        }

        const user = await User.findOne({ email }).populate('watchlist');
        if (!user) {
            return res.status(400).json({ message: "Invalid email or password" });
        }

        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
            return res.status(400).json({ message: "Invalid email or password" });
        }

        const token = generateToken(user);

        // Store token in cookie
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        });

        return res.status(200).json({
            message: "User logged in successfully",
            data: {
                _id: user._id,
                username: user.username,
                email: user.email,
                isAdmin: user.isAdmin,
                watchlist: user.watchlist.map(movie => movie._id || movie),
                token: token
            }
        });

    } catch (error) {
        return res.status(500).json({
            message: "An error occurred during login",
            error: error.message
        });
    }
};

export const logoutUser = async (req, res) => {
    try {
        res.clearCookie('token', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax'
        });
        return res.status(200).json({
            message: "User logged out successfully"
        });
    } catch (error) {
        return res.status(500).json({
            message: "An error occurred during logout",
            error: error.message
        });
    }
};

// Toggle watchlist items (Add or remove a movie from user's watchlist)
export const toggleWatchlist = async (req, res) => {
    try {
        const { movieId } = req.body;
        if (!movieId) {
            return res.status(400).json({ message: "Movie ID is required" });
        }

        const user = await User.findById(req.user._id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const index = user.watchlist.findIndex((id) => id && id.toString() === String(movieId));
        if (index > -1) {
            // Remove from watchlist
            user.watchlist.splice(index, 1);
        } else {
            // Add to watchlist
            user.watchlist.push(movieId);
        }

        await user.save();

        return res.status(200).json({
            message: "Watchlist updated successfully",
            watchlist: user.watchlist
        });

    } catch (error) {
        return res.status(500).json({
            message: "An error occurred updating watchlist",
            error: error.message
        });
    }
};
