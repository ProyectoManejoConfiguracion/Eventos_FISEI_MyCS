const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('EVENTOS', {
    ID_EVT: {
      type: DataTypes.STRING(10),
      allowNull: false,
      primaryKey: true
    },
    NOM_EVT: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    FEC_EVT: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    LUG_EVT: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    TIP_EVT: {
      type: DataTypes.STRING(10),
      allowNull: false
    },
    MOD_EVT: {
      type: DataTypes.STRING(10),
      allowNull: false
    },
    FOT_EVT: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    DES_EVT: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    SUB_EVT: {
      type: DataTypes.STRING(80),
      allowNull: true
    },
    FEC_FIN: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    CAR_MOT: {
      type: DataTypes.STRING(255),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'EVENTOS',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "ID_EVT" },
        ]
      },
    ]
  });
};
