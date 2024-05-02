const express = require("express");
const task = require("../models/ChangeLogModel");
const router = express.Router();

router.get("/api/tasks/all", async (req, res) => {
  try {
    let tasks = await task.find().sort({ timestamp: 1 }); // Sorting by timestamp in ascending order
    
    if (process.env.NODE_ENV === "production") {
      tasks = tasks.filter(task => task.checked === true);
    }
    
    res.json(tasks);
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
});

router.post("/api/tasks", async (req, res) => {
  const body = req.body;

  const Task = new task(body);

  try {
    await Task.save();
    res.status(201).send({ Task });
  } catch (error) {
    res.status(500).send(error.message);
  }
});



router.put("/api/task/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const body = req.body;

    await task.findByIdAndUpdate(id, body);

    res.send("Updated Succesfully");
  } catch (error) {
    res.status(400).send("An Error Occurred");
  }
});




router.delete("/api/task/:id", async (req, res) => {
  try {
    const id = req.params.id;
    await task.findByIdAndDelete(id);
    res.send("Deleted Successfully");
  } catch (error) {
    res.status(400).send("An Error Occurred");
  }
});

module.exports = router;
