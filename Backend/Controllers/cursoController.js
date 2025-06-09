const { sequelize, Sequelize } = require('../models');

exports.getCursos = async (req, res) => {
  const cedula = req.params.cedula;
  try {
    const rows = await sequelize.query(`
  SELECT 
    p.CED_PER,
    e.ID_EVT,
    e.NOM_EVT,
    e.FEC_EVT,
    e.LUG_EVT,
    e.TIP_EVT,
    e.MOD_EVT,
    d.CAT_DET,
    d.ARE_DET,
    d.CUP_DET,
    d.NOT_DET,
    d.HOR_DET
FROM 
    REGISTRO_PERSONAS p
JOIN 
    REGISTRO_EVENTO r ON p.ID_REG_EVT = r.ID_REG_EVT
JOIN 
    DETALLE_EVENTOS d ON r.ID_DET = d.ID_DET
JOIN 
    EVENTOS e ON d.ID_EVT = e.ID_EVT
WHERE 
    p.CED_PER =:cedula ;
    `, {
      replacements: { cedula },
      type: Sequelize.QueryTypes.SELECT
    });

    if (!rows.length)
      return res.status(404).json({ error: 'No se encontraron cursos para esta cédula' });

    const cursos = rows.map(r => ({
      cedula: r.CED_PER,
      curso: {
        id: r.ID_EVT,
        nombre: r.NOM_EVT,
        fecha: r.FEC_EVT,
        categoria: r.CAT_DET,
        horas: r.HOR_DET,
        area: r.ARE_DET
      }
    }));

    res.json(cursos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
