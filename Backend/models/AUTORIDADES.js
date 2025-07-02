const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('AUTORIDADES', {
    ID_AUT: {
      type: DataTypes.STRING(10),
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
    DIR_AUT: {
      type: DataTypes.STRING(30),
      allowNull: false
    },
    CAR_AUT: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    ID_FAC: {
      type: DataTypes.STRING(10),
      allowNull: false,
      references: {
        model: 'FACULTADES',
        key: 'ID_FAC'
      }
    },
    ESTADO: {
      type: DataTypes.STRING(50),
      allowNull: true,
      defaultValue: "PENDIENTE"
    },
    FOT_CON: {
      type: DataTypes.STRING(255),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'AUTORIDADES',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "ID_AUT" },
        ]
      },
      {
        name: "ID_FAC",
        using: "BTREE",
        fields: [
          { name: "ID_FAC" },
        ]
      },
      {
        name: "fk_autoridades_personas",
        using: "BTREE",
        fields: [
          { name: "CED_PER" },
        ]
      },
    ]
  });
};
