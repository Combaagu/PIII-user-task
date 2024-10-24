const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// schema mongoose
const userSchema = new mongoose.Schema({
  firstname: String,
  lastname: String,
  email:String,
  domicilio: String,
  celular: String,
  documento: String,
  rol: String,
  area: String,
});

const userModel = mongoose.model("User", userSchema);

module.exports = userModel;
