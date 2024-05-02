const jwt = require("jsonwebtoken");
const Va = require("../models/vaModel");

const auth = async (req, res, next) => {
  try {
    const token = req.header("Authorization");
    const decoded = jwt.verify(token, "test");
    const va = await Va.findOne({
      _id: decoded._id,
      "tokens.token": token,
    });

    if (!va) {
      throw new Error();
    }

    req.token = token;
    req.va = va;

    next();
  } catch (e) {
    res.status(401).send({ error: "Please authenticate." });
  }
};

module.exports = auth;
