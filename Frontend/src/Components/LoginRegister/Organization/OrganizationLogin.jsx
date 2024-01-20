import React, { useState } from 'react'
import api from '../../../api';
import { useNavigate } from "react-router-dom";


function OrganizationLogin({setOBoolean}) {
  const navigate = useNavigate();

  const [lFormData,setLFormData] = useState({
    username: "",
    pwd: "",
  });

  const handleInputChange = (event) => {
    setLFormData({
      ...lFormData,
      [event.target.name]: event.target.value,
    });
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    try {
      const checking = await api.post("/organisationlogin/", lFormData);
      console.log(checking.data)
      if (checking.data) {
        navigate("/home");
      } else {
        alert("Wrong Username & Password!");
      }
      setLFormData({
        username: "",
        pwd: "",
      });
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };
  return (
    <>

      <div className="col-12 col-md-6 col-xl-5">
        <div className="card border-0 rounded-4">
          <div className="card-body p-3 p-md-4 p-xl-5">
            <div className="row">
              <div className="col-12">
                <div className="mb-4">
                  <h3>Organization Login </h3>
                  <p>Don't have an account? <button className='btn btn-primary' onClick={()=>{setOBoolean(false)}} >Sign up</button></p>
                </div>
              </div>
            </div>
            <form onSubmit={handleFormSubmit}>
              <div className="row gy-3 overflow-hidden">
                <div className="col-12">
                  <div className="form-floating mb-3">
                  <input
                    type="text"
                    className="form-control"
                    id="username"
                    name="username"
                    placeholder=''
                    value={lFormData.username}
                    onChange={handleInputChange}
                  />
                    <label htmlFor="username" className="form-label">
                    Username
                  </label>
                  </div>
                </div>
                <div className="col-12">
                  <div className="form-floating mb-3">
                  <input
                    type="password"
                    className="form-control"
                    id="pwd"
                    name="pwd"
                    placeholder=''
                    value={lFormData.pwd}
                    onChange={handleInputChange}
                  />
                    <label htmlFor="pwd" className="form-label">
                    Password
                  </label>
                  </div>
                </div>
                <div className="col-12">
                  <div className="d-grid">
                    <button className="btn btn-primary btn-lg" type="submit">Log in now</button>
                  </div>
                </div>
              </div>
            </form>
            
          </div>
        </div>
      </div>
    </>
  )
}

export default OrganizationLogin

