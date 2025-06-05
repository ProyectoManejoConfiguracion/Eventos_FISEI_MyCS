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
import Eventos_admin from "./Pages/Admin/Eventos_admin";
import Contenido from "./Pages/Admin/Contenido";
import Notas from "./Pages/Admin/Notas";
import Tarifas from "./Pages/Admin/Tarifas";
import Configuracion from "./Pages/Admin/Configuracion";
import { Routes, Route, BrowserRouter as Router, useLocation } from "react-router-dom";
import Restudiante from './Pages/Restudiante'; 
import Registro from "./Pages/Registro";

const Layout = () => {
  const location = useLocation();
  const isPrivateRoute = location.pathname.startsWith("/Administrador");

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

        {/* Rutas privadas (Administrador) */}
        <Route path="/Administrador/*" element={<Administrador />}>
          <Route path="VistaGeneral" element={<VistaGeneral />} />
          <Route path="Usuario" element={<Usuario />} />
          <Route path="Curso" element={<Curso />} />
          <Route path="Eventos_admin" element={<Eventos_admin />} />
          <Route path="Contenido" element={<Contenido />} />
          <Route path="Notas" element={<Notas />} />
          <Route path="Tarifas" element={<Tarifas />} />
          <Route path="Configuracion" element={<Configuracion />} />
        </Route>
      </Routes>

      {!isPrivateRoute && <Footer />}
    </>
  );
};


function App() {
  return (
    <Router>
      <Layout />
    </Router>
  );
}

export default App;
