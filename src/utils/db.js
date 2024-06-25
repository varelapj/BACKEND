

const dotenv = require("dotenv");
dotenv.config();

const mongoose = require("mongoose");

const MONGO_URI = process.env.MONGO_URI;

const connect = async () => {
  try {
    const db = await mongoose.connect(MONGO_URI);
    const { name, host } = db.connection;
    console.log(
      `Conexión realizada correctamente a '${name}' en el host '${host}'. `
    );

  } catch (error) {
    console.log("No fue posible realizar la conexión - ", error);
  }
};

module.exports = { connect };
