const router = require('express').Router();
const User = require('../models/userModel')
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { findUserById } = require("../controllers/postController")

router.post("/", async(req, res) => {
    try {
        const { email, password, passwordVerify } = req.body;
    
        // validation
    
        if (!email || !password || !passwordVerify)
          return res
            .status(400)
            .json({ errorMessage: "Please enter all required fields." });
    
        if (password.length < 6)
          return res.status(400).json({
            errorMessage: "Please enter a password of at least 6 characters.",
          });
    
        if (password !== passwordVerify)
          return res.status(400).json({
            errorMessage: "Please enter the same password twice.",
          });
    
        const existingUser = await User.findOne({ email });
        if (existingUser)
          return res.status(400).json({
            errorMessage: "An account with this email already exists.",
          });
    
        // hash the password
    
        const salt = await bcrypt.genSalt();
        const passwordHash = await bcrypt.hash(password, salt);
    
        // save a new user account to the db
    
        const newUser = new User({
          email,
          passwordHash,
        });
    
        const savedUser = await newUser.save();

        // sign the token

        const token = jwt.sign(
            {
            user: savedUser._id,
            },
            process.env.JWT_SECRET
        );
    
        res.cookie("token", token, {expire: new Date() + 604800})
        res.status(201).json({token, savedUser });
        
    } catch (err) {
        console.error(err);
        res.status(500).send();
    }
    
})

// log in

router.post("/login", async (req, res) => {
    try {
      const { email, password } = req.body;
  
      // validate
  
      if (!email || !password)
        return res
          .status(400)
          .json({ errorMessage: "Please enter all required fields." });
  
      const existingUser = await User.findOne({ email });
      if (!existingUser)
        return res.status(401).json({ errorMessage: "Wrong email or password." });
  
      const passwordCorrect = await bcrypt.compare(
        password,
        existingUser.passwordHash
      );
      if (!passwordCorrect)
        return res.status(401).json({ errorMessage: "Wrong email or password." });
  
      // sign the token
  
      const token = jwt.sign(
        {
          user: existingUser._id,
        },
        process.env.JWT_SECRET
      );

      res.cookie("token", token, {expire: new Date() + 604800})
      res.status(201).json({token, existingUser });

    } catch (err) {
      console.error(err);
      res.status(500).send();
    }
  });
  
  //logout
  router.get("/logout", (req, res) => {
    res.clearCookie("token");
    res.json({ message: "Logged Out" });
  });

  router.get("/loggedIn", (req, res) => {
    try {
      const token = req.cookies.token;
      if (!token) return res.json(false);
  
      jwt.verify(token, process.env.JWT_SECRET);
  
      res.send(true);
    } catch (err) {
      res.json(false);
    }
  });

//to check weather the is a pramerter of user_id in the route then we need to execute the
//findUserById method
router.param("userId", findUserById);


module.exports = router;