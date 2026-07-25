import * as AuthModel from '../models/authModel.js';
import { generateToken } from '../utils/auth.js';

export async function registerUser(req, res) {
    try {
        const user = await AuthModel.register(req.body);

        if (user) {
            const token = generateToken(user);

            return res.status(201).json({
                message: "User registered successfully",
                data: {
                    _id: user._id,
                    username: user.username,
                    email: user.email,
                    isAdmin: user.isAdmin,
                    token: token,
                },
            });
        }

        return res.status(400).json({
            message: "User registration failed",
        });

    } catch (error) {
        return res.status(400).json({
            error: error.message,
        });
    }
}
export async function loginUser(req, res) {
    try {
        const user = await AuthModel.login(req.body);

        if (user) {
            const token = generateToken(user);

            return res.status(200).json({
                message: 'User logged in successfully',
                data: {
                    _id: user._id,
                    username: user.username,
                    email: user.email,
                    isAdmin: user.isAdmin,
                    token: token
                }
            });
        }

        return res.status(400).json({
            message: 'User login failed'
        });

    } catch (error) {
        return res.status(400).json({
            error: error.message
        });
    }
}