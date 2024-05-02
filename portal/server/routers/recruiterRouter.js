const express = require("express");
const recruiter = require("../models/recruitersModel");
const router = express.Router();
const adminAuth = require("../middleware/auth");
const clientAuth = require("../middleware/clientAuth");
const mongoose = require("mongoose");
const axios = require("axios");

router.get("/api/recruiters/all", adminAuth, async (req, res) => {
  try {
    const { q } = req.query;
    let query = {};

    if (q === "active") {
      query = { currentStage: "Paying Client" };
    } else if (q === "paused") {
      query = { currentStage: "Paused" };
    } else if (q === "New Applicant") {
      query = { currentStage: "Interviewing VAs" };
    } else if (q === null) {
      const regex = new RegExp(`^${q}`, "i");

      query = {
        $or: [
          { fullname: { $regex: regex } },
          { firstName: { $regex: regex } },
          { lastName: { $regex: regex } },
          { lookingFor: { $regex: regex } },
          { jobType: { $regex: regex } },
          { "assignedVas.fullname": { $regex: regex } },
          { requiredSkills: { $in: [regex] } },
          { currentStage: { $regex: regex } },
          { notes: { $regex: regex } },
        ],
      };
    }

    const recruiters = await recruiter.find(query).exec();
    res.json(recruiters);
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
});

router.get("/api/recruiter/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const foundClient = await recruiter.findById(id);
    if (foundClient.crmID) {
      var config = {
        method: "get",
        maxBodyLength: Infinity,
        url: `https://rest.gohighlevel.com/v1/contacts/${foundClient.crmID}/appointments/`,
        headers: {
          Authorization: process.env.CRM_KEY,
        },
      };
      try {
        const { data } = await axios(config);
        if (data.events.length > 0) {
          const plainClient = foundClient.toObject();
          plainClient.appointments = data.events;
          res.json(plainClient);
        } else {
          res.json(foundClient);
        }
      } catch (error) {
        res.status(500).send("Error getting appointments");
      }
    } else {
      res.json(foundClient);
    }
  } catch (error) {
    res.status(500).send("Server Error");
  }
});

router.post("/api/recruiters", async (req, res) => {
  try {
    let Recruiter;
    if (req.body.customData) {
      const checkExistingRecruiter = await recruiter.findOne({ crmID: req.body.customData.crmID });

      if (checkExistingRecruiter) {
        return res.status(409).json({ message: "Recruiter with this ID already exists." });
      }
      Recruiter = new recruiter(req.body.customData);
    } else {
      Recruiter = new recruiter(req.body);
    }
    await Recruiter.save();
    const token = await Recruiter.generateAuthToken();
    res.status(201).json({ Recruiter, token });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
});

router.put("/api/recruiter/:id", adminAuth, async (req, res) => {
  try {
    const id = req.params.id;
    const body = req.body;
    const selectedVas = [];

    if (body.assignedVas && body.crmID) {
      body.assignedVas.forEach((va) => {
        if (va.selected === true) {
          selectedVas.push(va);
        }
      });

      var data = {
        customField: {},
      };

      if (selectedVas.length > 0) {
        const customIds = [
          "zIlJPzkCddx02B71pPmt",
          "mzbot0d3N3msRo9TBI7Q",
          "B5EYw8wknKijcKN11wn6",
          "WzotF9fw3qPHyId4VeXw",
          "SqcRFZtLkfPcc9YyF10v",
        ];

        selectedVas.forEach((item, index) => {
          const customId = customIds[index];
          data.customField[customId] = item.fullname
            ? `Name: ${item.fullname} Email: ${item.email} Phone: ${item.phone}`
            : `Name: ${item.firstName} ${item.lastName} Email: ${item.email} Phone: ${item.phone}`;
        });

        var config = {
          method: "put",
          maxBodyLength: Infinity,
          url: `https://rest.gohighlevel.com/v1/contacts/${body.crmID}`,
          headers: {
            Authorization: process.env.CRM_KEY,
          },
          data: data,
        };
        try {
          const { data } = await axios(config);
          await recruiter.findByIdAndUpdate(id, body);
          res.send("Updated Successfully");
        } catch (error) {
          console.log(error);
        }
      } else {
        await recruiter.findByIdAndUpdate(id, body);
        res.send("Updated Successfully");
      }
    } else {
      await recruiter.findByIdAndUpdate(id, body);
      res.send("Updated Successfully");
    }
  } catch (error) {
    res.status(400).send("An Error Occurred");
  }

  ///////
  /* This is to handle changes from crm 
  try {
    const identifier = req.params.id;
    let id;
    // check if got id or email by parameter (for crm integration)
    if (mongoose.Types.ObjectId.isValid(identifier)) {
      id = identifier;
    } else {
      const recruiterData = await recruiter.findOne({ email: identifier });
      if (!recruiterData) {
        return res.status(404).send("Client not found by email");
      }
      id = recruiterData._id;
    }

    const body = req.body;

    if (body.appointmentTitle && !body.cancel && !body.update) {
      await recruiter.findByIdAndUpdate(id, {
        $push: { appointments: body },
      });
      res.send("Appointment Added Successfully");
    } else if (body.cancel === true) {
      await recruiter.findByIdAndUpdate(id, {
        $pull: { appointments: { appointmentTitle: body.appointmentTitle } },
      });
      res.send("Appointment cancelled Successfully");
    } else if (body.update === true) {
      await recruiter.findOneAndUpdate(
        {
          _id: id,
          "appointments.appointmentTitle": body.appointmentTitle,
        },
        {
          $set: { "appointments.$": body },
        }
      );
      res.send("Appointment Rescheduled Successfully");
    } else {
      await recruiter.findByIdAndUpdate(id, body);
      res.send("Updated Successfully");
    }
  } catch (error) {
    res.status(400).send("An Error Occurred");
  }
  */
});

// router.put("/api/recruiter/assign/:id", adminAuth, async (req, res) => {
//   try {
//     const recruiterId = req.params.id;
//     const vaName = req.body.vaName; // Get the VA ID from the request body

//     const updatedRecruiter = await recruiter.findByIdAndUpdate(
//       recruiterId,
//       { $push: { assignedVas: { vaName } } }, // Push the VA ID to the assignedVas array
//       { new: true }
//     );

//     res.send("Updated Successfully");
//   } catch (error) {
//     res.status(400).send("An Error Occurred");
//   }
// });

router.put("/api/recruiter/remove/:id", adminAuth, async (req, res) => {
  try {
    const recruiterId = req.params.id;
    const vaName = req.body.vaName; // Get the VA ID from the request body

    const updatedRecruiter = await recruiter.findByIdAndUpdate(
      recruiterId,
      { $pull: { assignedVas: { vaName } } }, // Remove the VA ID from the assignedVas array
      { new: true }
    );

    res.send("Updated Successfully");
  } catch (error) {
    res.status(400).send("An Error Occurred");
  }
});

router.delete("/api/recruiter/:id", adminAuth, async (req, res) => {
  try {
    const id = req.params.id;
    await recruiter.findByIdAndDelete(id);
    res.send("Deleted Successfully");
  } catch (error) {
    res.status(400).send("An Error Occurred");
  }
});

router.post("/api/recruiter/login", async (req, res) => {
  try {
    const Recruiter = await recruiter.findByCredentials(req.body.email, req.body.password);
    
    const token = await Recruiter.generateAuthToken();

    res.send({ Recruiter, token });
  } catch (error) {
    console.log(error);
    res.status(400).send("Invalid data.");
  }
});

router.post("/api/recruiter/logout", clientAuth, async (req, res) => {
  try {
    req.recruiter.tokens = req.recruiter.tokens.filter((t) => {
      return t.token !== req.token;
    });

    await req.recruiter.save();
    res.send("Logged out");
  } catch (e) {
    res.status(500).send();
  }
});

module.exports = router;
