const {Router}=require("router");
const courseRouter=Router();

courseRouter.post("/purchase",function(req,res){
    res.json({
        msg:"purchase end point!"
    });
});


courseRouter.get("/preview",function(req,res){
    res.json({
        msg:"preview end point!"
    });
});

module.exports={
    courseRouter:courseRouter
}