const express = require("express");
const {check, validationResult} = require("express-validator");
const User = require("../../models/User");
const gravatar = require("gravatar");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("config");
const secret = config.get("jwtSecret")
const router = express.Router();

router.post("/", [
  check("name", "Name is required").not().isEmpty(),
  check("email", "Please include a valid email").isEmail(),
  check("password", "Please enter a password with 6 or more characters").isLength({min: 6}),

], async (req, res) => {
  // console.log(req.body);
  const {name, email, password} = req.body;
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({errors: errors.array()});
  }

  try {
    let user = await User.findOne({email});
    if (user) {
      return res.status(400).json({errors: [{message: "User already exists."}]})
    }
    const avatar = gravatar.url(email, {
      s: "200",
      r: "pg",
      d: "mm"
    });

    user = new User({
      name,
      email,
      avatar,
      password
    });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
    await user.save();
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
