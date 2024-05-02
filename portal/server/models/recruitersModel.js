const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const Schema = mongoose.Schema;

const recruiterSchema = new Schema({
  fullname: {
    type: String,
  },

  firstName: {
    type: String,
  },

  lastName: {
    type: String,
  },

  password: {
    type: String,
    required: false,
    unique: true,
    trim: true,
  },

  companyName: {
    type: String,
  },

  lookingFor: {
    type: String,
  },

  email: {
    type: String,
  },

  phone: {
    type: String,
  },

  crmID: {
    type: String,
  },

  appointments: [
    {
      appointmentTitle: String,
      appointmentStartTime: String,
      appointmentEndTime: String,
      appointmentCancelLink: String,
      appointmentRescheduleLink: String,
    },
  ],

  requiredSkills: [String],

  assignedVas: [
    {
      _id: String,
      fullname: String,
      email: String,
      phone: String,
      selected: {
        type: Boolean,
        default: false,
      },
    },
  ],

  jobType: {
    type: String,
  },

  startDate: {
    type: Date,
  },
  currentStage: {
    type: String,
  },

  notes: String,

  tokens: [
    {
      token: {
        type: String,
        required: true,
      },
    },
  ],
});


recruiterSchema.methods.toJSON = function () {
  const recruiter = this;
  const recruiterObject = recruiter.toObject();

  delete recruiterObject.password;
  delete recruiterObject.tokens;

  return recruiterObject;
};

recruiterSchema.methods.generateAuthToken = async function () {
  const recruiter = this;
  const token = jwt.sign({ _id: recruiter._id.toString() }, "test");

  recruiter.tokens = recruiter.tokens.concat({ token });
  await recruiter.save();

  return token;
};

recruiterSchema.statics.findByCredentials = async (email, password) => {
  const recruiter = await Recruiter.findOne({ email });
  if (!recruiter) {
    throw new Error("Unable to login");
  }

  const isMatch = await bcrypt.compare(password, recruiter.password);

  if (!isMatch) {
    throw new Error("Unable to login");
  }

  return recruiter;
};

recruiterSchema.pre("save", async function (next) {
  const recruiter = this;

  if (recruiter.isModified("password")) {
    recruiter.password = await bcrypt.hash(recruiter.password, 8);
  }

  next();
});

const Recruiter = mongoose.model("recruiters", recruiterSchema);

module.exports = Recruiter;
