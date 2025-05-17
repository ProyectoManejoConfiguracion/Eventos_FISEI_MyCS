import { useState } from 'react'

import reactLogo from './assets/react.svg'
import './App.css'
import Home from './Pages/Home'
import { Routes, Route, BrowserRouter as Router } from "react-router-dom";
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
