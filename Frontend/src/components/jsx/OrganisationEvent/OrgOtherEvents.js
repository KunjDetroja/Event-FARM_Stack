// OrgOtherEvents

import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import $ from "jquery";
import OrganisationNavbar from "../OrganisationNavbar";
import "../../css/OrganisationEvent/OrgOtherEvents.css";
import api from "../api";
import { toast } from "react-toastify";
import {
  FaArrowCircleRight,
  FaArrowCircleLeft,
  FaRupeeSign,
} from "react-icons/fa";
// import { TbClockPlay } from "react-icons/tb";

function OrgOtherEvents() {
  const [details, setDetails] = useState();
  const [userData, setUserData] = useState(
    JSON.parse(localStorage.getItem("organisers"))
  );
  const [searchForm, setSearchform] = useState({
    event_title: "",
  });

  const [modalEaseIn, setModalEaseIn] = useState("");

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

  const fetchAllPostdetails = async () => {
    try {
      console.log(userData.clubname);
      const cname = userData.clubname; //Rajpath
      console.log(typeof cname); //string
      const response = await api.post("/getotherorgeventposts/", {
        clubname: cname,
      });
      setDetails(response.data);
      console.log(response.data);
    } catch (error) {
      console.error("Error fetching details:", error);
    }
  };

  const navigate = useNavigate();
  const handlepostdetails = (post) => {
    // console.log(JSON.stringify(post))
    navigate("/organisationevents/detailedview", {
      state: JSON.stringify(post),
    });
  };



  // /////////////

  const [lFormData, setLFormData] = useState({
    event_start_date: "",
    event_end_date: "",
    minprice: "",
    maxprice: "",
    venue_city: "",
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
    console.log("Filtered form:");
    console.log(filteredFormData);

    // Now you can use filteredFormData in your API call
    try {
      console.log("Inside try for api calling:");
      const data = {
        filteredFormData: filteredFormData,
        clubname: userData.clubname,
      };
      const checking = await api.post("/otherorgeventpostfilters/", data);
      console.log(checking);
      if (checking.data.success !== false) {
        console.log(checking.data);
        setDetails(checking.data);
      } else {
        toast.error(checking.data.error);
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
      venue_city: "",
    });
    setSearchform({
      event_title: "",
    });
    fetchAllPostdetails();
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

    const data = {
      clubname: userData["clubname"],
      title: searchForm["event_title"]
    };
    console.log("handle search submit");
    try {
      // console.log("hi");
      // const cname = orgData._id; //Rajpath
      // // console.log(typeof cname); //string
      const response = await api.post("/otherorgeventpostsbytitle/", data);
      if (response.data.success != false) {
        setDetails(response.data);
        
      } else {
        fetchAllPostdetails();
        toast.error(response.data.error)
      }
      // console.log(response.data);
    } catch (error) {
      console.error("Error fetching details:", error);
    }
  };

  return (
    <>
      <div>{<OrganisationNavbar />}</div>
      
      <div>
        <div className="d-flex justify-content-end mt-0">
          <form className="form-inline my-lg-0 " onSubmit={handlesearchSubmit}>
            <div className="row">
              <div className="col-10 p-2">
                <input
                  className="form-control"
                  name="event_title"
                  type="text"
                  placeholder="Search"
                  aria-label="Search"
                  onChange={handleSearchInputChange}
                  value={searchForm.event_title}
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
        <div className="loginmainEventdiv">
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
                <div className="d-flex flex-column align-items-end ">
                  <FaArrowCircleLeft
                    className="mt-2"
                    onClick={toggleCol2Visibility}
                    style={{ fontSize: "2.2rem" }}
                  />
                </div>
                <br />
                <div className="row">
                  <p className="col-6 orgeventcard_title">Filter</p>
                  <div className="col-6">
                    <div className="d-grid">
                      <button className="addpostbtn" onClick={handleformreset}>
                        Reset
                      </button>
                    </div>
                  </div>
                </div>

                <form onSubmit={handleFormSubmit} style={{ margin: "0px" }}>
                  <div className="row gy-3 overflow-hidden">
                    <div className="col">
                      <div className="form-floating mb-3">
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
                    <div className="col">
                      <div className="form-floating mb-3">
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
                      Price
                      <div className="row">
                        <div className="col-6">
                          <div className="form-floating mb-3">
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
                            <label htmlFor="minprice" className="form-label">
                              Min
                            </label>
                          </div>
                        </div>
                        <div className="col-6">
                          <div className="form-floating mb-3">
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
                            <label htmlFor="maxprice" className="form-label">
                              Max
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-12">
                      <div className="form-floating mb-3">
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
              <br />
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
                      <div class="main">
                        <ul class="othercards">
                          <li class="othercards_item">
                            <div class="othercard">
                              <div class="othercard_image">
                                <img
                                  className="othermaincardimage"
                                  src={post.event_image}
                                  alt="event image"
                                  onClick={() => handlepostdetails(post)}
                                  style={{ cursor: "pointer" }}
                                />
                                <span class="card_price cardspantag">
                                  <span>
                                    <FaRupeeSign />
                                    {post.ticket_price}
                                  </span>
                                </span>
                              </div>
                              <div class="othercard_content">
                                <h2
                                  class="card_title"
                                  onClick={() => handlepostdetails(post)}
                                  style={{ cursor: "pointer" }}
                                >
                                  {post.event_title}
                                </h2>
                                <div class="othercard_text">
                                  <p class="cardptag">{post.event_highlight}</p>
                                  <p class="cardptag">
                                    Venue: {post.venue_name}
                                  </p>
                                  <span class="cardptag">
                                    Venue City: {post.venue_city}
                                  </span>
                                  <p class="cardptag">
                                    Event Type:
                                    <strong> {post.type} </strong>{" "}
                                  </p>
                                  <hr className="cardhrtag" />
                                  <p class="cardptag">
                                    Event Dates:
                                    <strong>
                                      {" "}
                                      {post.event_start_date}{" "}
                                    </strong>{" "}
                                    <span> TO </span>
                                    <strong> {post.event_end_date}</strong>
                                  </p>
                                  {/* <button
                                    className="deletepostbtn"
                                    onClick={() => handledeletepost(post)}
                                  >
                                    Delete
                                  </button> */}
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
        </div>
      </div>
    </>
  );
}

export default OrgOtherEvents;
{
  /**/
}
