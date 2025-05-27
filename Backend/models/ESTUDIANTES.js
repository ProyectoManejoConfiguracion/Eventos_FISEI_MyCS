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
        name: "CED_EST",
        using: "BTREE",
        fields: [
          { name: "CED_EST" },
        ]
      },
      {
        name: "ID_NIV",
        using: "BTREE",
        fields: [
          { name: "ID_NIV" },
        ]
      },
    ]
  });
};
