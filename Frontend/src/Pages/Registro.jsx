import React from "react";
import { useState } from "react";
import "../Styles/Registro.css";

const Registro = () => {
    return (
        <div className="Contenedor">
        <h1>Registro</h1>
        <section>
            Imagen
        </section>
        <section>
        <form className="formulario" action="/api/registro" method="POST"> 
            <div>
            <label htmlFor="username">Nombre de usuario:</label>
            <input type="text" id="username" name="username" required />
            </div>
            <div>
            <label htmlFor="email">Correo electrónico:</label>
            <input type="email" id="email" name="email" required />
            </div>
            <div>
            <label htmlFor="password">Contraseña:</label>
            <input type="password" id="password" name="password" required />
            </div>
            <button type="submit">Registrarse</button>
        </form>
        </section>
        </div>
    )
    }

    export default Registro;