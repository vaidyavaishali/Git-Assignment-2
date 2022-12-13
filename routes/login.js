const express = require("express")
const mongoose = require("mongoose");
const Users = require("../modules/user")
mongoose.connect("mongodb://localhost/Assignment")
const bodyparser = require("body-parser");
const { body, validationResult } = require('express-validator');
const router = express.Router();
const bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
const secrete = "RESTAPIAUTH"

router.use(bodyparser.json())

router.post("/register",
    body("name").isAlpha(),
    body("email").isEmail(),
    body("password").isLength({ min: 6, max: 16 }),
    async (req, res) => {
        const { name, email, password } = req.body
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    errors: errors.array()
                })
            } else {
                const existingUser = await Users.find({ email })
                if (existingUser.length) {
                    res.status(400).json({
                        status: "Failed",
                        result: "User Already exist with the email"
                    })
                }
                else {
                    // console.log(password)
                    bcrypt.hash(password, 10, async (err, hash) => {

                        // console.log(hash)
                        if (err) {
                            return res.status(500).json({
                                status: "Failed",
                                message: err.message
                            })
                        }
                        const newUser = await Users.create({
                            name: name,
                            email: email,
                            password: hash
                        })

                        res.json({
                            status: "Success",
                            message: "User Successsfully Register",
                            result: newUser
                        })
                    })
                }
            }
        } catch (e) {
            res.json({
                status: "Failed",
                message: e.message
            })
        }
    })

router.post("/login", body('email').isEmail(), async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.status(400).json({ errors: errors.array() });
        }
        const { email, password } = req.body;
        let user = await Users.find({ email })
        // console.log(email)
        if (!user.length) {
            res.status(409).json({
                status: "Failed",
                message: "There is no account with the entered email"
            })
        } else {
            // console.log(user[0].password)
            bcrypt.compare(password, user[0].password, (err, result) => {
                // console.log(password)
                // console.log(user[0].password)
                //    console.log(result)
                if (err) {
                    res.status(500).json({
                        status: "Failed",
                        message: err.message
                    })
                }

                else {

                    if (result) {
                        // console.log(user[0].id)
                        const token = jwt.sign({
                            exp: Math.floor(Date.now() / 1000) + (60 * 60),
                            data: user[0].id
                            // console.log
                        }, secrete);
                        res.json({
                            status: "Success",
                            message: "Login Successful",
                            token
                        })

                    } else {
                        res.status(401).json({
                            status: "Failed",
                            message: "Invalid credentials"
                        })
                    }
                }
            });
        }

    } catch (e) {
        res.json({
            status: "Failed",
            message: e.message
        })
    }

})


module.exports = router