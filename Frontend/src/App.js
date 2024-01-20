import React from 'react'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from './Components/Home';
import Mainpage from './Components/Mainpage';
import LoginRegister from './Components/LoginRegister/LoginRegister';
import { ToastContainer } from 'react-toastify';


const App = () => {

  return (
    <>
  <ToastContainer/>
        <Router>
        <Routes>
          <Route path="/" element={<Mainpage/>} />
          <Route path="/loginregister" element={<LoginRegister/>} />
          <Route path="/home" element={<Home/>} />
        </Routes>
      </Router>
    </>
  )
}

export default App
