let express=require("express");

let app=express();

app.get("/",(request,response)=>{
    response.send("Hello Connection")
});

app.listen(3000);