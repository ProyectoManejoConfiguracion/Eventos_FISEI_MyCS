const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('TARIFAS_EVENTO', {
    ID_TAR: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    ID_EVT: {
      type: DataTypes.STRING(10),
      allowNull: false,
      references: {
        model: 'EVENTOS',
        key: 'ID_EVT'
      }
    },
    TIP_PAR: {
      type: DataTypes.STRING(10),
      allowNull: true
    },
    VAL_EVT: {
      type: DataTypes.DOUBLE,
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'TARIFAS_EVENTO',
    timestamps: false,
    indexes: [
      {
        name: "ID_EVT",
        using: "BTREE",
        fields: [
          { name: "ID_EVT" },
        ]
      },
      {
        name: "TIP_PAR",
        using: "BTREE",
        fields: [
          { name: "TIP_PAR" },
        ]
      },
    ]
  });
};
