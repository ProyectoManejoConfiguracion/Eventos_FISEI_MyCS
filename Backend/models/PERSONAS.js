const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('PERSONAS', {
    CED_PER: {
      type: DataTypes.STRING(10),
      allowNull: false,
      primaryKey: true
    },
    NOM_PER: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    APE_PER: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    TEL_PER: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    COR_PER: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    CON_PER: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    FOT_PER: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    EST_PER: {
      type: DataTypes.STRING(15),
      allowNull: true,
      defaultValue: "PENDIENTE"
    },
    FOT_CED: {
      type: DataTypes.STRING(255),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'PERSONAS',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "CED_PER" },
        ]
      },
    ]
  });
};
