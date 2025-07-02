const { sequelize, Sequelize } = require("../models");
const multer = require("multer");
const path = require("path");

exports.getAsistenciasPorAutoridad = async (req, res) => {
  try {
    const cedula = req.params.cedula;

    const results = await sequelize.query(
      `
      SELECT e.ID_EVT, e.NOM_EVT, e.FEC_EVT, e.FEC_FIN, e.EST_VIS, de.CAT_DET,
             p.CED_PER, p.NOM_PER, p.APE_PER,
             i.NUM_IFN, di.NUM_DET_INF, di.REG_ASI
      FROM EVENTOS e
      JOIN DETALLE_EVENTOS de ON e.ID_EVT = de.ID_EVT
      JOIN REGISTRO_EVENTO re ON de.ID_DET = re.ID_DET
      JOIN REGISTRO_PERSONAS rp ON re.ID_REG_EVT = rp.ID_REG_EVT
      JOIN PERSONAS p ON rp.CED_PER = p.CED_PER
      LEFT JOIN INFORMES i ON rp.NUM_REG_PER = i.NUM_REG_PER
      LEFT JOIN DETALLE_INFORME di ON i.NUM_IFN = di.NUM_INF
      WHERE de.CAT_DET = 'CURSO'
        AND de.CED_AUT = :cedula
        AND e.EST_VIS = 'VISIBLE'
        AND rp.EST_REG = 'VERIFICADO'
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
          FEC_FIN: row.FEC_FIN,
          CAT_DET: row.CAT_DET,
          Personas: [],
        };
      }

      // Buscar si ya existe la persona en el array
      let persona = eventosMap[key].Personas.find(
        (p) => p.CED_PER === row.CED_PER
      );
      if (!persona) {
        persona = {
          CED_PER: row.CED_PER,
          NOM_PER: row.NOM_PER,
          APE_PER: row.APE_PER,
          NUM_INF: row.NUM_IFN || null,
          DetallesInforme: [],
        };
        eventosMap[key].Personas.push(persona);
      }

      // Si hay detalle de informe, agregarlo a la lista
      if (row.NUM_DET_INF) {
        persona.DetallesInforme.push({
          NUM_DET_INF: row.NUM_DET_INF,
          REG_ASI: row.REG_ASI,
        });
      }
    });

    res.json(Object.values(eventosMap));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.asignarAsistencia = async (req, res) => {
  const { cedula, idEvento, fecha } = req.body;

  try {
    // 1. Obtener el NUM_REG_PER
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

    // 2. Buscar o crear un informe
    const [informe] = await sequelize.query(
      `SELECT NUM_INF FROM INFORMES WHERE NUM_REG_PER = :numRegPer LIMIT 1`,
      {
        replacements: { numRegPer: NUM_REG_PER },
        type: Sequelize.QueryTypes.SELECT,
      }
    );

    let numInforme;

    if (!informe) {
      // Crear nuevo informe
      const [result] = await sequelize.query(
        `INSERT INTO INFORMES (NUM_REG_PER) VALUES (:numRegPer)`,
        {
          replacements: { numRegPer: NUM_REG_PER },
          type: Sequelize.QueryTypes.INSERT,
        }
      );

      // Obtener el ID del informe recién creado
      const [newInforme] = await sequelize.query(
        `SELECT LAST_INSERT_ID() as id`,
        {
          type: Sequelize.QueryTypes.SELECT,
        }
      );

      numInforme = newInforme.id;
    } else {
      numInforme = informe.NUM_INF;
    }

    // Verificar que numInforme tenga un valor válido
    if (!numInforme) {
      return res.status(500).json({
        message: "Error al obtener o crear el informe",
      });
    }

    console.log("Número de informe:", numInforme);

    // 3. Verificar si ya existe un detalle para esta fecha
    const [detalleExistente] = await sequelize.query(
      `
      SELECT * FROM DETALLE_INFORME 
      WHERE NUM_INF = :numInforme AND REG_ASI = :fecha
    `,
      {
        replacements: { numInforme, fecha },
        type: Sequelize.QueryTypes.SELECT,
      }
    );

    if (!detalleExistente) {
      // 4. Si no existe, crear un nuevo detalle
      await sequelize.query(
        `
        INSERT INTO DETALLE_INFORME (NUM_INF, REG_ASI) 
        VALUES (:numInforme, :fecha)
      `,
        {
          replacements: { numInforme, fecha },
          type: Sequelize.QueryTypes.INSERT,
        }
      );
      
      res.json({ 
        message: "Asistencia registrada correctamente.",
        action: "created" 
      });
    } else {
      // No es necesario actualizar, ya existe un registro para esta fecha
      res.json({ 
        message: "La asistencia ya estaba registrada para esta fecha.",
        action: "exists",
        detalleId: detalleExistente.NUM_DET_INF
      });
    }
  } catch (error) {
    console.error("Error asignando asistencia:", error);
    res.status(500).json({ error: error.message });
  }
};



exports.eliminarDetalleInforme = async (req, res) => {
  const { id } = req.params;
  
  try {
    console.log("Eliminando detalle de informe:", id);
    
    // Primero verificamos que el detalle exista
    const [detalle] = await sequelize.query(
      `SELECT * FROM DETALLE_INFORME WHERE NUM_DET_INF = :id`,
      {
        replacements: { id },
        type: Sequelize.QueryTypes.SELECT,
      }
    );
    
    if (!detalle) {
      return res.status(404).json({ 
        message: "Detalle de informe no encontrado." 
      });
    }
    
    // Procedemos a eliminar
    await sequelize.query(
      `DELETE FROM DETALLE_INFORME WHERE NUM_DET_INF = :id`,
      {
        replacements: { id },
        type: Sequelize.QueryTypes.DELETE,
      }
    );
    
    res.json({ 
      message: "Asistencia eliminada correctamente.",
      detalleId: parseInt(id)
    });
  } catch (error) {
    console.error("Error eliminando asistencia:", error);
    res.status(500).json({ error: error.message });
  }
};