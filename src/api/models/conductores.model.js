
const mongoose = require("mongoose");
 
const ConductoresSchema = mongoose.Schema;

const bcrypt = require("bcrypt");
const validator = require("validator"); 

const SchemaConductores = new ConductoresSchema( 
  {
    Nombre: {type: String, unique:true, trim: true,},
    Genero: { type: String,
      enum: ["Hombre", "Mujer", "Otro"],
      default: "Otro",
    },
    Imagen: { type: String, required: false },
    Nacimiento: {type: Date},
    Localidad: {type: String},
    Rol: {type: String, 
      enum: ["Admin", "User"],
      default: "User",
    },
    Email: {
      type: String,

      trim: true, 
      unique: true,
      validate: [validator.isEmail, "Email no válido"],
    },
    Contrasena: {type: String,

      trim: true,
      validate: [validator.isStrongPassword,"Contraseña no válida. Debe incluir Mínimo 8 Caracteres, Mínimo 1 Mayuscula, Mínimo 1 Minúscula, Mínimo 1 Número, Mínimo 1 Caracter Especial."], // { minCaracteres: 8, minMayusculas: 1, minMinuscula: 1, minNumeros: 1, minCaracteresEspeciales: 1, returnScore: false, pointsPerUnique: 1, pointsPerRepeat: 0.5, pointsForContainingLower: 10, pointsForContainingUpper: 10, pointsForContainingNumber: 10, pointsForContainingSymbol: 10 }
    },
    Codigo: {
      type: Number,
      required: true,
    },
        Check: {
      type: Boolean,
      default: false,
    },
    
    Conductores: [{ type: mongoose.Schema.Types.ObjectId, ref: "Conductores" }],
    Coches: [{ type: mongoose.Schema.Types.ObjectId, ref: "Coches" }],
    Multas: [{ type: mongoose.Schema.Types.ObjectId, ref: "Multas" }],
  },
 
  {
    timestamps: true,
  }
);


SchemaConductores.pre("save", async function (next) {
  try {
    this.Contrasena = await bcrypt.hash(this.Contrasena, 10);
    next();
  } catch (error) {
    next("Error encriptando la contraseña", error);
  }
});

const Conductores = mongoose.model("Conductores", SchemaConductores);

module.exports = Conductores;
