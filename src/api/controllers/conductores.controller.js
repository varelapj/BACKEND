
const bcrypt = require("bcrypt");
const dotenv = require("dotenv");
dotenv.config();
const nodemailer = require("nodemailer");
const validator = require("validator"); 
const { deleteImgCloudinary } = require("../../middleware/files.middleware");
const { generateToken } = require("../../utils/token");
const randomPassword = require("../../utils/randomPAssword");
const randomCode = require("../../utils/randomCode");
const enumGenero = require("../../utils/enumOk");
const Coches = require("../models/coches.model");
const Multas = require("../models/multas.model");
const Conductores = require("../models/conductores.model");
/*
//! REGISTRO CON CODIGO
const RegistroConCodigo = async (req, res, next) => {
  const catchImg = req.file?.path;
  try {
    await Conductores.syncIndexes();
    let Codigo = randomCode();
    const { Email, Nombre } = req.body;

    const ConductoresExist = await Conductores.findOne(
      {
        Email: req.body.Email,
      },
      {
        Nombre: req.body.Nombre,
      }
    );

    if (!ConductoresExist) {
      const newConductores = new Conductores({...req.body, Codigo});
      if (req.file) {
        newConductores.Imagen = req.file.path;
      } else {
        newConductores.Imagen =
          "https://res.cloudinary.com/dhkbe6djz/image/upload/v1689099748/UserFTProyect/tntqqfidpsmcmqdhuevb.png";
      }
      try {
        const ConductoresSave = await newConductores.save();
        if (ConductoresSave) {
          const emailENV = process.env.EMAIL;
          const passwordENV = process.env.PASSWORD;
          const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
              user: emailENV,
              pass: passwordENV,
            },
          });
          const mailOptions = {
            from: emailENV,
            to: Email, 
            subject: "Código de Confirmación",
            text: `Su código de confirmación es ${Codigo}`,
          };
          transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
              return res
                .status(409)
                .json({ error: "correo no enviado", message: error });
            } else {
              return res.status(200).json({ Conductores: ConductoresSave, Codigo });
            }
          });
        } else {
          req.file && deleteImgCloudinary(catchImg);
          return res.status(409).json("Error al guardar el conductor");
        }
      } catch (error) {
        req.file && deleteImgCloudinary(catchImg);
        return res.status(409).json({
          error: "Problema al guardar el conductor",
          message: error.message,
        });
      }
    } else {
      req.file && deleteImgCloudinary(catchImg);
      return res.status(409).json("El conductor ya existe");
    }
  } catch (error) {
    req.file && deleteImgCloudinary(catchImg);
    return res
      .status(409)
      .json({ error: "Error en el registro del conductor", message: error.message });
  }
};^*/
//! REDIRECT

const RegistroRedirect = async (req, res, next) => {
  let catchImg = req.file?.path;
  try {
    await Conductores.syncIndexes();
    let Codigo = randomCode();
    const ConductoresExist = await Conductores.findOne(
      { Email: req.body.Email },
      { Nombre: req.body.Nombre }
    );
    
    if (!ConductoresExist) {
      const newConductores = new Conductores({ ...req.body, Codigo });
      if (req.file) {
        newConductores.Imagen = req.file.path;
      } else {
        newConductores.Imagen =
        "https://res.cloudinary.com/dhkbe6djz/image/upload/v1689099748/UserFTProyect/tntqqfidpsmcmqdhuevb.png";
      }
      try {
        const ConductoresSave = await newConductores.save();

        if (ConductoresSave) {
          return res.redirect(
            307,
            `http://localhost:8081/api/v1/conductores/registro-conductores/envioemail/${ConductoresSave._id}`
          );
        } else {
          req.file && deleteImgCloudinary(catchImg);
          return res.status(404).json({
            error: "El conductor no se ha guardado",
            message: "El conductor no se ha guardado",
          });
        }
      } catch (error) {
        req.file && deleteImgCloudinary(catchImg);
        return res
          .status(409)
          .json({ error: "El conductor no se ha guardado", message: error.message });
      }
    } else {
      req.file && deleteImgCloudinary(catchImg);
      return res.status(409).json({
        error: "El conductor ya existe",
        message: "El conductor ya existe",
      });
    }
  } catch (error) {
    req.file && deleteImgCloudinary(catchImg);
    return res
      .status(409)
      .json({ error: "Error en el registro del conductor", message: error.message });
  }
};

//! ENVÍO CÓDIGO

const sendCode = async (req, res, next) => {
  try {
    const { id } = req.params;

    const ConductoresDB = await Conductores.findById(id);

    const emailENV = process.env.EMAIL;
    const passwordENV = process.env.PASSWORD;

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: emailENV,
        pass: passwordENV,
      },
    });

    const mailOptions = {
      from: emailENV,
      to: ConductoresDB.Email,
      subject: "Código de Confirmación",
      text: `Su código de confirmación es ${ConductoresDB.Codigo}, gracias por confiar en nosotros`,
    };
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return res
          .status(409)
          .json({ error: "correo no enviado", message: error });
      } else {
        return res
          .status(200)
          .json({ user: ConductoresDB, Codigo: ConductoresDB.Codigo });
      }
    });
  } catch (error) {
    return res
      .status(409)
      .json({ error: "Error al enviar el email", message: error.message });
  }
};


//! RE-ENVÍO CÓDIGO

const resendCode = async (req, res, next) => {
  try {
    const emailENV = process.env.EMAIL;
    const passwordENV = process.env.PASSWORD;
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: emailENV,
        pass: passwordENV,
      },
    });

    const ConductoresSave = await Conductores.findOne({ Email: req.body.Email });

    if (ConductoresSave) {
      const mailOptions = {
        from: emailENV,
        to: req.body.Email, 
        subject: "Código de Confirmación",
        text: `Su código de confirmación es ${ConductoresSave.Codigo}`,
      };
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          return res
            .status(409)
            .json({ error: "Correo no enviado", message: error });
        } else {
          return res.status(200).json({ Conductor: ConductoresSave, resend: true });
        }
      });
    } else {
      return res
        .status(404)
        .json({ error: "Email no encontrado", message: "Introduzca un email válido." });
    }
  } catch (error) {
    return res
      .status(409)
      .json({ error: "Error al enviar el código", message: error.message });
  }
};


//! CHECK

const checkConductores = async (req, res, next) => {
  try {
    const { Email, Codigo } = req.body;

    // Buscamos al usuario
    const ConductoresExist = await Conductores.findOne({ Email });
    if (!ConductoresExist) {
      return res
        .status(404)
        .json({ error: "Conductor no encontrado", message: "Comprueba el campo: Email" });
    } else {
      if (ConductoresExist.Codigo === Codigo) {
        try {
          await Conductores.updateOne({ Check: true });
          const ConductoresActualizado = await Conductores.findOne({ Email });
          return res.status(200).json({
            Conductores: ConductoresActualizado,
            TestCheckConductores: ConductoresActualizado.Check == true ? true : false,
          });
        } catch (error) {
          return res
            .status(409)
            .json({ error: "Error al actualizar el conductor", message: error.message });
        }
      } else {
        // Si los códigos no coinciden borramos a este user

        await Conductores.findByIdAndDelete(ConductoresExist._id);
        if (
          ConductoresExist.Imagen !==
          "https://res.cloudinary.com/dhkbe6djz/image/upload/v1689099748/UserFTProyect/tntqqfidpsmcmqdhuevb.png"
        ) {
          deleteImgCloudinary(ConductoresExist.Imagen);
        }

        // Lanzamos la respuesta avisando del borrado del user
        return res.status(409).json({
          Conductores: ConductoresExist,
          Check: false,
          Borrado: (await Conductores.findById(ConductoresExist._id))
            ? "Conductor no borrado"
            : "Conductor borrado",
        });
      }
    }
  } catch (error) {
    return res
      .status(409)
      .json({ error: "Error al comprobar el conductor", message: error.message });
  }
};


//! LOGIN
//^ CONTRASEÑA SIN ENCRIPTAR
const login = async (req, res, next) => {
  try {
    const { Email, Contrasena } = req.body;

    const ConductoresDB = await Conductores.findOne({ Email });
    if (ConductoresDB) {
      if (bcrypt.compareSync(Contrasena, ConductoresDB.Contrasena)) {
        const token = generateToken(ConductoresDB._id, Email);
        return res.status(200).json({
          Conductores: ConductoresDB,
          token,
        });
      } else {
        return res.status(409).json({
          error: "Contraseña incorrecta",
          message: "Inténtelo de nuevo",
        });
      }
    } else {
      return res
        .status(404)
        .json({ error: "Condcutor no encontrado", message: "Conductor no registrado" });
    }
  } catch (error) {
    return res
      .status(409)
      .json({ error: "Error en el login", message: error.message });
  }
};
//! AUTOLOGIN
//^ CONTRASEÑA ENCRIPTADA
const autoLogin = async (req, res, next) => {
  try {
    const { Email, Contrasena } = req.body;
    const ConductoresDB = await Conductores.findOne({ Email });
    if (ConductoresDB) {
      if (Contrasena === ConductoresDB.Contrasena) {
        const token = generateToken(ConductoresDB._id, Email);
        return res.status(200).json({
          Conductores: ConductoresDB,
          token, 
        });
      } else {
        return res.status(409).json({
          error: "Contraseña incorrecta",
          message: "Intentalo otra vez",
        });
      }
    } else {
      return res
        .status(404)
        .json({ error: "Conductor no encontrado", message: "Conductor no registrado" });
    }
  } catch (error) {
    return res
      .status(409)
      .json({ error: "Error en el login", message: error.message });
  }
};



//! TOGGLE COCHES
//! Le pasamos el ID de conductor por el params y el ID de coches por el body 
const toggleCochesConductores = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { coches } = req.body; 


    const conductoresById = await Conductores.findById(id);
    if (conductoresById) {
      const arrayCoches = coches.split(",");

      Promise.all(
        arrayCoches.map(async (coche) => {
          if (conductoresById.Coches.includes(coche)) {

            try {
              await Conductores.findByIdAndUpdate(id, {
                $pull: { Coches: coche },
              });

              try {
                await Coches.findByIdAndUpdate(coche, {
                  $pull: { Condcutores: id },
                });
              } 
              
              
              catch (error) {
                return res.status(409).json({
                  error: "Error al desenlazar el coche del conductor",
                  message: error.message,
                });
              }
            } catch (error) {
              return res.status(409).json({
                error: "Error al desenlazar el conductor del coche",
                message: error.message,
              });
            }
          } else {



            try {

              await Conductores.findByIdAndUpdate(id, {
                $push: { Coches: coche },
              });

              try {


                await Coches.findByIdAndUpdate(coche, {
                  $push: { Conductores: id },
                });
              } catch (error) {
                return res.status(409).json({
                  error: "Error al enlazar el coche al conductor",
                  message: error.message,
                });
              }
            } catch (error) {
              return res.status(409).json({
                error: "Error al enlazar el conductor al coche",
                message: error.message,
              });
            }
          }
        })
      ).then(async () => {
        return res
          .status(200)
          .json(await Conductores.findById(id).populate("Coches"));
      });
    } else {

      return res.status(404).json("Conductor no encontrado, prueba con otro id");
    }
  } catch (error) {
    return res
      .status(409)
      .json({ error: 'Error al actualizar el conductor. Recuerde introducir los coches y los códigos entre doble comilla con el siguiente formato "coches": "codigodecoche1,codigodecoche2"', message: error.message });
  }
};


//! TOGGLE MULTAS
//! Le pasamos el ID de conductor por el params y el ID de multas por el body 
const toggleMultasConductores = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { multas } = req.body; 


    const conductoresById = await Conductores.findById(id);
    if (conductoresById) {
      const arrayMultas = multas.split(",");

      Promise.all(
        arrayMultas.map(async (multa) => {
          if (conductoresById.Multas.includes(multa)) {

            try {
              await Conductores.findByIdAndUpdate(id, {
                $pull: { Multas: multa },
              });

              try {
                await Multas.findByIdAndUpdate(multa, {
                  $pull: { Conductores: id },
                });
              } 
              
              
              catch (error) {
                return res.status(409).json({
                  error: "Error al desenlazar la multa del conductor",
                  message: error.message,
                });
              }
            } catch (error) {
              return res.status(409).json({
                error: "Error al desenlazar el conductor de la multa",
                message: error.message,
              });
            }
          } else {



            try {

              await Conductores.findByIdAndUpdate(id, {
                $push: { Multas: multa },
              });

              try {


                await Multas.findByIdAndUpdate(multa, {
                  $push: { Conductores: id },
                });
              } catch (error) {
                return res.status(409).json({
                  error: "Error al enlazar la multa al conductor",
                  message: error.message,
                });
              }
            } catch (error) {
              return res.status(409).json({
                error: "Error al enlazar el conductor a la multa",
                message: error.message,
              });
            }
          }
        })
      ).then(async () => {
        return res
          .status(200)
          .json(await Conductores.findById(id).populate("Multas"));
      });
    } else {

      return res.status(404).json("Conductor no encontrado, prueba con otro id");
    }
  } catch (error) {
    return res
      .status(409)
      .json({ error: 'Error al actualizar el conductor. Recuerde introducir las multas y los códigos entre doble comilla con el siguiente formato"multas": "codigodemulta1,codigodemulta2"', message: error.message });
  }
};




//! TOGGLE CONDUCTORES
//! Le pasamos el ID de CONDUCTOR 1 por el params y el ID de CONDUCTOR 2 por el body 
const toggleConductoresConductores = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { conductores } = req.body; 


    const conductoresById = await Conductores.findById(id);
    if (conductoresById) {
      const arrayConductores = conductores.split(",");

      Promise.all(
        arrayConductores.map(async (conductor) => {
          if (conductoresById.Conductores.includes(conductor)) {

            try {
              await Conductores.findByIdAndUpdate(id, {
                $pull: { Conductores: conductor },
              });

              try {
                await Conductores.findByIdAndUpdate(conductor, {
                  $pull: { Conductores: id },
                });
              } 
              
              
              catch (error) {
                return res.status(409).json({
                  error: "Error al desenlazar los conductores",
                  message: error.message,
                });
              }
            } catch (error) {
              return res.status(409).json({
                error: "Error al desenlazar los conductores",
                message: error.message,
              });
            }
          } else {



            try {

              await Conductores.findByIdAndUpdate(id, {
                $push: { Conductores: conductor },
              });

              try {


                await Conductores.findByIdAndUpdate(conductor, {
                  $push: { Conductores: id },
                });
              } catch (error) {
                return res.status(409).json({
                  error: "Error al enlazar los conductores",
                  message: error.message,
                });
              }
            } catch (error) {
              return res.status(409).json({
                error: "Error al enlazar los conductores",
                message: error.message,
              });
            }
          }
        })
      ).then(async () => {
        return res
          .status(200)
          .json(await Conductores.findById(id).populate("Conductores"));
      });
    } else {

      return res.status(404).json("Conductor no encontrado, prueba con otro id");
    }
  } catch (error) {
    return res
      .status(409)
      .json({ error: 'Error al actualizar el conductor. Recuerde introducir los conductores y los códigos entre doble comilla con el siguiente formato"conductores": "codigodeconductor1,codigodeconductor2"', message: error.message });
  }
};


//! ENVÍO CONTRASEÑA
//^ PASAMOS EL ID DE CONDUCTOR POR EL ID QUE COGEMOS DEL FORGOT PASSWORD

const sendPassword = async (req, res, next) => {
  try {
    const { id } = req.params;
    const   ConductoresDB = await  Conductores.findById(id);
    if (ConductoresDB) {

      const passwordSecure = randomPassword();

      const emailENV = process.env.EMAIL;
      const passwordENV = process.env.PASSWORD;

      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: emailENV,
          pass: passwordENV,
        },
      });

      const mailOptions = {
        from: emailENV,
        to:  ConductoresDB.Email, 
        subject: "Cambio de Contraseña",
        text: `Conductor: ${ConductoresDB.Nombre}, su nueva contraseña es: ${passwordSecure}.`,
      };
      transporter.sendMail(mailOptions, async (error, info) => {
        if (error) {
          return res
            .status(409)
            .json({ error: "correo no enviado", message: error });
        } else {
    
          const newPasswordEncript = bcrypt.hashSync(passwordSecure, 10);

          try {

            await  Conductores.findByIdAndUpdate(id, { Contrasena: newPasswordEncript });

            const  ConductoresUpdate = await  Conductores.findById(id);

        
            if (bcrypt.compareSync(passwordSecure,  ConductoresUpdate.Contrasena)) {
              return res.status(200).json({
                updateUser: true,
                sendPassword: true,
              });
            } else {
 
              return res.status(409).json({
                error: "Conductor no actualizado",
                message: "Se envio la nueva contraseña",
              });
            }
          } catch (error) {
            return res.status(409).json({
              error: "Error al actualizar el conductor",
              message: error.message,
            });
          }
        }
      });
    } else {
      return res
        .status(404)
        .json({ error: "Conductor no encontrado.", message: "Email erróneo." });
    }
  } catch (error) {
    return res.status(409).json({
      error: "Error durante el envio del correo",
      message: error.message,
    });
  }
};


//! FORGOT PASSWORD
//^ INTRODUCIENDO EL EMAIL POR EL BODY
const forgotPassword = async (req, res, next) => {
  try {
    const { Email } = req.body;

    const ConductoresDB = await Conductores.findOne({ Email });

    if (ConductoresDB) {
      return res.redirect(
        307,
        `http://localhost:${process.env.PORT}/api/v1/conductores/envio-contrasena-conductores/${ConductoresDB._id}`
      );
    } else {

      return res
        .status(404)
        .json({ error: "Conductor no encontrado", message: "Revise el email" });
    }
  } catch (error) {
    return res
      .status(409)
      .json({ error: "Error en el cambio de contraseña", message: error.message });
  }
};



//! CHANGE PASSWORD
//^ INTRODUCIENDO LA CONTRASEÑA ACTUAL Y LA NUEVA CONTRASEÑA POR EL BODY
//^ Y EL TOKEN , PORQUE ES AUTENTICADA
const changePassword = async (req, res, next) => {
  try {

    const { Contrasena, Nueva_Contrasena } = req.body;



    const validate = validator.isStrongPassword(Nueva_Contrasena);

    if (validate) {

      const { _id } = req.Conductores;

      if (bcrypt.compareSync(Contrasena, req.Conductores.Contrasena)) {

        const newPasswordHashed = bcrypt.hashSync(Nueva_Contrasena, 10);

        try {

          await Conductores.findByIdAndUpdate(_id, { Contrasena: newPasswordHashed });

          const ConductoresSave = await Conductores.findById(_id);

          if (bcrypt.compareSync(Nueva_Contrasena, ConductoresSave.Contrasena)) {
            return res.status(200).json({ Conductores: ConductoresSave, testUpdate: true });
          } else {
  
            return res.status(409).json({ testUpdate: false });
          }
        } catch (error) {
          return res.status(409).json({
            error: "Error al actualizar al conductor",
            message: error.message,
          });
        }
      } else {
        return res.status(409).json({
          error: "Contraseña antigua incorrecta",
          message: "Pruebe otra contraseña",
        });
      }
    } else {
      return res.status(409).json({
        error: "La contraseña nueva no es segura",
        message:
          "Minimo 8 caracteres, 1 simbolo, 1 mayuscula, 1 minuscula y un numero",
      });
    }
  } catch (error) {
    return res.status(409).json({
      error: "Error al cambiar la contraseña",
      message: error.message,
    });
  }
};


module.exports = { RegistroRedirect, sendCode, resendCode, checkConductores, login,
  autoLogin, toggleCochesConductores,toggleMultasConductores,
  toggleConductoresConductores, sendPassword, forgotPassword, changePassword};