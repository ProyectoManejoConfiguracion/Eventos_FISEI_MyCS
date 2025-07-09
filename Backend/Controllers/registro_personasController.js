const { REGISTRO_PERSONAS } = require('../models');
const { sequelize, Sequelize } = require('../models');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const uploadPath = path.join('C:', 'uploads', 'pagos');

exports.getAll = async (req, res) => {
  try {
    const data = await REGISTRO_PERSONAS.findAll();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getOne = async (req, res) => {
  try {
    const data = await REGISTRO_PERSONAS.findByPk(req.params.id);
    if (data) res.json(data);
    else res.status(404).json({ error: 'No encontrado' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.create = async (req, res) => {
  try {
    const newRecord = await REGISTRO_PERSONAS.create(req.body);
    res.status(201).json(newRecord);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.update = async (req, res) => {
  try {
    const [updated] = await REGISTRO_PERSONAS.update(req.body, { where: { id: req.params.id } });
    if (updated) {
      const updatedRecord = await REGISTRO_PERSONAS.findByPk(req.params.id);
      res.json(updatedRecord);
    } else {
      res.status(404).json({ error: 'No encontrado' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.delete = async (req, res) => {
  try {
    const deleted = await REGISTRO_PERSONAS.destroy({ where: { id: req.params.id } });
    if (deleted) res.json({ message: 'Eliminado correctamente' });
    else res.status(404).json({ error: 'No encontrado' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/*--------------------------------------------------- Inscripción de persona a un evento
exports.inscribirPersona = async (req, res) => {
  const { idEvento, cedula } = req.body;

  try {
    // 1. Obtener detalles del evento (ID_DET, CUP_DET) desde DETALLE_EVENTOS con idEvento
    const detalleEvento = await sequelize.query(
      `SELECT ID_DET, CUP_DET, ID_EVT FROM DETALLE_EVENTOS WHERE ID_EVT = :idEvento`,
      {
        replacements: { idEvento },
        type: Sequelize.QueryTypes.SELECT,
      }
    );

    if (!detalleEvento.length) {
      return res.status(404).json({ error: 'Evento no encontrado' });
    }

    // 2. Verificar si la persona es estudiante y obtener su nivel
    const estudiante = await sequelize.query(
      `SELECT ID_NIV FROM ESTUDIANTES WHERE CED_EST = :cedula`,
      {
        replacements: { cedula },
        type: Sequelize.QueryTypes.SELECT,
      }
    );
    const esEstudiante = estudiante.length > 0;
    const idNivel = esEstudiante ? estudiante[0].ID_NIV : null;

    // 3. Obtener modo del evento (PUBLICO/PRIVADO)
    const evento = await sequelize.query(
      `SELECT MOD_EVT FROM EVENTOS WHERE ID_EVT = :idEvento`,
      {
        replacements: { idEvento },
        type: Sequelize.QueryTypes.SELECT,
      }
    );
    if (!evento.length) {
      return res.status(404).json({ error: 'Evento no encontrado' });
    }
    const modoEvento = evento[0].MOD_EVT;

    // 4. Reglas de inscripción según tipo de persona y evento
    let registroEvento = null;
    if (esEstudiante) {
      if (modoEvento == 'PRIVADO') {
        registroEvento = await sequelize.query(
        `SELECT ID_REG_EVT, ID_DET FROM REGISTRO_EVENTO WHERE ID_DET IN (:idsDet) AND ID_NIV = :idNivel OR ID_NIV IS NULL`,
        {
          replacements: { idsDet: detalleEvento.map(d => d.ID_DET), idNivel },
          type: Sequelize.QueryTypes.SELECT,
        }
      );
      }else{
        registroEvento = await sequelize.query(
        `SELECT ID_REG_EVT, ID_DET FROM REGISTRO_EVENTO WHERE ID_DET IN (:idsDet) AND ID_NIV IS NULL`,
        {
          replacements: { idsDet: detalleEvento.map(d => d.ID_DET) },
          type: Sequelize.QueryTypes.SELECT,
        }
      );

      }
      // Buscar REGISTRO_EVENTO con ese ID_NIV
      
    } else {
      if (modoEvento !== 'PUBLICO') {
        return res.status(400).json({ error: 'Solo estudiantes pueden inscribirse en eventos privados' });
      }
      // Buscar REGISTRO_EVENTO con ID_NIV = NULL
      registroEvento = await sequelize.query(
        `SELECT ID_REG_EVT, ID_DET FROM REGISTRO_EVENTO WHERE ID_DET IN (:idsDet) AND ID_NIV IS NULL`,
        {
          replacements: { idsDet: detalleEvento.map(d => d.ID_DET) },
          type: Sequelize.QueryTypes.SELECT,
        }
      );
    }

    if (!registroEvento.length) {
      return res.status(400).json({ error: 'No disponible para inscripción' });
    }

    // 5. Verificar cupos desde REGISTRO_PERSONA para ese ID_REG_EVT contra CUP_DET de DETALLE_EVENTOS
    const idRegEvt = registroEvento[0].ID_REG_EVT;
    const idDet = registroEvento[0].ID_DET;
    const cupoDet = detalleEvento.find(d => d.ID_DET === idDet).CUP_DET;

    const totalInscritos = await sequelize.query(
      `SELECT COUNT(*) as total FROM REGISTRO_PERSONAS WHERE ID_REG_EVT = :idRegEvt`,
      {
        replacements: { idRegEvt },
        type: Sequelize.QueryTypes.SELECT,
      }
    );
    if (cupoDet !== null && totalInscritos[0].total >= cupoDet) {
      return res.status(400).json({ error: 'No hay cupos disponibles' });
    }

    // 6. Obtener tarifa desde TARIFAS_EVENTO si existe
    const tarifa = await sequelize.query(
      `SELECT ID_TAR FROM TARIFAS_EVENTO WHERE ID_EVT = :idEvento ORDER BY VAL_EVT ASC LIMIT 1`,
      {
        replacements: { idEvento },
        type: Sequelize.QueryTypes.SELECT,
      }
    );
    const idTarifa = tarifa.length ? tarifa[0].ID_TAR : null;

    // 7. Buscar el último NUM_REG_PER y sumar 1
    const ultimoNum = await sequelize.query(
      `SELECT MAX(NUM_REG_PER) as maxNum FROM REGISTRO_PERSONAS`,
      {
        type: Sequelize.QueryTypes.SELECT,
      }
    );
    const nuevoNum = (ultimoNum[0].maxNum || 0) + 1;

    // 8. Insertar en REGISTRO_PERSONAS
    await sequelize.query(
      `INSERT INTO REGISTRO_PERSONAS (NUM_REG_PER, CED_PER, ID_REG_EVT, ID_TAR_PER, FEC_REG_PER)
       VALUES (:numReg, :cedula, :idRegEvt, :idTarifa, CURRENT_DATE)`,
      {
        replacements: {
          numReg: nuevoNum,
          cedula,
          idRegEvt,
          idTarifa,
        },
        type: Sequelize.QueryTypes.INSERT,
      }
    );

    res.json({ message: 'Inscripción realizada con éxito', numReg: nuevoNum });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};
*/

const storagePagos = multer.diskStorage({
  destination: (req, file, cb) => {
    fs.mkdirSync(uploadPath, { recursive: true });
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});
const uploadPago = multer({ storage: storagePagos }).single('FOT_PAG');

exports.inscribirPersona = (req, res) => {
  uploadPago(req, res, async (err) => {
    if (err instanceof multer.MulterError || err) {
      return res.status(400).json({ error: err.message });
    }

    const { idEvento, cedula } = req.body;

    try {
      // 1. Obtener detalles del evento
      const detalleEvento = await sequelize.query(
        `SELECT ID_DET, CUP_DET, ID_EVT FROM DETALLE_EVENTOS WHERE ID_EVT = :idEvento`,
        { replacements: { idEvento }, type: Sequelize.QueryTypes.SELECT }
      );
      if (!detalleEvento.length) return res.status(404).json({ error: 'Evento no encontrado' });

      // 2. Verificar si la persona es estudiante y obtener su nivel
      const estudiante = await sequelize.query(
        `SELECT ID_NIV, ESTADO FROM ESTUDIANTES WHERE CED_EST = :cedula`,
        { replacements: { cedula }, type: Sequelize.QueryTypes.SELECT }
      );
      const esEstudiante = estudiante.length > 0;
      const idNivel = esEstudiante ? estudiante[0].ID_NIV : null;
      const estadoEstudiante = esEstudiante ? estudiante[0].ESTADO : null;

      // 3. Verificar si es autoridad
      const autoridad = await sequelize.query(
        `SELECT ESTADO FROM AUTORIDADES WHERE CED_PER = :cedula`,
        { replacements: { cedula }, type: Sequelize.QueryTypes.SELECT }
      );
      const esAutoridad = autoridad.length > 0;
      const estadoAutoridad = esAutoridad ? autoridad[0].ESTADO : null;

      // 4. Verificar si es persona (tabla PERSONAS)
      const persona = await sequelize.query(
        `SELECT EST_PER FROM PERSONAS WHERE CED_PER = :cedula`,
        { replacements: { cedula }, type: Sequelize.QueryTypes.SELECT }
      );
      const esPersona = persona.length > 0;
      const estadoPersona = esPersona ? persona[0].EST_PER : null;

      // 5. Obtener modo y tipo del evento
      const evento = await sequelize.query(
        `SELECT MOD_EVT, TIP_EVT FROM EVENTOS WHERE ID_EVT = :idEvento`,
        { replacements: { idEvento }, type: Sequelize.QueryTypes.SELECT }
      );
      if (!evento.length) return res.status(404).json({ error: 'Evento no encontrado' });
      const modoEvento = evento[0].MOD_EVT;
      const tipoEvento = evento[0].TIP_EVT;

      // 6. Verificar estado según rol y modo de evento
      if (modoEvento === 'PRIVADO') {
        if (esEstudiante && estadoEstudiante !== 'VERIFICADO') {
          return res.status(400).json({ error: 'Estudiante no verificado' });
        }
        if (esAutoridad && estadoAutoridad !== 'VERIFICADO') {
          return res.status(400).json({ error: 'Autoridad no verificada' });
        }
        if (esPersona && estadoPersona !== 'VERIFICADO') {
          return res.status(400).json({ error: 'Persona no verificada' });
        }
        if (!esEstudiante && !esAutoridad && !esPersona) {
          return res.status(400).json({ error: 'Usuario no registrado' });
        }
      } else {
        // Evento público: solo estudiantes y autoridades deben estar verificados si existen
        if (esEstudiante && estadoEstudiante !== 'VERIFICADO') {
          return res.status(400).json({ error: 'Estudiante no verificado' });
        }
        if (esAutoridad && estadoAutoridad !== 'VERIFICADO') {
          return res.status(400).json({ error: 'Autoridad no verificada' });
        }
      }

      // 7. Buscar registro_evento según reglas anteriores (igual que tu lógica actual)
      let registroEvento = null;
      if (esEstudiante) {
        if (modoEvento == 'PRIVADO') {
          registroEvento = await sequelize.query(
            `SELECT ID_REG_EVT, ID_DET FROM REGISTRO_EVENTO WHERE ID_DET IN (:idsDet) AND (ID_NIV = :idNivel OR ID_NIV IS NULL)`,
            { replacements: { idsDet: detalleEvento.map(d => d.ID_DET), idNivel }, type: Sequelize.QueryTypes.SELECT }
          );
        } else {
          registroEvento = await sequelize.query(
            `SELECT ID_REG_EVT, ID_DET FROM REGISTRO_EVENTO WHERE ID_DET IN (:idsDet) AND ID_NIV IS NULL`,
            { replacements: { idsDet: detalleEvento.map(d => d.ID_DET) }, type: Sequelize.QueryTypes.SELECT }
          );
        }
      } else {
        if (modoEvento !== 'PUBLICO') {
          return res.status(400).json({ error: 'Solo estudiantes pueden inscribirse en eventos privados' });
        }
        registroEvento = await sequelize.query(
          `SELECT ID_REG_EVT, ID_DET FROM REGISTRO_EVENTO WHERE ID_DET IN (:idsDet) AND ID_NIV IS NULL`,
          { replacements: { idsDet: detalleEvento.map(d => d.ID_DET) }, type: Sequelize.QueryTypes.SELECT }
        );
      }

      if (!registroEvento.length) {
        return res.status(400).json({ error: 'No disponible para inscripción' });
      }

      // 8. Verificar cupos
      const idRegEvt = registroEvento[0].ID_REG_EVT;
      const idDet = registroEvento[0].ID_DET;
      const cupoDet = detalleEvento.find(d => d.ID_DET === idDet).CUP_DET;
      const totalInscritos = await sequelize.query(
        `SELECT COUNT(*) as total FROM REGISTRO_PERSONAS WHERE ID_REG_EVT = :idRegEvt`,
        { replacements: { idRegEvt }, type: Sequelize.QueryTypes.SELECT }
      );
      if (cupoDet !== null && totalInscritos[0].total >= cupoDet) {
        return res.status(400).json({ error: 'No hay cupos disponibles' });
      }

      // 9. Obtener tarifa desde TARIFAS_EVENTO si existe
      const tarifa = await sequelize.query(
        `SELECT ID_TAR FROM TARIFAS_EVENTO WHERE ID_EVT = :idEvento ORDER BY VAL_EVT ASC LIMIT 1`,
        { replacements: { idEvento }, type: Sequelize.QueryTypes.SELECT }
      );
      const idTarifa = tarifa.length ? tarifa[0].ID_TAR : null;

      // 10. Buscar el último NUM_REG_PER y sumar 1
      const ultimoNum = await sequelize.query(
        `SELECT MAX(NUM_REG_PER) as maxNum FROM REGISTRO_PERSONAS`,
        { type: Sequelize.QueryTypes.SELECT }
      );
      const nuevoNum = (ultimoNum[0].maxNum || 0) + 1;

      // 11. Insertar en REGISTRO_PERSONAS
      await sequelize.query(
        `INSERT INTO REGISTRO_PERSONAS (NUM_REG_PER, CED_PER, ID_REG_EVT, ID_TAR_PER, FEC_REG_PER)
         VALUES (:numReg, :cedula, :idRegEvt, :idTarifa, CURRENT_DATE)`,
        {
          replacements: {
            numReg: nuevoNum,
            cedula,
            idRegEvt,
            idTarifa,
          },
          type: Sequelize.QueryTypes.INSERT,
        }
      );

      // 12. Si el evento es de pago, guardar el pago y la foto
      if (tipoEvento === 'DE PAGO') {
        if (!req.file) {
          return res.status(400).json({ error: 'Debe adjuntar comprobante de pago' });
        }
        const imagenPath = path.join('uploads', 'pagos', req.file.filename).replace(/\\/g, '/');
        await sequelize.query(
          `INSERT INTO PAGOS (ID_EVT, NUM_REG_PER, FOT_PAG) VALUES (:idEvento, :numReg, :fotPag)`,
          {
            replacements: {
              idEvento,
              numReg: nuevoNum,
              fotPag: imagenPath
            },
            type: Sequelize.QueryTypes.INSERT
          }
        );
      }

      res.json({ message: 'Inscripción realizada con éxito', numReg: nuevoNum });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: error.message });
    }
  });
};