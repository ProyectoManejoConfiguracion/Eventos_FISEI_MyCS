import connection from "../DB/connection.js";

export const getWebContent = async (req, res) => {
  try {
    const [results] = await connection.promise().query('SELECT * FROM CONTENIDO_WEB WHERE ID = 1');
    
    if (results.length === 0) {
      return res.status(404).json({ message: 'No se encontró contenido web' });
    }
    
    res.status(200).json(results[0]);
  } catch (error) {
    console.error('Error al obtener el contenido web:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

export const updateContent = async (req, res) => {
  const { id } = req.params;
  const contentData = req.body;

  try {
    const [checkResults] = await connection.promise().query(
      'SELECT ID FROM CONTENIDO_WEB WHERE ID = ?', 
      [id]
    );
    
    if (checkResults.length === 0) {
      return res.status(404).json({ message: 'Registro no encontrado' });
    }

    const [result] = await connection.promise().query(
      'UPDATE CONTENIDO_WEB SET ? WHERE ID = ?',
      [contentData, id]
    );

    res.status(200).json({ 
      message: 'Registro actualizado exitosamente',
      updatedId: id 
    });
  } catch (error) {
    console.error('Error al actualizar el contenido web:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};