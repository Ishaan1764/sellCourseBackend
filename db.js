const {Schema, mongo, default: mongoose}=require("mongoose");
const objId= Schema.ObjectId;
// mongoose.connect("mongodb+srv://ishaansaluja1764:mJAKIAZwb4v8ax3r@cluster0.tgtp8.mongodb.net/");
const userSchema=Schema({
    email:{type: String, unique: true},
    password: String,
    firstName: String,
    lastName: String
});

const adminSchema=Schema({
    email:{type: String, unique: true},
    password: String,
    firstName: String,
    lastName: String
});

const courseSchema=Schema({
    title: String,
    description:String,
    price:Number,
    imageUrl:String,
    creatorId:objId
});

const purchaseSchema=Schema({
    userId:objId,
    courseId:objId
});

const userModel=mongoose.model("user",userSchema);
const adminModel=mongoose.model("admin",adminSchema);
const courseModel=mongoose.model("course",courseSchema);
const purchaseModel=mongoose.model("purchase",purchaseSchema);

module.exports={
    userModel,
    adminModel,
    courseModel,
    purchaseModel
}