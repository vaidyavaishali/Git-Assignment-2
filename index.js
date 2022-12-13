const express = require("express");
const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost/Assignment");
// const userRoutes = require("./routes/user");
const loginRoutes = require("./routes/login");
const postsRoutes = require("./routes/blogs");
const secret = "RESTAPIAUTH";
var Jwt = require('jsonwebtoken');
const bodyparser = require("body-parser");
const port = 3000

const app = express();
app.use(bodyparser.json());


app.use('/api/v1/posts', (req, res, next) => {
    // console.log(req.headers.authorization)
    if (req.headers.authorization) {
        const token = req.headers.authorization;
        // console.log(token)
        Jwt.verify(token, secret, function (err, decoded) {

            // console.log(secret)
            if (err) {
                return res.status(403).json({
                    status: "failed",
                    message: "Not a valid token"
                })
            }
            else {
                req.user =  decoded.data
                console.log(decoded.data);
                next();
            }
        })
    }
    else {
        res.status(403).json({
            status: "Failed",
            message: "Not authenticated user"
        })
    }
    // console.log(token)

})



app.use('/api/v1/users', loginRoutes)
app.use('/api/v1/', postsRoutes)

app.listen(port, () => console.log(`Server Running on ${port}`))