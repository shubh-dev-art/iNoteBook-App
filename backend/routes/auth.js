const express = require('express');
const User = require('../models/User');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const fetchuser = require('../middleware/fetchuser');

const JWT_SECRET = "Shubhisa@beast";

// Routes1: create a User using: POST "/api/auth/createuser" . No login required
router.post('/createuser' , [
    body('username','Enter a valid username and minimum length for username is 3.').isLength({min : 3}),
    body('useremail','Enter a valid useremail').isEmail(),
    body('userpassword','Userpassword must have a minimum length of 5 characters.').isLength({min : 5})
], async (req , res) =>{

    let success = false;
    // if there are errors, return bad request and message
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({success, errors: errors.array()});
    }

    try {
        // check whether user with same email already exists
        let user = await User.findOne({useremail : req.body.useremail})
        if (user){
            return res.status(400).json({success, error: "User with same useremail arlready exists."})
        }

        // Adding salt in userpassword and then creating user
        const salt = await bcrypt.genSalt(10);
        const secPass = await bcrypt.hash(req.body.userpassword, salt);
        user = await User.create({
            username: req.body.username,
            useremail: req.body.useremail,
            userpassword: secPass
        })
        const data = {
            user:{
                id: user.id
            }
        }
        const authToken = jwt.sign(data, JWT_SECRET);
        success = true;
        res.json({success, authToken});
        
    }catch(error){
        console.error(error.message);
        res.status(500).send("Something went wrong!");
    }
});


// Routes2: Login a User using: POST "/api/auth/login" . No login required
router.post('/login' , [
    body('useremail','Enter a valid useremail').isEmail(),
    body('userpassword','Userpassword cannot be blank.').exists()
], async (req , res) =>{

    let success = false;
    // if there are errors, return bad request and message
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({errors: errors.array()});
    }

    //finding user by correct useremail and then comparing userpassword 
    const {useremail, userpassword} = req.body;
    try{
        let user = await User.findOne({useremail});
        if(!user){
            return res.status(400).json({success, error: "Please try to login with correct credentials"});
        }

        const userPasswordCompare = await bcrypt.compare(userpassword, user.userpassword);
        if(!userPasswordCompare){
            return res.status(400).json({success, error: "Please try to login with correct credentials"});
        }

        const data = {
            user:{
                id: user.id
            }
        }
        const authToken = jwt.sign(data, JWT_SECRET);
        success = true;
        res.json({success, authToken});

    }catch(error){
        console.error(error.message);
        res.status(500).send("Something went wrong!");
    }
});

// Routes3: Get loggedin user details using: POST "/api/auth/getuser" . Login required
router.post('/getuser' , fetchuser, async (req , res) =>{

    // getting user by userId
    try{
        const userId = req.user;
        const user = await User.findById(userId).select("-userpassword");
        res.send(user);

    }catch(error){
        console.log(error.message);
        res.status(500).send("Something went wrong!");
    }
})
module.exports = router;