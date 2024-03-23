// AdminOrg
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import $ from "jquery";
import AdminNavbar from "./AdminNavbar";
import api from "../api";
import "../../css/Admin/AdminOrg.css";
import { GrPowerReset } from "react-icons/gr";
// import { TbClockPlay } from "react-icons/tb";
import { toast } from "react-toastify";

function AdminOrg() {
  const [details, setDetails] = useState();

  const [searchForm, setSearchform] = useState({
    clubname: "",
  });

  useEffect(() => {
    fetchAllOrgdetails();
  }, []);

  const fetchAllOrgdetails = async () => {
    try {
      //   console.log(userData.clubname);
      //   const cname = userData.clubname; //Rajpath
      //   console.log(typeof cname); //string
      const response = await api.get("/allorganisations");
      setDetails(response.data);
      console.log(response.data);
    } catch (error) {
      console.error("Error fetching details:", error);
    }
  };

  const navigate = useNavigate();
  const handleorgdetails = (org) => {
    // console.log(JSON.stringify(org));
    navigate("/admin/orgdetailspage", {
      state: JSON.stringify(org),
    });
    JSON.stringify(localStorage.setItem("adminsingleorg", JSON.stringify(org)));
  };

  // /////////////

  const handleformreset = () => {
    setSearchform({
      clubname: "",
    });
    fetchAllOrgdetails();
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
    // console.log("handle search submit");
    try {
      const response = await api.post("/searchingorgbyname", data);
      if (response.data.success !== false) {
        console.log(response.data);
        setDetails(response.data);
      } else {
        toast.error(response.data.error);
      }
      // console.log(response.data);
    } catch (error) {
      console.error("Error fetching details:", error);
    }
  };

  

  const handleorgdelete = async (org) => {
    console.log(org["clubname"]);
    const deleteorgdata = { clubname: org["clubname"] };
    console.log(deleteorgdata);
    const response = await api.post("/admindeletesorg", deleteorgdata);
    fetchAllOrgdetails();
    // console.log(response.data);
  };

  return (
    <>
      <div>{<AdminNavbar />}</div>

      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "flex-end",
        }}
      >
        <div className="mt-0">
          <form className="form-inline my-lg-0 " onSubmit={handlesearchSubmit}>
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
                <button
                  className="btn btn-outline-success my-2 my-sm-0 membersearchicon"
                  type="submit"
                >
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
                {details && details.length ? (
                  details.map((org) => (
                    <div key={org._id} className="col-4 maincardbody">
                      <div class="col">
                        <section
                          class="mx-auto my-5"
                          style={{ maxWidth: "23rem" }}
                        >
                          <div class="card testimonial-card mt-2 mb-3 pb-3">
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
                              <button
                                className="deleteorgbtn"
                                onClick={() => handleorgdelete(org)}
                              >
                                Delete
                              </button>
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
    </>
  );
}

export default AdminOrg;
{
  /**/
}
