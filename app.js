const express=require("express");
const path=require("path");
const mongoose=require("mongoose");
const {userRouter}=require("./routes/user");
const {courseRouter}=require("./routes/course");
const {adminRouter}=require("./routes/admin");
const app=express();
app.use(express.json());

app.use("/api/v1/admin",adminRouter);
app.use("/api/v1/user",userRouter);
app.use("/api/v1/course",courseRouter);

// this will help to not start the server until database is connected
async function main(){
    await mongoose.connect("mongodb+srv://ishaansaluja1764:mJAKIAZwb4v8ax3r@cluster0.tgtp8.mongodb.net/")
    app.listen(3001);
}

main()

