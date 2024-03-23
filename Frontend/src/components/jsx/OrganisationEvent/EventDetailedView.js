import React, { useState, useEffect } from "react";
import OrganisationNavbar from "../OrganisationNavbar";
import { useNavigate, useLocation } from "react-router-dom";
import "../../css/OrganisationEvent/EventDetailedView.css";
function EventDetailedView() {
  const [descBool, setDescBool] = useState(false);
  const [timeBool, setTimeBool] = useState(false);
  const [dateBool, setDateBool] = useState(false);

  const setBoolValue = (type) => {
    switch (type) {
      case "desc":
        setDescBool(true);
        setTimeBool(false);
        setDateBool(false);
        break;
      case "time":
        setDescBool(false);
        setTimeBool(true);
        setDateBool(false);
        break;
      case "date":
        setDescBool(false);
        setTimeBool(false);
        setDateBool(true);
        break;
      default:
        break;
    }
  };
  const location = useLocation();
  const postData = JSON.parse(location.state);
  console.log(typeof postData);
  console.log(postData["event_title"]);
  return (
    <>
      <div>{<OrganisationNavbar />}</div>
      <div className="detailedPostBody">
        <div class="container">
          <div class="orgcard">
            <div class="container-fliud">
              <div class="orgwrapper row">
                <div class="orgpreview col-md-6">
                  <div class="orgpreview-pic orgtab-content">
                    <div class="orgtab-pane active" id="orgpic-1">
                      <img
                        src={postData["event_image"]}
                        className="detailedpostimg"
                      />
                      <br />
                      <hr />
                      <h3>Club- {postData["clubname"]}</h3>
                      <hr />
                    </div>
                  </div>
                </div>
                <div class="orgdetails col-md-6">
                  <h3 class="orgproduct-title">{postData["event_title"]}</h3>
                  <h4 class="orgprice">
                    current price:{" "}
                    <span className="orgdetailedspan">
                      Rs.{postData["ticket_price"]}
                    </span>
                  </h4>
                  <p class="orgproduct-description">
                    {postData["event_highlight"]}
                  </p>
                  <br />
                  <div className="row">
                    <div className="col">
                      <button
                        className="btn"
                        onClick={() => setBoolValue("desc")}
                      >
                        Description
                      </button>
                    </div>
                    <div className="col">
                      <button
                        className="btn"
                        onClick={() => setBoolValue("time")}
                      >
                        Time
                      </button>
                    </div>
                    <div className="col">
                      <button
                        className="btn"
                        onClick={() => setBoolValue("date")}
                      >
                        Dates
                      </button>
                    </div>
                  </div>

                  {descBool && (
                    <div>
                      <br />
                      <h4>Event Description</h4>
                      <p class="orgproduct-description">
                        {postData["event_desc"]}
                      </p>
                    </div>
                  )}

                  {timeBool && (
                    <div>
                      <br />
                      <h4>Timings</h4>
                      <p class="orgvote">
                        <strong>Start Time: {postData["start_time"]}</strong>
                        <br />
                        <strong>End Time: {postData["end_time"]}</strong>
                      </p>
                    </div>
                  )}

                  {dateBool && (
                    <div>
                      <br />
                      <h4>Date Schedule</h4>
                      <p class="orgvote">
                        <strong>
                          Start Date: {postData["event_start_date"]}
                        </strong>
                        <br />
                        <strong>End Date: {postData["event_end_date"]}</strong>
                      </p>
                    </div>
                  )}
                  <br />
                  <div>
                    Event Type:
                    <strong> {postData.type} </strong>{" "}
                  </div>
                  <hr />
                  <div class="orgsizes">
                    Organizers Details:
                    <hr />
                    <p class="orgsize" data-toggle="tooltip" title="small">
                      Name: {postData["event_organizer_name"]}
                    </p>
                    <p class="orgsize" data-toggle="tooltip" title="medium">
                      Email: {postData["event_organizer_email"]}
                    </p>
                    <p class="orgsize" data-toggle="tooltip" title="large">
                      Ph. Number: {postData["event_organizer_pnumber"]}
                    </p>
                    {/* <span class="size" data-toggle="tooltip" title="xtra large">
                      xl
                    </span> */}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default EventDetailedView;
