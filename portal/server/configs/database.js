const mongoose = require("mongoose");
const { config } = require("dotenv");

config();

mongoose.connect(process.env.DB_URI, { useNewUrlParser: true });