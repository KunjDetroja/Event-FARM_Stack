// UserPlatformFeedback
import React from "react";
import Navbar from "../Navbar";
import { useState } from "react";
import { useLocation } from "react-router-dom";
import api from "../api";
import { toast } from "react-toastify";

function UserPlatformFeedback() {
  const location = useLocation();
  const [userdata, setUserdata] = useState(
    JSON.parse(localStorage.getItem("users"))
  );
  const [lFormData, setLFormData] = useState({
    username: userdata.username,
    feedbackdata: "",
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
      const feedbackform = { lFormData: lFormData};
      console.log(feedbackform);
      const checking = await api.post("/userplatformfeedback", feedbackform);
      if (checking.data.success !== false) {
        toast.success("Feedback Submitted Successfully");
        setLFormData({
          username: userdata.username,
          feedbackdata: "",
        });
      } else {
        toast.error(checking.data.error);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  return (
    <>
      <div>
        <Navbar />
      </div>
      <section>
        <div className="container">
          <div className="row">
            <div className="col-12 col-md-6 bsb-tpl-bg-platinum">
              <div className="d-flex flex-column justify-content-between h-100 p-3 p-md-4 p-xl-5">
                {/* <h3 className="m-0">Welcome!</h3> */}
                <img
                  className="img-fluid rounded mx-auto "
                  src="https://i.ibb.co/Hgrnv9Y/feedbacksvg1.webp"
                  alt=""
                  width="545"
                />
              </div>
            </div>
            <div className="col-12 col-md-6 bsb-tpl-bg-lotion">
              <div className="p-3 p-md-4 p-xl-5">
                <div className="row">
                  <div className="col-12">
                    <div className="mb-2">
                      <h3>EventWiz Platform Feedback</h3>
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
                          disabled
                          value={userdata.username}
                          // onChange={handleInputChange}
                        />
                        <label htmlFor="username" className="form-label">
                          Username
                        </label>
                      </div>
                    </div>
                    <div className="col-12">
                      <div className="form-floating mb-3">
                        <textarea
                          className="form-control"
                          id="feedbackdata"
                          name="feedbackdata"
                          placeholder=""
                          rows="10"
                          cols="10"
                          style={{ width: "100%", height: "100px" }}
                          value={lFormData.feedbackdata}
                          onChange={handleInputChange}
                        ></textarea>
                        <label htmlFor="feedbackdata" className="form-label">
                          Your Feedback
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
                          Submit Feedback
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

export default UserPlatformFeedback;
