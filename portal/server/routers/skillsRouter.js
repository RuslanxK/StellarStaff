const express = require("express");
const skills = require("../models/skillsModel")
const router = express.Router();



router.get("/api/skills/all", async (req, res) => {

      try {
        const skill = await skills.find()
        res.json(skill);
      }

      catch(err) {

         console.log(err)
         res.status(500).send("Server Error");
      }
})



// router.post("/api/skills", async (req, res) => {

//     const body = req.body;
//     const Skills = new skills(body);
  
//     try {
//       await Skills.save();
//       res.status(201).send({ Skills });
//     } catch (error) {
//       res.status(500).send(error.message);
//     }
//   });



  router.put("/api/skill/:id", async (req, res) => {
    try {
      const id = req.params.id;
      const body = req.body;
  
      await skills.findByIdAndUpdate(id, body);
  
      res.send("Updated Succesfully");
    } catch (error) {
      res.status(400).send("An Error Occurred");
    }
  });



  module.exports = router;
