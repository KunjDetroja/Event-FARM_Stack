// OrgUsersFeedback
import React from "react";
import OrganisationNavbar from "../OrganisationNavbar";
import { useLocation } from "react-router-dom";
import { useState } from "react";

function OrgUserEventFeedback() {
  const location = useLocation();
  const [orgData, setOrgData] = useState(
    JSON.parse(localStorage.getItem("organisers"))
  );

  return (
    <>
      <div>
        <OrganisationNavbar />
      </div>
      <div className="mt-2 d-flex justify-content-center align-items-center">
        <h2>{orgData.clubname}'s Feedback</h2>
      </div>
      <div className="m-5">
        <table className="table table-hover">
          <thead>
            <tr>
              <th scope="col">User Name</th>
              <th scope="col">Feedback</th>
            </tr>
          </thead>
          <tbody>
            {orgData.feedback.map((feedback, index) => {
              return (
                <tr key={index}>
                  <td>{feedback.username}</td>
                  <td>{feedback.feedbackdata}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
}

export default OrgUserEventFeedback;
