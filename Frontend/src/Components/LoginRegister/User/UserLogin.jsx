import React, { useState, useEffect } from 'react'
import api from '../../../api'
import { useNavigate } from 'react-router-dom'

function UserLogin({ setUBoolean }) {
  const navigate = useNavigate();
  const [details, setDetails] = useState([])

  const [lFormData, setLFormData] = useState({
    clubname: "",
    username: "",
    pwd: "",
  });

  const handleInputChange = (event) => {
    console.log(event.target.name + " " + event.target.value);
    setLFormData({
      ...lFormData,
      [event.target.name]: event.target.value,

    });
  };
  const fetchAllDetails = async () => {
    try {
      const response = await api.get("/clubnames/");
      setDetails(response.data);
    } catch (error) {
      console.error("Error fetching details:", error);
    }
  };

  useEffect(() => {
    fetchAllDetails();
  }, []);
  const handleFormSubmit = async (event) => {
    event.preventDefault();
    console.log(lFormData)
    try {
      const checking = await api.post("/userlogin/", lFormData);
      console.log(checking);
      // if (checking.data) {
      //   // Use the navigate function to go to the home page
      //   console.log("form data: " + JSON.stringify(lFormData))
      //   navigate("/home", { state: JSON.stringify(lFormData) });
      // } else {
      //   alert("Wrong Username & Password!");
      // }
      setLFormData({
        clubname: "",
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
                  <h3>User Login </h3>
                  <p>Don't have an account?
                    <button
                      className='btn btn-primary'
                      onClick={() => { setUBoolean(false) }} >
                      Sign up
                    </button>
                  </p>
                </div>
              </div>
            </div>
            <form onSubmit={handleFormSubmit}>
              <div className="row gy-3 overflow-hidden">
                <div className="col-12">
                  <div className="form-floating mb-3">
                    <select
                      onChange={handleInputChange}
                      className="form-select"
                      id="clubname"
                      name="clubname"
                      value={lFormData.clubname}
                    >

                      {details.map((club) => (
                        <option key={club} value={club}>
                          {club}
                        </option>
                      ))}
                    </select>
                    <label htmlFor="clubname" className="form-label">
                      Club
                    </label>
                  </div>
                </div>
                <div className="col-12">
                  <div className="form-floating mb-3">
                    <input
                      onChange={handleInputChange}
                      type="text"
                      className="form-control"
                      id="username"
                      placeholder=""
                      name="username"
                      value={lFormData.username}
                    />
                    <label htmlFor="username" className="form-label">
                      Username
                    </label>
                  </div>
                </div>
                <div className="col-12">
                  <div className="form-floating mb-3">
                    <input
                      onChange={handleInputChange}
                      type="password"
                      className="form-control"
                      id="pwd"
                      placeholder=""
                      name="pwd"
                      value={lFormData.pwd}
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

export default UserLogin
