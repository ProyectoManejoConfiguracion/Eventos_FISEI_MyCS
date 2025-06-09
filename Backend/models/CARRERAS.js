const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('CARRERAS', {
    ID_CAR: {
      type: DataTypes.STRING(10),
      allowNull: false,
      primaryKey: true
    },
    NOM_CAR: {
      type: DataTypes.STRING(25),
      allowNull: false
    },
    ID_FAC: {
      type: DataTypes.STRING(10),
      allowNull: false,
      references: {
        model: 'FACULTADES',
        key: 'ID_FAC'
      }
    }
  }, {
    sequelize,
    tableName: 'CARRERAS',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "ID_CAR" },
        ]
      },
      {
        name: "ID_FAC",
        using: "BTREE",
        fields: [
          { name: "ID_FAC" },
        ]
      },
    ]
  });
};
