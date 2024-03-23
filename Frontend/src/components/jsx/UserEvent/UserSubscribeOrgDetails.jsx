import React, { useEffect } from "react";
import { useState } from "react";
import Navbar from "../Navbar";
import { useNavigate, useLocation } from "react-router-dom";
import "../../css/UserEvent/UserSubscribeOrgDetailsCss.css";
import { toast } from "react-toastify";


function UserSubscribeOrgDetails() {
  const navigate = useNavigate();
  const location = useLocation();
  const userData = JSON.parse(localStorage.getItem("users"));
  const orgData = JSON.parse(localStorage.getItem("orgdetails"));
//   const [orgData,setOrgdata] = useState(JSON.parse(location.state));
const memtype = orgData.memtype;
const filteredmemtype = memtype.filter(
  (item) => item["type"] !== userData.membertype
);
useEffect(()=>{

},[])

  const handleSubscribe = async () => {
    localStorage.setItem("orgname", JSON.stringify(orgData.clubname));
    localStorage.setItem("memtype", JSON.stringify(filteredmemtype));
    navigate("/subscribe/form");
  };

  const handlepastposts = async () => {
    localStorage.setItem("orgname", JSON.stringify(orgData.clubname));
    navigate("/subscribe/pastevents");
  };

  return (
    <div>
      <Navbar />
      <div>
        <div className="loginmainEventdiv">
          <div className="row">
            <div className="col-12">
              <br />
              <div>
                <section className="light">
                  <div className="container py-2">
                    <article className="postcard light blue">
                      <img
                        className="postcard__img"
                        src={orgData.background_image}
                        alt="Title"
                      />

                      <div className="postcard__text t-dark">
                        <div className="row">
                          <div className="col-9">
                            <h1 className="postcard__title blue">
                              <h4>{orgData.clubname}</h4>
                            </h1>
                          </div>
                          <div className="col">
                            <button
                              className="deletepostbtn d-flex flex-column align-items-end"
                              onClick={() => handleSubscribe()}
                            >
                              Subscribe
                            </button>
                            <button
                              className="mt-2 addpostbtn"
                              onClick={handlepastposts}
                            >
                              Past Events
                            </button>
                          </div>
                        </div>

                        <div className="postcard__subtitle small">
                          <strong>{orgData.ownname}</strong>
                          <br />
                          <strong> {orgData.email}</strong>
                        </div>
                        <div className="postcard__bar"></div>
                        <div className="postcard__preview-txt">
                          {orgData.desc}
                        </div>
                        <br />
                        <div className="row">
                          <span className="col">
                            <strong>Contact Number:</strong> {orgData.pnumber}
                          </span>
                          <span className="col">
                            <strong>City:</strong> {orgData.city}
                          </span>
                        </div>
                        <br />
                        <div className="">
                          <strong>Address:</strong> {orgData.address}
                        </div>
                        <div>
                          <br />
                          <strong>Membership Type & Price</strong>
                          <br />
                          <br />
                          {memtype && memtype.length ? (
                            memtype.map((type) => (
                              <li>
                                <span>
                                  {type.type} {"-->"} {type.price}
                                </span>
                              </li>
                            ))
                          ) : (
                            <p>No Membership Types...</p>
                          )}
                        </div>
                      </div>
                    </article>
                  </div>
                </section>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserSubscribeOrgDetails;
