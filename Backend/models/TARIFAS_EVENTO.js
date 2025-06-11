const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('TARIFAS_EVENTO', {
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
    },
    ID_TAR: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    }
  }, {
    sequelize,
    tableName: 'TARIFAS_EVENTO',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "ID_TAR" },
        ]
      },
      {
        name: "ID_EVT",
        using: "BTREE",
        fields: [
          { name: "ID_EVT" },
        ]
      },
    ]
  });
};
