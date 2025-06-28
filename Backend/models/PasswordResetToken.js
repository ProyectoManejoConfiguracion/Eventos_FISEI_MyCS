module.exports = (sequelize, DataTypes) => {
  const PasswordResetToken = sequelize.define('PasswordResetToken', {
    CED_PER: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    token: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    expiresAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  }, {
    tableName: 'PasswordResetTokens', // O el nombre que prefieras
    timestamps: false,
  });

  // Si quieres la relación con PERSONAS (opcional):
  // PasswordResetToken.associate = (models) => {
  //   PasswordResetToken.belongsTo(models.PERSONAS, { foreignKey: 'CED_PER' });
  // };

  return PasswordResetToken;
};
