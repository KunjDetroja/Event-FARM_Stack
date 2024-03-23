import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import $ from "jquery";
import OrganisationNavbar from "../OrganisationNavbar";
import "../../css/OrganisationEvent/orgEvent.css";
import api from "../api";
import { toast } from "react-toastify";
import {
  FaArrowCircleRight,
  FaArrowCircleLeft,
  FaRupeeSign,
} from "react-icons/fa";
import { CiEdit } from "react-icons/ci";

function OrgEvent() {
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
    setOngoingbtn(!ongoinbtn);
    setPastevent(false);
    setFutureevent(false);
    setCurrentevent(true);
    setContent("Current Events");
    try {
      console.log(userData.clubname);
      const cname = userData.clubname; //Rajpath
      console.log(typeof cname); 
      const response = await api.post("/allorgcurrenteventposts/", {
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

  const handledeletepost = async (post) => {
    console.log("deleting button");
    try {
      const response = await api.delete(`/deleteeventposts/${post._id}`);
      console.log(response);
      fetchAllPostdetails();
    } catch {
      console.error("Error in Deleting");
    }
  };

  const [updatepriceform, setUpdatepriceform] = useState({
    oldprice: "",
    newprice: "",
  });

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
        clubname: userData["clubname"],
        filteredFormData: filteredFormData,
        pastevent:pastevent,
        currentevent:currentevent,
        futureevent:futureevent,
      };
      const checking = await api.post("/orgfilters/", data);
      console.log(checking);
      if (checking.data.success !== false) {
        console.log(checking.data);
        setDetails(checking.data);
      } else {
        toast.error(checking.data.error);
        if (currentevent){
          fetchAllPostdetails();
        }
        else if(pastevent){
          handlepastposts();
        }
        else if(futureevent){
          handlefutureposts();
        }
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  

  const handlemodalclose = () => {
    setUpdatepriceform({
      oldprice: "",
      newprice: "",
    });
  };

  const handleupdatepriceformdata = (e) => {
    const { name, value } = e.target;
    setUpdatepriceform({
      ...updatepriceform,
      [name]: value,
    });
  };

  const [clickedpost, setClickedpost] = useState();

  const handleupdatepriceclicked = (post) => {

    // console.log(post)
    setClickedpost(post);
  };

  const handleupdatepricesubmit = async (event) => {
    event.preventDefault();
    try {
      console.log(updatepriceform);
      console.log(clickedpost);
      const data = { pricedata: updatepriceform, postdata: clickedpost };
      const response = await api.put("/updatepostprice", data);
      if (response.data.success !== false) {
      
        toast.success(response.data.message);
        setUpdatepriceform({
          oldprice: "",
          newprice: "",
        });

        fetchAllPostdetails();
      } else {
        toast.error(response.data.error);
      }
    } catch (error) {
      console.log(error);
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
      title: searchForm["event_title"],
    };
    console.log("handle search submit");
    try {
      // console.log("hi");
      // const cname = orgData._id; //Rajpath
      // // console.log(typeof cname); //string
      const response = await api.post("/organisationeventpostsbytitle/", data);
      setDetails(response.data);
      // console.log(response.data);
    } catch (error) {
      console.error("Error fetching details:", error);
    }
  };

  const [ongoinbtn, setOngoingbtn] = useState(true);
  const [content, setContent] = useState("");
  const [pastevent, setPastevent] = useState(false);
  const [futureevent, setFutureevent] = useState(false);
  const [currentevent, setCurrentevent] = useState(false);


  const handlefutureposts = async () => {
    console.log("future posts");
    setOngoingbtn(true);
    setFutureevent(true);
    setPastevent(false);
    setCurrentevent(false)
    const cname = userData.clubname;
    setContent("Future Events");

    try {
      const response = await api.post("/allorgfutureeventposts", {
        clubname: cname,
      });
      if (response.data.success != false) {
        setDetails(response.data);
      } else {
        toast.error(response.data.error);
        fetchAllPostdetails();
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handlepastposts = async () => {
    console.log("past posts");
    setOngoingbtn(true);
    setPastevent(true);
    setFutureevent(false);
    setCurrentevent(false)
    const cname = userData.clubname;
    setContent("Past Events");
    try {
      const response = await api.post("/allorgpasteventposts", {
        clubname: cname,
      });
      if (response.data.success != false) {
        setDetails(response.data);
      } else {
        toast.error(response.data.error);
        fetchAllPostdetails();
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleusereventfeedback = (post) => {
    navigate("/organisationevents/orgeventfeedback", {
      state: JSON.stringify(post),
    });
  }

  return (
    <>
      <div>{<OrganisationNavbar />}</div>
      {(
        <div
          className="modal fade"
          id="updatePriceModal"
          tabIndex="-1"
          aria-labelledby="exampleModalLabel"
          aria-hidden="true"
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="exampleModalLabel">
                  Update Ticket's Price:
                </h5>
                <button
                  onClick={handlemodalclose}
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                  
                ></button>
              </div>
              <div className="modal-body">
                <form onSubmit={handleupdatepricesubmit}>
                  <div className="mb-3">
                    <label htmlFor="oldprice" className="col-form-label">
                      Old Price:
                    </label>
                    <input
                      type="number"
                      className="form-control"
                      id="oldprice"
                      name="oldprice"
                      value={updatepriceform.oldprice}
                      onChange={handleupdatepriceformdata}
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="newprice" className="col-form-label">
                      New Price:
                    </label>
                    <input
                      type="number"
                      className="form-control"
                      id="newprice"
                      name="newprice"
                      value={updatepriceform.newprice}
                      onChange={handleupdatepriceformdata}
                    />
                  </div>
                  <div className="modal-footer">
                    <button
                      type="button"
                      style={{ padding: "0.8rem" }}
                      className="btn btn-secondary"
                      data-bs-dismiss="modal"
                      onClick={handlemodalclose}
                    >
                      Close
                    </button>
                    <button
                      type="submit"
                      className="addpostbtn"
                      data-bs-dismiss="modal"
                    >
                      Update Price
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}


      {/* <div>
        <Link to="/organisationevents/addpost">
          <button className="addpostbtn">Add New Post</button>
        </Link>
      </div> */}
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        <div>
          <Link to="/organisationevents/addpost">
            <button className="addpostbtn">Add New Post</button>
          </Link>

          {ongoinbtn && (
            <button className="addpostbtn" onClick={fetchAllPostdetails}>
              Current Events
            </button>
          )}
          <button className="addpostbtn" onClick={handlepastposts}>
            Past Events
          </button>

          <button className="addpostbtn" onClick={handlefutureposts}>
            Future Events
          </button>
          <span style={{ marginLeft: "20rem", fontSize: "2rem" }}>
            <strong>{content}</strong>
          </span>
        </div>

        <div className="mt-0">
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
                        <ul class="orgeventcards">
                          <li class="orgeventcards_item">
                            <div class="orgeventcard">
                              <div class="orgeventcard_image">
                                <img
                                  className="orgeventmaincardimage"
                                  src={post.event_image}
                                  alt="event image"
                                  onClick={() => handlepostdetails(post)}
                                  style={{ cursor: "pointer" }}
                                />
                                <span class="card_price cardspantag">
                                  <span>
                                    <FaRupeeSign />
                                    {post.ticket_price}

                                    <button
                                      type="button"
                                      className="btn"
                                      onClick={() =>
                                        handleupdatepriceclicked(post)
                                      }
                                      data-bs-toggle="modal"
                                      data-bs-target="#updatePriceModal"
                                    >
                                      <CiEdit
                                        style={{
                                          color: "white",
                                          fontSize: "1.7rem",
                                          padding: "3px",
                                          cursor: "pointer",
                                        }}
                                      />
                                    </button>
                                  </span>
                                </span>
                              </div>
                              <div class="orgeventcard_content">
                                <h2
                                  class="orgeventcard_title"
                                  onClick={() => handlepostdetails(post)}
                                  style={{ cursor: "pointer" }}
                                >
                                  {post.event_title}
                                </h2>
                                <div class="orgeventcard_text">
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
                                  {pastevent ? (
                                    <button
                                    className="deletepostbtn"
                                    onClick={() => handleusereventfeedback(post)}
                                  >
                                    See Feedback
                                  </button>
                                  ) : (
                                    <button
                                      className="deletepostbtn"
                                      onClick={() => handledeletepost(post)}
                                    >
                                      Delete
                                    </button>
                                  )}
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

export default OrgEvent;
{
  /**/
}
