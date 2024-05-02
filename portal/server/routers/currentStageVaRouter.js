const express = require("express");
const vaStages = require("../models/currentStageVaModel")
const router = express.Router();



router.get("/api/vaStages/all", async (req, res) => {

      try {
        const stages = await vaStages.find()
        res.json(stages);
      }

      catch(err) {

         console.log(err)
         res.status(500).send("Server Error");
      }
})



router.post("/api/vaStages", async (req, res) => {

    const body = req.body;
    const stage = new vaStages(body);
  
    try {
      await stage.save();
      res.status(201).send({ stage });
    } catch (error) {
      res.status(500).send(error.message);
    }
  });



  router.put("/api/vaStage/:id", async (req, res) => {
    try {
      const id = req.params.id;
      const body = req.body;
  
      await vaStages.findByIdAndUpdate(id, body);
      
      res.send("Updated Succesfully");

    } catch (error) {
      res.status(400).send("An Error Occurred");
    }
  });


  module.exports = router;
