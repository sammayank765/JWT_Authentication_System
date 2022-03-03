const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();
// connect to db
mongoose.connect(
process.env.DB_CONNECT,
{
  useNewUrlParser: true,
  useUnifiedTopology: true,
},
() => console.log("connected to db")
);
const auth= require("./apis/authorization");
const dashboard = require("./apis/dashboard");
const verifyToken = require("./apis/token-validator");
app.use(express.json()); // for parsing

app.use("/api/user", auth);
app.use("/api/dashboard", verifyToken, dashboard);
const PORT = process.env.PORT || 5000;

app.get("/", (req, res) => {
  res.send(`Hey it's working !!`);
});
app.listen(PORT, () => console.log(`server up and running at  ${PORT}`));