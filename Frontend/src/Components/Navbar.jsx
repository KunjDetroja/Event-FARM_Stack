import React from 'react'
import { Link } from 'react-router-dom';


function Navbar() {
  return (
    <div>
      <nav className="navbar navbar-dark navbar-expand-lg bg-primary ">
        <div className="container-fluid">
          <Link to="/" className="navbar-brand" >Navbar</Link>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse justify-content-end" id="navbarNav">
            <ul className="navbar-nav  ">
              <li className="nav-item">
                <Link className="nav-link active" aria-current="page" to="/home">Home</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link active" aria-current="page" to="/loginregister">Login/Register</Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>
      

    </div>
  )
}

export default Navbar
