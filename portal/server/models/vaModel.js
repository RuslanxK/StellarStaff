const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

mongoose.set("strictQuery", true);

const vaSchema = new mongoose.Schema(
  {
    fullname: String,
    firstName: String,
    lastName: String,
    username: String,
    phone: String,
    profileImage: String,
    age: String,
    shortBio: String,
    industries: String,
    strengths: String,
    achievements: String,
    isImproved: Boolean,
    crmId: String,

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    assignedRec: [
      {
        _id: String,
        fullname: String,
        email: String,
        phone: String
      },
    ],

    languages: [String],
    skills: [String],
    hardwareImages: String,
    internetSpeed: String,
    notes: String,
    position: String,
    coverLetterText: String,
    coverLetterImage: String,
    newResumePdf: String,

    status: String,

    address: String,
    city: String,
    country: String,

    experience: [
      {
        companyName: String,
        companyLocation: String,
        fromDate: String,
        toDate: String,
        description: String,
      },
    ],

    noEducation: Boolean,

    education: [
      {
        collageUniversity: String,
        educationTitle: String,
        fromDate: String,
        toDate: String,
      },
    ],

    computerScreenShot: String,
    videoData: String,
    videoAWS: String,
    linksAWS: [String],
    internetSpeedAWS: String,
    aptitudeFile: String,
    aptitudeText: String,
    discFile: String,
    discText: String,
    englishFile: String,
    englishText: String,
    personalIdFile: String,
    governmentTax: String,
    vsnWaiver: String,

    completedApplication: {
      type: Boolean,
      default: false,
    },

    tokens: [
      {
        token: {
          type: String,
          required: true,
        },
      },
    ],
  },

  {
    timestamps: true,
  }
);

vaSchema.methods.toJSON = function () {
  const va = this;
  const vaObject = va.toObject();

  delete vaObject.password;
  delete vaObject.tokens;

  return vaObject;
};

vaSchema.methods.generateAuthToken = async function () {
  const va = this;
  const token = jwt.sign({ _id: va._id.toString() }, "test");

  va.tokens = va.tokens.concat({ token });
  await va.save();

  return token;
};

vaSchema.statics.findByCredentials = async (email, password) => {
  const va = await Va.findOne({ email });

  if (!va) {
    throw new Error("Unable to login");
  }

  const isMatch = await bcrypt.compare(password, va.password);

  if (!isMatch) {
    throw new Error("Unable to login");
  }

  return va;
};

vaSchema.pre("save", async function (next) {
  const va = this;

  if (va.isModified("password")) {
    va.password = await bcrypt.hash(va.password, 8);
  }

  next();
});

const Va = mongoose.model("vas", vaSchema);

module.exports = Va;
