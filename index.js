require('dotenv').config()
const express = require('express')
const mongoose = require("mongoose");
const swaggerUi = require('swagger-ui-express')
const swaggerDocument = require('./swagger-output.json');

// Routers
const taskRouter = require("./src/modules/task/task.routes");
const usuarioRouter = require("./src/modules/user/user.routes");
const timerRouter = require("./src/modules/timer/timer.routes"); 

// Secure setup
const { expressjwt: jwt } = require('express-jwt');
const jwksRsa = require('jwks-rsa');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express()
const port = process.env.PORT

// Enable CORS
app.use(cors());

// Enable the use of request body parsing middleware
app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.urlencoded({ extended: true })); // Para parsear application/x-www-form-urlencoded

mongoose.connect(
  process.env.DB_RECLAMO
);

app.get("/", async (request, response) => {
      return response.send("Beckend reclamos node js express");
});

// Routers
app.use(taskRouter);
app.use(usuarioRouter);
app.use(timerRouter);

app.all('*', (req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, X-UserId, X-Nonce' +
    ', X-Secret, X-Ts, X-Sig, X-Vendor-Sig, X-Vendor-Apikey, X-Vendor-Nonce, X-Vendor-Ts, X-ProfileId' +
    ', X-Authorization, Authorization, Token, Pragma, Cache-Control, Expires');
  res.header('Access-Control-Allow-Methods', 'HEAD,OPTIONS,GET,PUT,POST,DELETE');
  next();
});

app.get('/api/user', async (req, res) => {
  try {
    const users = await User.find(); // Suponiendo que usas Mongoose
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching users' }); // Respuesta en caso de error
  }
});

var options = {
  explorer: true
};

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument, options))

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

// require('dotenv').config();
// const express = require('express');
// const mongoose = require('mongoose');
// const swaggerUi = require('swagger-ui-express');
// const swaggerDocument = require('./swagger-output.json');
// const { expressjwt: jwt } = require('express-jwt');
// const jwksRsa = require('jwks-rsa');
// const cors = require('cors');
// const bodyParser = require('body-parser');

// // Routers
// const taskRouter = require('./src/modules/task/task.routes');
// const usuarioRouter = require('./src/modules/user/user.routes');
// const timerRouter = require('./src/modules/timer/timer.routes'); 

// const app = express();
// const port = process.env.PORT || 5000; // Default port if not set

// // Enable CORS
// app.use(cors());

// // Middleware for parsing request bodies
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));

// // Connect to MongoDB
// mongoose.connect(process.env.DB_RECLAMO, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// }).then(() => {
//   console.log("Connected to MongoDB");
// }).catch(err => {
//   console.error("MongoDB connection error:", err);
// });

// // Basic route
// app.get("/", (req, res) => {
//   return res.send("Backend reclamos Node.js Express");
// });

// // Use routers
// app.use('/api', taskRouter);
// app.use('/api', usuarioRouter);
// app.use('/api', timerRouter);

// // Swagger setup
// var options = {
//   explorer: true
// };
// app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument, options));

// // Start the server
// app.listen(port, () => {
//   console.log(`Server is running on port ${port}`);
// });
