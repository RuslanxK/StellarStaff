const express = require("express");
const va = require("../models/vaModel");
const router = express.Router();
const vaAuth = require("../middleware/vaAuth");
const authAdmin = require("../middleware/auth");
const bcrypt = require("bcryptjs");
const AWS = require("aws-sdk");
const multer = require("multer");
const upload = multer({ storage: multer.memoryStorage() });
const axios = require("axios");

router.get("/api/vas/all", authAdmin, async (req, res) => {
  try {
    const { q } = req.query;
    let query = {};

    if (q === "active") {
      query = { status: "Added to candidate poll" };
    } else if (q === "inactive") {
      query = { status: "Rejected" };
    } else if (q === "New Applicant") {
      query = { status: "New Applicant" };
    } else if (q === null) {
      const regex = new RegExp(`^${q}`, "i");
      query = {
        $or: [
          { fullname: { $regex: regex } },
          { "assignedRec.fullname": { $regex: regex } },
          { position: { $regex: regex } },
          { skills: { $in: [regex] } },
          { status: { $regex: regex } },
          { languages: { $in: [regex] } },
          { notes: { $regex: regex } },
        ],
      };
    }

    const vas = await va.find(query).exec();
    res.json(vas);
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
});

router.get("/api/vas/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const foundVa = await va.findById(id);
    res.json(foundVa);
  } catch (error) {
    res.status(500).send("Server Error");
  }
});

router.post("/api/vas", async (req, res) => {
  const body = req.body;

  const Va = new va(body);

  const data = {
    firstName: body.fullname,
    email: body.email,
    phone: body.phone,
    source: Va._id,
  };

  var config = {
    method: "post",
    maxBodyLength: Infinity,
    url: `https://rest.gohighlevel.com/v1/contacts/`,
    headers: {
      Authorization: process.env.VA_CRM_KEY,
    },
    data: data,
  };

  try {
    const resp = await axios(config);
    Va.crmId = resp.data.contact.id;
    await Va.save();
    const token = await Va.generateAuthToken();

    res.status(201).send({ Va, token });
  } catch (error) {
    console.log(error.message);
    res.status(500).send(error.message);
  }
});

router.post("/api/vas/login", async (req, res) => {
  try {
    const Va = await va.findByCredentials(req.body.email, req.body.password);

    const token = await Va.generateAuthToken();

    res.send({ Va, token });
  } catch (error) {
    res.status(400).send("Invalid data.");
  }
});

router.post("/api/vas/logout", vaAuth, async (req, res) => {
  try {
    req.va.tokens = req.va.tokens.filter((t) => {
      return t.token !== req.token;
    });

    await req.va.save();
    res.send("Logged out");
  } catch (e) {
    res.status(500).send();
  }
});

router.post("/api/vas/logoutAll", authAdmin, async (req, res) => {
  try {
    await va.updateMany({}, { $set: { tokens: [] } });
    res.send("All VA sessions logged out");
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: "Failed to log out all sessions" });
  }
});

router.put("/api/vas/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const body = req.body;
    if (body.password) {
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(body.password, saltRounds);
      body.password = hashedPassword;
    }
    await va.findByIdAndUpdate(id, body);
    res.status(200).send("Updated Succesfully");
  } catch (error) {
    console.log(error);
    res.status(400).send("An Error Occurred");
  }
});

router.delete("/api/vas/:id", authAdmin, async (req, res) => {
  try {
    const id = req.params.id;
    await va.findByIdAndDelete(id);
    res.send("Deleted Successfully");
  } catch (error) {
    res.status(400).send("An Error Occurred");
  }
});

const s3 = new AWS.S3();

const uploadVideoToS3 = async (blob, id) => {
  const tags = [{ key: "userID", value: id }];

  const tagString = tags.map((tag) => `${tag.key}=${encodeURIComponent(tag.value)}`).join("&");

  const params = {
    Bucket: "vasupportbucket",
    Key: `${Date.now()}`, // or any preferred name
    Body: blob,
    ContentType: "video/webm",
    Tagging: tagString,
  };
  try {
    const data = await s3.upload(params).promise();
    console.log(data);
    return data.Key;
  } catch (error) {

    console.error("Error uploading video", error);
    return null;
  }
};

const uploadFilesToS3 = async (file, id, fieldName) => {
  const tags = [{ key: "userID", value: id }];

  const tagString = tags.map((tag) => `${tag.key}=${encodeURIComponent(tag.value)}`).join("&");

  const params = {
    Bucket: "vasupportbucket",
    Key: Date.now() + "-" + file.originalname,
    Body: file.buffer,
    ContentType: file.mimetype,
    Tagging: tagString,
    Metadata: {
      fieldName: fieldName,
    },
  };

  try {
    const data = await s3.upload(params).promise();

    const metadataResponse = await s3
      .headObject({
        Bucket: params.Bucket,
        Key: params.Key,
      })
      .promise();

    const respDataObj = {
      [metadataResponse.Metadata.fieldname]: data.key,
    };

    return respDataObj;
  } catch (error) {
    console.log(error);
    console.error("Error uploading file or image", error);
    return null;
  }
};

const uploadSingleFileToS3 = async (file, id) => {
  const tags = [{ key: "userID", value: id }];

  const tagString = tags.map((tag) => `${tag.key}=${encodeURIComponent(tag.value)}`).join("&");

  const params = {
    Bucket: "vasupportbucket",
    Key: Date.now() + "-" + file.originalname,
    Body: file.buffer,
    ContentType: file.mimetype,
    Tagging: tagString,
  };

  try {
    const data = await s3.upload(params).promise();
    console.log(data);
    return data.Key ? data.Key : data.key;
  } catch (error) {
    console.error("Error uploading single file or image", error);
    return null;
  }
};

router.put("/api/vas/application/upload/file/:id", upload.any(), async (req, res) => {
  try {
    const id = req.params.id;
    const body = req.body;
    const files = req.files;
    if (files.length > 1) {
      const uploadPromises = files.map((file) => uploadFilesToS3(file, id, file.fieldname));
      const s3Links = await Promise.all(uploadPromises);
      console.log(s3Links + "1");
      return res.status(200).send(s3Links);
    } else {
      const singleFile = files[0];
      const uploadPromises = await uploadSingleFileToS3(singleFile, id);
      console.log(uploadPromises + "2");
      return res.status(200).send(uploadPromises);
    }
  } catch (error) {
    console.log(error);
    return res.status(400).send("An Error Occurred while uploading video to server");
  }
});

router.put("/api/vas/application/upload/:id", upload.single("file"), async (req, res) => {
  try {
    const id = req.params.id;
    const body = req.body;
    const video = req.file.buffer;
    const videoFinalLink = await uploadVideoToS3(video, id);
    console.log(videoFinalLink);
    if (body.password) {
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(body.password, saltRounds);
      body.password = hashedPassword;
    }

    if (videoFinalLink) {
      return res.status(200).send(videoFinalLink);
    }
  } catch (error) {
    console.log(error);
    return res.status(400).send("An Error Occurred while uploading video to server");
  }
});

module.exports = router;
