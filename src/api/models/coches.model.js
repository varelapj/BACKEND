
const mongoose = require("mongoose");

const CochesSchema = mongoose.Schema;


const SchemaCoches = new CochesSchema(
  {
    Matricula: {type: String},
    Modelo: {type: String},
    Ano: {type: String},
    Permiso_Ambiental: {type: String},
    Color: {type: String},
    Imagen: { type: String, required: false },
    Multas: [{ type: mongoose.Schema.Types.ObjectId, ref: "Multas" }],
    Conductores: [{ type: mongoose.Schema.Types.ObjectId, ref: "Conductores" }],
  },
 
  {
    timestamps: true,
  }
);


const Coches = mongoose.model("Coches", SchemaCoches);

module.exports = Coches;
