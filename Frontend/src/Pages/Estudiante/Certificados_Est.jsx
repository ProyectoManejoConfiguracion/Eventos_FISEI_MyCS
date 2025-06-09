import React, { useState, useEffect, useRef } from 'react'
import axios from 'axios'
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'
import { useAuth } from '../../auth/AuthContext'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faAward,
  faCircleCheck,
  faFileArrowDown
} from '@fortawesome/free-solid-svg-icons'
import Certificado from '../../Components/Certificados'  
import firmaChair      from '../../assets/firma_chair.png'
import firmaCommittee  from '../../assets/firma_comite.png'
import sponsorSpringer from '../../assets/sponsor_springer.png'
import sponsorScopus   from '../../assets/sponsor_scopus.png'
import sponsorRedcedia from '../../assets/sponsor_redcedia.png'
import sponsorDide     from '../../assets/sponsor_dide.jpg'
import '../../Styles/Certificados_Est.css'

const Certificados_Est = () => {
  const { user } = useAuth()
  const [certs, setCerts]   = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState(null)

  const [pdfCert, setPdfCert] = useState(null)
  const pdfRef = useRef(null)

  useEffect(() => {
    if (!user) return
    setLoading(true)
    axios.get(`http://localhost:3000/api/certificado/${user.id}`)
      .then(({ data }) => {
        setCerts(data)
        setError(null)
      })
      .catch(err => {
        console.error(err)
        setError('No se pudieron cargar los certificados.')
      })
      .finally(() => setLoading(false))
  }, [user])

  useEffect(() => {
    if (!pdfCert) return
    const generate = async () => {
      const element = pdfRef.current
      if (!element) return

      try {
        const canvas = await html2canvas(element, { scale: 3, useCORS: true })
        const imgData = canvas.toDataURL('image/png')
        const pdf = new jsPDF({
          orientation: 'landscape',
          unit: 'mm',
          format: 'a4'
        })
        pdf.addImage(imgData, 'PNG', 0, 0, 297, 210)
        const blobUrl = pdf.output('bloburl')
        window.open(blobUrl)
      } catch (err) {
        console.error('Error generando PDF:', err)
      } finally {
        setPdfCert(null)
      }
    }
    generate()
  }, [pdfCert])

  const downloadPDF = (cert) => {
    setPdfCert(cert)
  }

  if (loading)  return <p className="cert-loading">Cargando certificados…</p>
  if (error)    return <p className="cert-error">{error}</p>
  if (!certs.length) return <p className="cert-empty">No tienes certificados disponibles.</p>

  return (
    <div className="certificados-container">
      <h1 className="certificados-title">Mis Certificados</h1>
      <div className="certificados-list">
        {certs.map((c, i) => (
          <div key={i} className="cert-card">
            <div className="cert-card-header">
              <FontAwesomeIcon icon={faAward} className="cert-icon-award" />
              <FontAwesomeIcon icon={faCircleCheck} className="cert-icon-ok" />
            </div>

            <div className="cert-card-body">
              <h2 className="cert-course-name">{c.curso.nombre}</h2>
              <p className="cert-date">
                Emitido: {new Date(c.curso.fecha).toLocaleDateString()}
              </p>
            </div>

            <button
              className="cert-download-btn"
              onClick={() => downloadPDF(c)}
            >
              <FontAwesomeIcon icon={faFileArrowDown} />
              Descargar Certificado
            </button>
          </div>
        ))}
      </div>


      {pdfCert && (
        <div
          ref={pdfRef}
          style={{
            position: 'absolute',
            top: '-9999px',
            left: '-9999px',
            width: '1122px',  
            height: '794px'
          }}
        >
          <Certificado
            participante={pdfCert.estudiante.nombre}
            tituloEvento={pdfCert.curso.nombre}
            horasEvento={pdfCert.curso.horas}
            locacion={pdfCert.curso.locacion || ''}
            fechaInicio={new Date(pdfCert.curso.fecha).toLocaleDateString()}
            fechaFin={new Date(pdfCert.curso.fecha).toLocaleDateString()}
            chair={{
              name: pdfCert.autoridad.nombre,
              title: pdfCert.autoridad.cargo,
              signatureSrc: firmaChair
            }}
            committee={{
              name: 'MSc. Comité Ingenieria',
              title: 'Director de Comité',
              signatureSrc: firmaCommittee
            }}
            sponsors={[
              sponsorSpringer,
              sponsorScopus,
              sponsorRedcedia,
              sponsorDide
            ]}
          />
        </div>
      )}
    </div>
  )
}

export default Certificados_Est
