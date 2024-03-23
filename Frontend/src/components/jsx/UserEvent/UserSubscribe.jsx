import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../../css/UserEvent/UserSubscribeCss.css";
import Navbar from "../Navbar";
import api from "../api";
import { GrPowerReset } from "react-icons/gr";
import { toast } from "react-toastify";
import UserEvent from "./UserEvent";

function UserSubscribe() {
  const [checkingdata, setCheckingdata] = useState(
    JSON.parse(localStorage.getItem("users"))
  );
  const [orgDetails, setOrgDetails] = useState();
  const [searchForm, setSearchform] = useState({
    clubname: "",
  });

  const fetchAllOrganization = async () => {
    try {
      const response = await api.get("/getallorganizatonforuser");
      setOrgDetails(response.data);
      console.log(response.data);
    } catch (error) {
      console.error("Error fetching details:", error);
    }
  };

  useEffect(() => {
    fetchAllOrganization();
    localStorage.removeItem("orgname");
    localStorage.removeItem("memtype");
  }, []);

  const navigate = useNavigate();
  const handleorgdetails = (org) => {
    console.log(JSON.stringify(org));
    localStorage.setItem("orgdetails", JSON.stringify(org));
    navigate("/subscribe/orgdetails", {
      state: JSON.stringify(org),
    });

  };

  const handleformreset = () => {
    setSearchform({
      clubname: "",
    });
    fetchAllOrganization();
  };

  const handleSearchInputChange = (event) => {
    // const { name, value } = e.target;
    setSearchform({
      ...searchForm,
      [event.target.name]: event.target.value,
    });
  };

  const handlesearchSubmit = async (event) => {
    event.preventDefault();

    const data = {
      clubname: searchForm["clubname"],
    };
    console.log("handle search submit");
    try {
      const response = await api.post("/searchingorgbyname", data);
      if (response.data.success !== false) {
        console.log(response.data);
        setOrgDetails(response.data);
      } else {
        toast.error(response.data.error);
      }
      // console.log(response.data);
    } catch (error) {
      console.error("Error fetching details:", error);
    }
  };

  return (
    <>
      {checkingdata ? (
        <>
          <div>
            <Navbar />
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "flex-end",
              }}
            >
              <div className="mt-2 me-2">
                <form
                  className="form-inline my-lg-0 "
                  onSubmit={handlesearchSubmit}
                >
                  <div className="row">
                    <div className="col-8 p-2">
                      <input
                        className="form-control"
                        name="clubname"
                        type="text"
                        placeholder="Search"
                        aria-label="Search"
                        onChange={handleSearchInputChange}
                        value={searchForm.clubname}
                      />
                    </div>
                    <div className="col-2 p-2">
                      <button className="addpostbtn pt-2 pb-2" type="submit">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          fill="currentColor"
                          className="bi bi-search"
                          viewBox="0 0 16 16"
                        >
                          <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0" />
                        </svg>
                      </button>
                    </div>
                    <div className="col-2">
                      <button className="addorgbtn" onClick={handleformreset}>
                        <GrPowerReset
                          style={{
                            height: "1.2rem",
                            width: "1.2rem",
                          }}
                        />
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
            <hr />
            <div>
              <div className="loginmainEventdiv">
                <div className="row">
                  <div className="col-12">
                    <br />
                    <div className="row">
                      {orgDetails && orgDetails.length ? (
                        orgDetails.map((org) => (
                          <div key={org._id} className="col-4 maincardbody">
                            <div class="col">
                              <section
                                class="mx-auto my-5"
                                style={{ maxWidth: "23rem" }}
                              >
                                <div class="card testimonial-card mt-2 mb-3">
                                  <div class="card-up aqua-gradient"></div>
                                  <div class="avatar mx-auto white">
                                    <img
                                      src={org.logo}
                                      class="rounded-circle img-fluid"
                                      alt="woman avatar"
                                      onClick={() => handleorgdetails(org)}
                                      style={{ cursor: "pointer" }}
                                    />
                                  </div>
                                  <div class="card-body text-center">
                                    <h4
                                      class="card-title font-weight-bold"
                                      onClick={() => handleorgdetails(org)}
                                      style={{ cursor: "pointer" }}
                                    >
                                      {org.clubname}
                                    </h4>
                                    <hr />
                                    <p>
                                      <strong>Email: {org.email}</strong>
                                    </p>
                                    <p>
                                      <i class="fas fa-quote-left"></i>
                                      <span style={{ marginLeft: "5px" }}>
                                        {org.address}
                                      </span>
                                    </p>
                                  </div>
                                </div>
                              </section>
                            </div>
                          </div>
                        ))
                      ) : (
                        <p>No Records...</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      ) : (
        <UserEvent />
      )}
    </>
  );
}

export default UserSubscribe;
