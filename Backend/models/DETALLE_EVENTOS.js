const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('DETALLE_EVENTOS', {
    ID_DET: {
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
    CED_AUT: {
      type: DataTypes.STRING(10),
      allowNull: false,
      references: {
        model: 'PERSONAS',
        key: 'CED_PER'
      }
    },
    CUP_DET: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    NOT_DET: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    HOR_DET: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    ARE_DET: {
      type: DataTypes.STRING(40),
      allowNull: true
    },
    CAT_DET: {
      type: DataTypes.STRING(20),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'DETALLE_EVENTOS',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "ID_DET" },
        ]
      },
      {
        name: "DETALLE_EVENTOS_ibfk_1",
        using: "BTREE",
        fields: [
          { name: "ID_EVT" },
        ]
      },
      {
        name: "DETALLE_EVENTOS_ibfk_2",
        using: "BTREE",
        fields: [
          { name: "CED_AUT" },
        ]
      },
    ]
  });
};
