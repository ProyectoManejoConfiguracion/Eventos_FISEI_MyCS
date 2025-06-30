const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('REGISTRO_PERSONAS', {
    NUM_REG_PER: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    CED_PER: {
      type: DataTypes.STRING(10),
      allowNull: false,
      references: {
        model: 'PERSONAS',
        key: 'CED_PER'
      }
    },
    ID_REG_EVT: {
      type: DataTypes.STRING(10),
      allowNull: false,
      references: {
        model: 'REGISTRO_EVENTO',
        key: 'ID_REG_EVT'
      }
    },
    ID_TAR_PER: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'TARIFAS_EVENTO',
        key: 'ID_TAR'
      }
    },
    FEC_REG_PER: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    EST_REG: {
      type: DataTypes.STRING(15),
      allowNull: true,
      defaultValue: "PENDIENTE"
    },
    CAR_MOT: {
      type: DataTypes.STRING(255),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'REGISTRO_PERSONAS',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "NUM_REG_PER" },
        ]
      },
      {
        name: "CED_PER",
        using: "BTREE",
        fields: [
          { name: "CED_PER" },
        ]
      },
      {
        name: "ID_REG_EVT",
        using: "BTREE",
        fields: [
          { name: "ID_REG_EVT" },
        ]
      },
      {
        name: "ID_TAR_PER",
        using: "BTREE",
        fields: [
          { name: "ID_TAR_PER" },
        ]
      },
    ]
  });
};
