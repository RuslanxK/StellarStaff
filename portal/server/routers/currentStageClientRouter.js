const express = require("express");
const clientStages = require("../models/currentStageClientModel")
const router = express.Router();



router.get("/api/clientStages/all", async (req, res) => {

      try {
        const stages = await clientStages.find()
        res.json(stages);
      }

      catch(err) {

         console.log(err)
         res.status(500).send("Server Error");
      }
})



router.post("/api/clientStages", async (req, res) => {

    const body = req.body;
    const stage = new clientStages(body);
  
    try {
      await stage.save();
      res.status(201).send({ stage });
    } catch (error) {
      res.status(500).send(error.message);
    }
  });



  router.put("/api/clientStage/:id", async (req, res) => {
    try {
      const id = req.params.id;
      const body = req.body;
  
      await clientStages.findByIdAndUpdate(id, body);
      
      res.send("Updated Succesfully");

    } catch (error) {
      res.status(400).send("An Error Occurred");
    }
  });


  module.exports = router;
