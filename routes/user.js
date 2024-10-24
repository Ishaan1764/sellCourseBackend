const {Router} = require("express");
const userRouter=Router();

userRouter.post("/signup",function(req,res){
    res.json({
        msg:"signup endpoint!"
    });
});
userRouter.post("/sigin",function(req,res){
    res.json({
        msg:"signin endpoint!"
    });
});
userRouter.get("/purchases",function(req,res){
    res.json({
        msg:"purchases end point"
    });
});

module.exports={
    userRouter:userRouter
}