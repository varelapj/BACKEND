const enumTipoMultaOk = (TipoMulta) => {
  const enumTipoMulta = ["aparcamiento", "velocidad", "otro"];
  if (enumTipoMulta.includes(TipoMulta)) {
    return { check: true, TipoMulta };
  } else {
    return { check: false };
  }
};

const enumMultaPagada = (MultaPagada) => {
  const enumMultaPagada = ["Si", "No"];
  if (enumMultaPagada.includes(MultaPagada)) {
    return { check: true, MultaPagada };
  } else {
    return { check: false };
  }
};

const enumGenero = (Genero) => {
  const enumGenero = ["Hombre", "Mujer", "Otro"];
  if (enumGenero.includes(Genero)) {
    return { check: true, Genero };
  } else {
    return { check: false };
  }
};

const enumRol = (Rol) => {
  const enumGender = ["admin", "user"];
  if (enumGender.includes(Rol)) {
    return { check: true, Rol };
  } else {
    return { check: false };
  }
};

module.exports = {enumTipoMultaOk,enumMultaPagada,enumGenero,enumRol};
