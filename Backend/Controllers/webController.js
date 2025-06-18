const { CONTENIDO_WEB } = require('../models');

exports.getWebContent = async (req, res) => {
  try {
    const content = await CONTENIDO_WEB.findByPk(1);
    if (!content) return res.status(404).json({ message: 'No se encontró contenido web' });
    res.status(200).json(content);
  } catch (error) {
    console.error('Error al obtener el contenido web:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

exports.updateContent = async (req, res) => {
  const { id } = req.params;
  const contentData = req.body;

  try {
    const content = await CONTENIDO_WEB.findByPk(id);
    if (!content) return res.status(404).json({ message: 'Registro no encontrado' });
    await content.update(contentData);
    res.status(200).json({ message: 'Registro actualizado exitosamente', updatedId: id });
  } catch (error) {
    console.error('Error al actualizar el contenido web:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};