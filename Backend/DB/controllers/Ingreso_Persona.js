
const nuevaPersona = async (req, res) => {
    const { idPersona, nombre, apellido, telefono } = req.body;
$query = `INSERT INTO PERSONAS (ID_PER, NOM_PER,APE_PER, TEL_PER)
VALUES ('$idPersona', '$nombre', '$apellido', '$telefono')`;

if($conexion->query($query) === TRUE){
    "Persona registrada correctamente";
} else {
    
}

}