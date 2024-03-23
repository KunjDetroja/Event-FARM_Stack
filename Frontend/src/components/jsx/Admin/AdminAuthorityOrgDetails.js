// AdminAuthorityOrgDetails
import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import $ from "jquery";
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

function AdminAuthorityOrgDetails() {
  const [showmemberdatabtn, setShowmemberdatabtn] = useState(true);
  const [bvalue, setBValue] = useState(true);
  // const [details, setDetails] = useState();
  const [searchForm, setSearchform] = useState({
    membername: "",
    start_date: "",
    expiry_date: "",
  });

  const location = useLocation();
  const [orgData, setOrgData] = useState(JSON.parse(location.state));
  // console.log(orgData);
  const memtype = orgData.memtype;
  // console.log(memtype);
  const [originalmemberslist, setOriginalMemberlist] = useState(orgData.members);
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
      const data = { clubname: orgData.clubname, col: col, value: bvalue };
      const checking = await api.post("/membersortinguserside", data);
      console.log(checking);
      if (checking.data.success !== false) {
        console.log(checking.data);
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
      const data = { filterdict: filteredFormData, memberlist: originalmemberslist };
      // const data = {"name":"hi"}
      const response = await api.post("/adminorgmemberstablefilters", data);
      if (response.data.data_dict === "empty") {
        setMemberlist(orgData.members)
      
      } else if (response.data.success != false) {
        // console.log("Response=" + response.data.error);
        setMemberlist(response.data);
      } else {
        // setMemberlist(orgData.members)
        toast.error(response.data.error);
      }
    } catch (error) {
      console.error(error);
    }
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
          
          {showmemberdatabtn ? (
            <button
              className="addpostbtn"
              onClick={handleMemberDataButtonClick}
            >
              Member Data
            </button>
          ) : (
            <>
              <button
                className="addpostbtn"
                onClick={handleMemberDataButtonClick}
              >
                Org Data
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
                  <span>Start Date:</span>
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
                  <span>Expiry Date:</span>
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
                            src={orgData.background_image }
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
                              onClick={() => handlesorting("name")}
                            />
                          </span>
                          <span>
                            <IoIosArrowDropdownCircle
                              onClick={() => handlesorting("name")}
                            />
                          </span>
                        </span>
                      </th>
                      <th scope="col" className="tablehead align-middle">
                        Email
                      </th>
                      <th scope="col" className="tablehead align-middle">
                        <span>Number </span>
                        <span>
                          <span>
                            <IoIosArrowDropupCircle
                              onClick={() => handlesorting("pnumber")}
                            />
                          </span>
                          <span>
                            <IoIosArrowDropdownCircle
                              onClick={() => handlesorting("pnumber")}
                            />
                          </span>
                        </span>
                      </th>
                      <th scope="col" className="tablehead align-middle">
                        Gender
                      </th>
                      <th scope="col" className="tablehead align-middle">
                        Type
                      </th>
                      <th scope="col" className="tablehead align-middle">
                        <span>Start date </span>
                        <span>
                          <span>
                            <IoIosArrowDropupCircle
                              onClick={() => handlesorting("start_date")}
                            />
                          </span>
                          <span>
                            <IoIosArrowDropdownCircle
                              onClick={() => handlesorting("start_date")}
                            />
                          </span>
                        </span>
                      </th>

                      <th scope="col" className="tablehead align-middle">
                        <span>Expiry date </span>
                        <span>
                          <span>
                            <IoIosArrowDropupCircle
                              onClick={() => handlesorting("expiry_date")}
                            />
                          </span>
                          <span>
                            <IoIosArrowDropdownCircle
                              onClick={() => handlesorting("expiry_date")}
                            />
                          </span>
                        </span>
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

export default AdminAuthorityOrgDetails;
{
  /**/
}
