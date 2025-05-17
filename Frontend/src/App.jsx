import { Routes, Route, BrowserRouter as Router } from "react-router-dom";
import Home from './Pages/Home'
import Header from './Components/Header' ;



function App() {
  

  return (
    <>

      <Router>
        <Header />
         <Home/>
      </Router>

    </>
  )
}

export default App
