const jwt = require("jsonwebtoken");
const Recruiter = require("../models/recruitersModel");

const auth = async (req, res, next) => {
  try {
    const token = req.header("Authorization");
    const decoded = jwt.verify(token, "test");
    const recruiter = await Recruiter.findOne({
      _id: decoded._id,
      "tokens.token": token,
    });

    if (!recruiter) {
      throw new Error();
    }

    req.token = token;
    req.recruiter = recruiter;

    next();
  } catch (e) {
    res.status(401).send({ error: "Please authenticate." });
  }
};

module.exports = auth;
