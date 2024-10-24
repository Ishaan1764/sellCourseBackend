const {Router} =require("express");
const adminRouter=Router();

adminRouter.post("/signup",function(req,res){
    res.json({
        msg:"Admin signup endpoint!"
    });
});
adminRouter.post("/sigin",function(req,res){
    res.json({
        msg:"Admin signin endpoint!"
    });
});
adminRouter.post("/course",function(req,res){
    res.json({
        msg:"Admin Create Course endpoint!"
    });
});
adminRouter.put("/course",function(req,res){
    res.json({
        msg:"Admin update Course endpoint!"
    });
});
adminRouter.get("/course/bulk",function(req,res){
    res.json({
        msg:"Admin get all Courses endpoint!"
    });
});

module.exports={
    adminRouter:adminRouter
}
