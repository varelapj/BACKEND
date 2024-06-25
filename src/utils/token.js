
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

const generateToken = (id, Email) => {
  if (!id || !Email) {
    throw new Error("Falta el email o id");
  }
  return jwt.sign({ id, Email }, process.env.JWT_SECRET, { expiresIn: "21d" });
};

const verifyToken = (token) => {
  if (!token) {
    throw new Error("Sin token");
  }
  return jwt.verify(token, process.env.JWT_SECRET);
};

module.exports = { generateToken,verifyToken,};
