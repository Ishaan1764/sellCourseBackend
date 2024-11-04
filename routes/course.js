const {Router}=require("express");
const { userMiddleware } = require("../middleware/userMiddleware");
const { purchaseModel, courseModel } = require("../db");
const courseRouter=Router();

courseRouter.post("/purchase",userMiddleware,async function(req,res){
    const courseId=req.body.courseId;
    const userId=req.userId;

    //avoid twice buuying the same course.
    //check weathre user actually paid thge price of course
    await purchaseModel.create({
        userId,
        courseId
    });
    res.json({
        msg: "you have successfully bought a course"
    });
});


courseRouter.get("/preview",async function(req,res){
    const courses= await courseModel.find({});
    
    res.json({
        msg:"preview of cources:",
        courses
    });
});

module.exports={
    courseRouter:courseRouter
}