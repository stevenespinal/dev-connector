const express = require("express");
const router = express.Router();
const User = require("../../models/User");
const auth = require("../../middleware/auth");
const {check, validationResult} = require("express-validator");
const config = require("config");
const secret = config.get("jwtSecret");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

router.get("/", auth, async (req, res) => {
  try {
    // -password removes password from being listed
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error.");
  }
});

router.post("/", [
  check("email", "Please include a valid email").isEmail(),
  check("password", "Password is required").exists(),

], async (req, res) => {
  // console.log(req.body);
  const {email, password} = req.body;
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({errors: errors.array()});
  }

  try {
    let user = await User.findOne({email});
    if (!user) {
      return res.status(400).json({errors: [{message: "Invalid Credentials"}]})
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({errors: [{message: "Invalid Credentials"}]});
    }

    const payload = {
      user: {
        id: user.id
      }
    }

    jwt.sign(payload, secret, {expiresIn: '3600000'}, (err, token) => {
      if (err) throw err;
      res.json({token});
    });
  } catch (err) {
    console.error({error: err.message});
    res.status(500).send("Server error");
  }

});


module.exports = router;
