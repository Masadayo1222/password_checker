//jshint esversion:6
require("dotenv").config()
const express = require("express")
const bodyParser = require("body-parser")
const ejs = require("ejs")
const mongoose = require("mongoose")
const encrypt = require("mongoose-encryption") 

const app = express()


app.use(express.static("public"))
app.set("view engine", "ejs")
app.use(bodyParser.urlencoded({
    extended: true
}))

mongoose.connect("mongodb://127.0.0.1:27017/userDB", {useNewUrlParser: true})

const userSchema = mongoose.Schema({
    email: String,
    password: String
})

userSchema.plugin(encrypt, {secret: process.env.SECRET, encryptedFields: ["password"]})

const User = new mongoose.model("User", userSchema)

app.get("/", async function(req, res){
    try{
        await res.render("home")
    }catch(err){
        console.log(err)
    }
})

app.get("/login", async function(req, res){
    try{
        await res.render("login")
    }catch(err){
        console.log(err)
    }
})

app.get("/register", async function(req, res){
    try{
        await res.render("register")
    }catch(err){
        console.log(err)
    }
})


app.post("/register", async function(req, res){
try {
    newUser = new User({
        email: req.body.username,
        password: req.body.password
    })
        await newUser.save()
        res.render("secrets")
    }catch(err){
        console.log(err)
    }
})


app.post("/login",  function(req, res){
    const username = req.body.username
    const password = req.body.password

    User.findOne({email: username})
    .then(function(foundUser){
        if(foundUser.password === password){
            res.render("secrets");
        }
    })
    .catch(function(err){
        console.log(err);
    })})



app.listen(3000, function(req, res){
    console.log("Server started on port 3000")
})