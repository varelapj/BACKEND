const {
createMultas,
getAllMultas,
getByIdMultas,
getByPagadaMultas,
getByTipoMultas,
updateMultas,
toggleCoches,
toggleConductores} = require("../controllers/multas.controller");

const { isAuth, isAuthAdmin } = require("../../middleware/auth.middleware");
const express = require("express");


const MultasRouter = express.Router();


MultasRouter.post("/crear-multas", createMultas);
MultasRouter.get("/todas-multas", getAllMultas);
MultasRouter.get("/id-multas/:id", getByIdMultas);
MultasRouter.get("/pagada-multas/:Pagada", getByPagadaMultas);
MultasRouter.get("/tipo-multas/:Tipo", getByTipoMultas);
MultasRouter.patch("/actualizar-multas/:id", updateMultas);
MultasRouter.patch("/toggle-coches-multas/:id", [isAuthAdmin], toggleCoches);
MultasRouter.patch("/toggle-conductores-multas/:id",[isAuthAdmin], toggleConductores);

module.exports = MultasRouter;







