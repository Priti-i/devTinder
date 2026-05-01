const express=require('express');
const app=express();
app.use('/home',(req,res)=>{
    res.send("home page");
})
app.use((req,res)=>{
    res.send("request sent to server");
});
app.listen(3000,()=>{
    console.log("server is running");
});