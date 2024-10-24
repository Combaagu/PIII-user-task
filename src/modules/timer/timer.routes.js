const express = require("express");
const timerService = require("./timer.service");
const mongoose = require('mongoose');


const router = express.Router();

// GET /api/timer
router.get("/api/timer", async (req, res) => {
  // #swagger.tags = ['Timer']
  try {
    // params = req.query;
    const params = JSON.parse(req.headers['params'])    
    
    const page = parseInt(params.page, 10) || 0;
    const perPage = parseInt(params.perPage, 10) || 10;
    const filter = params.filter || {};
    const sort = params.sort || {};

    const paginated = await timerService.paginated({ page, perPage, filter, sort });
    return res.status(200).send(paginated);

  } catch (error) {
    console.log(error);
    return res.status(500).send(error);
  }
});

// GET /api/timer/:id
router.get("/api/timer/:id", async (req, res) => {
  // #swagger.tags = ['Timer']
  const timerId = req.params.id;

  try {

    if (!mongoose.Types.ObjectId.isValid(timerId)) {
      return res.status(400).send({ error: "ID del temporizador no valido" });
    }

    const timer = await timerService.findOneById(timerId);

    
    if (!timer){
      return res.status(400).send ({error: "Timer no encontrado"})
    }

    return res.status(200).send(timer);

  } catch (error) {
    console.log(error);
    return res.status(500).send(error);
  }
});

// POST /api/timer
router.post("/api/timer", async (req, res) => {
  // #swagger.tags = ['Timer']
  try {
    const { startDate, endDate, startTime, endTime, task, user } = req.body;

    const newTimer = {
      startDate,
      endDate,
      startTime,
      endTime,
      task,
      user,
    };
    console.log(newTimer);

    const timer = await timerService.save(newTimer);

    if(!timer){
      return res.status(400).send({error: "Campos incompletos"})
    }

    return res.status(201).send(timer);

  } catch (error) {
    console.log(error);
    return res.status(500).send(error);
  }
});

// PUT /api/timer/:id
router.put("/api/timer/:id", async (req, res) => {
  // #swagger.tags = ['Timer']
  try {
    const timerId = req.params.id;
    // const updatedTimer = req.body;

    const { startDate, endDate, startTime, endTime, task } = req.body;

    const updatedTimer = {
      startDate,
      endDate,
      startTime,
      endTime,
      task
    };

    if (!mongoose.Types.ObjectId.isValid(timerId)) {
      return res.status(400).send({ error: "ID del temporizador no valido" });
    }
    const timer = await timerService.update(timerId, updatedTimer);

    
    if (!timer){
      return res.status(400).send ({error: "Timer no encontrado"})
    }

    return res.status(200).send(timer);

  } catch (error) {
    console.log(error);
    return res.status(500).send(error);
  }
});

// DELETE /api/timer/:id
router.delete("/api/timer/:id", async (req, res) => {
  // #swagger.tags = ['Timer']
  try {
    const timerId = req.params.id;

    // Verificar si el ID es válido
    if (!mongoose.Types.ObjectId.isValid(timerId)) {
      return res.status(400).send({ error: "ID del temporizador no valido" });
    }

    const timer = await timerService.remove(timerId);

    if (!timer){
      return res.status(400).send ({error: "Timer no encontrado"})
    }

    return res.status(200).send("Temporizador eliminado correctamente.");

  } catch (error) {
    console.log(error);
    return res.status(500).send(error);
  }
});

module.exports = router;
