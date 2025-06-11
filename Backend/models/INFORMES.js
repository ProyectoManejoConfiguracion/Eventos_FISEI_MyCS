const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('INFORMES', {
    NUM_IFN: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    NUM_REG_PER: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'REGISTRO_PERSONAS',
        key: 'NUM_REG_PER'
      }
    },
    NOT_INF: {
      type: DataTypes.DECIMAL(5,2),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'INFORMES',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "NUM_IFN" },
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
