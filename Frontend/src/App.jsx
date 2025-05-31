import { Routes, Route, BrowserRouter as Router } from "react-router-dom";
import Home from './Pages/Home'
import Header from './Components/Header' ;
import Eventos from './Pages/Eventos' ;
import Nosotros from './Pages/Nosotros' ;
import Contactos from "./Pages/Contactos";
import Footer from "./Components/Footer";




function App() {
  

  return (
    <>

      <Router>
        <Header />
          <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/Eventos" element={<Eventos />} />
          <Route path="/Nosotros" element={<Nosotros />} />
          <Route path="/Contactos" element={<Contactos />} />
        </Routes>
        <Footer/>
      
      </Router>

    </>
  )
}

export default App
