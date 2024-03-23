// AdminAuthority
import React, { useState, useEffect } from "react";
import AdminNavbar from "../Admin/AdminNavbar";
import "../../css/OrganisationEvent/memberdetails.css";
import api from "../api";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import {
  IoIosArrowDropupCircle,
  IoIosArrowDropdownCircle,
} from "react-icons/io";
import { GrPowerReset } from "react-icons/gr";

function AdminAuthority() {
  const [bvalue, setBValue] = useState(true);
  const [details, setDetails] = useState();
  const [noappliedorg, setNoappliedorg] = useState(false);
  const [searchForm, setSearchform] = useState({
    clubname: "",
  });
  // const [orgData, setOrgData] = useState(
  //   JSON.parse(localStorage.getItem("organisers"))
  // );
  const [filters, setFilters] = useState({
    clubname: "",
    username: "",
    ownname: "",
    email: "",
    pnumber: "",
  });
  const [memType, setMemType] = useState();

  const fetchAllMemtypedetails = async () => {
    try {
      // const cname = orgData.clubname;
      // const response = await api.post("/getmemtype/", { clubname: cname });
      // setMemType(response.data);
      // console.log(response.data);
    } catch (error) {
      console.error("Error fetching details:", error);
    }
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
      const data = { col: col["name"], value: col["value"],"members":details };
      const checking = await api.post("/adminmembersorting", data);
      if (checking.data.success !== false) {
        setDetails(checking.data);
      } else {
        toast.error(checking.data.error);
      }
    } catch (error) {
      console.error("Error fetching details:", error);
    }
  };

  const handleformreset = () => {
    fetchAllMemberdetails();
    setFilters({
      clubname: "",
      username: "",
      ownname: "",
      email: "",
      pnumber: "",
    });
    setSearchform({
      clubname: "",
    });
  };

  const fetchAllMemberdetails = async () => {
    try {
      const response = await api.get("/allappliedorg");
      if (response.data.success !== false) {
        setDetails(response.data);
      } else if (response.data.message == "empty") {
        setNoappliedorg(true);
      }
      // console.log(response.data);
    } catch (error) {
      console.error("Error fetching details:", error);
    }
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchMembersFilters();
    }, 100);
    return () => clearTimeout(timeoutId);
  }, [filters]);

  const handleorgaccept = async (org) => {
    console.log("Accept org method");
    try {
      console.log(org);
      const data = { data: org };
      const response = await api.post("/acceptingorg", data);
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

  const handleorgreject = async (org) => {
    console.log("Accept org method");
    try {
      console.log(org);
      const data = { data: org };
      const response = await api.post("/rejectingorg", data);
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
  const handleSearchInputChange = (event) => {
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
    // console.log(data);
    try {
      const response = await api.post("/searchorgbyname", data);
      if (response.data.success !== false) {
        setDetails(response.data);
      } else {
        toast.error(response.data.error);
      }
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
      const data = { data: filters };
      const response = await api.post("/appliedorgtablefilters", data);
      console.log(response.data);
      if (response.data.data_dict === "empty") {
        fetchAllMemberdetails();
      } else if (response.data.success != false) {
        console.log("Response=" + response.data.error);
        setDetails(response.data);
      } else {
        toast.error(response.data.error);
        fetchAllMemberdetails();
      }
    } catch (error) {
      console.error(error);
    }
  };

  // console.log(filters);
  const navigate = useNavigate();
  const handleorgreadmore = (org) => {
    navigate("/admin/appliedorgdetails", {
      state: JSON.stringify(org),
    });
  };

  return (
    <>
      <div>
        <AdminNavbar />
      </div>
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
      <div className="row">
        <div className="col-12">
          {/* <br /> */}

          {noappliedorg ? (
            <>
              <table className="table table-bordered">
                <thead>
                  <tr>
                    <th scope="col" className="tablehead align-middle">
                      Sno
                    </th>
                    <th scope="col" className="tablehead align-middle">
                      <span>Org Name </span>
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
                      Username
                    </th>
                    <th scope="col" className="tablehead align-middle">
                      Owner Name
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
                      Read More..
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
              <div>
                <h1
                  style={{ margin: "5rem", color: "black" }}
                  className="d-flex flex-column align-items-center"
                >
                  No Applied Organization!
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
                        <span>Org Name </span>
                        <span>
                          <span>
                            <IoIosArrowDropupCircle
                              style={{"cursor":"pointer"}}
                              onClick={() => handlesorting({"name":"name","value":true})}
                            />
                          </span>
                          <span>
                            <IoIosArrowDropdownCircle
                              style={{"cursor":"pointer"}}
                              onClick={() => handlesorting({"name":"name","value":false})}
                            />
                          </span>
                        </span>
                      </th>
                      <th scope="col" className="tablehead align-middle">
                        Username
                      </th>
                      <th scope="col" className="tablehead align-middle">
                        Owner Name
                      </th>
                      <th scope="col" className="tablehead align-middle">
                        Email
                      </th>
                      <th scope="col" className="tablehead align-middle">
                        <span>Number </span>
                        <span>
                          <span>
                            <IoIosArrowDropupCircle
                              style={{"cursor":"pointer"}}
                              onClick={() => handlesorting({"name":"pnumber","value":true})}
                            />
                          </span>
                          <span>
                            <IoIosArrowDropdownCircle
                              style={{"cursor":"pointer"}}
                              onClick={() => handlesorting({"name":"pnumber","value":false})}
                            />
                          </span>
                        </span>
                      </th>
                      <th scope="col" className="tablehead align-middle">
                        Read More..
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
                    

                    {details.map((org, index) => (
                      <tr>
                        <td className="trtext">{index + 1} </td>
                        <td className="trtext">{org.clubname} </td>
                        <td className="trtext">{org.username} </td>
                        <td className="trtext">{org.ownname} </td>
                        <td className="trtext">{org.email} </td>
                        <td className="trtext">{org.pnumber} </td>

                        <td className="trtext">
                          <button
                            className="addmembtn"
                            onClick={() => handleorgreadmore(org)}
                          >
                            Read More..
                          </button>
                        </td>
                        <td className="trtext">
                          <button
                            className="addmembtn"
                            onClick={() => handleorgaccept(org)}
                          >
                            Accept
                          </button>
                        </td>
                        <td className="trtext">
                          <button
                            className="addmembtn"
                            onClick={() => handleorgreject(org)}
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

export default AdminAuthority;
