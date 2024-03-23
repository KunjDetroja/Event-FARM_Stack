import React, { useEffect, useState } from "react";
import Navbar from "../Navbar";
import "../../css/UserEvent/UserEventCss.css";
import { Link } from "react-router-dom";

function UserEvent() {
  
  return (
    <>
      <div>
        <Navbar />
      </div>
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
                <p>You need to Login or Signup!</p>
                <Link to="/loginregister">
                  <button className="accept">Login/Signup</button>
                </Link>
              </div>
            </div>
          </div>
        </div>
    </>
  );
}

export default UserEvent;
