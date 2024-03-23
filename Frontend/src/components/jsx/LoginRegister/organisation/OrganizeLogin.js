import React, { useState } from 'react'
import api from '../../api';
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';
// import {useDispatch,useSelector} from "react-redux"
// import { orglogin,orglogout } from '../../../ReduxStore/AuthSlice';


function OrganizeLogin({ setOBoolean }) {
  // const auth = useSelector(state => state.data)
  // const status = useSelector(state => state.orgstatus)
  const navigate = useNavigate();
  // const dispatch = useDispatch()
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
      const checking = await api.post("/organisationlogin", lFormData);
      // const data = checking.data
      // console.log(data)

      if (checking.data.success !== false) {
        localStorage.setItem("organisers", JSON.stringify(checking.data));
        // dispatch(orglogin({data}))
        // console.log(auth)
        // console.log(status)
        toast.success("Login Successfully")
        setLFormData({
          username: "",
          pwd: "",
        });
        navigate("/organisationdashboard");
      } else {
        toast.error(checking.data.error);
      }

    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };
  
  return (
    <>

      <div className="col-12 col-md-6 col-xl-5 ">
        <div className="card border-0 rounded-4">
          <div className="card-body p-3 p-md-4 p-xl-5">
            <div className="row">
              <div className="col-12">
                <div className="mb-4">
                  <h3>Organization Login </h3>
                  <p>Don't have an account? <button style={{color: 'white',backgroundColor: '#0e2643',border: 'none',marginLeft: '1rem',padding: '0.3rem 0.5rem 0.3rem 0.5rem',borderRadius: '0.375rem'}} onClick={() => { setOBoolean(false) }} >Register</button></p>
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

export default OrganizeLogin

