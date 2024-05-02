const jwt = require("jsonwebtoken");
const Admin = require("../models/adminModel");
const { config } = require("dotenv");

const auth = async (req, res, next) => {
  try {
    const crmAuthorization = req.header("crmAuthorization");
    if (crmAuthorization) {
      if (crmAuthorization === process.env.CRM_LOCATION) {
        return next();
      } else {
        throw new Error("Invalid CRM Key");
      }
    } else {
      const token = req.header("Authorization");
      const decoded = jwt.verify(token, "test");
      const admin = await Admin.findOne({
        _id: decoded._id,
        "tokens.token": token,
      });

      if (!admin) {
        throw new Error("Admin authentication failed");
      }

      req.token = token;
      req.admin = admin;

      next();
    }
  } catch (e) {
    res.status(401).send({ error: "Please authenticate." });
  }
};

module.exports = auth;
