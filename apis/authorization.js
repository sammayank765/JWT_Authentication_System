const router = require("express").Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../model/db");
const { registerValidation, loginValidation } = require("./validator");
router.post("/register", async(req, res) => {
    // validate the user
    const { error } = registerValidation(req.body);
    if (error) {
        return res.status(400).json({ error: error.details[0].message   });
    }
    const doesEmailExist = await User.findOne({ email: req.body.email });
    if (doesEmailExist)
    return res.status(400).json({ error: "Email already exists" });
    // hash the password
    const salt = await bcrypt.genSalt(10);
    const password = await bcrypt.hash(req.body.password, salt);
    const user = new User({
        name: req.body.name,
        email: req.body.email,
        password,
      });
      try {
        const savedUser = await user.save();
        res.json({ error: null, data: savedUser });
      } catch (error) {
        res.status(400).json({ error });
      }
    });
// login route
router.post("/login", async (req, res) => {
    // validate the user
    const { error } = loginValidation(req.body);
    if (error) return res.status(400).json({ error:   error.details[0].message });
    const user = await User.findOne({ email: req.body.email });
    // if email is wrong
    if (!user) return res.status(400).json({ error: "Email is wrong" });
    // password verification
    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if (!validPassword)
    return res.status(400).json({ error: "Password is wrong" });
    // create token
    const token = jwt.sign(
        // payload data
        {
        name: user.name,
        id: user._id,
        },
        process.env.TOKEN_SECRET
    );
    res.header("auth-token", token).json({
        error: null,
        data: {
        message : "login successful!!!",
        token,
        },
    });
    });
module.exports = router;