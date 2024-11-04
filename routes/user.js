const { Router } = require("express");
const { userModel, purchaseModel, courseModel } = require("../db");
const userRouter = Router();
const bcrypt = require("bcrypt");
const { z } = require('zod');
const jwt=require('jsonwebtoken');
const {JWT_SECRET_USER}=require('../config');
const {userMiddleware}=require("../middleware/userMiddleware");

//!Signup Schema
const signupSchema = z.object({
    email: z.string().email(),

    password: z.string()
        .min(6, { message: "Password must be at least 6 characters long." })
        .refine((password) => /[A-Z]/.test(password), {
            message: "Password must contain at least one uppercase letter."
        })
        .refine((password) => /[a-z]/.test(password), {
            message: "Password must contain at least one lowercase letter."
        })
        .refine((password) => /\d/.test(password), {
            message: "Password must contain at least one number."
        })
        .refine((password) => /[!@#$%^&*]/.test(password), {
            message: "Password must contain at least one special character (!@#$%^&*)."
        }),

    firstName: z.string().min(1, { message: "First name is required." }),
    lastName: z.string().min(1, { message: "Last name is required." }),
});

//! SIGNUP
userRouter.post("/signup", async function (req, res) {
    try {
        // Validate request body
        const { email, password, firstName, lastName } = signupSchema.parse(req.body);
        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);
        // Create user in the database
        await userModel.create({
            email,
            password: hashedPassword,
            firstName,
            lastName,
        });
        // Send a success response
        res.json({
            msg: "Signup successful!",
        });
    } catch (error) {
        // Send validation errors if any
        res.status(400).json({
            msg: "Error signing up.",
            errors: error.errors,
        });
    }
});

//! SIGNIN
userRouter.post("/signin", async function (req, res) {
    try {
        const { email, password } = req.body;
        // Find the user by email
        const user = await userModel.findOne({ email: email });
        if (!user) {
            return res.status(403).json({ message: "Incorrect Credentials" });
        }
        // Compare the provided password with the stored hashed password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(403).json({ message: "Incorrect Credentials" });
        }
        // Generate JWT token
        const token = jwt.sign({ id: user._id }, JWT_SECRET_USER, { expiresIn: '1h' });
        // Send token in response
        res.json({ token: token });
    } catch (error) {
        res.status(500).json({ message: "An error occurred during sign-in", error: error.message });
    }
});


//!Purchase
userRouter.get("/purchases", userMiddleware,async function (req, res) {

    const userId=req.userId;

    const purchases= await purchaseModel.find({userId,});

    const courseData= await courseModel.find({_id:purchases.map(x=>x.courseId)});
    res.json({
        msg: "purchases end point",
        purchases,
        courseData
    });
});

module.exports = {
    userRouter: userRouter
}