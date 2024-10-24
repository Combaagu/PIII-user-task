const express = require("express");
const taskService = require("./task.service");
const mongoose = require('mongoose');


const router = express.Router();

// GET /api/task
// metodo query
router.get("/api/task", async (req, res) => {
  // #swagger.tags = ['Task']
  try {
    // params = req.query;
    const params = JSON.parse(req.headers['params'])    
    
    const page = parseInt(params.page, 10) || 0;
    const perPage = parseInt(params.perPage, 10) || 10;
    const filter = params.filter || {};
    const sort = params.sort || {};

    const paginated = await taskService.paginated({ page, perPage, filter, sort });
    return res.status(200).send(paginated);

  } catch (error) {
    console.log(error);
    return res.status(500).send(error);
  }
});

// GET /api/task/:id
router.get("/api/task/:id", async (req, res) => {
  // #swagger.tags = ['Task']
  const taskId = req.params.id;

  try {

    if (!mongoose.Types.ObjectId.isValid(taskId)) {
      return res.status(400).send({ error: "ID de la tarea no valida" });
    }

    const task = await taskService.findOneById(taskId);

    if (!task) {
      return res.status(400).send({ error: "Tarea no encontrada" })
    }

    return res.status(200).send(task);

  } catch (error) {
    console.log(error);
    return res.status(500).send(error);
  }
});

// POST /api/task
router.post("/api/task", async (req, res) => {
  // #swagger.tags = ['Task']
  try {
    const { name, description, resume, user } = req.body;

    const newTask = {
      name,
      description,
      resume,
      user
    };
    console.log(newTask);

    const task = await taskService.save(newTask);

    if(!task){
      return res.status(400).send({error: "Campos incompletos"})
    }
    
    return res.status(201).send(task);

  } catch (error) {
    console.log(error);
    return res.status(500).send(error);
  }
});

// PUT /api/task/:id
// metodo params
router.put("/api/task/:id", async (req, res) => {
  // #swagger.tags = ['Task']
  try {
    const taskId = req.params.id;
    // const updatedTask = req.body;

    const { name, description, resume, user } = req.body;

    const updatedTask = {
      name,
      description,
      resume,
      user
    };

    if (!mongoose.Types.ObjectId.isValid(taskId)) {
      return res.status(400).send({ error: "ID de la tarea no valida" });
    }

    const task = await taskService.update(taskId, updatedTask);

    if (!task) {
      return res.status(400).send({ error: "Tarea no encontrada" })
    }

    return res.status(200).send(task);

  } catch (error) {
    console.log(error);
    return res.status(500).send(error);

  }
});

// DELETE /api/task/:id
router.delete("/api/task/:id", async (req, res) => {
  // #swagger.tags = ['Task']
  try {
    const taskId = req.params.id;

    // Verificar si el ID es válido
    if (!mongoose.Types.ObjectId.isValid(taskId)) {
      return res.status(400).send({ error: "ID de la tarea no valida" });
    }

    const task = await taskService.remove(taskId);

    if (!task) {
      return res.status(400).send({ error: "Tarea no encontrada" })
    }
    return res.status(200).send("Tarea eliminada correctamente.");

  } catch (error) {
    console.log(error);
    return res.status(500).send(error);
  }
});

module.exports = router;
