import React, { useState, useEffect } from "react";
import OrganisationNavbar from "../OrganisationNavbar";
import "../../css/OrganisationEvent/memberdetails.css";
import api from "../api";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import {
  IoIosArrowDropupCircle,
  IoIosArrowDropdownCircle,
} from "react-icons/io";

function OrgMemberDetails() {
  const [bvalue, setBValue] = useState(true);
  const [showeventwiz, setShowEventWiz] = useState(false);
  const [details, setDetails] = useState();

  const [searchForm, setSearchform] = useState({
    membername: "",
    start_date: "",
    expiry_date: "",
  });
  const [orgData, setOrgData] = useState(
    JSON.parse(localStorage.getItem("organisers"))
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
  const [memType, setMemType] = useState();

  const fetchAllMemtypedetails = async () => {
    try {
      const cname = orgData.clubname;
      const response = await api.post("/getmemtype/", { clubname: cname });
      setMemType(response.data);
      console.log(response.data);
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
      const data = {
        clubname: orgData.clubname,
        col: col["name"],
        value: col["value"],
        members: details,
      };
      const checking = await api.post("/membersortinguserside", data);
      console.log(checking);
      if (checking.data.success !== false) {
        console.log(checking.data);
        setBValue(!bvalue);
        setDetails(checking.data);
      } else {
        toast.error(checking.data.error);
      }
    } catch (error) {
      console.error("Error fetching details:", error);
    }
  };

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
    setShowEventWiz(false);
    fetchAllMemberdetails();
  };

  const fetchAllMemberdetails = async () => {
    try {
      // console.log(orgData.clubname);
      const cname = orgData.clubname; //Rajpath
      // console.log(typeof cname); //string
      const response = await api.post("/organizationmemberdetails/", {
        clubname: cname,
      });
      if (response.data.success !== false) {
        // console.log(response.data);
        setDetails(response.data);
      } else {
        toast.error(response.data.error);
        fetchAllMemberdetails();
      }
    } catch (error) {
      console.error("Error fetching details:", error);
    }
  };

  useEffect(() => {
    fetchAllMemtypedetails();
    // Use a timeout to wait for the user to stop typing
    const timeoutId = setTimeout(() => {
      fetchMembersFilters();
    }, 100);
    return () => clearTimeout(timeoutId);
  }, [filters]);

  const navigate = useNavigate();
  const handlememberupdate = (member) => {
    console.log("Update detail method");
    localStorage.setItem("member", JSON.stringify(member));
    navigate("/organisationevents/organizationupdatememberdetails");
  };

  const handlememberdelete = async (post) => {
    const data = { orgid: orgData._id, memberid: post.memberid };
    console.log(data);
    try {
      const checking = await api.put("/deletemember", data);
      console.log(checking);
      if (checking.data.success !== false) {
        toast.success(checking.data.data);
        fetchAllMemberdetails();
      } else {
        toast.error(checking.data.data);
      }
    } catch (error) {
      console.error("Error fetching details:", error);
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
      cid: orgData._id,
      membername: searchForm["membername"],
      start_date: searchForm["start_date"],
      expiry_date: searchForm["expiry_date"],
    };
    console.log("handle search submit");
    console.log(data);
    try {
      // console.log(data);
      // const cname = orgData._id; //Rajpath
      // // console.log(typeof cname); //string
      const response = await api.post("/orgmemberfilter/", data);
      setDetails(response.data);
      console.log(response.data);
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
      console.log("filtering details");
      console.log(filters);
      const tablefilters = { data: filters, orgid: orgData._id };
      const response = await api.post(
        "/organisationmembertablefilters",
        tablefilters
      );
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

  const handleLoggedinmembers = async () => {
    setShowEventWiz(true);
    try {
      console.log(memberslist);
      const result = await api.post("/loggedinmembers", {
        data: memberslist,
      });
      console.log(result.data); // Log the result for debugging
      if (result.data.success !== false) {
        setDetails(result.data);
      } else {
        setDetails(memberslist);
        toast.error(result.data.error);
      }
    } catch (error) {
      console.error("Error in handleLoggedinmembers:", error);
    }
  };

  const handleInactivemembers = async () => {
    setShowEventWiz(false);
    try {
      console.log(memberslist);
      const result = await api.post("/inactivemembers", {
        data: memberslist,
      });
      console.log(result.data); // Log the result for debugging
      if (result.data.success !== false) {
        setDetails(result.data);
      } else {
        setDetails(memberslist);
        toast.error(result.data.error);
      }
    } catch (error) {
      console.error("Error in handleInactivemembers:", error);
    }
  };

  const handleSubscribers = async () => {
    try {
      const result = await api.post("/subscribeusers", {
        data: memberslist,
      });
      if (result.data.success !== false) {
        setDetails(result.data);
      } else if (result.data.error === "empty") {
        toast(result.data.message);
        setShowEventWiz(false);
      } else {
        toast.error(result.data.error);
        setShowEventWiz(false);
        setDetails(orgData.members);
      }
    } catch (error) {
      console.error("Error in handleInactivemembers:", error);
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
          <Link to="/organisationevents/organizationaddmember">
            <button className="addpostbtn mt-3">Add New Member</button>
          </Link>
          <button className="addpostbtn mt-3" onClick={handleformreset}>
            Reset
          </button>
        </div>
        <div className="mt-3"></div>
        <div className="mt-3">
          <form className="form-inline my-lg-0 " onSubmit={handlesearchSubmit}>
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
      <div>
        <button className="addpostbtn" onClick={handleLoggedinmembers}>
          Active Members
        </button>
        {showeventwiz && (
          <span>
            <button className="addpostbtn" onClick={handleSubscribers}>
              EventWiz Subscribers
            </button>
          </span>
        )}
        <button className="addpostbtn" onClick={handleInactivemembers}>
          Inactive Members
        </button>
      </div>
      <hr />
      <div className="row">
        <div className="col-12">
          {/* <br /> */}

          {details && details.length ? (
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
                    <span>
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
                          style={{ cursor: "pointer" }}
                          onClick={() =>
                            handlesorting({ name: "start_date", value: true })
                          }
                        />
                      </span>
                      <span>
                        <IoIosArrowDropdownCircle
                          style={{ cursor: "pointer" }}
                          onClick={() =>
                            handlesorting({ name: "start_date", value: false })
                          }
                        />
                      </span>
                    </span>
                  </th>
                  <th scope="col" className="tablehead align-middle">
                    <span>Expiry date </span>
                    <span>
                      <span>
                        <IoIosArrowDropupCircle
                          style={{ cursor: "pointer" }}
                          onClick={() =>
                            handlesorting({ name: "expiry_date", value: true })
                          }
                        />
                      </span>
                      <span>
                        <IoIosArrowDropdownCircle
                          style={{ cursor: "pointer" }}
                          onClick={() =>
                            handlesorting({ name: "expiry_date", value: false })
                          }
                        />
                      </span>
                    </span>
                  </th>
                  <th scope="col" className="tablehead align-middle">
                    Update
                  </th>
                  <th scope="col" className="tablehead align-middle">
                    Delete
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
                        {memType?.map((type) => (
                          <option key={type} value={type}>
                            {type}
                          </option>
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
                  <td className="trtext">--</td>
                  <td className="trtext">--</td>
                </tr>
                {details.map((post, index) => (
                  <tr key={post.memberid}>
                    <td className="trtext">{index + 1}</td>
                    <td className="trtext">{post.memberid}</td>
                    <td className="trtext">{post.username}</td>
                    <td className="trtext">{post.name}</td>
                    <td className="trtext">{post.email}</td>
                    <td className="trtext">{post.pnumber}</td>
                    <td className="trtext">{post.gender}</td>
                    <td className="trtext">{post.membertype}</td>
                    <td className="trtext">{post.start_date}</td>
                    <td className="trtext">{post.expiry_date}</td>
                    <td className="trtext">
                      <button
                        className="addmembtn"
                        onClick={() => handlememberupdate(post)}
                      >
                        Update
                      </button>
                    </td>
                    <td className="trtext">
                      <button
                        className="addmembtn"
                        onClick={() => handlememberdelete(post)}
                      >
                        Delete
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
        </div>
      </div>
    </>
  );
}

export default OrgMemberDetails;
