const Coches = require("../models/coches.model");
const Multas = require("../models/multas.model");
const {enumMultaPagada }= require("../../utils/enumOk");
const Conductores = require("../models/conductores.model");

//! CREATE
const createMultas = async (req, res, next) => {
  try {
    await Multas.syncIndexes();
    const newMultas = new Multas(req.body);
    const saveMultas = await newMultas.save();
    if (saveMultas) {
      return res.status(200).json(saveMultas);
    } else {
      return res
        .status(404)
        .json("No se ha podido registrar la multa");
    }
  } catch (error) {
    return res.status(409).json("Error en el registro de la multa. Recuerde que los valores permitidos para el tipo de multa son 'Aparcamiento', 'Velocidad' y 'Otro'. El pago de la multa solo admite valores 'Si' y 'No'. Además, el formato de fecha debe ser AAAA-MM-DD");
  }
};


//! GET ALL

const getAllMultas = async (req, res, next) => {
  try {
    const allMultas = await Multas.find();
    if (allMultas.length > 0) {
      return res.status(200).json(allMultas);
    } else {
      return res.status(404).json("No se han encontrado multas");
    }
  } catch (error) {
    return res
      .status(409)
      .json({ error: "Error al buscar multas", message: error.message });
  }
};

//! GET BY ID
const getByIdMultas = async (req, res, next) => {
  try {
    const { id } = req.params;
    const MultasById = await Multas.findById(id).populate("Coches");;
    if (MultasById) {
      return res.status(200).json(MultasById);
    } else {
      return res.status(404).json("No se ha encontrado la multa");
    }
  } catch (error) {
    return res
      .status(409)
      .json({ error: "Error al buscar por Id", message: error.message });
  }
};


//! GET BY PAGADA
const getByPagadaMultas = async (req, res, next) => {
  try {
    const { Pagada } = req.params;
    const MultasByPagada = await Multas.find({ Pagada }).populate("Coches Conductores");
    if (MultasByPagada.length !== 0 ){
      return res.status(200).json(MultasByPagada);
    } else {
      return res.status(404).json("No se han encontrado las multas. Recuerde que el valor de 'Pagada' debe ser 'Si' o 'No' con la primera letra en mayúscula");
    }
  } catch (error) {
    return res
      .status(409)
      .json({ error: "Error al buscar por estado de la multa", message: error.message });
  }
};

//! GET BY TIPO
const getByTipoMultas = async (req, res, next) => {
  try {
    const { Tipo } = req.params;
    const MultasByTipo = await Multas.find({ Tipo }).populate("Coches");
    if (MultasByTipo.length !== 0 ){
      return res.status(200).json(MultasByTipo);
    } else {
      return res.status(404).json("No se han encontrado las multas. Recuerde que el valor de 'Tipo' debe ser 'Aparcamiento', 'Velocidad' u 'Otro' con la primera letra en mayúscula");
    }
  } catch (error) {
    return res
      .status(409)
      .json({ error: "Error al buscar por tipo de multa", message: error.message });
  }
};


//! UPDATE
const updateMultas = async (req, res, next) => {
  try {
 
    await Multas.syncIndexes();

    const { id } = req.params;

    // buscamos el character
    const multasById = await Multas.findById(id);

    if (multasById) {
      const bodyCustom = {
        _id: multasById._id,
        Fecha: req.body?.Fecha ? req.body?.Fecha : multasById.Fecha,
        Calle: req.body?.Calle ? req.body?.Calle : multasById.Calle,
        Tipo: req.body?.Tipo ? req.body?.Tipo : multasById.Tipo,
        Importe: req.body?.Importe ? req.body?.Importe : multasById.Importe,
      };
      if (req.body?.Pagada) {
        const resultEnumOk = enumMultaPagada(req.body?.Pagada);
        bodyCustom.Pagada = resultEnumOk.check
          ? req.body?.Pagada
          : multasById.Pagada;
      }
      try {

        await Multas.findByIdAndUpdate(id, bodyCustom);

        const multasByIdUpdate = await Multas.findById(id);
        const elementUpdate = Object.keys(req.body);
        let test = {};

        elementUpdate.forEach((item) => {

          if (req.body[item] == multasByIdUpdate[item]) {
            test[item] = true;
          } else {
            test[item] = false;
          }
        });
        let acc = 0;

        for (const key in test) {

          test[key] == false && acc++;
        }

        if (acc > 0) {
          return res.status(409).json({ error:"Multa no actualizada. Solo puede modificar el estado de 'Pagada'  a 'Si' o 'No', con la primera en mayúsucla. El resto de campos no pueden se modificados" });
        } else {
          return res
            .status(200)
            .json({ update: multasByIdUpdate });
        }
      } catch (error) {
        return res.status(409).json({
          error: "No se ha podidio actualizar",
          message: error.message,
        });
      }
    } else {
      return res.status(404).json("La multa no ha sido encontrado");
    }
  } catch (error) {
    return res
      .status(409)
      .json({ error: "No se ha podidio actualizar", message: error.message });
  }
};

  

//! TOGGLE COCHES
//! Le pasamos el ID de multa por el params y el ID de coches por el body 
const toggleCoches = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { coches } = req.body; 
console.log(coches);

    const multasById = await Multas.findById(id);
    if (multasById) {
      const arrayCoches = coches.split(",");

      Promise.all(
        arrayCoches.map(async (coche) => {
          if (multasById.Coches.includes(coche)) {

            try {
              await Multas.findByIdAndUpdate(id, {
                $pull: { Coches: coche },
              });

              try {
                await Coches.findByIdAndUpdate(coche, {
                  $pull: { Multas: id },
                });
              } 
              
              
              catch (error) {
                return res.status(409).json({
                  error: "Error al desenlazar el coche de la multa",
                  message: error.message,
                });
              }
            } catch (error) {
              return res.status(409).json({
                error: "Error al desenlazar la multa del coche",
                message: error.message,
              });
            }
          } else {



            try {

              await Multas.findByIdAndUpdate(id, {
                $push: { Coches: coche },
              });

              try {


                await Coches.findByIdAndUpdate(coche, {
                  $push: { Multas: id },
                });
              } catch (error) {
                return res.status(409).json({
                  error: "Error al enlazar el coche a la multa",
                  message: error.message,
                });
              }
            } catch (error) {
              return res.status(409).json({
                error: "Error al enlazar la multa al coche",
                message: error.message,
              });
            }
          }
        })
      ).then(async () => {
        return res
          .status(200)
          .json(await Multas.findById(id).populate("Coches"));
      });
    } else {

      return res.status(404).json("Multa no encontrada, prueba con otro id");
    }
  } catch (error) {
    return res
      .status(409)
      .json({ error: 'Error al actualizar la multa. Recuerde introducir los coches y los códigos entre doble comilla con el siguiente formato "coches": "codigodecoche1,codigodecoche2"', message: error.message });
  }
};


//! TOGGLE CONDUCTORES
//! Le pasamos el ID de multa por el params y el ID de conductores por el body 
const toggleConductores = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { conductores } = req.body; 


    const multasById = await Multas.findById(id);
    if (multasById) {
      const arrayConductores = conductores.split(",");

      Promise.all(
        arrayConductores.map(async (conductor) => {
          if (multasById.Conductores.includes(conductor)) {

            try {
              await Multas.findByIdAndUpdate(id, {
                $pull: { Conductores: conductor },
              });

              try {
                await Conductores.findByIdAndUpdate(conductor, {
                  $pull: { Multas: id },
                });
              } 
              
              
              catch (error) {
                return res.status(409).json({
                  error: "Error al desenlazar el conductor de la multa",
                  message: error.message,
                });
              }
            } catch (error) {
              return res.status(409).json({
                error: "Error al desenlazar la multa del conductor",
                message: error.message,
              });
            }
          } else {



            try {

              await Multas.findByIdAndUpdate(id, {
                $push: { Conductores: conductor },
              });

              try {


                await Conductores.findByIdAndUpdate(conductor, {
                  $push: { Multas: id },
                });
              } catch (error) {
                return res.status(409).json({
                  error: "Error al enlazar el conductor a la multa",
                  message: error.message,
                });
              }
            } catch (error) {
              return res.status(409).json({
                error: "Error al enlazar la multa al conductor",
                message: error.message,
              });
            }
          }
        })
      ).then(async () => {
        return res
          .status(200)
          .json(await Multas.findById(id).populate("Conductores"));
      });
    } else {

      return res.status(404).json("Multa no encontrada, prueba con otro id");
    }
  } catch (error) {
    return res
      .status(409)
      .json({ error: 'Error al actualizar la multa. Recuerde introducir los conductores y los códigos entre doble comilla con el siguiente formato "coches": "codigodeconductor1,codigodeconductor2"', message: error.message });
  }
};



module.exports = { createMultas, getAllMultas, getByIdMultas, getByPagadaMultas,getByTipoMultas, updateMultas, toggleCoches, toggleConductores };