import React, { useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";

function Navbar() {
  const location = useLocation();
  const isHomeActive = location.pathname === "/";
  const [userData, setUserData] = useState(
    JSON.parse(localStorage.getItem("users"))
  );
  const handleSignOut = async () => {
    try {
      localStorage.clear();
      setUserData(null);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div>
      <nav
        className="navbar navbar-dark navbar-expand-lg  fixed-top"
        style={{ backgroundColor: "#0e2643" , height:"80px"}}
      >
        <div className="container-fluid" style={{fontSize:"1.2rem"}}>
          <Link to="/" className="navbar-brand ms-5">
            EventWiz
          </Link>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div
            className="collapse navbar-collapse justify-content-end me-5"
            id="navbarNav"
          >
            <ul className="navbar-nav "
            style={{ backgroundColor: "#0e2643", color: "white" }}
            >
              <li className="nav-item">
                <NavLink
                  to="/"
                  className={`nav-link ${
                    isHomeActive ? "" : ""
                  }`}
                >
                  Home
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink
                  to="/events"
                  className={`nav-link ${
                    isHomeActive ? "" : ""
                  }`}
                >
                  Events
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink
                  to="/subscribe"
                  className={`nav-link ${
                    isHomeActive ? "" : ""
                  }`}
                >
                  Subscribe
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink
                  to="/partcipate"
                  className={`nav-link ${
                    isHomeActive ? "" : ""
                  }`}
                >
                  Partcipated
                </NavLink>
              </li>
              {userData?.username?(
              <li className="nav-item">
                <NavLink
                  to="/userplatformfeedback"
                  className={`nav-link ${
                    isHomeActive ? "" : ""
                  }`}
                >
                  Platform Feedback
                </NavLink>
              </li>
              ):("")}
              <li className="nav-item">
                {userData?.email ? (
                  <NavLink
                    to="/"
                    onClick={handleSignOut}
                    className={`nav-link ${
                      !isHomeActive ? "" : ""
                    }`}
                  >
                    Logout {userData.username}
                  </NavLink>
                ) : (
                  <NavLink
                    to="/loginregister"
                    className={`nav-link ${
                      !isHomeActive ? "" : ""
                    }`}
                  >
                    Login/Register
                  </NavLink>
                )}
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </div>
  );
}

export default Navbar;
