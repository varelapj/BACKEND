const { isAuth, isAuthAdmin } = require("../../middleware/auth.middleware");
const { upload } = require("../../middleware/files.middleware");
const { RegistroConCodigo, RegistroRedirect, sendCode, resendCode, checkConductores, login, autoLogin,
toggleCochesConductores,
toggleMultasConductores,
toggleConductoresConductores,
sendPassword, forgotPassword, changePassword} = require("../controllers/conductores.controller");

const ConductoresRouter = require("express").Router();
 
 

//ConductoresRouter.post("/registro", upload.single("Imagen"), RegistroConCodigo);

ConductoresRouter.post("/registroredirect-conductores", upload.single("Imagen"), RegistroRedirect); 
ConductoresRouter.post("/registro-conductores/envioemail/:id", sendCode);
ConductoresRouter.post("/reenviocodigo-conductores", resendCode);
ConductoresRouter.post("/check-conductores", checkConductores);
ConductoresRouter.post("/login-conductores", login);
ConductoresRouter.post("/autoLogin-conductores", autoLogin);
ConductoresRouter.patch("/toggle-conductores-conductores/:id", [isAuth], toggleConductoresConductores);
ConductoresRouter.patch("/toggle-coches-conductores/:id", [isAuth], toggleCochesConductores);
ConductoresRouter.patch("/toggle-multas-conductores/:id", [isAuthAdmin], toggleMultasConductores);
ConductoresRouter.patch("/envio-contrasena-conductores/:id", sendPassword);
ConductoresRouter.patch("/olvido-contrasena-conductores", forgotPassword);
ConductoresRouter.patch("/cambio-contrasena-conductores", [isAuth], changePassword);




 


























//ConductoresRouter.patch("/forgot/sendPassword/:id", sendPassword);
/*
UserRoutes.post("/resend", resendCode);
UserRoutes.post("/check", checkNewUser);

UserRoutes.post("/login", login);
UserRoutes.post("/autoLogin", autoLogin);

UserRoutes.patch("/forgotPassword", forgotPassword); // redirect sendPassword

//! ------ RUTAS AUTENTICADAS ------
// middleware isAuth --> verifica que tenemos token 
// isAuthAdmin --> verifica que tenemos token y somos rol = Admin 
UserRoutes.get("/pruebas", [isAuthAdmin], exampleAuth);

UserRoutes.patch("/changePassword", [isAuth], changePassword);
UserRoutes.patch("/update", [isAuth], upload.single("image"), updateUser);
UserRoutes.delete("/delete", [isAuth], deleteUser);
UserRoutes.patch("/addLikeMovie/:idMovie", [isAuth], addFavMovie);

// ----------------- Controladores usados por redirect
*/

module.exports = ConductoresRouter;
