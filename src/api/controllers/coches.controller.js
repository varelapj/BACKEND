
const Coches = require("../models/coches.model");
const Conductores = require("../models/conductores.model");
const Multas = require("../models/multas.model");

 
//! CREATE
const createCoches = async (req, res, next) => {
  let catchImg = req.file?.path;
  //let catchImg = req.body?.Imagen;

  try {
    await Coches.syncIndexes();


    const newCoches = new Coches(req.body);

   if (catchImg) { 
      newCoches.Imagen = catchImg;
    } else {
      newCoches.Imagen =
        "https://asset.cloudinary.com/dx8p4o1ak/4967248420db2547c74d989c73bce1bc";
    }
    const saveCoches = await newCoches.save();

    if (saveCoches) {
      return res.status(200).json(saveCoches);
    } else {
      return res.status(409).json("No se ha podido registrar el coche");
    }
  } catch (error) {
    return res.status(409).json({
      error: "Error en el registro del coche",
      message: error.message,
    });
  }
};



//! GET ALL

const getAllCoches = async (req, res, next) => {
  try {
    const allCoches = await Coches.find();
    if (allCoches.length > 0) {
      return res.status(200).json(allCoches);
    } else {
      return res.status(404).json("No se han encontrado coches");
    }
  } catch (error) {
    return res
      .status(409)
      .json({ error: "Error al buscar coches", message: error.message });
  }
};

//! GET BY ID
const getByIdCoches = async (req, res, next) => {
  try {
    const { id } = req.params;
    const CochesById = await Coches.findById(id).populate("Multas");;
    if (CochesById) {
      return res.status(200).json(CochesById);
    } else {
      return res.status(404).json("No se ha encontrado el coche");
    }
  } catch (error) {
    return res
      .status(409)
      .json({ error: "Error al buscar por Id", message: error.message });
  }
};


//! GET BY MATRICULA
const getByMatriculaCoches = async (req, res, next) => {
  try {
    const { Matricula } = req.params;
    const CaochesByMatricula = await Coches.find({ Matricula }).populate("Multas");
    if (CaochesByMatricula.length !== 0 ){
      return res.status(200).json(CaochesByMatricula);
    } else {
      return res.status(404).json("No se ha encontrado la matrícula. Recuerde que el valor de la 'Matrícula' ha de ser 4 números y tres letras en mayúscula");
    }
  } catch (error) {
    return res
      .status(409)
      .json({ error: "Error al buscar por matrícula", message: error.message });
  }
};

//! GET BY AÑO
const getByAnoCoches = async (req, res, next) => {
  try {
    const { Ano } = req.params;
    const CaochesByAno = await Coches.find({ Ano }).populate("Multas");
    if (CaochesByAno.length !== 0 ){
      return res.status(200).json(CaochesByAno);
    } else {
      return res.status(404).json("No se han encontrado coches para el año seleccionado.");
    }
  } catch (error) {
    return res
      .status(409)
      .json({ error: "Error al buscar por año", message: error.message });
  }
};


//! DELETE
const deleteCoches = async (req, res, next) => {
  try {

    const { id } = req.params;
    const coches = await Coches.findByIdAndDelete(id);
    if (coches) {
      const CochesDelete = await Coches.findById(id);
      try {
        await Multas.updateMany(
          { Coches: id },
          { $pull: { Coches: id } }
        );
        await Conductores.updateMany(
          { Coches: id },
          { $pull: { Coches: id } }
        );
        return res.status(CochesDelete ? 409 : 200).json({
          deleteTest: CochesDelete ? false : true,
        });
      } catch (error) {
        return res.status(409).json({
          error: "Error al borrar el coche",
          message: error.message,
        });
      }
    } else {
      return res.status(404).json("El coche no ha sido encontrado");
    }
  } catch (error) {
    return res.status(409).json({
      error: "Error al borrar el coche",
      message: error.message,
    });
  }
};

//! TOGGLE MULTAS
//! Le pasamos el ID de coche por el params y el ID de multas por el body 
const toggleMultas = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { multas } = req.body; 


    const cochesById = await Coches.findById(id);
    if (cochesById) {
      const arrayMultas = multas.split(",");

      Promise.all(
        arrayMultas.map(async (multa) => {
          if (cochesById.Multas.includes(multa)) {

            try {
              await Coches.findByIdAndUpdate(id, {
                $pull: { Multas: multa },
              });

              try {
                await Multas.findByIdAndUpdate(multa, {
                  $pull: { Coches: id },
                });
              } 
              
              
              catch (error) {
                return res.status(409).json({
                  error: "Error al desenlazar la multa del coche",
                  message: error.message,
                });
              }
            } catch (error) {
              return res.status(409).json({
                error: "Error al desenlazar el coche de la multa",
                message: error.message,
              });
            }
          } else {



            try {

              await Coches.findByIdAndUpdate(id, {
                $push: { Multas: multa },
              });

              try {


                await Multas.findByIdAndUpdate(multa, {
                  $push: { Coches: id },
                });
              } catch (error) {
                return res.status(409).json({
                  error: "Error al enlazar la multa al coche",
                  message: error.message,
                });
              }
            } catch (error) {
              return res.status(409).json({
                error: "Error al enlazar el coche a la multa",
                message: error.message,
              });
            }
          }
        })
      ).then(async () => {
        return res
          .status(200)
          .json(await Coches.findById(id).populate("Multas"));
      });
    } else {

      return res.status(404).json("Coche no encontrado, prueba con otro id");
    }
  } catch (error) {
    return res
      .status(409)
      .json({ error: 'Error al actualizar el coche. Recuerde introducir las multas y los códigos entre doble comilla con el siguiente formato"multas": "codigodemulta1,codigodemulta2"', message: error.message });
  }
};



//! TOGGLE CONDUCTORES
//! Le pasamos el ID de coche por el params y el ID de CONDUCTORES por el body 
const toggleConductores = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { conductores } = req.body; 


    const cochesById = await Coches.findById(id);
    if (cochesById) {
      const arrayConductores = conductores.split(",");

      Promise.all(
        arrayConductores.map(async (conductor) => {
          if (cochesById.Conductores.includes(conductor)) {

            try {
              await Coches.findByIdAndUpdate(id, {
                $pull: { Conductores: conductor },
              });

              try {
                await Conductores.findByIdAndUpdate(conductor, {
                  $pull: { Coches: id },
                });
              } 
              
              
              catch (error) {
                return res.status(409).json({
                  error: "Error al desenlazar el conductor del coche",
                  message: error.message,
                });
              }
            } catch (error) {
              return res.status(409).json({
                error: "Error al desenlazar el coche del conductor",
                message: error.message,
              });
            }
          } else {



            try {

              await Coches.findByIdAndUpdate(id, {
                $push: { Conductores: conductor },
              });

              try {


                await Conductores.findByIdAndUpdate(conductor, {
                  $push: { Coches: id },
                });
              } catch (error) {
                return res.status(409).json({
                  error: "Error al enlazar el conductor al coche",
                  message: error.message,
                });
              }
            } catch (error) {
              return res.status(409).json({
                error: "Error al enlazar el coche al conductor",
                message: error.message,
              });
            }
          }
        })
      ).then(async () => {
        return res
          .status(200)
          .json(await Coches.findById(id).populate("Conductores"));
      });
    } else {

      return res.status(404).json("Coche no encontrado, prueba con otro id");
    }
  } catch (error) {
    return res
      .status(409)
      .json({ error: 'Error al actualizar el coche. Recuerde introducir los conductores y los códigos entre doble comilla con el siguiente formato"conductores": "codigodecondcutor1,codigodecondcutor2"', message: error.message });
  }
};
module.exports = { createCoches, getAllCoches, getByIdCoches, getByMatriculaCoches, getByAnoCoches, deleteCoches, toggleMultas, toggleConductores };