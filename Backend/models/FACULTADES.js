const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('FACULTADES', {
    ID_FAC: {
      type: DataTypes.STRING(10),
      allowNull: false,
      primaryKey: true
    },
    NOM_FAC: {
      type: DataTypes.STRING(30),
      allowNull: false
    },
    UBI_PRE_FAC: {
      type: DataTypes.STRING(15),
      allowNull: true
    },
    MIS_FAC: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    VIC_FAC: {
      type: DataTypes.STRING(255),
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'FACULTADES',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "ID_FAC" },
        ]
      },
    ]
  });
};
