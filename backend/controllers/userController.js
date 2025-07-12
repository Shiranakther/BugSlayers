import userModel from "../models/userModels.js";
import validator from "validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// --- Modified to include name and image URL ---
const createToken = (id, name, imageUrl) => {
    return jwt.sign({ id, name, imageUrl }, process.env.JWT_SECRET, {
        expiresIn: '3d' // Optional: Adds an expiration date to the token
    });
};

// Route for user login
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await userModel.findOne({ email });

        if (!user) {
            return res.status(404).json({ success: false, message: "User does not exist" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (isMatch) {
            // --- Pass user details to the token ---
            const token = createToken(user._id, user.name, user.imageUrl);
            res.json({ success: true, token });
        } else {
            res.status(400).json({ success: false, message: "Invalid credentials" });
        }
    } catch (error) {
        console.error("Login Error:", error);
        res.status(500).json({ success: false, message: "Server error during login." });
    }
};

// Route for user registration
const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        if (!name || !email || !password) {
            return res.status(400).json({ success: false, message: "Please fill all the fields" });
        }

        const exists = await userModel.findOne({ email });
        if (exists) {
            return res.status(400).json({ success: false, message: "User with this email already exists" });
        }

        if (!validator.isEmail(email)) {
            return res.status(400).json({ success: false, message: "Please enter a valid email" });
        }
        if (password.length < 8) {
            return res.status(400).json({ success: false, message: "Password must be at least 8 characters" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new userModel({
            name,
            email,
            password: hashedPassword
        });

        const user = await newUser.save();
        // --- Pass new user details to the token ---
        const token = createToken(user._id, user.name, user.imageUrl);
        res.status(201).json({ success: true, token });

    } catch (error) {
        console.error("Register Error:", error);
        res.status(500).json({ success: false, message: "Server error during registration." });
    }
};

// Route for admin login
const adminLogin = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
            // --- Create a specific, secure admin token ---
            const token = jwt.sign(
                { id: process.env.ADMIN_EMAIL, role: 'admin' },
                process.env.JWT_SECRET,
                { expiresIn: '1d' }
            );
            res.json({ success: true, token });
        } else {
            res.status(401).json({ success: false, message: "Invalid admin credentials" });
        }
    } catch (error) {
        console.error("Admin Login Error:", error);
        res.status(500).json({ success: false, message: "Server error during admin login." });
    }
};

export { loginUser, registerUser, adminLogin };