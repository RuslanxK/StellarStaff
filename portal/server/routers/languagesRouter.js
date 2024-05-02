const express = require("express");
const languages = require("../models/languagesModel")
const router = express.Router();



router.get("/api/languages/all", async (req, res) => {

      try {
        const lang = await languages.find()
        res.json(lang);
      }

      catch(err) {

         console.log(err)
         res.status(500).send("Server Error");
      }
})



router.post("/api/languages", async (req, res) => {

    const body = req.body;
    const lang = new languages(body);
  
    try {
      await lang.save();
      res.status(201).send({ lang });
    } catch (error) {
      res.status(500).send(error.message);
    }
  });



  router.put("/api/language/:id", async (req, res) => {
    try {
      const id = req.params.id;
      const body = req.body;
  
      await languages.findByIdAndUpdate(id, body);
      
      res.send("Updated Succesfully");

    } catch (error) {
      res.status(400).send("An Error Occurred");
    }
  });


  module.exports = router;
