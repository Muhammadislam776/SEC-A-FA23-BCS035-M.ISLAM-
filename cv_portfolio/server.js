const express = require("express");
const bodyParser = require("body-parser");

const app = express();

app.use(express.static("public"));
app.use("/node_modules", express.static("node_modules"));

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({extended:true}));

app.get("/",(req,res)=>{
res.render("home",{title:"Home",page:"home"});
});

app.get("/about",(req,res)=>{
res.render("about",{title:"About",page:"about"});
});

app.get("/experience",(req,res)=>{
res.render("experience",{title:"Experience",page:"experience"});
});

app.get("/projects",(req,res)=>{
res.render("projects",{title:"Projects",page:"projects"});
});

app.get("/contact",(req,res)=>{
res.render("contact",{title:"Contact",page:"contact"});
});

app.post("/contact",(req,res)=>{
console.log(req.body);
res.redirect("/contact");
});

app.listen(3000,()=>{
console.log("Server running on http://localhost:3000");
});