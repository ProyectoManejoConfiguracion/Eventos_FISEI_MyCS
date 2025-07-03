import React from 'react';
import '../Styles/Certificado.css';

import logoUniversidad from '../assets/logo_universidad.png';
import logoFacultad    from '../assets/logo_facultad.png';
import firmaChair      from '../assets/firma_chair.png';
import firmaCommittee  from '../assets/firma_comite.png';
import sponsorSpringer from '../assets/sponsor_springer.png';
import sponsorScopus   from '../assets/sponsor_scopus.png';
import sponsorRedcedia from '../assets/sponsor_redcedia.png';
import sponsorDide     from '../assets/sponsor_dide.jpg';
import sidebarCurvas   from '../assets/sidebar.png';

const Certificado = ({
  participante    = 'NOMBRE DEL PARTICIPANTE',
  tituloEvento    = 'TÍTULO DEL EVENTO / CURSO',
  horasEvento     = '00',
  locacion        = 'Ciudad, País',
  fechaInicio     = 'Fecha Inicio',
  fechaFin        = 'Fecha Fin',
  tipoCurso       = '',
  descripcion     = '',
  carrera         = '',
  area             = '',
  chair           = {
    name: 'Ing. Nombre Chair',
    title: 'Cargo del Chair',
    signatureSrc: firmaChair,
  },
  committee       = {
    name: 'MSc. Nombre Comite',
    title: 'Cargo del Comite',
    signatureSrc: firmaCommittee,
  },
  sponsors = [sponsorSpringer, sponsorScopus, sponsorRedcedia, sponsorDide],
}) => {
  return (
    <div className="certificate-container">
      {/* Sidebar a la izquierda */}
      <div
        className="certificate-sidebar"
        style={{
          backgroundImage: `url(${sidebarCurvas})`,
          backgroundRepeat:   'no-repeat',
          backgroundPosition: 'center top',
          backgroundSize:     'cover',
          width:              '300px',
          position:           'absolute',
          left:               0,
          top:                0,
          bottom:             0,
        }}
      />

      {/* Header con logos y texto */}
      <div className="certificate-header">
        <img src={logoUniversidad} alt="Logo Universidad" className="logo-universidad"/>
        <div className="header-textos">
          <h2>UNIVERSIDAD TÉCNICA DE AMBATO</h2>
          <p>FACULTAD DE INGENIERÍA EN SISTEMAS, ELECTRÓNICA E INDUSTRIAL</p>
        </div>
        <img src={logoFacultad} alt="Logo Facultad" className="logo-facultad"/>
      </div>

      {/* Título central del certificado */}
      <div className="certificate-title">
        <h1>CERTIFICADO DE APROBACIÓN DE CURSO</h1>
      </div>

      {/* Sección “PARA: [Participante]” */}
      <div className="certificate-to">
        <span>PARA:</span>
        <h2>{participante}</h2>
      </div>

      {/* Texto del cuerpo */}
      <div className="certificate-body">
        <p>
          Por haber aprobado y asistido al <strong>{tipoCurso}</strong> <strong>“{tituloEvento}”</strong> ({horasEvento} horas),<br />
          realizado en {locacion}, desde el {fechaInicio} hasta el {fechaFin}.
        </p>
        <p>
          <strong>Descripción:</strong> {descripcion}
        </p>
        <p>
          <strong>Área:</strong> {area}
        </p>
      </div>

      {/* Bloque de firmas */}
      <div className="certificate-signatures">
        <div className="signature-block">
          <img
            src={chair.signatureSrc}
            alt={`Firma de ${chair.name}`}
            className="signature-image"
          />
          <p className="signature-name">{chair.name}</p>
          <p className="signature-title">{chair.title}</p>
        </div>
        <div className="signature-block">
          <img
            src={committee.signatureSrc}
            alt={`Firma de ${committee.name}`}
            className="signature-image"
          />
          <p className="signature-name">{committee.name}</p>
          <p className="signature-title">{committee.title}</p>
        </div>
      </div>

      {/* Logos de sponsors */}
      <div className="certificate-sponsors">
        {sponsors.map((src, idx) => (
          <img
            key={idx}
            src={src}
            alt={`Sponsor ${idx}`}
            className="sponsor-logo"
          />
        ))}
      </div>
    </div>
  );
};

export default Certificado;
