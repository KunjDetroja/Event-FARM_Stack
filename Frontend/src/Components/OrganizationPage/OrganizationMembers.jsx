import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import OrganizationNavbar from './OrganizationNavbar'
import "./Css/OrganizationMemberCss.css"
import api from '../../api'
import { toast } from "react-toastify"

function OrganizationMember() {
  const navigate = useNavigate();
  const [bvalue, setBValue] = useState(true)
  const [details, setDetails] = useState()
  const [searchForm, setSearchform] = useState({
    membername: "",
  });
  const [userData, setUserData] = useState(
    JSON.parse(localStorage.getItem("organization"))
  );
  const [filters, setFilters] = useState({
    memberid: "",
    username: "",
    name: "",
    email: "",
    pnumber: "",
    gender: "",
    membertype: "",
    start_date: "",
    expiry_date: "",
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
      const data = { "clubname": userData.clubname, "col": col, "value": bvalue }
      const checking = await api.post("/membersorting", data);
      console.log(checking);
      if (checking.data.success !== false) {
        console.log(checking.data)
        setBValue(!bvalue)
        setDetails(checking.data)
      }
      else {
        toast.error(checking.data.error)
      }

    } catch (error) {
      console.error("Error fetching details:", error);
    }

  }

  const handlememberupdate = (member) => {
    console.log("Update detail method");
    localStorage.setItem('member', JSON.stringify(member));
    navigate("/organizations/members/updatemember")
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
      start_date: "",
      expiry_date: "",
    });
    setSearchform({
      membername: "",
    });
    fetchAllMemberdetails();
  }
  // const [modalEaseIn, setModalEaseIn] = useState("");

  const fetchAllMemberdetails = async () => {
    try {
      // console.log(userData.clubname);
      const cname = userData.clubname; //Rajpath
      // console.log(typeof cname); //string
      const response = await api.post("/organizationmember/", { "clubname": cname });
      setDetails(response.data);
      console.log(response.data);
    } catch (error) {
      console.error("Error fetching details:", error);
    }
  };
  useEffect(() => {
    fetchAllMemberdetails();
    fetchMembersFilters();
  }, []);
  const deleteMember = async (post) => {
    const data = { "orgid": userData._id, "memberid": post.memberid }
    console.log(data)
    try {
      const checking = await api.put("/deletemember", data);
      console.log(checking);
      if (checking.data.success !== false) {
        toast.success("Member Deleted Successfully")
        fetchAllMemberdetails();
      } else {
        toast.error(checking.data.error);
      }
    } catch (error) {
      console.error("Error fetching details:", error);
    }
  };

  const handleSearchInputChange = (e) => {
    const { name, value } = e.target;
    setSearchform({
      ...searchForm,
      [name]: value,
    });
  };

  const handlesearchSubmit = async (event) => {
    event.preventDefault();

    const data = { cid: userData._id, membername: searchForm["membername"] };
    console.log("handle search submit");
    try {
      console.log(data);
      // const cname = userData._id; //Rajpath
      // // console.log(typeof cname); //string
      const response = await api.post("/orgmemberfilterbyname/", data);
      setDetails(response.data);
      console.log(response.data);
    } catch (error) {
      console.error("Error fetching details:", error);
    }
  };

  const fetchMembersFilters = async () => {
    try {
      console.log("filtering details");
      console.log(filters);
      const tablefilters = { data: filters, orgid: userData._id };
      const response = await api.post(
        "/organisationmembertablefilters",
        tablefilters
      );
      if (response.data.data_dict === "empty") {
        fetchAllMemberdetails();
      }
      else if (response.data.success !== false) {
        console.log("Response=" + response.data.error);
        setDetails(response.data);
      }
      else {
        alert(response.data.error)
      }
    } catch (error) {
      alert(error);
    }
  };

  const handleFilterInputChange = (e) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value,
    }));
    fetchMembersFilters();
  };

  return (
    <>
      <div><OrganizationNavbar /></div>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
        }}>
        <Link to="/organizations/members/addmember">
          <button className="addpostbtn mt-3">Add New Member</button>
        </Link>
        <button className="addpostbtn mt-3" onClick={handleformreset}>
          Reset
        </button>
        <div className="mt-3">
          <form className="form-inline my-lg-0 " onSubmit={handlesearchSubmit}>
            <div className="row">
              <div className="col-10  p-2">
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
        <div className="col-12 m-2">
          {details && details.length ? (
            <table className="table table-bordered">
              <thead >
                <tr>
                  <th scope="col" className='tablehead align-middle'>Sno</th>
                  <th scope="col" className='tablehead align-middle'>ID</th>
                  <th scope="col" className='tablehead align-middle'>Username</th>
                  <th scope="col" onClick={() => handlesorting("name")} className='tablehead align-middle'>Name</th>
                  <th scope="col" className='tablehead align-middle'>Email</th>
                  <th scope="col" onClick={() => handlesorting("pnumber")} className='tablehead align-middle'>Number</th>
                  <th scope="col" className='tablehead align-middle'>Gender</th>
                  <th scope="col" className='tablehead align-middle'>Type</th>
                  <th scope="col" onClick={() => handlesorting("start_date")} className='tablehead align-middle'>Start date</th>
                  <th scope="col" onClick={() => handlesorting("expiry_date")} className='tablehead align-middle'>Expiry date</th>
                  <th scope="col" className='tablehead align-middle'>Update</th>
                  <th scope="col" className='tablehead align-middle'>Delete</th>
                  {/* <th scope="col">Username</th>
                  <th scope="col">Password</th> */}
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td></td>
                  <td>
                    <div type="text" className="inputdiv">
                      <input className='trtext'
                        name="memberid"
                        value={filters.memberid}
                        onChange={handleFilterInputChange}
                      />
                    </div>
                  </td>
                  <td>
                    <div type="text" className="inputdiv">
                      <input className='trtext'
                        name="username"
                        value={filters.username}
                        onChange={handleFilterInputChange}
                      />
                    </div>
                  </td>
                  <td>
                    <div type="text" className="inputdiv">
                      <input className='trtext'
                        name="name"
                        value={filters.name}
                        onChange={handleFilterInputChange}
                      />
                    </div>
                  </td>
                  <td>
                    <div type="text" className="inputdiv">
                      <input className='trtext'
                        name="email"
                        value={filters.email}
                        onChange={handleFilterInputChange} />
                    </div>
                  </td>
                  <td>
                    <div type="number" className="inputdiv">
                      <input className='trtext'
                        name="email"
                        value={filters.email}
                        onChange={handleFilterInputChange}
                      />
                    </div>
                  </td>
                  <td>
                    <div type="text" className="inputdiv">
                      <input className='trtext'
                        name="gender"
                        value={filters.gender}
                        onChange={handleFilterInputChange}
                      />
                    </div>
                  </td>
                  <td>
                    <div type="text" className="inputdiv">
                      <input className='trtext'
                        name="membertype"
                        value={filters.membertype}
                        onChange={handleFilterInputChange}
                      />
                    </div>
                  </td>
                  <td>
                    <div type="text" className="inputdiv">
                      <input type='date' className='trtext'
                        name="start_date"
                        value={formatDateForInput(filters.start_date)}
                        onChange={handleFilterInputChange}
                        style={{ width: "102px" }}
                      />
                    </div>
                  </td>
                  <td>
                    <div type="text" className="inputdiv">
                      <input type='date' className='trtext' style={{ width: "102px" }}
                        name="expiry_date"
                        value={formatDateForInput(filters.expiry_date)}
                        onChange={handleFilterInputChange}
                      />
                    </div>
                  </td>
                  <td className='trtext'>--</td>
                  <td className='trtext'>--</td>

                </tr>
                {details.map((post, index) => (
                  <tr key={post.memberid} >
                    <td className='trtext'>{index + 1}</td>
                    <td className='trtext'>{post.memberid}</td>
                    <td className='trtext'>{post.username}</td>
                    <td className='trtext'>{post.name}</td>
                    <td className='trtext'>{post.email}</td>
                    <td className='trtext'>{post.pnumber}</td>
                    <td className='trtext'>{post.gender}</td>
                    <td className='trtext'>{post.membertype}</td>
                    <td className='trtext'>{post.start_date}</td>
                    <td className='trtext'>{post.expiry_date}</td>
                    <td className='trtext'>
                      <button className="addmembtn"
                        onClick={() => handlememberupdate(post)}
                      >
                        Update
                      </button>
                    </td>
                    <td className='trtext'>
                      <button className="addmembtn"
                        onClick={() => deleteMember(post)}
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

  )
}

export default OrganizationMember
