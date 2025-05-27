var DataTypes = require("sequelize").DataTypes;
var _AUTORIDADES = require("./AUTORIDADES");
var _CARRERAS = require("./CARRERAS");
var _CREDENCIALES = require("./CREDENCIALES");
var _DETALLE_EVENTOS = require("./DETALLE_EVENTOS");
var _DETALLE_INFORME = require("./DETALLE_INFORME");
var _ESTUDIANTES = require("./ESTUDIANTES");
var _EVENTOS = require("./EVENTOS");
var _FACULTADES = require("./FACULTADES");
var _INFORMES = require("./INFORMES");
var _NIVEL = require("./NIVEL");
var _PAGOS = require("./PAGOS");
var _PERSONAS = require("./PERSONAS");
var _REGISTRO_EVENTO = require("./REGISTRO_EVENTO");
var _REGISTRO_PERSONAS = require("./REGISTRO_PERSONAS");
var _REQUERIMIENTOS = require("./REQUERIMIENTOS");
var _TARIFAS_EVENTO = require("./TARIFAS_EVENTO");

function initModels(sequelize) {
  var AUTORIDADES = _AUTORIDADES(sequelize, DataTypes);
  var CARRERAS = _CARRERAS(sequelize, DataTypes);
  var CREDENCIALES = _CREDENCIALES(sequelize, DataTypes);
  var DETALLE_EVENTOS = _DETALLE_EVENTOS(sequelize, DataTypes);
  var DETALLE_INFORME = _DETALLE_INFORME(sequelize, DataTypes);
  var ESTUDIANTES = _ESTUDIANTES(sequelize, DataTypes);
  var EVENTOS = _EVENTOS(sequelize, DataTypes);
  var FACULTADES = _FACULTADES(sequelize, DataTypes);
  var INFORMES = _INFORMES(sequelize, DataTypes);
  var NIVEL = _NIVEL(sequelize, DataTypes);
  var PAGOS = _PAGOS(sequelize, DataTypes);
  var PERSONAS = _PERSONAS(sequelize, DataTypes);
  var REGISTRO_EVENTO = _REGISTRO_EVENTO(sequelize, DataTypes);
  var REGISTRO_PERSONAS = _REGISTRO_PERSONAS(sequelize, DataTypes);
  var REQUERIMIENTOS = _REQUERIMIENTOS(sequelize, DataTypes);
  var TARIFAS_EVENTO = _TARIFAS_EVENTO(sequelize, DataTypes);

  NIVEL.belongsTo(CARRERAS, { as: "ID_CAR_CARRERA", foreignKey: "ID_CAR"});
  CARRERAS.hasMany(NIVEL, { as: "NIVELs", foreignKey: "ID_CAR"});
  REGISTRO_EVENTO.belongsTo(DETALLE_EVENTOS, { as: "ID_DET_DETALLE_EVENTO", foreignKey: "ID_DET"});
  DETALLE_EVENTOS.hasMany(REGISTRO_EVENTO, { as: "REGISTRO_EVENTOs", foreignKey: "ID_DET"});
  DETALLE_EVENTOS.belongsTo(EVENTOS, { as: "ID_EVT_EVENTO", foreignKey: "ID_EVT"});
  EVENTOS.hasMany(DETALLE_EVENTOS, { as: "DETALLE_EVENTOs", foreignKey: "ID_EVT"});
  PAGOS.belongsTo(EVENTOS, { as: "ID_EVT_EVENTO", foreignKey: "ID_EVT"});
  EVENTOS.hasMany(PAGOS, { as: "PAGOs", foreignKey: "ID_EVT"});
  REQUERIMIENTOS.belongsTo(EVENTOS, { as: "ID_EVT_EVENTO", foreignKey: "ID_EVT"});
  EVENTOS.hasMany(REQUERIMIENTOS, { as: "REQUERIMIENTOs", foreignKey: "ID_EVT"});
  TARIFAS_EVENTO.belongsTo(EVENTOS, { as: "ID_EVT_EVENTO", foreignKey: "ID_EVT"});
  EVENTOS.hasMany(TARIFAS_EVENTO, { as: "TARIFAS_EVENTOs", foreignKey: "ID_EVT"});
  AUTORIDADES.belongsTo(FACULTADES, { as: "ID_FAC_FACULTADE", foreignKey: "ID_FAC"});
  FACULTADES.hasMany(AUTORIDADES, { as: "AUTORIDADEs", foreignKey: "ID_FAC"});
  CARRERAS.belongsTo(FACULTADES, { as: "ID_FAC_FACULTADE", foreignKey: "ID_FAC"});
  FACULTADES.hasMany(CARRERAS, { as: "CARRERAs", foreignKey: "ID_FAC"});
  DETALLE_INFORME.belongsTo(INFORMES, { as: "NUM_INF_INFORME", foreignKey: "NUM_INF"});
  INFORMES.hasMany(DETALLE_INFORME, { as: "DETALLE_INFORMEs", foreignKey: "NUM_INF"});
  ESTUDIANTES.belongsTo(NIVEL, { as: "ID_NIV_NIVEL", foreignKey: "ID_NIV"});
  NIVEL.hasMany(ESTUDIANTES, { as: "ESTUDIANTEs", foreignKey: "ID_NIV"});
  REGISTRO_EVENTO.belongsTo(NIVEL, { as: "ID_NIV_NIVEL", foreignKey: "ID_NIV"});
  NIVEL.hasMany(REGISTRO_EVENTO, { as: "REGISTRO_EVENTOs", foreignKey: "ID_NIV"});
  AUTORIDADES.belongsTo(PERSONAS, { as: "CED_PER_PERSONA", foreignKey: "CED_PER"});
  PERSONAS.hasMany(AUTORIDADES, { as: "AUTORIDADEs", foreignKey: "CED_PER"});
  CREDENCIALES.belongsTo(PERSONAS, { as: "CED_PER_PERSONA", foreignKey: "CED_PER"});
  PERSONAS.hasMany(CREDENCIALES, { as: "CREDENCIALEs", foreignKey: "CED_PER"});
  DETALLE_EVENTOS.belongsTo(PERSONAS, { as: "CED_AUT_PERSONA", foreignKey: "CED_AUT"});
  PERSONAS.hasMany(DETALLE_EVENTOS, { as: "DETALLE_EVENTOs", foreignKey: "CED_AUT"});
  ESTUDIANTES.belongsTo(PERSONAS, { as: "CED_EST_PERSONA", foreignKey: "CED_EST"});
  PERSONAS.hasMany(ESTUDIANTES, { as: "ESTUDIANTEs", foreignKey: "CED_EST"});
  REGISTRO_PERSONAS.belongsTo(PERSONAS, { as: "CED_PER_PERSONA", foreignKey: "CED_PER"});
  PERSONAS.hasMany(REGISTRO_PERSONAS, { as: "REGISTRO_PERSONAs", foreignKey: "CED_PER"});
  REGISTRO_PERSONAS.belongsTo(REGISTRO_EVENTO, { as: "ID_REG_EVT_REGISTRO_EVENTO", foreignKey: "ID_REG_EVT"});
  REGISTRO_EVENTO.hasMany(REGISTRO_PERSONAS, { as: "REGISTRO_PERSONAs", foreignKey: "ID_REG_EVT"});
  INFORMES.belongsTo(REGISTRO_PERSONAS, { as: "NUM_REG_PER_REGISTRO_PERSONA", foreignKey: "NUM_REG_PER"});
  REGISTRO_PERSONAS.hasMany(INFORMES, { as: "INFORMEs", foreignKey: "NUM_REG_PER"});
  PAGOS.belongsTo(REGISTRO_PERSONAS, { as: "NUM_REG_PER_REGISTRO_PERSONA", foreignKey: "NUM_REG_PER"});
  REGISTRO_PERSONAS.hasMany(PAGOS, { as: "PAGOs", foreignKey: "NUM_REG_PER"});
  REGISTRO_PERSONAS.belongsTo(TARIFAS_EVENTO, { as: "TIP_PAR_TARIFAS_EVENTO", foreignKey: "TIP_PAR"});
  TARIFAS_EVENTO.hasMany(REGISTRO_PERSONAS, { as: "REGISTRO_PERSONAs", foreignKey: "TIP_PAR"});

  return {
    AUTORIDADES,
    CARRERAS,
    CREDENCIALES,
    DETALLE_EVENTOS,
    DETALLE_INFORME,
    ESTUDIANTES,
    EVENTOS,
    FACULTADES,
    INFORMES,
    NIVEL,
    PAGOS,
    PERSONAS,
    REGISTRO_EVENTO,
    REGISTRO_PERSONAS,
    REQUERIMIENTOS,
    TARIFAS_EVENTO,
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
