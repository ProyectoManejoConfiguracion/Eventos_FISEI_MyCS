
const nuevaPersona = async (req, res) => {
    const { idPersona, nombre, apellido, telefono } = req.body;
const query = `INSERT INTO PERSONAS (ID_PER, NOM_PER, APE_PER, TEL_PER)
VALUES ('${idPersona}', '${nombre}', '${apellido}', '${telefono}')`;

try {
    const result = await conexion.query(query);
    res.send("Persona registrada correctamente");
} catch (error) {
    res.status(500).send("Error al registrar persona");
}

}