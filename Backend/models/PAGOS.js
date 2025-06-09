const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('PAGOS', {
    NUM_PAG: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
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
    NUM_REG_PER: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'REGISTRO_PERSONAS',
        key: 'NUM_REG_PER'
      }
    },
    VAL_PAG: {
      type: DataTypes.DECIMAL(5,2),
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'PAGOS',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "NUM_PAG" },
        ]
      },
      {
        name: "ID_EVT",
        using: "BTREE",
        fields: [
          { name: "ID_EVT" },
        ]
      },
      {
        name: "NUM_REG_PER",
        using: "BTREE",
        fields: [
          { name: "NUM_REG_PER" },
        ]
      },
    ]
  });
};
