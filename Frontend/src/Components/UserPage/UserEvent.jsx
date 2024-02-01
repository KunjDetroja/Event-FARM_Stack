import React, { useEffect, useState } from "react";
import Navbar from "../Navbar"
import "./Css/UserEventCss.css"
import { Link } from "react-router-dom";
import eventBackgroundImage from "../../Static/Image/eventBackgroundImage.jpg"
import UserEvent1 from "./UserEvent1";

function UserEvent() {
    const [userData, setUserData] = useState(
        JSON.parse(localStorage.getItem("users"))
    );
    return (
        <>
            <div><Navbar /></div>
            {userData ? (
                <UserEvent1 />
            ) : (
                <div className="backgroundImg">
                    <div className="logoutmainEventdiv">
                        <div className="container d-flex align-items-center justify-content-center">
                            <div className="cookiesContent" id="cookiesPopup">
                                <button className="close">✖</button>
                                <img
                                    src="https://cdn-icons-png.flaticon.com/512/1047/1047711.png"
                                    alt="cookies-img"
                                    className="modalimg"
                                />
                                <p>
                                    You need to Login or Signup!
                                </p>
                                <Link to="/loginregister"><button className="accept">Login/Signup</button></Link>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}

export default UserEvent