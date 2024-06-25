

const express = require("express");
const dotenv = require("dotenv");
dotenv.config();

const { connect } = require("./src/utils/db");
connect();

const { configCloudinary } = require("./src/middleware/files.middleware");
configCloudinary();

const app = express();

const cors = require("cors");
app.use(cors());

app.use(express.json({ limit: "5mb" }));
app.use(express.urlencoded({ limit: "5mb", extended: false }));

const ConductoresRouter = require("./src/api/routes/conductores.routes");
app.use("/api/v1/conductores", ConductoresRouter);

const CochesRouter = require("./src/api/routes/coches.routes");
app.use("/api/v1/coches", CochesRouter);

const MultasRouter = require("./src/api/routes/multas.routes");
app.use("/api/v1/multas", MultasRouter);


app.use("*", (req, res, next) => {
  const error = new Error("Ruta no encontrada");
  error.status = 404;
  return next(error);
});


app.use((error, req, res) => {
  return res
    .status(error.status || 500)
    .json(error.message || "Error inesperado");
});

app.disable("x-powered-by");


const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto 'http://localhost:${PORT}'.`);
});
