// OrgDashboardSec2
import React from "react";
import api from "../api";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

function OrgDashboardSec2() {
  const [content, setContent] = useState();
  const [orgdata, setOrgData] = useState(
    JSON.parse(localStorage.getItem("organisers"))
  );

  const fetchdata = async () => {
    try {
      const data = {
        clubname: orgdata.clubname,
      };
      const response = await api.post("/orgdashboardpopulareventcards", data);
      console.log(response.data);
      if (response.data.success !== false) {
        setContent(response.data);
      } else {
        toast.error("No data found");
        setContent([]);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchdata();
  }, []);

  return (
    <>
      {(content?.length !==0) && (
        <>
          <div className="align-items-center justify-content-center text-center mt-5">
            <h1>Most Popular Events:</h1>
            <div class="card-group m-5">
              <div className="row m-5">
                {content &&
                  content.map((post, index) => {
                    return (
                      <>
                        <div className="col-md-4">
                          <div class="card">
                            <img
                              src={post.event_image}
                              class="card-img-top"
                              alt={post.event_title}
                            />
                            <div class="card-body">
                              <h5
                                class="card-title"
                                style={{ fontSize: "1.8rem" }}
                              >
                                {post.event_title}
                              </h5>
                              <p
                                class="card-text"
                                style={{ fontSize: "1.5rem" }}
                              >
                                {post.clubname}
                              </p>
                              <p
                                class="card-text"
                                style={{ fontSize: "1.3rem" }}
                              >
                                {post.event_highlight}
                              </p>
                              <p class="card-text">
                                <small
                                  class="text-muted"
                                  style={{ fontSize: "1.2rem" }}
                                >
                                  Event Type: {post.type}
                                </small>
                              </p>
                              <p class="card-text">
                                <small
                                  class="text-info"
                                  style={{
                                    fontSize: "1.1rem",
                                    fontWeight: "bold",
                                  }}
                                >
                                  Start Date: {post.event_start_date}
                                </small>
                              </p>
                              <p class="card-text">
                                <small
                                  class="text-info"
                                  style={{
                                    fontSize: "1.1rem",
                                    fontWeight: "bold",
                                  }}
                                >
                                  End Date: {post.event_end_date}
                                </small>
                              </p>
                            </div>
                          </div>
                        </div>
                      </>
                    );
                  })}
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}

export default OrgDashboardSec2;
