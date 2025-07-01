const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('REGISTRO_EVENTO', {
    ID_REG_EVT: {
      type: DataTypes.STRING(10),
      allowNull: false,
      primaryKey: true
    },
    ID_DET: {
      type: DataTypes.STRING(10),
      allowNull: false,
      references: {
        model: 'DETALLE_EVENTOS',
        key: 'ID_DET'
      }
    },
    ID_NIV: {
      type: DataTypes.STRING(10),
      allowNull: true,
      references: {
        model: 'NIVEL',
        key: 'ID_NIV'
      }
    }
  }, {
    sequelize,
    tableName: 'REGISTRO_EVENTO',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "ID_REG_EVT" },
        ]
      },
      {
        name: "REGISTRO_EVENTO_ibfk_1",
        using: "BTREE",
        fields: [
          { name: "ID_DET" },
        ]
      },
      {
        name: "REGISTRO_EVENTO_ibfk_2",
        using: "BTREE",
        fields: [
          { name: "ID_NIV" },
        ]
      },
    ]
  });
};
