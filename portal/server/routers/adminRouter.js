const express = require("express");
const admin = require("../models/adminModel");
const router = express.Router();
const adminAuth = require("../middleware/auth");
const bcrypt = require("bcryptjs");

router.get("/api/admins/all", adminAuth, async (req, res) => {
  try {
    const admins = await admin.find();
    res.json(admins);
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
});



router.get("/api/admin/:id", adminAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const Admin = await admin.findById(id);
    res.json(Admin);
  } catch (error) {
    res.status(500).send("Server Error");
  }
});



router.post("/api/admins", async (req, res) => {
  const body = req.body;

  const Admin = new admin(body);

  try {
    await Admin.save();
    const token = await Admin.generateAuthToken();
    res.status(201).send({ Admin, token });
  } catch (error) {
    res.status(500).send(error.message);
  }
});

router.post("/api/admins/login", async (req, res) => {
  try {
    const Admin = await admin.findByCredentials(
      req.body.username,
      req.body.password
    );

    const token = await Admin.generateAuthToken();

    res.send({ Admin, token });
  } catch (error) {
    res.status(400).send("Invalid data.");
  }
});

router.post("/api/admins/logout", adminAuth, async (req, res) => {
  try {
    req.admin.tokens = req.admin.tokens.filter((t) => {
      return t.token !== req.token;
    });

    await req.admin.save();
    res.send("Logged out");
  } catch (e) {
    res.status(500).send();
  }
});

router.post("/api/admins/logoutAll", adminAuth, async (req, res) => {
  try {
    req.admin.tokens = [];
    await req.admin.save();
    res.send("All sessions logged out");
  } catch (e) {
    res.status(500).send();
  }
});

router.put("/api/admin/:id", adminAuth, async (req, res) => {
  try {
    const id = req.params.id;
    const body = req.body;
    if (body.password) {
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(body.password, saltRounds);
      body.password = hashedPassword;
    }

    await admin.findByIdAndUpdate(id, body);
    res.send("Updated Succesfully");
  } catch (error) {
    res.status(400).send("An Error Occurred");
  }
});

module.exports = router;
