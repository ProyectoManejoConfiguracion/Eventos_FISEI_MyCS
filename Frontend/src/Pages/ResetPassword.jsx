import React, { useState } from "react";
import Swal from "sweetalert2";
import { useSearchParams, useNavigate } from "react-router-dom";
import { BACK_URL } from "../../config";

import "../Styles/reset.css";

export default function ResetPassword() {
    const [searchParams] = useSearchParams();
    const token = searchParams.get("token");
    const [password, setPassword] = useState("");
    const [password2, setPassword2] = useState("");
    const navigate = useNavigate();

    const handleReset = async () => {
        if (password.length < 6) {
            Swal.fire("Error", "La contraseña debe tener al menos 6 caracteres.", "error");
            return;
        }
        if (password !== password2) {
            Swal.fire("Error", "Las contraseñas no coinciden.", "error");
            return;
        }
        try {
            const res = await fetch(`${BACK_URL}/api/auth/reset-password`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ token, newPassword: password }),
            });
            if (res.ok) {
                Swal.fire("Listo", "Tu contraseña ha sido restablecida.", "success");
                navigate("/");
            } else {
                const err = await res.json();
                console.log(err); // Agrega esto para debug
                Swal.fire("Error", err.message || err.error || "No se pudo restablecer la contraseña.", "error");
            }
        } catch (error) {
            Swal.fire("Error", "Error en el servidor.", "error");
        }
    };

    if (!token) {
        return <div>Token inválido o expirado.</div>;
    }

    return (
        <div className="reset-flex-wrapper">
            <div className="reset-container">
                <h2>Restablecer Contraseña</h2>
                <input
                    type="password"
                    placeholder="Nueva contraseña"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                />
                <input
                    type="password"
                    placeholder="Repite la nueva contraseña"
                    value={password2}
                    onChange={e => setPassword2(e.target.value)}
                />
                <button onClick={handleReset} disabled={!password || !password2}>
                    Cambiar contraseña
                </button>
            </div>

        </div>
    );
}
