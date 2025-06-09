const { sequelize, Sequelize } = require("../models");
const multer = require("multer");
const path = require("path");

exports.getAsistenciasPorAutoridad = async (req, res) => {
  try {
    const cedula = req.params.cedula;

    const results = await sequelize.query(
      `
      SELECT e.ID_EVT, e.NOM_EVT, e.FEC_EVT, de.CAT_DET,
             p.CED_PER, p.NOM_PER, p.APE_PER,
             di.NUM_DET_INF, di.REG_ASI
      FROM EVENTOS e
      JOIN DETALLE_EVENTOS de ON e.ID_EVT = de.ID_EVT
      JOIN REGISTRO_EVENTO re ON de.ID_DET = re.ID_DET
      JOIN REGISTRO_PERSONAS rp ON re.ID_REG_EVT = rp.ID_REG_EVT
      JOIN PERSONAS p ON rp.CED_PER = p.CED_PER
      LEFT JOIN INFORMES i ON rp.NUM_REG_PER = i.NUM_REG_PER
      LEFT JOIN DETALLE_INFORME di ON i.NUM_IFN = di.NUM_INF
      WHERE de.CAT_DET = 'CURSO' AND de.CED_AUT = :cedula
    `,
      {
        replacements: { cedula },
        type: Sequelize.QueryTypes.SELECT,
      }
    );

    const eventosMap = {};

    results.forEach((row) => {
      const key = row.ID_EVT;
      if (!eventosMap[key]) {
        eventosMap[key] = {
          ID_EVT: row.ID_EVT,
          NOM_EVT: row.NOM_EVT,
          FEC_EVT: row.FEC_EVT,
          CAT_DET: row.CAT_DET,
          Personas: [],
        };
      }

      eventosMap[key].Personas.push({
        CED_PER: row.CED_PER,
        NOM_PER: row.NOM_PER,
        APE_PER: row.APE_PER,
        NUM_DET_INF: row.NUM_DET_INF || null,
        REG_ASI: row.REG_ASI || null,
      });
    });

    res.json(Object.values(eventosMap));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.asignarAsistencia = async (req, res) => {
  const { cedula, idEvento, fecha } = req.body;

  try {
    const [registro] = await sequelize.query(
      `
      SELECT rp.NUM_REG_PER
      FROM REGISTRO_PERSONAS rp
      JOIN REGISTRO_EVENTO re ON rp.ID_REG_EVT = re.ID_REG_EVT
      JOIN DETALLE_EVENTOS de ON re.ID_DET = de.ID_DET
      WHERE rp.CED_PER = :cedula AND de.ID_EVT = :idEvento
      LIMIT 1
    `,
      {
        replacements: { cedula, idEvento },
        type: Sequelize.QueryTypes.SELECT,
      }
    );

    if (!registro) {
      return res
        .status(404)
        .json({
          message: "No se encontró el registro de persona para el evento.",
        });
    }

    const { NUM_REG_PER } = registro;

    const [informe] = await sequelize.query(
      `
      SELECT * FROM INFORMES WHERE NUM_REG_PER = :numRegPer
    `,
      {
        replacements: { numRegPer: NUM_REG_PER },
        type: Sequelize.QueryTypes.SELECT,
      }
    );

    let NUM_INF;

    if (!informe) {
      const [insertResult] = await sequelize.query(
        `
  INSERT INTO INFORMES (NUM_REG_PER) VALUES (:numRegPer)
`,
        {
          replacements: { numRegPer: NUM_REG_PER },
          type: Sequelize.QueryTypes.INSERT,
        }
      );

      const [newInforme] = await sequelize.query(
        `
  SELECT LAST_INSERT_ID() as NUM_IFN
`,
        {
          type: Sequelize.QueryTypes.SELECT,
        }
      );

      NUM_INF = newInforme.NUM_IFN;
    } else {
      NUM_INF = informe.NUM_IFN;
    }

    const [detalle] = await sequelize.query(
      `
      SELECT * FROM DETALLE_INFORME 
      WHERE NUM_INF = :numInf
    `,
      {
        replacements: { numInf: NUM_INF },
        type: Sequelize.QueryTypes.SELECT,
      }
    );

    if (!detalle) {
      await sequelize.query(
        `
        INSERT INTO DETALLE_INFORME (NUM_INF, REG_ASI) 
        VALUES (:numInf, :fecha)
      `,
        {
          replacements: { numInf: NUM_INF, fecha },
          type: Sequelize.QueryTypes.INSERT,
        }
      );
    } else {
      await sequelize.query(
        `
        UPDATE DETALLE_INFORME SET REG_ASI = :fecha 
        WHERE NUM_DET_INF = :numDetInf
      `,
        {
          replacements: { fecha, numDetInf: detalle.NUM_DET_INF },
          type: Sequelize.QueryTypes.UPDATE,
        }
      );
    }

    res.json({ message: "Asistencia asignada correctamente." });
  } catch (error) {
    console.error("Error asignando asistencia:", error);
    res.status(500).json({ error: error.message });
  }
};
