import React, { useState, useEffect } from "react";
import "../../css/LoginRegister/LoginPage.css";
import { useNavigate } from "react-router-dom";
import Navbar from "../Navbar";
import User from "./user/User";
import Organize from "./organisation/Organize";

function LoginPage() {
  const [booleanvalue, setBoolean] = useState(true);
  const Navigate = useNavigate()
  const [user, setUser] = useState(false)

  useEffect(() => { // Check for existing user data in localStorage on mount
    const loggedInUser = localStorage.getItem("users");
    if (loggedInUser) {
      // const foundUser = JSON.parse(loggedInUser); // Parse stored data back to object
      setUser(true);
    }
  }, []);

  if(user){
    Navigate("/")
  }

  
  return (
    <>
      <div>{<Navbar />}</div>
      <div className="mainbuttons mb-5">
        <button onClick={() => setBoolean(true)} className="choiceBtn">user</button>
        <button onClick={() => setBoolean(false)} className="choiceBtn">organisation</button>
      </div>
      {booleanvalue ? <User/> : <Organize />}{" "}
    
    </>
  );
}

export default LoginPage;
