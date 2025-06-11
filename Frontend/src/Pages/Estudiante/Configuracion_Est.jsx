import React, { useState, useEffect } from "react";
import {
  FaUserCircle, FaUser, FaEnvelope, FaPhone, FaPen, FaSave, FaTimes, FaUpload
} from "react-icons/fa";
import "../../Styles/Configuracion_Est.css";
import { useAuth } from "../../auth/AuthContext";
import axios from "axios";
import Swal from "sweetalert2";

const Configuracion_Est = () => {
  const { user, refreshUser } = useAuth();
  const [editingProfile, setEditingProfile] = useState(false);
  const [error, setError] = useState("");
  const [imagenPreview, setImagenPreview] = useState("");

  const [profileData, setProfileData] = useState({
    nombres: "",
    apellidos: "",
    email: "",
    telefono: "",
    contra: "",
    foto: "",
    fotoOriginal: "",
  });

  useEffect(() => {
    if (!user?.id) return;

    fetch(`https://eventos-fisei-mycs.onrender.com/api/personas/${user?.id}`)
      .then(res => res.json())
      .then(data => {
        const fotoUrl = data.FOT_PER
          ? `https://eventos-fisei-mycs.onrender.com/${data.FOT_PER.replace(/\\/g, "/")}`
          : "";
        setProfileData({
          nombres: data.NOM_PER || "",
          apellidos: data.APE_PER || "",
          email: data.COR_PER || "",
          contra: data.CON_PER || "",
          telefono: data.TEL_PER ? data.TEL_PER.toString() : "",
          foto: fotoUrl,
          fotoOriginal: data.FOT_PER || "",
        });
        setImagenPreview(""); 
      });
  }, [user?.id]);


  const handleProfileSave = async () => {
    
    let fotoRuta = profileData.fotoOriginal;
    if (fotoRuta.startsWith("http")) {
      const partes = fotoRuta.split("/uploads/");
      if (partes.length > 1) fotoRuta = "uploads/" + partes[1];
    }

    const data = {
      NOM_PER: profileData.nombres,
      APE_PER: profileData.apellidos,
      COR_PER: profileData.email,
      TEL_PER: profileData.telefono,
      CON_PER: profileData.contra,
      FOT_PER: fotoRuta, 
    };

    try {
      const res = await axios.put(
        `https://eventos-fisei-mycs.onrender.com/api/personas/${user?.id}`,
        data
      );

      if (res.status === 200) {
        const updated = res.data;
         Swal.fire({
                title: "Perfil actualizado con éxito",
                icon: "success",
                draggable: true,
              });
     
        setEditingProfile(false);
        setProfileData((prev) => ({
          ...prev,
          fotoOriginal: updated.FOT_PER || prev.fotoOriginal,
          foto: updated.FOT_PER
            ? `https://eventos-fisei-mycs.onrender.com/${updated.FOT_PER.replace(/\\/g, "/")}`
            : prev.foto,
        }));
        await refreshUser();
      } else {
        Swal.fire({
                title: "Error",
                text: "Error al actualizar el perfil.",
                icon: "error",
                confirmButtonColor: "#d33",
              });
      }
    } catch (error) { 
      Swal.fire({
              title: "Error",
              text: error || "Ocurrió un error en la actualización.",
              icon: "error",
              confirmButtonColor: "#d33",
            });
      
          }
  };

  return (
    <div className="perfil-page-full">
      <div className="perfil-card">
        <h2 className="perfil-title">Configuración del Perfil</h2>

        <div className="perfil-avatar-section">
          <div className="perfil-avatar-wrapper">
            {profileData.foto ? (
              <img src={profileData.foto} alt="Perfil" className="perfil-avatar-img" />
            ) : (
              <FaUserCircle size={120} color="#cfd8dc" />
            )}
          </div>
          <p className="perfil-rol">Estudiante</p>
          {error && <p style={{ color: "red" }}>{error}</p>}
        </div>

        <div className="perfil-header">
          {!editingProfile ? (
            <button onClick={() => setEditingProfile(true)} className="perfil-editar-btn">
              <FaPen style={{ marginRight: 6 }} /> Editar
            </button>
          ) : (
            <div className="perfil-edit-actions">
              <button onClick={handleProfileSave} className="perfil-guardar-btn">
                <FaSave style={{ marginRight: 6 }} /> Guardar
              </button>
              <button onClick={() => setEditingProfile(false)} className="perfil-cancelar-btn">
                <FaTimes style={{ marginRight: 6 }} /> Cancelar
              </button>
            </div>
          )}
        </div>

        <div className="perfil-info-section">
          <div className="perfil-info-grid">
            <div>
              <label className="perfil-label">
                <FaUser className="perfil-icon" /> Nombres
              </label>
              {editingProfile ? (
                <input
                  type="text"
                  value={profileData.nombres}
                  onChange={(e) => setProfileData({ ...profileData, nombres: e.target.value })}
                  className="perfil-input"
                />
              ) : (
                <p className="perfil-info-value">{profileData.nombres}</p>
              )}
            </div>

            <div>
              <label className="perfil-label">
                <FaUser className="perfil-icon" /> Apellidos
              </label>
              {editingProfile ? (
                <input
                  type="text"
                  value={profileData.apellidos}
                  onChange={(e) => setProfileData({ ...profileData, apellidos: e.target.value })}
                  className="perfil-input"
                />
              ) : (
                <p className="perfil-info-value">{profileData.apellidos}</p>
              )}
            </div>

            <div>
              <label className="perfil-label">
                <FaEnvelope className="perfil-icon" /> Email
              </label>
              {editingProfile ? (
                <input
                  type="email"
                  value={profileData.email}
                  onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                  className="perfil-input"
                />
              ) : (
                <p className="perfil-info-value">{profileData.email}</p>
              )}
            </div>

            <div>
              <label className="perfil-label">
                <FaPhone className="perfil-icon" /> Teléfono
              </label>
              {editingProfile ? (
                <input
                  type="tel"
                  value={profileData.telefono}
                  onChange={(e) => setProfileData({ ...profileData, telefono: e.target.value })}
                  className="perfil-input"
                />
              ) : (
                <p className="perfil-info-value">{profileData.telefono}</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Configuracion_Est;