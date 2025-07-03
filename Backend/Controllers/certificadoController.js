const { sequelize, Sequelize } = require('../models');

exports.getCertificado = async (req, res) => {
  const cedula = req.params.cedula;
  try {
    const rows = await sequelize.query(`
      SELECT 
        p.CED_PER, p.NOM_PER, p.APE_PER,
        e.ID_EVT, e.NOM_EVT, e.FEC_EVT,
        de.CAT_DET, de.HOR_DET,
        i.NOT_INF,
        -- mejor traer directamente la persona de la autoridad
        perAut.CED_PER   AS CED_AUT,
        perAut.NOM_PER   AS NOM_AUT,
        perAut.APE_PER   AS APE_AUT,
        au.CAR_AUT
      FROM PERSONAS p
      JOIN REGISTRO_PERSONAS rp
        ON p.CED_PER = rp.CED_PER
      JOIN REGISTRO_EVENTO re
        ON rp.ID_REG_EVT = re.ID_REG_EVT
      JOIN DETALLE_EVENTOS de
        ON re.ID_DET = de.ID_DET
      JOIN EVENTOS e
        ON de.ID_EVT = e.ID_EVT
      LEFT JOIN INFORMES i
        ON rp.NUM_REG_PER = i.NUM_REG_PER
      -- estos JOIN ahora son LEFT JOIN
      LEFT JOIN AUTORIDADES au
        ON de.CED_AUT = au.CED_PER
      LEFT JOIN PERSONAS perAut
        ON de.CED_AUT = perAut.CED_PER
      WHERE p.CED_PER = :cedula
        AND de.CAT_DET = 'CURSO'
    `, {
      replacements: { cedula },
      type: Sequelize.QueryTypes.SELECT
    });
    
    if (!rows.length)
      return res.status(404).json({ error: 'No hay datos para certificado' });
    
    const info = rows.map(r => ({
      estudiante: {
        cedula: r.CED_PER,
        nombre: `${r.NOM_PER} ${r.APE_PER}`
      },
      curso: {
        id:        r.ID_EVT,
        nombre:    r.NOM_EVT,
        fecha:     r.FEC_EVT,
        categoria: r.CAT_DET,
        horas:     r.HOR_DET,
        nota:      r.NOT_INF
      },
      autoridad: {
        cedula: r.CED_AUT,
        nombre: `${r.NOM_AUT || '—'} ${r.APE_AUT || ''}`.trim(),
        cargo:  r.CAR_AUT || '—'
      }
    }));
    
    res.json(info);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
exports.getAsistencia = async (req, res) => {
  const { cedula, id_det } = req.params;
  try {
    const rows = await sequelize.query(`
      SELECT 
        p.CED_PER, p.NOM_PER, p.APE_PER,
        e.ID_EVT, e.NOM_EVT, e.FEC_EVT, e.FEC_FIN,
        de.CAT_DET, de.HOR_DET,
        i.NOT_INF,
        perAut.CED_PER   AS CED_AUT,
        perAut.NOM_PER   AS NOM_AUT,
        perAut.APE_PER   AS APE_AUT,
        au.CAR_AUT,
        COUNT(di.NUM_DET_INF) AS dias_asistidos,
        DATEDIFF(e.FEC_FIN, e.FEC_EVT) + 1 AS dias_totales,
        ROUND(COUNT(di.NUM_DET_INF) * 100.0 / (DATEDIFF(e.FEC_FIN, e.FEC_EVT) + 1), 2) AS porcentaje_asistencia
      FROM PERSONAS p
      JOIN REGISTRO_PERSONAS rp      ON p.CED_PER = rp.CED_PER
      JOIN REGISTRO_EVENTO re        ON rp.ID_REG_EVT = re.ID_REG_EVT
      JOIN DETALLE_EVENTOS de        ON re.ID_DET = de.ID_DET
      JOIN EVENTOS e                 ON de.ID_EVT = e.ID_EVT
      LEFT JOIN INFORMES i           ON rp.NUM_REG_PER = i.NUM_REG_PER
      LEFT JOIN AUTORIDADES au       ON de.CED_AUT = au.CED_PER
      LEFT JOIN PERSONAS perAut      ON de.CED_AUT = perAut.CED_PER
      LEFT JOIN INFORMES inf         ON inf.NUM_REG_PER = rp.NUM_REG_PER
      LEFT JOIN DETALLE_INFORME di   ON di.NUM_INF = inf.NUM_IFN
      WHERE p.CED_PER = :cedula
        AND de.ID_DET = :id_det
      GROUP BY p.CED_PER, p.NOM_PER, p.APE_PER,
               e.ID_EVT, e.NOM_EVT, e.FEC_EVT, e.FEC_FIN,
               de.CAT_DET, de.HOR_DET,
               i.NOT_INF,
               perAut.CED_PER,
               perAut.NOM_PER,
               perAut.APE_PER,
               au.CAR_AUT
    `, {
      replacements: { cedula, id_det },
      type: Sequelize.QueryTypes.SELECT
    });

    if (!rows.length)
      return res.status(404).json({ error: 'No hay datos de asistencia' });

    const asistencia = rows.map(r => ({
      asistencia: {
        dias_asistidos: r.dias_asistidos,
        dias_totales:   r.dias_totales,
        porcentaje:     r.porcentaje_asistencia
      }
    }));

    res.json(asistencia);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

