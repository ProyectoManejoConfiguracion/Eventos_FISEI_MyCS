const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('NIVEL', {
    ID_NIV: {
      type: DataTypes.STRING(10),
      allowNull: false,
      primaryKey: true
    },
    NOM_NIV: {
      type: DataTypes.STRING(10),
      allowNull: false
    },
    ORG_CUR_NIV: {
      type: DataTypes.STRING(30),
      allowNull: false
    },
    ID_CAR: {
      type: DataTypes.STRING(10),
      allowNull: false,
      references: {
        model: 'CARRERAS',
        key: 'ID_CAR'
      }
    }
  }, {
    sequelize,
    tableName: 'NIVEL',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "ID_NIV" },
        ]
      },
      {
        name: "ID_CAR",
        using: "BTREE",
        fields: [
          { name: "ID_CAR" },
        ]
      },
    ]
  });
};
