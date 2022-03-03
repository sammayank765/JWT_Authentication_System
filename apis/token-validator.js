const jwt = require("jsonwebtoken");
// middleware to validate token
const verifyToken = (req, res, next) => {
  const token = req.header("auth-token");
  if (!token) return res.status(401).json({ error: "Sorry! Please come back with a token" });
  try {
    const verified = jwt.verify(token, process.env.TOKEN_SECRET);
    req.user = verified;
    console.log("try");
    next(); // to continue the flow
  } catch (err) {
      console.log("catch");
    res.status(400).json({ error: "Invalid Token. Sorry!!!" });
  }
};
module.exports = verifyToken;