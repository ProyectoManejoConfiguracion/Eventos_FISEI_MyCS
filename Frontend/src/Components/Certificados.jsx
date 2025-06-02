import React from 'react';
import '../Styles/Certificado.css';

import logoUniversidad from '../assets/logo_universidad.png';
import logoFacultad from '../assets/logo_facultad.png';
import firmaChair from '../assets/firma_chair.png';
import firmaCommittee from '../assets/firma_comite.png';
import sponsorSpringer from '../assets/sponsor_springer.png';
import sponsorScopus from '../assets/sponsor_scopus.png';
import sponsorRedcedia from '../assets/sponsor_redcedia.png';
import sponsorDide from '../assets/sponsor_dide.jpg';

import sidebarCurvas from '../assets/sidebar.png';

const Certificado = ({
  participante = 'NOMBRE DEL PARTICIPANTE',
  tituloEvento = 'TÍTULO DEL EVENTO / CURSO',
  horasEvento = '00',
  locacion = 'Ciudad, País',
  fechaInicio = 'Fecha Inicio',
  fechaFin = 'Fecha Fin',
  chair = {
    name: 'Ing. Nombre Chair',
    title: 'Cargo del Chair',
    signatureSrc: firmaChair,
  },
  committee = {
    name: 'MSc. Nombre Comite',
    title: 'Cargo del Comite',
    signatureSrc: firmaCommittee,
  },
  sponsors = [sponsorSpringer, sponsorScopus, sponsorRedcedia, sponsorDide],
}) => {
  return (
    <div className="certificate-container">
      <div
        className="certificate-sidebar"
        style={{
          backgroundImage: `url(${sidebarCurvas})`,
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center top',
          backgroundSize: 'cover',
          width: '300px',
          position: 'absolute',
          left: 0,
          top: 0,
          bottom: 0,
        }}
      />
      <div className="certificate-header">
        <img
          src={logoUniversidad}
          alt="Logo Universidad"
          className="logo-universidad"
        />
        <div className="header-textos">
          <h2>UNIVERSIDAD TÉCNICA DE AMBATO</h2>
          <p>FACULTAD DE INGENIERÍA EN SISTEMAS, ELECTRÓNICA E INDUSTRIAL</p>
        </div>
        <img
          src={logoFacultad}
          alt="Logo Facultad"
          className="logo-facultad"
        />
      </div>

      <div className="certificate-title">
        <h1>CERTIFICATE OF COURSE COMPLETION</h1>
      </div>

      <div className="certificate-to">
        <span>TO:</span>
        <h2>{participante}</h2>
      </div>

      <div className="certificate-body">
        <p>
          For this course approval and attendance “
          <strong>{tituloEvento}</strong>” ({horasEvento} hours) which was held in{' '}
          {locacion}, from {fechaInicio} to {fechaFin}.
        </p>
      </div>

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

      <div className="certificate-sponsors">
        {sponsors.map((src, idx) => (
          <img key={idx} src={src} alt={`Sponsor ${idx}`} className="sponsor-logo" />
        ))}
      </div>
    </div>
  );
};

export default Certificado;
