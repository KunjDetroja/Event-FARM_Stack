import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import $ from "jquery";
import Navbar from "../Navbar";
import "../../css/UserEvent/UserEvent1Css.css";
import api from "../api";
import UserEvent from "./UserEvent";
import {
  FaArrowCircleLeft,
  FaRupeeSign,
} from "react-icons/fa";
import { toast } from "react-toastify";

function UserEvent1() {
  const [checkingdata, setCheckingdata] = useState(
    JSON.parse(localStorage.getItem("users"))
  );
  const [memType, setMemType] = useState();
  const [details, setDetails] = useState();
  const [clubname, setClubname] = useState([]);
  const [userData, setUserData] = useState(
    JSON.parse(localStorage.getItem("users"))
  );

  const fetchAllMemTypedetails = async () => {
    try {
      const response = await api.get("/allmembershiptype");
      setMemType(response.data);
      console.log(response.data);
    } catch (error) {
      console.error("Error fetching details:", error);
    }
  };

  const [searchForm, setSearchform] = useState({
    event_title: "",
  });

  const [modalEaseIn, setModalEaseIn] = useState("");

  const fetchAllClubname = async () => {
    try {
      const response = await api.get("/clubnames/");
      setClubname(response.data);
    } catch (error) {
      console.error("Error fetching details:", error);
    }
  };

  useEffect(() => {
    fetchAllPostdetails();
    fetchAllMemTypedetails();
    fetchAllClubname();
    localStorage.removeItem("postid");
    localStorage.removeItem("orgname");
    localStorage.removeItem("memtype");

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

  const [isCol2Visible, setIsCol2Visible] = useState(false);

  const toggleCol2Visibility = () => {
    setIsCol2Visible(!isCol2Visible);
  };

  const [originaldata,setOriginaldata] = useState()

  const fetchAllPostdetails = async () => {
    setOngoingbtn(!ongoinbtn);
    setContent("Current Events");
    console.log("fetching post function");
    try {
      console.log(userData.username);
      const response = await api.post(
        `/fetchingallpostforuser/${userData.username}`
      );
      console.log(response.data);
      setDetails(response.data);
      setOriginaldata(response.data)
      //   console.log(response.data);
    } catch (error) {
      console.error("Error fetching details:", error);
    }
  };

  const navigate = useNavigate();
  const handlepostdetails = (post) => {
    navigate("/event/details", {
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
    type: "",
    clubname: "",
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

    const filteredFormData = {};
    for (const key in lFormData) {
      if (lFormData[key] !== "") {
        filteredFormData[key] = lFormData[key];
      }
    }
    const data = {
      "eventposts":originaldata,
      "filteredFormData":filteredFormData
    }

    console.log("Filtered form:");
    console.log(filteredFormData);

    try {
      console.log("Inside try for api calling:");
      const checking = await api.post("/postfilter", data);
      console.log(checking);
      if (checking.data.success !== false) {
        console.log(checking.data);
        setDetails(checking.data);
        
      } else {
        toast.error(checking.data.error);
      }

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
      type: "",
      clubname: "",
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
    const data = { title: searchForm["event_title"], uname: userData.username };
    console.log("handle search submit");
    try {
      const response = await api.post("/postsearchbyuser", data);
      setDetails(response.data);
      console.log(response.data);
    } catch (error) {
      console.error("Error fetching details:", error);
    }
  };

  const handleParticipate = async (id) => {
    localStorage.setItem("postid", JSON.stringify(id));
    navigate("/event/partcipate");
  };
  const handleSubscribe = async (post) => {
    navigate("/subscribe/form1", { state: JSON.stringify(post) });
  };

  const [ongoinbtn, setOngoingbtn] = useState(true);
  const [content, setContent] = useState("");

  const handlefutureposts = async () => {
    console.log("future posts");
    setOngoingbtn(true);
    setContent("Future Events");

    try {
      const response = await api.post("/alluserfutureeventposts", {
        uname: userData.username,
      });
      if (response.data.success != false) {
        setDetails(response.data);
        setOriginaldata(response.data)
      } else {
        toast.error(response.data.error);
        fetchAllPostdetails();
      }
    } catch (error) {
      console.error(error);
    }
  };

 
  return (
    <>
      {checkingdata ? (
        <>
          <div>
            <Navbar />
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <div>
              {ongoinbtn && (
                <button className="addpostbtn" onClick={fetchAllPostdetails}>
                  Current Events
                </button>
              )}
              {/* <button className="addpostbtn" onClick={handlepastposts}>
                Past Events
              </button> */}

              <button className="addpostbtn" onClick={handlefutureposts}>
                Future Events
              </button>
              <span style={{ marginLeft: "20rem", fontSize: "2rem" }}>
                <strong>{content}</strong>
              </span>
            </div>

            <div>
              <div className="mt-2 me-5 d-flex flex-column align-items-end ">
                <form
                  className="form-inline my-lg-0"
                  onSubmit={handlesearchSubmit}
                >
                  <div className="row">
                    <div className="col-10 p-2">
                      <input
                        className="form-control"
                        name="event_title"
                        type="text"
                        placeholder="Search by Title"
                        aria-label="Search"
                        onChange={handleSearchInputChange}
                        value={searchForm.event_title}
                      />
                    </div>
                    <div className="col-2 p-2">
                      <button className="addpostbtn pt-2 pb-2" type="submit">
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
                    <div className="d-flex flex-column align-items-end">
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
                          <button
                            className="addpostbtn"
                            onClick={handleformreset}
                          >
                            Reset
                          </button>
                        </div>
                      </div>
                    </div>

                    <form onSubmit={handleFormSubmit} style={{ margin: "0px" }}>
                      <div className="row gy-3 overflow-hidden">
                        <div className="col-12">
                          <div className="form-floating mb-3">
                            <input
                              onChange={handleInputChange}
                              type="date"
                              className="form-control"
                              id="event_start_date"
                              placeholder=""
                              name="event_start_date"
                              value={formatDateForInput(
                                lFormData.event_start_date
                              )}
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
                          <div className="form-floating mb-3">
                            <input
                              onChange={handleInputChange}
                              type="date"
                              className="form-control"
                              id="event_end_date"
                              placeholder=""
                              name="event_end_date"
                              value={formatDateForInput(
                                lFormData.event_end_date
                              )}
                            />
                            <label
                              htmlFor="event_end_date"
                              className="form-label"
                            >
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
                                <label
                                  htmlFor="minprice"
                                  className="form-label"
                                >
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
                          <div className="form-floating mb-3">
                            <select
                              onChange={handleInputChange}
                              className="form-select"
                              id="type"
                              name="type"
                              value={lFormData.type}
                            >
                              <option value="">Select Membership Type</option>
                              <option value={"Public"}>Public</option>
                              {memType?.map((type) => (
                                <option key={type} value={type}>
                                  {type}
                                </option>
                              ))}
                            </select>
                            <label htmlFor="type" className="form-label">
                              Type
                            </label>
                          </div>
                        </div>
                        <div className="col-12">
                          <div className="form-floating mb-3">
                            <select
                              onChange={handleInputChange}
                              className="form-select"
                              id="clubname"
                              name="clubname"
                              value={lFormData.clubname}
                            >
                              <option value="">Select Clubname</option>
                              {clubname.map((club) => (
                                <option key={club} value={club}>
                                  {club}
                                </option>
                              ))}
                            </select>
                            <label htmlFor="clubname" className="form-label">
                              Club
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
                    <button
                      style={{ fontSize: "25px" }}
                      className="addpostbtn pt-1 pb-1"
                      onClick={toggleCol2Visibility}
                    >
                      Filter
                    </button>
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
                          <div className="usereventsmain">
                            <ul className="usereventscards">
                              <li className="usereventscards_item">
                                <div className="usereventscard">
                                  <div className="usereventscard_image">
                                    <img
                                      className="usereventsmaincardimage"
                                      src={post.event_image}
                                      alt="event"
                                      onClick={() => handlepostdetails(post)}
                                      style={{ cursor: "pointer" }}
                                    />
                                    <span className="card_price cardspantag">
                                      <span>
                                        <FaRupeeSign />
                                        {post.ticket_price}
                                      </span>
                                    </span>
                                  </div>
                                  <div className="usereventscard_content">
                                    <h2
                                      className="usereventscard_title"
                                      onClick={() => handlepostdetails(post)}
                                      style={{ cursor: "pointer" }}
                                    >
                                      {post.event_title}
                                    </h2>
                                    <div className="usereventscard_text">
                                      <p className="cardptag">
                                        Venue: {post.venue_name}
                                      </p>
                                      <span className="cardptag">
                                        Venue City: {post.venue_city}
                                      </span>
                                      <hr />
                                      <span className="cardptag">
                                        Club: {post.clubname}
                                      </span>
                                      <hr />
                                      <p className="cardptag">
                                        Event Type:
                                        <strong> {post.type} </strong>{" "}
                                      </p>
                                      <hr className="cardhrtag" />
                                      <p className="cardptag">
                                        Event Dates:
                                        <strong>
                                          {" "}
                                          {post.event_start_date.toString().slice(0,10)}{" "}
                                        </strong>{" "}
                                        <span> TO </span>
                                        <strong> {post.event_end_date}</strong>
                                      </p>
                              
                                        
                                          {(post.type === userData.membertype &&
                                            post.clubname ===
                                              userData.clubname) ||
                                          post.type === "Public" ? (
                                            <button
                                              {...(post["capacity"] <=
                                              post["participate"].length
                                                ? { disabled: true }
                                                : {})}
                                              className="deletepostbtn"
                                              onClick={() =>
                                                handleParticipate(post._id)
                                              }
                                            >
                                              Participate
                                            </button>
                                          ) : (
                                            <button
                                              className="deletepostbtn"
                                              onClick={() =>
                                                handleSubscribe(post)
                                              }
                                            >
                                              Subscribe
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
      ) : (
        <UserEvent />
      )}
    </>
  );
}

export default UserEvent1;
