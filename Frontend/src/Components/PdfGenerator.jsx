// src/components/PdfGenerator.jsx

import React, { useRef } from 'react';
import html2canvas from 'html2canvas';
import jsPDF       from 'jspdf';

// Importa el componente exactamente con su nombre de archivo:
import Certificado from './Certificados';

import firmaChair      from '../assets/firma_chair.png';
import firmaCommittee  from '../assets/firma_comite.png';
import sponsorSpringer from '../assets/sponsor_springer.png';
import sponsorScopus   from '../assets/sponsor_scopus.png';
import sponsorRedcedia from '../assets/sponsor_redcedia.png';
import sponsorDide     from '../assets/sponsor_dide.jpg';

const PdfGenerator = () => {
  const certificadoRef = useRef(null);

  const generatePdf = async () => {
  const element = certificadoRef.current;
  if (!element) return;

  try {
    // 1) html2canvas: renderizamos el <div> a un canvas de alta resolución
    const canvas = await html2canvas(element, {
      scale: 3,
      useCORS: true,
    });

    // 2) Convertimos ese canvas a una imagen PNG en base64
    const imgData = canvas.toDataURL('image/png');

    // 3) Creamos un PDF A4 horizontal (landscape) usando el preset 'a4'
    //    en milímetros (unit: 'mm').
    //    De esta forma, jsPDF sabe internamente que son 297 × 210 mm.
    const pdf = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: 'a4', // <–– aquí usamos el preset "a4" en lugar de [297, 210]
    });

    // 4) Añadimos la imagen estirada a TODO el A4 (0,0 → 297 × 210 mm)
    pdf.addImage(
      imgData,
      'PNG',
      /* x */ 0,
      /* y */ 0,
      /* ancho en mm */ 297,
      /* alto en mm */ 210
    );

    // 5) Abrimos el PDF en una pestaña nueva
    const blobUrl = pdf.output('bloburl');
    window.open(blobUrl);

    // Si prefieres descargar en lugar de abrir:
    // pdf.save('certificado.pdf');
  } catch (error) {
    console.error('Error al generar el PDF:', error);
  }
};


  return (
    <div style={{ textAlign: 'center', margin: '2rem 0' }}>
      <div ref={certificadoRef}>
        <Certificado
          participante="Juan Pérez"
          tituloEvento="Curso React"
          horasEvento="8"
          locacion="Ambato, Ecuador"
          fechaInicio="05 de Junio de 2025"
          fechaFin="06 de Junio de 2025"
          chair={{
            name: 'Ing. Laura Ruiz',
            title: 'Coordinadora',
            signatureSrc: firmaChair,
          }}
          committee={{
            name: 'MSc. Pedro Vélez',
            title: 'Director de Comité',
            signatureSrc: firmaCommittee,
          }}
          sponsors={[
            sponsorSpringer,
            sponsorScopus,
            sponsorRedcedia,
            sponsorDide,
          ]}
        />
      </div>
      <button
        onClick={generatePdf}
        style={{
          marginTop: '1.5rem',
          backgroundColor: '#822433',
          color: 'white',
          padding: '0.8rem 1.8rem',
          border: 'none',
          borderRadius: '4px',
          fontSize: '1rem',
          cursor: 'pointer',
        }}
      >
        Generar PDF
      </button>
    </div>
  );
};

export default PdfGenerator;
