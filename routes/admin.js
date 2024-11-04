const {Router} =require("express");
const adminRouter=Router();
const bcrypt = require("bcrypt");
const { z } = require('zod');
const jwt=require('jsonwebtoken');
const {JWT_SECRET_ADMIN}=require("../config");
const {adminModel, courseModel}=require("../db");
const {adminMiddleware}=require("../middleware/adminMiddleware");

//!SIGNUP SCHEMA
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

//!SIGNUP
adminRouter.post("/signup",async function(req,res)
{
    try {
        // Validate request body
        const { email, password, firstName, lastName } = signupSchema.parse(req.body);
        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);
        // Create admin in the database
        await adminModel.create({
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

//!Signin
adminRouter.post("/signin",async function(req,res){
    try {
        const { email, password } = req.body;
        // Find the admin by email
        const admin = await adminModel.findOne({ email: email });
        if (!admin) {
            return res.status(403).json({ message: "Incorrect Credentials" });
        }
        // Compare the provided password with the stored hashed password
        const isPasswordValid = await bcrypt.compare(password, admin.password);
        if (!isPasswordValid) {
            return res.status(403).json({ message: "Incorrect Credentials" });
        }
        // Generate JWT token
        const token = jwt.sign({ id: admin._id }, JWT_SECRET_ADMIN, { expiresIn: '1h' });
        // Send token in response
        res.json({ token: token });
    } catch (error) {
        res.status(500).json({ message: "An error occurred during sign-in", error: error.message });
    }
});

//!Course
adminRouter.post("/course",adminMiddleware,async function(req,res){
    const adminId= req.adminId;

    const{title, description, price,imageUrl}=req.body;
    //* use multer to take images from user.
    const course=await courseModel.create({
        title:title, description, price,imageUrl,creatorId:adminId
    });
    
    res.json({
        message:"course Created",
        courseId: course._id
    });
});

//!/course PUT
adminRouter.put("/course",adminMiddleware,async function(req,res){
    const adminId= req.adminId;

    const{title, description, price,imageUrl,courseId}=req.body;
    // yaha jiska course hoga sirf vo hi update kr skta hai aur koi nhi ok. 
    const course = await courseModel.updateOne({
        _id:courseId,
        creatorId:adminId
    },{
        title, description, price,imageUrl
    })
    res.json({
        message:"course Updated",
        courseId: course._id
    });
});

//! Get all Courses
adminRouter.get("/course/bulk",adminMiddleware,async function(req,res){
    const adminId= req.adminId;

    const courses= await courseModel.find({
        creatorId:adminId
    })
    res.json({
        message:"Your Courses",
        courses
    });
});

module.exports={
    adminRouter:adminRouter
}
