import React, { useEffect, useState } from "react";
import Navbar from "../Navbar";
import api from "../api";
import { FaRupeeSign } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import UserEvent from "./UserEvent";
import { toast } from "react-toastify";

function UserParticipatedEvents() {
  const [checkingdata, setCheckingdata] = useState(
    JSON.parse(localStorage.getItem("users"))
  );
  const [post, setPost] = useState([]);
  const [posterror, setPostError] = useState("");

  const userData = JSON.parse(localStorage.getItem("users"));

  const fetchAllPostdetails = async () => {
    setCurrentparticipatedposts(false);
    console.log("fetching post function");
    try {
      // console.log(userData.username)
      const checking = await api.post(`/userparticipated/${userData.username}`);
      if (checking.data.success !== false) {
        // toast.success(checking.data.data)
        setPost(checking.data);
      } else {
        toast.error(checking.data.error);
      }
    } catch (error) {
      console.error("Error fetching details:", error);
    }
  };

  useEffect(() => {
    fetchAllPostdetails();
  }, []);
  const navigate = useNavigate();
  const handlepostdetails = (post) => {
    navigate("/event/details", {
      state: JSON.stringify(post),
    });
  };

  const [showcurrentparticipatedposts, setCurrentparticipatedposts] =
    useState(false);

  const handlepastparticipatedevents = async () => {
    console.log("fetching past post function");
    try {
      // console.log(userData.username)
      const checking = await api.post(
        `/userpastparticipated/${userData.username}`
      );
      if (checking.data.success !== false) {
        // toast.success(checking.data.data)
        setCurrentparticipatedposts(true);
        setPost(checking.data);
      } else {
        toast.error(checking.data.error);
      }
    } catch (error) {
      console.error("Error fetching details:", error);
    }
  };

  const handleeventfeedback = (post) => {
    navigate("/event/feedback", {
      state: JSON.stringify(post),
    });
  };
  const handleorgfeedback = (post) => {
    navigate("/organisation/feedback", {
      state: JSON.stringify(post),
    });
  };

  return (
    <>
      {checkingdata ? (
        <>
          <div>
            <Navbar />
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                // justifyContent: "space-between",
              }}
            >
              {showcurrentparticipatedposts ? (
                <button
                  className="col-3 addpostbtn mt-2"
                  onClick={fetchAllPostdetails}
                >
                  Current Participated Events
                </button>
              ) : (
                <button
                  className="col-2 addpostbtn mt-2"
                  onClick={handlepastparticipatedevents}
                >
                  Past Participated Events
                </button>
              )}

              <h2 className="col-8 text-center mt-2">
                {showcurrentparticipatedposts
                  ? "Past Participated Events"
                  : "Current Participated Events"}
              </h2>
            </div>
            <div className="row">
              {post && post.length ? (
                post.map((post) => (
                  <div key={post._id} className="col-3 maincardbody">
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
                                    {post.event_start_date}{" "}
                                  </strong>{" "}
                                  <span> TO </span>
                                  <strong> {post.event_end_date}</strong>
                                </p>
                                {showcurrentparticipatedposts ? (
                                  <>
                                    <button
                                      className="addpostbtn m-2"
                                      onClick={() => handleeventfeedback(post)}
                                    >
                                      Event Feedback
                                    </button>
                                    <button
                                      className="addpostbtn m-2"
                                      onClick={() => handleorgfeedback(post)}
                                    >
                                      Org Feedback
                                    </button>
                                  </>
                                ) : (
                                  ""
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
                <p>No Records Available</p>
              )}
            </div>
          </div>
        </>
      ) : (
        <UserEvent />
      )}
    </>
  );
}

export default UserParticipatedEvents;
