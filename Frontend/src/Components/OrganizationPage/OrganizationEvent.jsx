import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import { toast } from "react-toastify"
import OrganizationNavbar from './OrganizationNavbar'
import "./Css/OrganizationEventCss.css"
import $ from "jquery"
import {
  FaArrowCircleRight,
  FaArrowCircleLeft,
  FaRupeeSign,
} from "react-icons/fa";
import api from '../../api'

function OrganizationEvent() {
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

  const handledeletepost = async (post) => {
    // console.log("deleting button");
    try {
      const response = await api.delete(`/deleteeventposts/${post._id}`);
      // console.log(response);
      fetchAllPostdetails();
    } catch {
      toast.error("Error in Deleting");
    }
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
    // console.log("Filtered form:")
    // console.log(filteredFormData);

    // Now you can use filteredFormData in your API call
    try {
      // console.log("Inside try for api calling:")
      const checking = await api.post(`/postfilters/${userData.clubname}`, filteredFormData);
      // console.log(checking);
      if (checking.data.success !== false) {
        // console.log(checking.data)
        setDetails(checking.data)
      }
      else {
        toast.error(checking.data.error)
      }

      // Rest of your code...
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };


  const handleformreset = () => {
    setLFormData({
      event_start_date: "",
      event_end_date: "",
      minprice: "",
      maxprice: "",
      venue_city: ""
    });
    fetchAllPostdetails();
  }
  const [modalEaseIn, setModalEaseIn] = useState("");

  const fetchAllPostdetails = async () => {
    try {
      // console.log(userData.clubname);
      const cname = userData.clubname; //Rajpath
      // console.log(typeof cname); //string
      const response = await api.post("/geteventposts/", { "clubname": cname });
      setDetails(response.data);
      // console.log(response.data);
    } catch (error) {
      console.error("Error fetching details:", error);
    }
  };

  const navigate = useNavigate();
  const handlepostdetails = (post) => {
    // console.log(JSON.stringify(post))
    navigate("/organizations/event/eventdetails", {
      state: JSON.stringify(post),

    });
  };
  useEffect(() => {
    fetchAllPostdetails();

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
  return (
    <>
      <div><OrganizationNavbar /></div>
      <div>
        <Link to="/organizations/event/addpost">
          <button className="addpostbtn mt-3">Add New Post</button>
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
                      From
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
                      To
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
        <div className={isCol2Visible ? "col-10" : "col-12"}>
          {/* <br /> */}
          <div className="row">

            {details && details.length ? (
              details.map((post) => (
                <div
                  key={post._id}
                  className={
                    isCol2Visible
                      ? "col-4 maincardbody"
                      : "col-3 maincardbody"
                  }
                >
                  <div className="main">
                    <ul className="cards">
                      <li className="cards_item">
                        <div className="card">
                          <div className="card_image">
                            <img
                              src={post.event_image}
                              alt="event"
                              onClick={() => handlepostdetails(post)}
                              style={{ cursor: "pointer" }}
                            />
                            <span className="card_price cardspantag">
                              <span ><FaRupeeSign />{post.ticket_price}</span>
                            </span>
                          </div>
                          <div className="card_content">
                            <h2 className="card_title" onClick={() => handlepostdetails(post)} style={{ cursor: "pointer" }}>{post.event_title}</h2>
                            <div className="card_text">
                              <p className="cardptag">{post.event_highlight}</p>
                              <p className="cardptag">Venue: {post.venue_name}</p>
                              <span className="cardptag">Venue City: {post.venue_city}</span>
                              <hr className="cardhrtag" />
                              <p className="cardptag">
                                Event Dates:
                                <strong>
                                  {" "}
                                  {post.event_start_date}{" "}
                                </strong>{" "}
                                <span> TO </span>
                                <strong> {post.event_end_date}</strong>
                              </p>
                              <button onClick={() => handledeletepost(post)} className="deletepostbtn">Delete</button>
                            </div>
                          </div>
                        </div>
                      </li>
                    </ul>
                  </div>
                </div>
              ))
            ) : (
              <p>No Records...</p>
            )}
          </div>
        </div>
      </div>
    </>

  )
}

export default OrganizationEvent
