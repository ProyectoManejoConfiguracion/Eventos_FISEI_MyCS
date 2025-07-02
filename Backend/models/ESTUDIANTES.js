const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('ESTUDIANTES', {
    ID_EST: {
      type: DataTypes.STRING(10),
      allowNull: false,
      primaryKey: true
    },
    CED_EST: {
      type: DataTypes.STRING(10),
      allowNull: false,
      references: {
        model: 'PERSONAS',
        key: 'CED_PER'
      }
    },
    ID_NIV: {
      type: DataTypes.STRING(10),
      allowNull: false,
      references: {
        model: 'NIVEL',
        key: 'ID_NIV'
      }
    },
    FOT_INS: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    ESTADO: {
      type: DataTypes.STRING(20),
      allowNull: true,
      defaultValue: "PENDIENTE"

    }
  }, {
    sequelize,
    tableName: 'ESTUDIANTES',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "ID_EST" },
        ]
      },
      {
        name: "ID_NIV",
        using: "BTREE",
        fields: [
          { name: "ID_NIV" },
        ]
      },
      {
        name: "fk_estudiantes_personas",
        using: "BTREE",
        fields: [
          { name: "CED_EST" },
        ]
      },
    ]
  });
};
