const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('CONTENIDO_WEB', {
    ID: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    TITLE: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    SUBTITLE: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    OBJETIVE: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    TELF: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    EMAIL_A: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    EMAIL_B: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    VISION: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    MISION: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    VALOR: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    DECANO: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    SUBDECANO: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    CTT: {
      type: DataTypes.STRING(255),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'CONTENIDO_WEB',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "ID" },
        ]
      },
    ]
  });
};
