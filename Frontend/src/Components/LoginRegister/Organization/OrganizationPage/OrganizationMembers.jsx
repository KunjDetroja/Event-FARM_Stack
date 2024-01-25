import React, { useState, useEffect } from 'react'
import { Link,useNavigate } from 'react-router-dom'
import OrganizationNavbar from './OrganizationNavbar'
// import "./Css/OrganizationEventCss.css"
import "./Css/OrganizationMemberCss.css"
import $ from "jquery"
import {
  FaArrowCircleRight,
  FaArrowCircleLeft,
} from "react-icons/fa";
import api from "../../../../api"
import { toast } from "react-toastify"

function OrganizationMember() {
  const navigate = useNavigate();
  const [details, setDetails] = useState()
  const [userData, setUserData] = useState(
    JSON.parse(localStorage.getItem("organization"))
  );
  const [lFormData, setLFormData] = useState({
    event_start_date: "",
    event_end_date: "",
    minprice: "",
    maxprice: "",
    venue_city: ""
  });


  function formatDateForInput(dateString) {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return ""; // Invalid date, return an empty string
    }
    return date.toISOString().split("T")[0];
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setLFormData({
      ...lFormData,
      [name]: value,
    });

  };

  

  const handleFormSubmit = async (event) => {
    event.preventDefault();

    // Filter out key-value pairs with empty values
    const filteredFormData = {};
    for (const key in lFormData) {
      if (lFormData[key] !== "") {
        filteredFormData[key] = lFormData[key];
      }
    }
    console.log("Filtered form:")
    console.log(filteredFormData);

    // Now you can use filteredFormData in your API call
    try {
      console.log("Inside try for api calling:")
      const checking = await api.post("/orgfilters/", filteredFormData);
      console.log(checking);
      if (checking.data.success !== false) {
        console.log(checking.data)
        setDetails(checking.data)
      }
      else {
        alert(checking.data.error)
      }

      // Rest of your code...
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  const handlememberupdate = (member) => {
    console.log("Update detail method");
    localStorage.setItem('member', JSON.stringify(member));
    navigate("/organizations/updatemember")
  };

  const handleformreset = () => {
    setLFormData({
      event_start_date: "",
      event_end_date: "",
      minprice: "",
      maxprice: "",
      venue_city: ""
    });
    fetchAllMemberdetails();
  }
  const [modalEaseIn, setModalEaseIn] = useState("");

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

    $(".modal").each(function () {
      $(this).on("show.bs.modal", function () {
        const easeIn = $(this).attr("data-easein");
        setModalEaseIn(easeIn);

        if (["bounce"].includes(easeIn)) {
          $(".modal-dialog").velocity(`callout.${easeIn}`);
        } else {
          $(".modal-dialog").velocity(`transition.${easeIn}`);
        }
      });
    });
  }, []);
  const [isCol2Visible, setIsCol2Visible] = useState(true);

  const toggleCol2Visibility = () => {
    setIsCol2Visible(!isCol2Visible);
  };


  const deleteMember = async (post) => {

    const data = { "orgid": userData._id, "memberid": post.memberid }
    console.log(data)
    try {
      const checking = await api.put("/deletemember", data);
      console.log(checking);
      if (checking.data.success !== false) {
        toast.success(checking.data.data)
        fetchAllMemberdetails();
      } else {
        toast.error(checking.data.data);
      }
    } catch (error) {
      console.error("Error fetching details:", error);
    }
  };
  return (
    <>
      <div><OrganizationNavbar /></div>
      <div>
        <Link to="/organizations/addmember">
          <button className="addpostbtn mt-3">Add New Member</button>
        </Link>
      </div>
      <hr />
      <div className="row">
        {isCol2Visible ? (
          <div
            className="col-2"
            style={{
              backgroundColor: "#0000",
              color: "#0e2643",
              cursor: "pointer",
            }}
          >
            <div className='d-flex flex-column align-items-end'>
              <FaArrowCircleLeft
                className=" mt-2"
                onClick={toggleCol2Visibility}
                style={{ fontSize: "2.2rem" }}
              /></div>
            <br />
            <div className="row">
              <p className="col-6 card_title">Filter</p>
              <div className="col-6">
                <div className="d-grid">
                  <button className="addpostbtn" onClick={handleformreset} >
                    Reset
                  </button>
                </div>
              </div>
            </div>

            <form onSubmit={handleFormSubmit}>
              <div className="row gy-2 overflow-hidden ms-2">
                <div className="col-12">
                  <div className="form-floating mb-1">
                    <input
                      onChange={handleInputChange}
                      type="date"
                      className="form-control"
                      id="event_start_date"
                      placeholder=""
                      name="event_start_date"
                      value={formatDateForInput(lFormData.event_start_date)}
                    />
                    <label
                      htmlFor="event_start_date"
                      className="form-label"
                    >
                      Start Date
                    </label>
                  </div>
                </div>
                <div className="col-12">
                  <div className="form-floating mb-1">
                    <input
                      onChange={handleInputChange}
                      type="date"
                      className="form-control"
                      id="event_end_date"
                      placeholder=""
                      name="event_end_date"
                      value={formatDateForInput(lFormData.event_end_date)}
                    />
                    <label htmlFor="event_end_date" className="form-label">
                      End Date
                    </label>
                  </div>
                </div>

                <div className="col-12">
                  <h5 className="row ms-1">Price</h5>
                  <div className="row">
                    <div className="col-6">
                      <div className="form-floating mb-1">
                        <input
                          onChange={handleInputChange}
                          type="number"
                          step="0.01"
                          className="form-control"
                          id="minprice"
                          placeholder=""
                          name="minprice"
                          value={lFormData.minprice}
                        />
                        <label
                          htmlFor="minprice"
                          className="form-label"
                        >
                          Min
                        </label>
                      </div>
                    </div>
                    <div className="col-6">
                      <div className="form-floating mb-1">
                        <input
                          onChange={handleInputChange}
                          type="number"
                          step="0.01"
                          className="form-control"
                          id="maxprice"
                          placeholder=""
                          name="maxprice"
                          value={lFormData.maxprice}
                        />
                        <label
                          htmlFor="maxprice"
                          className="form-label"
                        >
                          Max
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-12">
                  <div className="form-floating mb-1">
                    <input
                      onChange={handleInputChange}
                      type="text"
                      className="form-control"
                      id="venue_city"
                      placeholder=""
                      name="venue_city"
                      value={lFormData.venue_city}
                    />
                    <label htmlFor="venue_city" className="form-label">
                      Venue City
                    </label>
                  </div>
                </div>
                <div className="col-12">
                  <div className="d-grid">
                    <button className="addpostbtn" type="submit">
                      Apply
                    </button>
                  </div>
                </div>
              </div>
            </form>
          </div>
        ) : (
          <div className="col-12" style={{ cursor: "pointer" }}>
            <FaArrowCircleRight
              className=" mt-2"
              onClick={toggleCol2Visibility}
              style={{ fontSize: "2.2rem" }}
            />
          </div>
        )}
        <div className={isCol2Visible ? "col-10" : "col-12 m-2"}>
          {/* <br /> */}


          {details && details.length ? (
            <table className="table table-bordered">
              <thead >
                <tr>
                  <th scope="col" className='tablehead align-middle'>Sno</th>
                  <th scope="col" className='tablehead align-middle'>Id</th>
                  <th scope="col" className='tablehead align-middle'>Username</th>
                  <th scope="col" className='tablehead align-middle'>Name</th>
                  <th scope="col" className='tablehead align-middle'>Email</th>
                  <th scope="col" className='tablehead align-middle'>Number</th>
                  <th scope="col" className='tablehead align-middle'>Gender</th>
                  <th scope="col" className='tablehead align-middle'>Type</th>
                  <th scope="col" className='tablehead align-middle'>Start date</th>
                  <th scope="col" className='tablehead align-middle'>Expiry date</th>
                  <th scope="col" className='tablehead align-middle'>Update</th>
                  <th scope="col" className='tablehead align-middle'>Delete</th>
                  {/* <th scope="col">Username</th>
                  <th scope="col">Password</th> */}
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td></td>
                  <td><input className='trtext' style={{width:"80px"}}/></td>
                  <td><input className='trtext' style={{width:"80px"}}/></td>
                  <td><input className='trtext' style={{width:"80px"}}/></td>
                  <td><input className='trtext' style={{width:"80px"}}/></td>
                  <td><input className='trtext' style={{width:"80px"}}/></td>
                  <td><input className='trtext' style={{width:"80px"}}/></td>
                  <td><input className='trtext' style={{width:"80px"}}/></td>
                  <td><input className='trtext' style={{width:"80px"}}/></td>
                  <td><input className='trtext' style={{width:"80px"}}/></td>
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
