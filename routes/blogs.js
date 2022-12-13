const express = require("express");
const mongoose = require("mongoose");
const Users = require("../modules/posts");
mongoose.connect("mongodb://localhost/Assignment");
const bodyparser = require("body-parser");
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
const secret = "RESTAPIAUTH";

const router = express.Router();

router.use(bodyparser.json());

router.get("/posts", async (req, res)=>{
    try{
        const users = await Users.find()
        res.json({
            stutus:"Success",
            users
        })
    }catch(e){
        res.status(400).json({
            status: "Failed",
            message: e.message
        })
    }
    
})


router.post("/posts", async (req, res) => {
    try {
        const posts = await Users.create({
            title: req.body.title,
            body: req.body.body,
            image: req.body.image,
            user: req.user
        })
        // console.log(posts)
        console.log(req.user)
        res.json({
            status: "Success",
            posts
        })
    } catch (e) {
        res.status(400).json({
            status: "Failed",
            message: e.message
        })
    }
})

router.put('/posts/:id', async (req,res)=>{
    try{
        const UserName = await Users.find({_id:req.params.id})
        if(UserName.length){
        const updatedUser = await Users.updateOne({_id:req.params.id}, req.body)
        //   console.log(UserName)
        const newUsers = await Users.find({_id:req.params.id})
        res.json({
            status:"Successfully Updated",
            newUsers
        })
    }
    else{
        res.json({
         status:"Failure",
         message:"Invalid id"
        })
    }
}catch(e){
        res.status(400).json({
            status :"Failure",
            message:e.message
          })
    }
})
router.delete("/posts/:id", async (req, res)=>{
    
    try{
        
        const users = await Users.find({_id:req.params.id})
        if(users.length){
            const users = await Users.deleteOne({_id:req.params.id})
       
            res.json({
                stutus:"Successfully deleted",
                users
            })
        }else{
            res.json({
                stutus:"Failed",
                result:"User Already exists"
            })
        }
        
    }catch(e){
        res.status(400).json({
            status: "Failed",
            message: e.message
        })
    }
    
})

module.exports = router