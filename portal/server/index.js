const express = require("express");
const adminRouter = require("./routers/adminRouter");
const vaRouter = require("./routers/vaRouter");
const recruiterRouter = require("./routers/recruiterRouter");
const changeLogRouter = require("./routers/changeLogRouter");
const hardwareRouter = require("./routers/hardwareRouter");
const skillsRouter = require("./routers/skillsRouter");
const languageRouter = require("./routers/languagesRouter");
const clientStage = require("./routers/currentStageClientRouter");
const vaStage = require("./routers/currentStageVaRouter");
const cors = require("cors");
var bodyParser = require("body-parser");
const { config } = require("dotenv");
const { Configuration, OpenAIApi } = require("openai");
const AWS = require("aws-sdk");

const PORT = 8080;

const app = express();

app.use(cors());

var jsonParser = bodyParser.json({
  type: "application/json",
  limit: "50mb",
});
var urlencodedParser = bodyParser.urlencoded({
  extended: true,
  type: "application/x-www-form-urlencoded",
  limit: "50mb",
});

app.use(jsonParser);
app.use(urlencodedParser);
app.use(express.json({ limit: "50mb" }));

require("./configs/database");

app.use(adminRouter);
app.use(vaRouter);
app.use(recruiterRouter);
app.use(changeLogRouter);
app.use(hardwareRouter);
app.use(skillsRouter);
app.use(languageRouter);
app.use(clientStage);
app.use(vaStage);

app.listen(process.env.PORT || PORT, () => {
  console.log(`app listening on port ${PORT}`);
});

config();

AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: "us-east-1",
});

const openai = new OpenAIApi(
  new Configuration({
    apiKey: process.env.API_KEY,
  })
);

app.post("/api/gpt", async (req, res) => {
  const { content } = req.body;
  try {
    const response = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content:
            "You are an assistant of a company who is hiring Virtual assistants for a job, and your role is to improve their resume that you are getting in a JSON object. the values that need to be improved from the JSON object are the values of the keys: `experience.description` and key: `coverLetterText`, make the coverLetterText value about 130 words. return the answer in the same exact format JSON object as you got, but with the improved values. Do not use the name Virtual assistants and do not write anything regrading name at the end. Do not write any closing sentence or thank you sentence in the end",
        },
        { role: "user", content: content },
      ],
    });

    
    const completion = response.data.choices[0].message.content;

    res.status(200).json({ completion });
  } catch (error) {
    console.log(error);
    res.status(500).send(error.message);
  }
});
