import React, { useEffect, useState } from "react";
import Navbar from "../Navbar"
import "./Css/UserEventCss.css"
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
                <div>
                    <div className="backgroundImg">
                        <img src={eventBackgroundImage} alt="background" />
                    </div>
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
                                    We use cookies for improving user experience, analytics, and
                                    marketing.
                                </p>
                                <button className="accept">That's fine!</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}

export default UserEvent