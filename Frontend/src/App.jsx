import { Routes, Route, BrowserRouter as Router, useLocation } from "react-router-dom";
import Home from './Pages/Home';
import Eventos from './Pages/Eventos';
import Nosotros from './Pages/Nosotros';
import Contactos from './Pages/Contactos';
import Administrador from './Pages/Administrador';

import Header from './Components/Header';
import Footer from './Components/Footer';

const Layout = () => {
  const location = useLocation();
  
  // Rutas donde NO se debe mostrar Header y Footer
  const isPrivateRoute = location.pathname.startsWith("/Administrador") ;

  return (
    <>
      {!isPrivateRoute && <Header />}
      
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/Eventos" element={<Eventos />} />
        <Route path="/Nosotros" element={<Nosotros />} />
        <Route path="/Contactos" element={<Contactos />} />
        <Route path="/Administrador" element={<Administrador />} />
       
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
