import React, { useState } from 'react'
import api from '../../../api';
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';


function OrganizationLogin({ setOBoolean }) {
  const navigate = useNavigate();

  const [lFormData, setLFormData] = useState({
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
      if (checking.data.success !== false) {
        localStorage.setItem("organization", JSON.stringify(checking.data));
        toast.success("Login Successfully")
        setLFormData({
          username: "",
          pwd: "",
        });
        navigate("/organization");
      } else {
        toast.error(checking.data.data);
      }

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
                  <p>Don't have an account? <button style={{color: 'white',backgroundColor: '#0e2643',border: 'none',marginLeft: '1rem',padding: '0.3rem 0.5rem 0.3rem 0.5rem',borderRadius: '0.375rem'}} onClick={() => { setOBoolean(false) }} >Sign up</button></p>
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
                    <button style={{color: 'white',backgroundColor: '#0e2643',border: 'none',marginLeft: '1rem',padding: '0.3rem 0.5rem 0.3rem 0.5rem',borderRadius: '0.375rem'}} type="submit">Log in now</button>
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

