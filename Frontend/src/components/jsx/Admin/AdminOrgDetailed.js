// AdminOrgDetailed.js
import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
// import $ from "jquery";
import AdminNavbar from "./AdminNavbar";
import "../../css/OrganisationEvent/orgEvent.css";
import api from "../api";
import "../../css/Admin/AdminOrdDetail.css";
import { GrPowerReset } from "react-icons/gr";
import {
  IoIosArrowDropupCircle,
  IoIosArrowDropdownCircle,
} from "react-icons/io";
import { toast } from "react-toastify";

function AdminOrgDetailed() {
  const [showmemberdatabtn, setShowmemberdatabtn] = useState(true);
  const [showeventwiz, setShowEventWiz] = useState(false);
  const [bvalue, setBValue] = useState(true);
  // const [details, setDetails] = useState();
  const [searchForm, setSearchform] = useState({
    membername: "",
    start_date: "",
    expiry_date: "",
  });

  const location = useLocation();
  // const [orgData, setOrgData] = useState(JSON.parse(location.state));
  const [orgData, setOrgData] = useState(
    JSON.parse(localStorage.getItem("adminsingleorg"))
  );
  // console.log(orgData);
  const memtype = orgData.memtype;
  // console.log(memtype);
  const [originalmemberslist, setOriginalMemberlist] = useState(
    orgData.members
  );
  const [memberslist, setMemberlist] = useState(orgData.members);

  const [filters, setFilters] = useState({
    memberid: "",
    username: "",
    name: "",
    email: "",
    pnumber: "",
    gender: "",
    membertype: "",
  });

  const handleMemberDataButtonClick = () => {
    setShowEventWiz(false);
    setShowmemberdatabtn(!showmemberdatabtn);
  };

  function formatDateForInput(dateString) {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return ""; // Invalid date, return an empty string
    }
    return date.toISOString().split("T")[0];
  }

  const handlesorting = async (col) => {
    try {
      const data = {
        clubname: orgData.clubname,
        col: col["name"],
        value: col["value"],
        members: memberslist,
      };
      const checking = await api.post("/adminmembersorting", data);
      // console.log(checking);
      if (checking.data.success !== false) {
        // console.log(checking.data);
        setBValue(!bvalue);
        setMemberlist(checking.data);
      } else {
        toast.error(checking.data.error);
      }
    } catch (error) {
      console.error("Error fetching details:", error);
    }
  };

  useEffect(() => {
    // Use a timeout to wait for the user to stop typing
    const timeoutId = setTimeout(() => {
      fetchMembersFilters();
    }, 100);
    return () => clearTimeout(timeoutId);
  }, [filters]);

  const handleformreset = () => {
    setFilters({
      memberid: "",
      username: "",
      name: "",
      email: "",
      pnumber: "",
      gender: "",
      membertype: "",
    });
    setSearchform({
      membername: "",
      start_date: "",
      expiry_date: "",
    });
    setMemberlist(orgData.members);
    setShowEventWiz(false);
  };

  const handleSearchInputChange = (event) => {
    setSearchform({
      ...searchForm,
      [event.target.name]: event.target.value,
    });
  };

  const handlesearchSubmit = async (event) => {
    event.preventDefault();

    const data = {
      memberlist: originalmemberslist,
      membername: searchForm["membername"],
      start_date: searchForm["start_date"],
      expiry_date: searchForm["expiry_date"],
    };
    console.log("handle search submit");
    console.log(data);
    try {
      const response = await api.post("/adminorgsearchfilter", data);
      if (response.data.success !== false) {
        console.log(response.data);
        setMemberlist(response.data);
      } else {
        // toast.error(response.data.error)
        setMemberlist(orgData.members);
      }
    } catch (error) {
      console.error("Error fetching details:", error);
    }
  };
  const handleFilterInputChange = (e) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      [e.target.name]: e.target.value,
    }));
    fetchMembersFilters();
  };

  const fetchMembersFilters = async () => {
    try {
      console.log(originalmemberslist);
      // console.log("filtering details");
      // console.log(filters);
      const filteredFormData = {};
      for (const key in filters) {
        if (filters[key] !== "") {
          filteredFormData[key] = filters[key];
        }
      }
      console.log("Filtered form:");
      console.log(filteredFormData);
      const data = {
        filterdict: filteredFormData,
        memberlist: originalmemberslist,
      };
      // const data = {"name":"hi"}
      const response = await api.post("/adminorgmemberstablefilters", data);
      if (response.data.data_dict === "empty") {
        setMemberlist(orgData.members);
      } else if (response.data.success != false) {
        // console.log("Response=" + response.data.error);
        setMemberlist(response.data);
      } else {
        setMemberlist(orgData.members);
        toast.error(response.data.error);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleLoggedinmembers = async () => {
    try {
      console.log(originalmemberslist);
      const result = await api.post("/loggedinmembers", {
        data: originalmemberslist,
      });
      console.log(result.data); // Log the result for debugging
      if (result.data.success !== false) {
        setShowEventWiz(true);
        setMemberlist(result.data);
      } else {
        setMemberlist(orgData.members);
        toast.error(result.data.error);
      }
    } catch (error) {
      console.error("Error in handleLoggedinmembers:", error);
    }
  };

  const handleInactivemembers = async () => {
    setShowEventWiz(false);
    try {
      console.log(originalmemberslist);
      const result = await api.post("/inactivemembers", {
        data: originalmemberslist,
      });
      console.log(result.data); // Log the result for debugging
      if (result.data.success !== false) {
        setMemberlist(result.data);
      } else {
        setShowEventWiz(false);
        setMemberlist(orgData.members);
        toast.error(result.data.error);
      }
    } catch (error) {
      console.error("Error in handleInactivemembers:", error);
    }
  };

  const handleSubscribers = async () => {
    try {
      const result = await api.post("/subscribeusers", {
        data: originalmemberslist,
      });
      if (result.data.success !== false) {
        setMemberlist(result.data);
      } else if (result.data.error === "empty") {
        toast(result.data.message);
        setShowEventWiz(false);
      } else {
        toast.error(result.data.error);
        setShowEventWiz(false);
        setMemberlist(orgData.members);
      }
    } catch (error) {
      console.error("Error in handleInactivemembers:", error);
    }
  };
  const navigate = useNavigate();
  const handleorgfeedback = () => {
    navigate("/admin/orgfeedback", {
      state: JSON.stringify(orgData),
    });
  };
  return (
    <>
      <div>{<AdminNavbar />}</div>

      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        <div className="mt-1">
          {/* <Link to="/organisationevents/addpost">
            <button className="addpostbtn">Member Data</button>
          </Link> */}
          {showmemberdatabtn ? (
            <>
              <button
                className="addpostbtn"
                onClick={handleMemberDataButtonClick}
              >
                Member Data
              </button>
              <button className="addpostbtn" onClick={handleorgfeedback}>
                {orgData.clubname}'s Feedback
              </button>
            </>
          ) : (
            <>
              <button
                className="addpostbtn"
                onClick={handleMemberDataButtonClick}
              >
                Org Data
              </button>
              <button className="addpostbtn" onClick={handleLoggedinmembers}>
                Active Members
              </button>
              <button className="addpostbtn" onClick={handleInactivemembers}>
                Inactive Members
              </button>
            </>
          )}
        </div>
        {showmemberdatabtn ? (
          <div></div>
        ) : (
          <div className="mt-0">
            <form
              className="form-inline my-lg-0 "
              onSubmit={handlesearchSubmit}
            >
              <div className="row">
                <div className="col-3">
                  <span>
                    <strong>From:</strong>
                  </span>
                  <input
                    type="date"
                    className="trtext"
                    name="start_date"
                    value={formatDateForInput(searchForm.start_date)}
                    onChange={handleSearchInputChange}
                    style={{ width: "10rem" }}
                  />
                </div>
                <div className="col-3">
                  <span>
                    <strong>To:</strong>
                  </span>
                  <input
                    type="date"
                    className="trtext"
                    style={{ width: "10rem" }}
                    name="expiry_date"
                    value={formatDateForInput(searchForm.expiry_date)}
                    onChange={handleSearchInputChange}
                  />
                </div>
                <div className="col-4 p-2">
                  <input
                    className="form-control"
                    name="membername"
                    type="text"
                    placeholder="Search"
                    aria-label="Search"
                    onChange={handleSearchInputChange}
                    value={searchForm.membername}
                  />
                </div>
                <div className="col-1 p-2">
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
                <div className="col-1">
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
        )}
      </div>
      <hr />
      {showeventwiz && (
        <>
          <div>
            <button className="addpostbtn" onClick={handleSubscribers}>
              EventWiz Subscribers
            </button>
          </div>
          <hr />
        </>
      )}
      {showmemberdatabtn ? (
        <div>
          <div className="loginmainEventdiv">
            <div className="row">
              <div className="col-12">
                <br />
                <div>
                  <section class="light">
                    <div class="container py-2">
                      <article class="postcard light blue">
                        <a class="postcard__img_link" href="#">
                          <img
                            class="postcard__img"
                            src={orgData.background_image}
                            alt="Image Title"
                          />
                        </a>
                        <div class="postcard__text t-dark">
                          <h1 class="postcard__title blue">
                            <h4>{orgData.clubname}</h4>
                          </h1>
                          <div class="postcard__subtitle small">
                            <strong>{orgData.ownname}</strong>
                            <br />
                            <strong> {orgData.email}</strong>
                          </div>
                          <div class="postcard__bar"></div>
                          <div class="postcard__preview-txt">
                            {orgData.desc}
                          </div>
                          <br />
                          <div class="row">
                            <span className="col">
                              <strong>Contact Number:</strong> {orgData.pnumber}
                            </span>
                            <span className="col">
                              <strong>City:</strong> {orgData.city}
                            </span>
                          </div>
                          <br />
                          <div class="">
                            <strong>Address:</strong> {orgData.address}
                          </div>
                          <div>
                            <br />
                            <strong>Membership Type & Price</strong>
                            <br />
                            <br />
                            {memtype && memtype.length ? (
                              memtype.map((type) => (
                                <li>
                                  <span>
                                    {type.type} {"-->"} {type.price}
                                  </span>
                                </li>
                              ))
                            ) : (
                              <p>No Membership Types...</p>
                            )}
                          </div>
                        </div>
                      </article>
                    </div>
                  </section>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <>
          <div className="row">
            <div className="col-12">
              {/* <br /> */}

              {memberslist && memberslist.length ? (
                <table className="table table-bordered">
                  <thead>
                    <tr>
                      <th scope="col" className="tablehead align-middle">
                        Sno
                      </th>
                      <th scope="col" className="tablehead align-middle">
                        Id
                      </th>
                      <th scope="col" className="tablehead align-middle">
                        Username
                      </th>
                      <th scope="col" className="tablehead align-middle">
                        <span>Name </span>
                        <span>
                          <span>
                            <IoIosArrowDropupCircle
                              style={{ cursor: "pointer" }}
                              onClick={() =>
                                handlesorting({ name: "name", value: true })
                              }
                            />
                          </span>
                          <span>
                            <IoIosArrowDropdownCircle
                              style={{ cursor: "pointer" }}
                              onClick={() =>
                                handlesorting({ name: "name", value: false })
                              }
                            />
                          </span>
                        </span>
                      </th>
                      <th scope="col" className="tablehead align-middle">
                        Email
                      </th>
                      <th scope="col" className="tablehead align-middle">
                        <span>Number </span>
                        <p>
                          <span>
                            <IoIosArrowDropupCircle
                              style={{ cursor: "pointer" }}
                              onClick={() =>
                                handlesorting({ name: "pnumber", value: true })
                              }
                            />
                          </span>
                          <span>
                            <IoIosArrowDropdownCircle
                              style={{ cursor: "pointer" }}
                              onClick={() =>
                                handlesorting({ name: "pnumber", value: false })
                              }
                            />
                          </span>
                        </p>
                      </th>
                      <th scope="col" className="tablehead align-middle">
                        Gender
                      </th>
                      <th scope="col" className="tablehead align-middle">
                        Type
                      </th>
                      <th scope="col" className="tablehead align-middle">
                        <span>Start date </span>
                        <p>
                          <span>
                            <IoIosArrowDropupCircle
                              style={{ cursor: "pointer" }}
                              onClick={() =>
                                handlesorting({
                                  name: "start_date",
                                  value: true,
                                })
                              }
                            />
                          </span>
                          <span>
                            <IoIosArrowDropdownCircle
                              style={{ cursor: "pointer" }}
                              onClick={() =>
                                handlesorting({
                                  name: "start_date",
                                  value: false,
                                })
                              }
                            />
                          </span>
                        </p>
                      </th>

                      <th scope="col" className="tablehead align-middle">
                        <span>Expiry date </span>
                        <p>
                          <span>
                            <IoIosArrowDropupCircle
                              style={{ cursor: "pointer" }}
                              onClick={() =>
                                handlesorting({
                                  name: "expiry_date",
                                  value: true,
                                })
                              }
                            />
                          </span>
                          <span>
                            <IoIosArrowDropdownCircle
                              style={{ cursor: "pointer" }}
                              onClick={() =>
                                handlesorting({
                                  name: "expiry_date",
                                  value: false,
                                })
                              }
                            />
                          </span>
                        </p>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td></td>
                      <td>
                        <div type="text" className="inputdiv">
                          <input
                            className="trtext"
                            name="memberid"
                            value={filters.memberid}
                            onChange={handleFilterInputChange}
                          />
                        </div>
                      </td>
                      <td>
                        <div type="text" className="inputdiv">
                          <input
                            className="trtext"
                            name="username"
                            value={filters.username}
                            onChange={handleFilterInputChange}
                          />
                        </div>
                      </td>
                      <td>
                        <div type="text" className="inputdiv">
                          <input
                            className="trtext"
                            name="name"
                            value={filters.name}
                            onChange={handleFilterInputChange}
                          />
                        </div>
                      </td>
                      <td>
                        <div type="text" className="inputdiv">
                          <input
                            className="trtext"
                            name="email"
                            value={filters.email}
                            onChange={handleFilterInputChange}
                          />
                        </div>
                      </td>
                      <td>
                        <div type="number" className="inputdiv">
                          <input
                            className="trtext"
                            name="pnumber"
                            value={filters.pnumber}
                            onChange={handleFilterInputChange}
                          />
                        </div>
                      </td>
                      <td>
                        <div type="text" className="inputdiv">
                          <select
                            onChange={handleFilterInputChange}
                            className="trtext form-select"
                            style={{ width: "7rem" }}
                            id="gender"
                            name="gender"
                            value={filters.gender}
                          >
                            <option value="">Gender</option>
                            <option value="Female">Female</option>
                            <option value="Male">Male</option>
                          </select>
                        </div>
                      </td>
                      <td>
                        <div type="text" className="inputdiv">
                          <select
                            onChange={handleFilterInputChange}
                            className="trtext form-select"
                            style={{ width: "10rem" }}
                            id="membertype"
                            name="membertype"
                            value={filters.membertype}
                          >
                            <option value="">Membership-Type</option>
                            {memtype?.map((type) => (
                              <option value={type.type}>{type.type}</option>
                            ))}
                          </select>
                        </div>
                      </td>
                      <td>
                        <div type="text" className="inputdiv">
                          --
                        </div>
                      </td>
                      <td>
                        <div type="text" className="inputdiv">
                          --
                        </div>
                      </td>
                    </tr>
                    {memberslist.map((member, index) => (
                      <tr key={member.memberid}>
                        <td className="trtext">{index + 1}</td>
                        <td className="trtext">{member.memberid}</td>
                        <td className="trtext">{member.username}</td>
                        <td className="trtext">{member.name}</td>
                        <td className="trtext">{member.email}</td>
                        <td className="trtext">{member.pnumber}</td>
                        <td className="trtext">{member.gender}</td>
                        <td className="trtext">{member.membertype}</td>
                        <td className="trtext">{member.start_date}</td>
                        <td className="trtext">{member.expiry_date}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p>No Records...</p>
              )}
            </div>
          </div>
        </>
      )}
    </>
  );
}

export default AdminOrgDetailed;
{
  /**/
}
