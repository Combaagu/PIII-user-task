const express = require("express");
const userService = require("./user.service");
const mongoose = require('mongoose');

const router = express.Router();

// GET /api/user
router.get("/api/user", async (req, res) => {
  // #swagger.tags = ['Usuario']
  try {
    // // const params = req.query;
    const params = JSON.parse(req.headers['params'])    
    
    const page = parseInt(params.page, 10) || 0;
    const perPage = parseInt(params.perPage, 10) || 10;
    const filter = params.filter || {};
    const sort = params.sort || {};

    const paginated = await userService.paginated({ page, perPage, filter, sort });
    return res.status(200).send(paginated);

  } catch (error) {
    console.log(error);
    return res.status(500).send(error);
  }
});

// GET /api/user/:id
router.get("/api/user/:id", async (req, res) => {
  // #swagger.tags = ['Usuario']
  const userId = req.params.id;

  try {

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).send({ error: "ID de usuario inválido" });
    }
    const user = await userService.findOneById(userId);
    if (!user) {
      return res.status(404).send({ error: "Usuario no encontrado" });
    }
    return res.status(200).send(user);
  } catch (error) {
    console.error(error);
    return res.status(500).send({ error: "Error interno del servidor" });
  }
});

// POST /api/user
router.post("/api/user", async (req, res) => {
  // #swagger.tags = ['Usuario']
  const { firstname, lastname, email, domicilio, celular, documento, rol, area } = req.body;
  // const newUser = req.body;

  try {

    const existingUser = await userService.findOne({ email:email });
    if (existingUser) {
      return res.status(400).send({ error: 'El email ya está registrado.' });
    }


    const newUser = {
      firstname: firstname,
      lastname: lastname,
      email: email,
      domicilio: domicilio,
      celular: celular,
      documento: documento,
      rol: rol,
      area: area,
    }

    // Guardar el nuevo usuario
    const user = await userService.save(newUser);

    console.log(user)
    if(!user){
      return res.status(400).send({error: "Campos incompletos"})
    }

    return res.status(201).send(user);


  } catch (error) {
    console.error(error);
    if (error.code === 11000) {
      res.status(400).send({ error: 'El email ya está registrado.' });
    } else {
      res.status(500).send({ error: 'Error interno del servidor' });
    }
  }
});

// PUT /api/user/:id
router.put("/api/user/:id", async (req, res) => {
  // #swagger.tags = ['Usuario']
  try {
    const userId = req.params.id;
    // const updatedUser = req.body;
    const { firstname, lastname, email, domicilio, celular, documento, rol, area } = req.body

    const updatedUser = {
      firstname,
      lastname,
      email,
      domicilio,
      celular,
      documento,
      rol,
      area,
    }

    
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).send({ error: "ID de usuario inválido" });
    }
    // Actualizar usuario por ID
    const user = await userService.update(userId, updatedUser);

    if (!user) {
      return res.status(404).send({ error: "Usuario no encontrado" });
    }

    return res.status(200).send(user);
  } catch (error) {
    console.error("Error al actualizar usuario:", error);
    return res.status(500).send({ error: "Error interno del servidor" });
  }
});

// DELETE /api/user/:id
router.delete("/api/user/:id", async (req, res) => {
  // #swagger.tags = ['Usuario']
  try {
    const userId = req.params.id;

    // Verificar si el ID es válido
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).send({ error: "ID de usuario inválido" });
    }

    // Eliminar usuario por ID
    const user = await userService.remove(userId);

    if (!user) {
      return res.status(404).send({ error: "Usuario no encontrado" });
    }
    
    return res.status(200).send("Usuario eliminado correctamente.");
  } catch (error) {
    console.error("Error al eliminar usuario:", error);
    return res.status(500).send({ error: "Error interno del servidor" });
  }
});

module.exports = router;