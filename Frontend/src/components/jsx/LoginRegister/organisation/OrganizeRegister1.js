import React, { useState } from "react";
import api from "../../api";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

function OrganizeRegister1({ setOBoolean }) {
  const navigate = useNavigate();

  const [lFormData, setLFormData] = useState({
    clubname: "",
    logo: "",
    background_image: "",
    ownname: "",
    email: "",
    address: "",
    city: "",
    pnumber: "",
    desc: "",
    memtype: [],
    members: [],
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
      const checking = await api.post("/organisationregistration/", lFormData);
      if (checking.data.success !== false) {

        toast.success(checking.data.message);
        document.getElementById("memtype").value = "";
        document.getElementById("members").value = "";
        document.getElementById("logo").value = "";
        document.getElementById("background_image").value = "";
        setLFormData({
          clubname: "",
          logo: "",
          background_image: "",
          ownname: "",
          email: "",
          address: "",
          city: "",
          pnumber: "",
          desc: "",
          memtype: [],
          members: [],
          username: "",
          pwd: "",
        });
        navigate("/");
      } else {
        toast.error(checking.data.error);
      }
    } catch (error) {
      console.error("Error submitting form");
    }
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];

    if (file) {
      if (file.type === "image/jpeg" || file.type === "image/png") {
        const reader = new FileReader();

        reader.onloadend = () => {
          // reader.result contains the base64-encoded string
          const base64String = reader.result;

          setLFormData({
            ...lFormData,
            [event.target.name]: base64String,
          });
        };

        reader.readAsDataURL(file);
      } else {
        setLFormData({
          ...lFormData,
          [event.target.name]: "",
        });
        document.getElementById(event.target.name).value = "";
        toast.error("Unsupported file type. Please choose a JPG or PNG image.");
      }
    }
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const fileContent = e.target.result;
        try {
          console.log("step4" + event.target.name);
          const jsonData = JSON.parse(fileContent);
          setLFormData({
            ...lFormData,
            [event.target.name]: jsonData,
            // memtypeName : file?.name
          });
        } catch (error) {
          console.error("Error parsing JSON file:", error);
        }
      };

      reader.readAsText(file);
    }
  };

  return (
    <>
      <div className="col-12 col-md-6 col-xl-7">
        <div className="card border-0 rounded-4 ">
          <div className="card-body p-3 p-md-4 p-xl-5">
            <div className="row">
              <div className="col-12">
                <div className="mb-4">
                  <h3>Organization Registration</h3>
                  <p>
                    If you have an account?{" "}
                    <button
                      style={{
                        color: "white",
                        backgroundColor: "#0e2643",
                        border: "none",
                        marginLeft: "1rem",
                        padding: "0.3rem 0.5rem 0.3rem 0.5rem",
                        borderRadius: "0.375rem",
                      }}
                      onClick={() => {
                        setOBoolean(true);
                      }}
                    >
                      Login
                    </button>
                  </p>
                </div>
              </div>
            </div>
            <form onSubmit={handleFormSubmit}>
              <div className="row overflow-hidden">
                <div className="col-6">
                  <div className="form-floating mb-3">
                    <input
                      onChange={handleInputChange}
                      type="text"
                      className="form-control"
                      id="clubname"
                      name="clubname"
                      placeholder=""
                      value={lFormData.clubname}
                    />
                    <label htmlFor="clubname" className="form-label">
                      Club Name
                    </label>
                  </div>
                </div>
                <div className="col-6">
                  <div className="form-floating mb-3">
                    <input
                      onChange={handleInputChange}
                      type="text"
                      className="form-control"
                      id="ownername"
                      name="ownname"
                      placeholder=""
                      value={lFormData.ownname}
                    />
                    <label htmlFor="ownername" className="form-label">
                      Owner Name
                    </label>
                  </div>
                </div>
              </div>
              <div className="row  overflow-hidden">
                <div className="col-6">
                  <div className="form-floating mb-3">
                    <input
                      onChange={handleInputChange}
                      type="email"
                      className="form-control"
                      id="email"
                      placeholder=""
                      name="email"
                      value={lFormData.email}
                    />
                    <label htmlFor="email" className="form-label">
                      Email
                    </label>
                  </div>
                </div>
                <div className="col-6">
                  <div className="form-floating mb-3">
                    <input
                      onChange={handleInputChange}
                      type="number"
                      className="form-control"
                      id="number"
                      placeholder=""
                      name="pnumber"
                      value={lFormData.pnumber}
                    />
                    <label htmlFor="pnumber" className="form-label">
                      Phone Number:
                    </label>
                  </div>
                </div>
              </div>
              <div className="row  overflow-hidden">
                <div className="col-6">
                  <div className="form-floating mb-3">
                    <input
                      onChange={handleImageChange}
                      type="file"
                      className="form-control"
                      id="logo"
                      placeholder=""
                      name="logo"
                      // value={lFormData.event_image}
                      required
                    />
                    <label htmlFor="event_image" className="form-label">
                      Logo
                    </label>
                  </div>
                </div>
                <div className="col-6">
                  <div className="form-floating mb-3">
                    <input
                      onChange={handleImageChange}
                      type="file"
                      className="form-control"
                      id="background_image"
                      placeholder=""
                      name="background_image"
                      // value={lFormData.event_image}
                      required
                    />
                    <label htmlFor="background_image" className="form-label">
                      Background Image
                    </label>
                  </div>
                </div>
              </div>
              <div className="row  overflow-hidden">
                <div className="col-12">
                  <div className="form-floating mb-3">
                    <input
                      onChange={handleInputChange}
                      type="text"
                      className="form-control"
                      id="address"
                      placeholder=""
                      name="address"
                      value={lFormData.address}
                    />
                    <label htmlFor="address" className="form-label">
                      Address
                    </label>
                  </div>
                </div>
              </div>
              <div className="row  overflow-hidden">
                <div className="col-12">
                  <div className="form-floating mb-3">
                    <input
                      onChange={handleInputChange}
                      type="text"
                      className="form-control"
                      id="city"
                      placeholder=""
                      name="city"
                      value={lFormData.city}
                    />
                    <label htmlFor="city" className="form-label">
                      City Name
                    </label>
                  </div>
                </div>
              </div>
              <div className="row  overflow-hidden">
                <div className="col-12">
                  <div className="form-floating mb-3">
                    <textarea
                      onChange={handleInputChange}
                      className="form-control"
                      id="desc"
                      placeholder=""
                      name="desc"
                      value={lFormData.desc}
                    ></textarea>
                    <label htmlFor="desc" className="form-label">
                      Organisation Description
                    </label>
                  </div>
                </div>
              </div>
              <div className="row  overflow-hidden">
                <div className="col-6">
                  <div className="form-floating mb-3">
                    <input
                      type="file"
                      className="form-control"
                      id="memtype"
                      accept=".json"
                      onChange={handleFileChange}
                      multiple={false}
                      name="memtype"
                    />
                    <label htmlFor="memtype" className="form-label">
                      Membership .json File
                    </label>
                  </div>
                </div>
                <div className="col-6">
                  <div className="form-floating mb-3">
                    <input
                      type="file"
                      className="form-control"
                      id="members"
                      accept=".json"
                      onChange={handleFileChange}
                      multiple={false}
                      name="members"
                    />
                    <label htmlFor="members" className="form-label">
                      Members .json File
                    </label>
                  </div>
                </div>
                <div className="col-6">
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
                <div className="col-6">
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
                      Register now
                    </button>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

export default OrganizeRegister1;
