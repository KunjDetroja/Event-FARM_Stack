// AdminNavbar
import React, { useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { VscFeedback } from "react-icons/vsc";

function AdminNavbar() {
  const location = useLocation();
  const isHomeActive = location.pathname === "/admin/home";
  const [userData, setUserData] = useState(
    JSON.parse(localStorage.getItem("admin"))
  );
  const handleSignOut = async () => {
    try {
      localStorage.clear();
      setUserData(null);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <nav
        className="navbar navbar-dark navbar-expand-lg  fixed-top "
        style={{ backgroundColor: "#0e2643" , height:"80px"}}
      >
        <div className="container-fluid" style={{fontSize:"1.2rem"}}>
          <Link to="/admin/home" className="navbar-brand ms-5">
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
                  to="/admin/home"
                  className={`nav-link ${
                    isHomeActive ? "" : ""
                  }`}
                >
                  Home
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink
                  to="/admin/allusers"
                  className={`nav-link ${
                    isHomeActive ? "" : ""
                  }`}
                >
                  User
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink
                  to="/admin/allorg"
                  className={`nav-link ${
                    isHomeActive ? "" : ""
                  }`}
                >
                  Organisation
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink
                  to="/admin/accepetrejectorg"
                  className={`nav-link ${
                    isHomeActive ? "" : ""
                  }`}
                >
                  Authorization
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink
                  to="/admin/alleventposts"
                  className={`nav-link ${
                    isHomeActive ? "" : ""
                  }`}
                >
                  Events
                </NavLink>
              </li>
              <li className="nav-item">
                {userData?.username ? (
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
                  <NavLink to="*"></NavLink>
                )}
              </li>
              {userData?.username ? (
                  <li className="nav-item">
                    <NavLink
                    to="/admin/platformfeedback"
                    className={`nav-link ${
                      isHomeActive ? "" : ""
                    }`}
                  >
                    <VscFeedback 
                      style={{ fontSize: "1.8rem"}}
                      />
                  </NavLink>
                    
                  </li>
                ) : (
                  ""
                )}
            </ul>
          </div>
        </div>
      </nav>
    </>
  );
}

export default AdminNavbar;
