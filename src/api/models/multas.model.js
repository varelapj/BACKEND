
const mongoose = require("mongoose");

const MultasSchema = mongoose.Schema;


const SchemaMultas = new MultasSchema(
  {
    Fecha: {type: Date,  immutable: true},
    Calle: {type: String,  immutable: true},
    Tipo: {
      type: String,
      enum: ["Aparcamiento", "Velocidad", "Otro"],
      default: "Otro",
      required: false,
      immutable: true
    },
    Importe:{type: Number,  immutable: true},
    Pagada: {
        type: String,
        enum: ["Si", "No"],
        required: false,
      },

    Coches: [{ type: mongoose.Schema.Types.ObjectId, ref: "Coches" }],
    Conductores: [{ type: mongoose.Schema.Types.ObjectId, ref: "Conductores" }],
  },
 
  {
    timestamps: true,
  }
);


const Multas = mongoose.model("Multas", SchemaMultas);

module.exports = Multas;

