//OrgAuthorization
import React, { useState, useEffect } from "react";
import OrganisationNavbar from "../OrganisationNavbar";
import "../../css/OrganisationEvent/memberdetails.css";
import api from "../api";
import { toast } from "react-toastify";
// import { Link, useNavigate } from "react-router-dom";
import {
  IoIosArrowDropupCircle,
  IoIosArrowDropdownCircle,
  IoMdClose,
} from "react-icons/io";

function OrgAuthorization() {
  const [singleuser, setSingleuser] = useState();
  const [noappliedusers, setNoappliedusers] = useState(false);
  const [bvalue, setBValue] = useState(true);
  const [showmemberid, setShowMemberid] = useState(false);
  const [memberid, setMemberid] = useState({
    memberid: "",
    start_date: "",
    expiry_date: "",
  });

  const [details, setDetails] = useState();
  const [searchForm, setSearchform] = useState({
    membername: "",
  });

  const [filters, setFilters] = useState({
    username: "",
    name: "",
    email: "",
    pnumber: "",
    gender: "",
    membertype: "",
  });
  const [orgData, setOrgData] = useState(
    JSON.parse(localStorage.getItem("organisers"))
  );

  function formatDateForInput(dateString) {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return ""; // Invalid date, return an empty string
    }
    return date.toISOString().split("T")[0];
  }

  const handlesorting = async (col) => {
    try {
      // const data = { clubname: orgData.clubname, col: col, value: bvalue };
      // const checking = await api.post("/membersortinguserside", data);
      // console.log(checking);
      // if (checking.data.success !== false) {
      //   console.log(checking.data);
      //   setBValue(!bvalue);
      //   setDetails(checking.data);
      // } else {
      //   toast.error(checking.data.error);
      // }
    } catch (error) {
      console.error("Error fetching details:", error);
    }
  };

  const handleformreset = () => {
    setFilters({
      username: "",
      name: "",
      email: "",
      pnumber: "",
      gender: "",
      membertype: "",
    });
    setSearchform({
      membername: "",
    });
    setMemberid({
      memberid: "",
      start_date: "",
      expiry_date: "",
    });
    fetchAllMemberdetails();
  };

  const fetchAllMemberdetails = async () => {
    // setNewusers(!shownewusers);
    try {
      const data = { clubid: orgData["_id"] };
      const response = await api.post("/allappliedusers", data);
      if (response.data.success !== false) {
        setDetails(response.data);
      } else if (response.data.message == "empty") {
        setNoappliedusers(true);
        // toast.error(response.data.error);
      }
      // console.log(response.data);
    } catch (error) {
      console.error("Error fetching details:", error);
    }
  };
  //   console.log(details);
  useEffect(() => {
    fetchAllMemberdetails();
  }, []);
  //   useEffect(() => {
  //     // Use a timeout to wait for the user to stop typing
  //     const timeoutId = setTimeout(() => {
  //       fetchMembersFilters();
  //     }, 100);
  //     return () => clearTimeout(timeoutId);
  //   }, [filters]);

  const handleSearchInputChange = (event) => {
    setSearchform({
      ...searchForm,
      [event.target.name]: event.target.value,
    });
  };
  const handlesearchSubmit = async (event) => {
    event.preventDefault();

    // const data = {
    //   membername: searchForm["membername"],
    //   start_date: searchForm["start_date"],
    //   expiry_date: searchForm["expiry_date"],
    // };
    // console.log("handle search submit");
    // console.log(data);

    try {
      //   const response = await api.post("/usersearchform", data);
      //   if (response.data.success !== false) {
      //     setDetails(response.data);
      //     console.log(response.data);
      //   } else {
      //     fetchAllMemberdetails();
      //     alert(response.data.error);
      //   }
    } catch (error) {
      console.error("Error fetching details:", error);
    }
  };

  const handleFilterInputChange = (e) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value,
    }));
  };

  const fetchMembersFilters = async () => {
    try {
      //   console.log("filtering details");
      //   console.log(filters);
      //   const tablefilters = { data: filters };
      //   const response = await api.post("/adminusertablefilters", tablefilters);
      //   console.log(response.data);
      //   if (response.data.data_dict === "empty") {
      //     fetchAllMemberdetails();
      //   } else if (response.data.success != false) {
      //     console.log("Response=" + response.data.error);
      //     // setDetails(response.data);
      //   } else {
      //     alert(response.data.error);
      //     fetchAllMemberdetails();
      //   }
    } catch (error) {
      console.error(error);
    }
  };

  //   console.log(filters);

  const handleAcceptUserSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log(singleuser);
      const data = {
        data: singleuser,
        memberdata: memberid,
        clubid: orgData["_id"],
      };
      console.log(data["memberid"]);

      const response = await api.post("/acceptingusersubscription", data);
      if (response.data.success !== false) {
        setShowMemberid(false);
        setMemberid({
          memberid: "",
          start_date: "",
          expiry_date: "",
        });
      } else if (response.data.closeform !== false) {
        toast.error(response.data.error);
      } else {
        toast.error(response.data.error);
      }

      fetchAllMemberdetails();
    } catch (error) {
      console.log(error);
    }
  };

  const handleAcceptInputChange = (e) => {
    const { name, value } = e.target;
    setMemberid({
      ...memberid,
      [name]: value,
    });
  };

  const closeAcceptForm = () => {
    setShowMemberid(false);
  };
  const handleorgaccept = async (user) => {
    console.log("Accept org method");
    setShowMemberid(true);
    setSingleuser(user);
  };

  const handleorgreject = async (user) => {
    console.log("Accept org method");
    try {
      // console.log(user)
      const data = { data: user, clubid: orgData["_id"] };
      console.log(data);

      const response = await api.post("/rejectingsubscribinguser", data);
      if (response.data.success !== false) {
        fetchAllMemberdetails();
      } else {
        toast.error(response.data.error);
        fetchAllMemberdetails();
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <div>
        <OrganisationNavbar />
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        <div>
          <button className="addpostbtn mt-3" onClick={handleformreset}>
            Reset
          </button>
        </div>
        <div className="mt-3"></div>
        <div className="mt-3">
          <form className="form-inline my-lg-0 " onSubmit={handlesearchSubmit}>
            <div className="row">
              <div className="col p-2">
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
            </div>
          </form>
        </div>
      </div>
      <hr />
      <div className="row">
        <div className="col-12">
          {/* <br /> */}

          {showmemberid && (
            <form onSubmit={handleAcceptUserSubmit}>
              <div className="row gy-3 overflow-hidden">
                <div className="col-3">
                  <div className="form-floating mb-3">
                    <input
                      onChange={handleAcceptInputChange}
                      type="text"
                      className="form-control"
                      id="memberid"
                      placeholder=""
                      name="memberid"
                      value={memberid.memberid}
                    />
                    <label htmlFor="memberid" className="form-label">
                      Member ID
                    </label>
                  </div>
                </div>
                <div className="col-2">
                  <p>Start Date:</p>
                  <input
                    type="date"
                    className="trtext"
                    name="start_date"
                    value={memberid.start_date}
                    onChange={handleAcceptInputChange}
                    style={{ width: "10rem" }}
                  />
                </div>
                <div className="col-3">
                  <p>Expiry Date:</p>
                  <input
                    type="date"
                    className="trtext"
                    style={{ width: "10rem" }}
                    name="expiry_date"
                    value={memberid.expiry_date}
                    onChange={handleAcceptInputChange}
                  />
                </div>
                <div className="col-2">
                  <div>
                    <button type="submit" className="memtypesavesubmitbtn">
                      Save
                    </button>
                  </div>
                </div>
                <div className="col-1"></div>
                <div className="col-1">
                  <div>
                    <button className=" closeformbtn" onClick={closeAcceptForm}>
                      <IoMdClose
                        style={{ height: "1.5rem", width: "1.5rem" }}
                      />
                    </button>
                  </div>
                </div>
              </div>
            </form>
          )}
          {noappliedusers ? (
            <>
              <table className="table table-bordered">
                <thead>
                  <tr>
                    <th scope="col" className="tablehead align-middle">
                      Sno
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
                          <IoIosArrowDropupCircle />
                        </span>
                        <span>
                          <IoIosArrowDropdownCircle />
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
                      Accept
                    </th>
                    <th scope="col" className="tablehead align-middle">
                      Reject
                    </th>
                  </tr>
                </thead>
              </table>
              <div >
                <h1
                  style={{ margin: "5rem", color: "black" }}
                  className="d-flex flex-column align-items-center"
                >
                  No Applied Users!
                </h1>
              </div>
            </>
          ) : (
            <>
              {details && details.length ? (
                <table className="table table-bordered">
                  <thead>
                    <tr>
                      <th scope="col" className="tablehead align-middle">
                        Sno
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
                        Accept
                      </th>
                      <th scope="col" className="tablehead align-middle">
                        Reject
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {details.map((user, index) => (
                      <tr>
                        <td className="trtext">{index + 1}</td>

                        <td className="trtext">{user.username}</td>
                        <td className="trtext">{user.name}</td>
                        <td className="trtext">{user.email}</td>
                        <td className="trtext">{user.pnumber}</td>
                        <td className="trtext">{user.gender}</td>
                        <td className="trtext">{user.membertype}</td>

                        <td className="trtext">
                          <button
                            className="addmembtn"
                            onClick={() => handleorgaccept(user)}
                          >
                            Accept
                          </button>
                        </td>
                        <td className="trtext">
                          <button
                            className="addmembtn"
                            onClick={() => handleorgreject(user)}
                          >
                            Reject
                          </button>
                        </td>
                        {/* <td scope="col">{post.username}</td>
                    <td scope="col">{post.pwd}</td> */}
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p>No Records...</p>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
}

export default OrgAuthorization;
