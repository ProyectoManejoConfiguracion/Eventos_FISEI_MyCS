const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('REQUERIMIENTOS', {
    ID_REC: {
      type: DataTypes.STRING(10),
      allowNull: false,
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
    DES_REC: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    URL_REQ: {
      type: DataTypes.STRING(50),
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'REQUERIMIENTOS',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "ID_REC" },
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
