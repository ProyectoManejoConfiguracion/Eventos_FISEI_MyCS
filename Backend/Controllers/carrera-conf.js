const { sequelize, Sequelize } = require('../models');

exports.getCarreraConf = async (req, res) => {
  const cedula = req.params.cedula;
  try {
    const rows = await sequelize.query(`
      SELECT
        e.FOT_INS,
        n.NOM_NIV,
        c.NOM_CAR
      FROM
        ESTUDIANTES e
      JOIN NIVEL n ON e.ID_NIV = n.ID_NIV
      JOIN CARRERAS c ON n.ID_CAR = c.ID_CAR
      WHERE e.CED_EST = :cedula;
    `, {
      replacements: { cedula },
      type: Sequelize.QueryTypes.SELECT
    });

    if (!rows.length)
      return res.status(404).json({ error: 'No se encontraron datos de carrera para esta cédula' });

    // Puede haber sólo un resultado, pero lo dejamos como array por consistencia
    const carreras = rows.map(r => ({
      foto: r.FOT_INS,
      nivel: r.NOM_NIV,
      carrera: r.NOM_CAR
    }));

    res.json(carreras);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};