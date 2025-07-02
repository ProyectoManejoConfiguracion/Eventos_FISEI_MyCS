import Home from "./Pages/Home";
import Eventos from "./Pages/Eventos";
import Nosotros from "./Pages/Nosotros";
import Contactos from "./Pages/Contactos";
import Administrador from "./Pages/Administrador";
import Header from "./Components/Header";
import Footer from "./Components/Footer";
import VistaGeneral from "./Pages/Admin/VistaGeneral";
import Usuario from "./Pages/Admin/Usuarios";
import Curso from "./Pages/Admin/Cursos";
import Eventos_admin from "./Pages/Admin/MainEvento";
import Contenido from "./Pages/Admin/Contenido";
import Notas from "./Pages/Admin/Notas";
import Configuracion from "./Pages/Admin/Configuracion";
import Restudiante from './Pages/Restudiante'; 
import Registro from "./Pages/Registro";
import Estudiante from "./Pages/Estudiante";
import Curso_Est from "./Pages/Estudiante/Curso_Est";
import Calificacion_Est from "./Pages/Estudiante/Calificacion_Est";
import Asistencia_Est from "./Pages/Estudiante/Asistencia_Est";
import Certificado_Est from "./Pages/Estudiante/Certificados_Est";
import Configuracion_Est from "./Pages/Estudiante/Configuracion_Est"; 
import ResetPassword from "./Pages/ResetPassword";
import { Routes, Route, BrowserRouter as Router, useLocation } from "react-router-dom";

const Layout = () => {
  const location = useLocation();
  const isPrivateRoute = location.pathname.startsWith("/Administrador")|| location.pathname.startsWith("/Estudiante");

  return (
    <>
      {!isPrivateRoute && <Header />}

      <Routes>
        {/* Rutas públicas */}
        <Route path="/" element={<Home />} />
        <Route path="/Eventos" element={<Eventos />} />
        <Route path="/Nosotros" element={<Nosotros />} />
        <Route path="/Contactos" element={<Contactos />} />
        <Route path="/Registro" element={<Registro/>} />
          <Route path="/Restudiante" element={<Restudiante/>} />
          <Route path="/reset-password" element={<ResetPassword />} />


        {/* Rutas privadas (Administrador) */}
        <Route path="/Administrador/*" element={<Administrador />}>
          <Route path="VistaGeneral" element={<VistaGeneral />} />
          <Route path="Usuario" element={<Usuario />} />
          <Route path="Curso" element={<Curso />} />
          <Route path="Eventos" element={<Eventos_admin />} />
          <Route path="Contenido" element={<Contenido />} />
          <Route path="Notas" element={<Notas />} />
          <Route path="Configuracion" element={<Configuracion />} />
        </Route>
        <Route path="/Estudiante/*" element={<Estudiante />}>
        <Route path="Cursos" element={<Curso_Est />} />
        <Route path="Calificaciones" element={<Calificacion_Est />} />
        <Route path="Asistencia" element={<Asistencia_Est />} />
        <Route path="Certificados" element={<Certificado_Est />} />
        <Route path="Configuracion" element={<Configuracion_Est />} />
        
        </Route>

      </Routes>

      {!isPrivateRoute && <Footer />}
    </>
  );
};



function App() {
  return (
    <Router>
      <div >
      <Layout />
      </div>
    </Router>
  );
}

export default App;
