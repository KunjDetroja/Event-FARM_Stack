import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../api";

function AdminLogin() {
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
      const checking = await api.post("/adminlogin/", lFormData);

      if (checking.data.success !== false) {
        localStorage.setItem("admin", JSON.stringify(checking.data[0]));
        toast.success("Login Successfully");
        setLFormData({
          username: "",
          pwd: "",
        });
        navigate("/admin/home");
      } else {
        toast.error(checking.data.error);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  return (
    <>
      <section>
        <div className="container">
          <div className="row">
            <div className="col-12 col-md-6 bsb-tpl-bg-platinum">
              <div className="d-flex flex-column justify-content-between h-100 p-3 p-md-4 p-xl-5">
                {/* <h3 className="m-0">Welcome!</h3> */}
                <img
                  className="img-fluid rounded mx-auto "
                  src="https://img.freepik.com/free-vector/tablet-login-concept-illustration_114360-7883.jpg?w=740&t=st=1706529733~exp=1706530333~hmac=e294cf3ddb40c7cfdb91565f09d19d6771116dba97922030183962a816cfd0d8"
                  alt=""
                  width="545"
                />
              </div>
            </div>
            <div className="col-12 col-md-6 bsb-tpl-bg-lotion">
              <div className="p-3 p-md-4 p-xl-5">
                <div className="row">
                  <div className="col-12">
                    <div className="mb-5">
                      <h3>Admin Login</h3>
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
                          placeholder=""
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
                          placeholder=""
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
                        <button
                          style={{
                            color: "white",
                            backgroundColor: "#0e2643",
                            border: "none",
                            marginLeft: "1rem",
                            padding: "0.3rem 0.5rem 0.3rem 0.5rem",
                            borderRadius: "0.375rem",
                          }}
                          type="submit"
                        >
                          Log in now
                        </button>
                      </div>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default AdminLogin;
