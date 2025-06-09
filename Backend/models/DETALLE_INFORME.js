const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('DETALLE_INFORME', {
    NUM_DET_INF: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    REG_ASI: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    NUM_INF: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'INFORMES',
        key: 'NUM_INF'
      }
    }
  }, {
    sequelize,
    tableName: 'DETALLE_INFORME',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "NUM_DET_INF" },
        ]
      },
      {
        name: "NUM_INF",
        using: "BTREE",
        fields: [
          { name: "NUM_INF" },
        ]
      },
    ]
  });
};
