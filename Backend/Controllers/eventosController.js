const {
  sequelize,
  EVENTOS,
  DETALLE_EVENTOS,
  TARIFAS_EVENTO,
  REGISTRO_EVENTO,
} = require("../models");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const uploadPath = path.join("C:", "uploads", "eventos");

const storageEventos = multer.diskStorage({
  destination: (req, file, cb) => {
    fs.mkdirSync(uploadPath, { recursive: true });
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const uploadEvento = multer({
  storage: storageEventos,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|gif/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(
      path.extname(file.originalname).toLowerCase()
    );
    if (mimetype && extname) cb(null, true);
    else cb(new Error("Solo se permiten imágenes (JPEG, JPG, PNG, GIF)"));
  },
}).single("FOT_EVT");

exports.create = async (req, res) => {
  uploadEvento(req, res, async (err) => {
    if (err instanceof multer.MulterError || err) {
      return res.status(400).json({ error: err.message });
    }

    try {
      const lastEvento = await EVENTOS.findOne({
        order: [["ID_EVT", "DESC"]],
      });

      let newId;
      if (lastEvento) {
        const lastNumber = parseInt(lastEvento.ID_EVT.replace("EV", ""), 10);
        const nextNumber = lastNumber + 1;
        newId = `EV${nextNumber.toString().padStart(3, "0")}`;
      } else {
        newId = "EV001";
      }

      const {
        NOM_EVT,
        FEC_EVT,
        FEC_FIN,
        LUG_EVT,
        TIP_EVT,
        MOD_EVT,
        DES_EVT,
        SUB_EVT,
        CAR_MOT,
      } = req.body;

      const imagenPath = req.file
        ? path.join("uploads", "eventos", req.file.filename).replace(/\\/g, "/")
        : null;

      if (!imagenPath) {
        return res
          .status(400)
          .json({ error: "No se subió ninguna imagen válida." });
      }

      const newEvento = await EVENTOS.create({
        ID_EVT: newId,
        NOM_EVT,
        FEC_EVT,
        FEC_FIN,
        LUG_EVT,
        TIP_EVT,
        MOD_EVT,
        FOT_EVT: imagenPath,
        DES_EVT,
        SUB_EVT,
        CAR_MOT,
      });

      res.status(201).json(newEvento);
    } catch (error) {
      console.error("Error al crear evento:", error);
      res.status(500).json({ error: error.message });
    }
  });
};

exports.getAll = async (req, res) => {
  try {
    const data = await EVENTOS.findAll();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getOne = async (req, res) => {
  try {
    const data = await EVENTOS.findByPk(req.params.id);
    if (data) res.json(data);
    else res.status(404).json({ error: "No encontrado" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.editarEventoCompleto = (req, res) => {
  uploadEvento(req, res, async (err) => {
    if (err instanceof multer.MulterError || err) {
      return res.status(400).json({ error: err.message });
    }

    const t = await sequelize.transaction();
    try {
      // Si el frontend manda los datos como multipart/form-data, los objetos llegan como strings JSON
      const evento = JSON.parse(req.body.evento);
      const detalle = JSON.parse(req.body.detalle);
      const tarifas = JSON.parse(req.body.tarifas);
      const registros = JSON.parse(req.body.registros);

      // Si hay nueva imagen, actualiza el path
      if (req.file) {
        evento.FOT_EVT = path
          .join("uploads", "eventos", req.file.filename)
          .replace(/\\/g, "/");
      }

      // 1. Actualizar evento principal
      await EVENTOS.update(evento, {
        where: { ID_EVT: evento.ID_EVT },
        transaction: t,
      });

      // 2. Actualizar detalle (siempre uno)
      await DETALLE_EVENTOS.update(detalle, {
        where: { ID_DET: detalle.ID_DET },
        transaction: t,
      });

      // 3. Tarifas: elimina todas las tarifas del evento y vuelve a insertar las que vengan
      await TARIFAS_EVENTO.destroy({
        where: { ID_EVT: evento.ID_EVT },
        transaction: t,
      });
      if (Array.isArray(tarifas) && tarifas.length > 0) {
        await TARIFAS_EVENTO.bulkCreate(tarifas, { transaction: t });
      }

      // 4. Registros de niveles: elimina todos los registros del detalle y vuelve a insertar los que vengan
      await REGISTRO_EVENTO.destroy({
        where: { ID_DET: detalle.ID_DET },
        transaction: t,
      });

      if (Array.isArray(registros) && registros.length > 0) {
        // Obtener el último ID_REG_EVT para continuar la numeración
        const lastRegistro = await REGISTRO_EVENTO.findOne({
          order: [["ID_REG_EVT", "DESC"]],
        });

        let nextRegNum = 1;
        if (lastRegistro) {
          const lastRegNumber = parseInt(
            lastRegistro.ID_REG_EVT.replace("REG", ""),
            10
          );
          nextRegNum = lastRegNumber + 1;
        }

        const generarIdReg = () => {
          const id = `REG${nextRegNum.toString().padStart(3, "0")}`;
          nextRegNum++;
          return id;
        };

        // Asignar ID_REG_EVT si no viene
        const registrosConId = registros.map((reg) => ({
          ...reg,
          ID_REG_EVT: reg.ID_REG_EVT ? reg.ID_REG_EVT : generarIdReg(),
        }));

        await REGISTRO_EVENTO.bulkCreate(registrosConId, { transaction: t });
      }

      await t.commit();
      res.json({ message: "Evento y relaciones actualizados correctamente" });
    } catch (error) {
      await t.rollback();
      res.status(500).json({ error: error.message });
    }
  });
};

exports.delete = async (req, res) => {
  try {
    const deleted = await EVENTOS.destroy({ where: { id: req.params.id } });
    if (deleted) res.json({ message: "Eliminado correctamente" });
    else res.status(404).json({ error: "No encontrado" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.cambiarVisibilidad = async (req, res) => {
  try {
    const { EST_VIS } = req.body;
    const [updated] = await EVENTOS.update(
      { EST_VIS },
      { where: { ID_EVT: req.params.id } }
    );
    if (updated) {
      res.json({ message: `Estado de visibilidad actualizado a "${EST_VIS}"` });
    } else {
      res.status(404).json({ error: "No encontrado" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getEventosPagoConTarifas = async (req, res) => {
  try {
    const eventos = await EVENTOS.findAll({
      where: { TIP_EVT: "DE PAGO" },
    });

    const resultados = await Promise.all(
      eventos.map(async (evento) => {
        const tarifas = await TARIFAS_EVENTO.findAll({
          where: { ID_EVT: evento.ID_EVT },
        });

        const tarifaEstudiante = tarifas.find(
          (t) => t.TIP_PAR === "ESTUDIANTE"
        );
        const tarifaPersona = tarifas.find((t) => t.TIP_PAR === "PERSONA");

        let tarifasFormateadas = {};

        if (evento.MOD_EVT === "PRIVADO") {
          tarifasFormateadas = {
            Estudiante: tarifaEstudiante ? tarifaEstudiante.VAL_EVT : "",
            Persona: "N/A",
          };
        } else {
          tarifasFormateadas = {
            Estudiante: tarifaEstudiante ? tarifaEstudiante.VAL_EVT : "",
            Persona: tarifaPersona ? tarifaPersona.VAL_EVT : "",
          };
        }

        return {
          ID_EVT: evento.ID_EVT,
          NOM_EVT: evento.NOM_EVT,
          TIP_EVT: evento.TIP_EVT,
          FEC_EVT: evento.FEC_EVT,
          MOD_EVT: evento.MOD_EVT,
          FOT_EVT: evento.FOT_EVT,
          ACCESO_EVT: evento.ACCESO_EVT,
          tarifas: tarifasFormateadas,
        };
      })
    );

    return res.json(resultados);
  } catch (error) {
    console.error("Error al obtener eventos de pago con tarifas:", error);
    return res.status(500).json({ error: "Error del servidor" });
  }
};

exports.asignarOActualizarTarifa = async (req, res) => {
  try {
    const { ID_EVT, TIP_PAR, VAL_EVT } = req.body;

    if (!ID_EVT || !TIP_PAR || VAL_EVT === undefined) {
      return res.status(400).json({ error: "Datos incompletos." });
    }

    const [tarifa, created] = await TARIFAS_EVENTO.findOrCreate({
      where: { ID_EVT, TIP_PAR },
      defaults: { VAL_EVT },
    });

    if (!created) {
      // Ya existe → actualizar
      tarifa.VAL_EVT = VAL_EVT;
      await tarifa.save();
    }

    return res.json({
      mensaje: created
        ? "Tarifa creada correctamente."
        : "Tarifa actualizada correctamente.",
      tarifa,
    });
  } catch (error) {
    console.error("Error al asignar o actualizar tarifa:", error);
    return res.status(500).json({ error: "Error del servidor" });
  }
};
