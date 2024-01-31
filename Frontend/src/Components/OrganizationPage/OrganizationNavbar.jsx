import React,{useState} from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom';



function OrganizationNavbar() {
    const location = useLocation();
    const isHomeActive = location.pathname === '/organization';
    const [orgData, setOrgData] = useState(
        JSON.parse(localStorage.getItem("organization"))
    );
    const handleSignOut = async () => {
        try {
          localStorage.clear();
          setOrgData(null);
        } catch (error) {
          console.log(error);
        }
      };
    return (
        <div>
            <nav className="navbar navbar-dark navbar-expand-lg  fixed-top " style={{backgroundColor:"#0e2643"}}>
                <div className="container-fluid">
                    <Link to="/organization" className="navbar-brand ms-5" >EventWiz</Link>
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse justify-content-end me-5" id="navbarNav">
                        <ul className="navbar-nav  ">
                            <li className="nav-item">
                                <NavLink to="/organization" className={`nav-link ${isHomeActive ? 'font-weight-bold' : ''}`}>Home</NavLink>
                            </li>
                            <li className="nav-item">
                                <NavLink to="/organizations/event" className={`nav-link ${isHomeActive ? 'font-weight-bold' : ''}`}>Event</NavLink>
                            </li>
                            <li className="nav-item">
                                <NavLink to="/organizations/members" className={`nav-link ${isHomeActive ? 'font-weight-bold' : ''}`}>Members</NavLink>
                            </li>
                            <li className="nav-item">
                                <NavLink to="/organizations/membership" className={`nav-link ${isHomeActive ? 'font-weight-bold' : ''}`}>Membership</NavLink>
                            </li>
                            <li className="nav-item">
                                <NavLink to="/organizations/memberapplied" className={`nav-link ${isHomeActive ? 'font-weight-bold' : ''}`}>Applied</NavLink>
                            </li>
                            <li className="nav-item">
                                {orgData?.email ? (
                                    <NavLink to="/" onClick={handleSignOut} className={`nav-link ${!isHomeActive ? 'font-weight-bold' : ''}`}>Logout {orgData.username}
                                    </NavLink>
                                ) : (
                                    <NavLink to="/loginregister" className={`nav-link ${!isHomeActive ? 'font-weight-bold' : ''}`}>Login/Register
                                    </NavLink>
                                )}
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>


        </div>
    )
}

export default OrganizationNavbar
