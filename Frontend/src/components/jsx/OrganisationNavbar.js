import React, { useState, useEffect } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
// import "../css/OrganisationNavbar.css";
import { VscFeedback } from "react-icons/vsc";

function OrganisationNavbar() {
  const location = useLocation();
  const isHomeActive = location.pathname === "/organisationevents";
  const [isNavOpen, setNavOpen] = useState(false);
  const [orgData, setOrgData] = useState(
    JSON.parse(localStorage.getItem("organisers"))
  );

  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      localStorage.clear();
      setOrgData(null);
      navigate("/");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <div>
        <nav
          className="navbar navbar-dark navbar-expand-lg  fixed-top "
          style={{ backgroundColor: "#0e2643", height: "80px" }}
        >
          <div className="container-fluid" style={{ fontSize: "1.2rem" }}>
            <Link to="/organisationdashboard" className="navbar-brand ms-5">
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
              <ul
                className="navbar-nav"
                style={{ backgroundColor: "#0e2643", color: "white" }}
              >
                {/* <li className="nav-item">
                  <NavLink
                    to="/organisationevents"
                    className={`nav-link ${
                      isHomeActive ? "" : ""
                    }`}
                  >
                    Home
                  </NavLink>
                </li> */}
                {/*  */}
                <li className="nav-item">
                  <NavLink
                    to="/organisationevents/orgevents"
                    className={`nav-link ${isHomeActive ? "" : ""}`}
                  >
                    Event
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink
                    to="/organisationevents/organizationmemberdetails"
                    className={`nav-link ${isHomeActive ? "" : ""}`}
                  >
                    Member Data
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink
                    to="/organisationevents/organisationmemberships"
                    className={`nav-link ${isHomeActive ? "" : ""}`}
                  >
                    Membership
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink
                    to="/organisationevents/authorization"
                    className={`nav-link ${isHomeActive ? "" : ""}`}
                  >
                    Authorization
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink
                    to="/organisationevents/otherevents"
                    className={`nav-link ${isHomeActive ? "" : ""}`}
                  >
                    Other Events
                  </NavLink>
                </li>
                {orgData?.username ? (
                  <li className="nav-item">
                    <NavLink
                      style={{ marginTop: "0" }}
                      to="/orgplatformfeedback"
                      className={`nav-link ${isHomeActive ? "" : ""}`}
                    >
                      Platform Feedback
                      {/* <img
                        src="https://i.ibb.co/jg6WX8D/Untitled-design-1.png"
                        alt="Platform Feedback"
                        width="80rem"
                        height="60rem"
                      /> */}
                    </NavLink>
                  </li>
                ) : (
                  ""
                )}
                <li className="nav-item">
                  {orgData?.email ? (
                    <NavLink
                      to="/"
                      onClick={handleSignOut}
                      className={`nav-link ${!isHomeActive ? "" : ""}`}
                    >
                      Logout {orgData.username}
                    </NavLink>
                  ) : (
                    <NavLink
                      to="/loginregister"
                      className={`nav-link ${!isHomeActive ? "" : ""}`}
                    >
                      Login/Register
                    </NavLink>
                  )}
                </li>
                {orgData?.username ? (
                  <li className="nav-item">
                    <NavLink
                      to="/usersfeedbacks"
                      className={`nav-link ${isHomeActive ? "" : ""}`}
                    >
                      <VscFeedback style={{ fontSize: "1.8rem" }} />
                    </NavLink>
                  </li>
                ) : (
                  ""
                )}
              </ul>
            </div>
          </div>
        </nav>
      </div>
    </>
  );
}

export default OrganisationNavbar;
