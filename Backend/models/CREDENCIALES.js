const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('CREDENCIALES', {
    CED_PER: {
      type: DataTypes.STRING(10),
      allowNull: false,
      references: {
        model: 'PERSONAS',
        key: 'CED_PER'
      }
    },
    COR_PER: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    CON_PER: {
      type: DataTypes.STRING(20),
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'CREDENCIALES',
    timestamps: false,
    indexes: [
      {
        name: "CED_PER",
        using: "BTREE",
        fields: [
          { name: "CED_PER" },
        ]
      },
    ]
  });
};
