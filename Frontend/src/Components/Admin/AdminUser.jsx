// AdminUser
import React, { useState, useEffect } from "react";
import AdminNavbar from "./AdminNavbar";
// import "../../css/OrganisationEvent/memberdetails.css";
import { toast } from "react-toastify";
import {
  IoIosArrowDropupCircle,
  IoIosArrowDropdownCircle,
} from "react-icons/io";
import api from "../../api";

function AdminUser() {
  const [bvalue, setBValue] = useState(true);
  const [shownewusers, setNewusers] = useState(false);
  const [details, setDetails] = useState();
  const [searchForm, setSearchform] = useState({
    membername: "",
  });
  // const [userData, setOrgData] = useState();
  const [filters, setFilters] = useState({
    memberid: "",
    username: "",
    name: "",
    email: "",
    pnumber: "",
    gender: "",
    membertype: "",
  });

  function formatDateForInput(dateString) {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return ""; // Invalid date, return an empty string
    }
    return date.toISOString().split("T")[0];
  }

  const handlesorting = async (col) => {
    try {
      // const data = { clubname: orgData.clubname, col: col, value: bvalue,"members":details };
      // const checking = await api.post("/membersorting", data);
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
    });

    fetchAllMemberdetails();
  };

  const fetchAllMemberdetails = async () => {
    setNewusers(!shownewusers);
    try {
      const response = await api.get("/adminmemberdetails");
      setDetails(response.data);
      // console.log(response.data);
    } catch (error) {
      console.error("Error fetching details:", error);
    }
  };
  // console.log(details);
  // useEffect(() => {
  //   fetchAllMemberdetails();
  // }, []);
  useEffect(() => {
    // Use a timeout to wait for the user to stop typing
    const timeoutId = setTimeout(() => {
      fetchMembersFilters();
    }, 100);
    return () => clearTimeout(timeoutId);
  }, [filters]);

  const handleSearchInputChange = (event) => {
    setSearchform({
      ...searchForm,
      [event.target.name]: event.target.value,
    });
  };
  const handlesearchSubmit = async (event) => {
    event.preventDefault();

    const data = {
      membername: searchForm["membername"],
    };
    // console.log("handle search submit");
    // console.log(data);

    try {
      const response = await api.post("/usersearchform", data);
      if (response.data.success !== false) {
        setDetails(response.data);
        // console.log(response.data);
      } else {
        fetchAllMemberdetails();
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
      // console.log("filtering details");
      // console.log(filters);
      const tablefilters = { data: filters };
      const response = await api.post("/adminusertablefilters", tablefilters);
      // console.log(response.data);
      if (response.data.success !== false) {
        // console.log("Response=" + response.data.error);
        setDetails(response.data);
      }
      else if (response.data.data_dict === "empty") {
        fetchAllMemberdetails();

      } else {
        toast.error(response.data.error);
        fetchAllMemberdetails();
      }
      // if (response.data.data_dict === "empty") {
      //   fetchAllMemberdetails();
      // } else if (response.data.success != false) {
      //   console.log("Response=" + response.data.error);
      //   setDetails(response.data);
      // } else {
      //   // fetchAllMemberdetails();
      //   toast.error(response.data.error);
      // }
    } catch (error) {
      console.error(error);
    }
  };

  // console.log(filters);

  const handleshownewusers = async () => {
    setNewusers(!shownewusers);
    try {
      const result = await api.get("/fetchingnewusers");
      if (result.data.success !== false) {
        setDetails(result.data);
      } else {
        fetchAllMemberdetails();
        toast.error(result.data.error);
      }
    } catch (error) {
      console.error(error);
    }
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
          justifyContent: "space-between",
        }}
      >
        <div>
          {shownewusers ? (
            <button className="addpostbtn mt-3" onClick={handleshownewusers}>
              New Users
            </button>
          ) : (
            <button className="addpostbtn mt-3" onClick={fetchAllMemberdetails}>
              All Users
            </button>
          )}

          <button className="addpostbtn mt-3" onClick={handleformreset}>
            Reset
          </button>
        </div>
        <div className="mt-3"></div>
        <div className="mt-3">
          <form className="form-inline my-lg-0 " onSubmit={handlesearchSubmit}>
            <div className="row">
              <div className="col-7 p-2">
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
                    <p>
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
                          onClick={() => handlesorting("start_date")}
                        />
                      </span>
                      <span>
                        <IoIosArrowDropdownCircle
                          onClick={() => handlesorting("start_date")}
                        />
                      </span>
                    </p>
                  </th>

                  <th scope="col" className="tablehead align-middle">
                    <span>Expiry date </span>
                    <p>
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
                      <input
                        className="trtext"
                        name="membertype"
                        value={filters.membertype}
                        onChange={handleFilterInputChange}
                      />
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
                {details.map((post, index) => (
                  <tr>
                    <td className="trtext">{index + 1}</td>
                    <td className="trtext">
                      {post.memberid ? post.memberid : "--"}
                    </td>
                    <td className="trtext">{post.username}</td>
                    <td className="trtext">{post.name}</td>
                    <td className="trtext">{post.email}</td>
                    <td className="trtext">{post.pnumber}</td>
                    <td className="trtext">{post.gender}</td>
                    <td className="trtext">
                      {post.membertype}
                    </td>
                    <td className="trtext">
                      {post.start_date ? post.start_date : "--"}
                    </td>
                    <td className="trtext">
                      {post.expiry_date ? post.expiry_date : "--"}
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

export default AdminUser;