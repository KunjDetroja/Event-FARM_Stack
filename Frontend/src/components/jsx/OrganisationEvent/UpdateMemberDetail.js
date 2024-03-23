import React, { useState, useEffect } from "react";
import OrganisationNavbar from "../OrganisationNavbar";
import { Link, useNavigate, useLocation } from "react-router-dom";
import api from "../api";
import { toast } from "react-toastify";

function UpdateMemberDetail() {
  const [memType, setMemType] = useState();
  const [memberDetails,setMemberDetails]  =  useState(JSON.parse(localStorage.getItem("member")))
  // const [memberId, setMemberId] = useState(memberDetails.memberid);

  const navigate = useNavigate();
  console.log(memberDetails.memberid);

  const [userData, setUserData] = useState(
    JSON.parse(localStorage.getItem("organisers"))
  );
  const [memberoriginalData, setMemberoriginalData] = useState();
  // console.log(userData);
  const fetchAllMembertypedetails = async () => {
    try {
      const cname = userData.clubname;
      const userorindata = {
        cid: userData._id,
        memberid: memberDetails.memberid,
        clubname: cname,
      };
      const response = await api.post("/organisationunupdatedmemberdetails",userorindata);

      if (response.data.success) {
        setMemType(response.data.memtypes);
        setMemberoriginalData(response.data.memberDetails);
        console.log(memberoriginalData)
      } else {
        toast.error(response.data.error);
      }
    } catch (error) {
      console.error("Error fetching details:", error); 
    }
    // try {
    //   const cname = userData.clubname;
    //   const response = await api.post("/getmemtype/", { clubname: cname });
    //   setMemType(response.data);
    //   const memberdata = { cid: userData._id, memberid: memberDetails.memberid };

    //   const response2 = await api.post(
    //     "/organisationunupdatedmemberdetails",
    //     memberdata
    //   );
    //   console.log(response2.data);
    //   setMemberoriginalData(response2.data);
    //   console.log(memberoriginalData);
    //   // console.log(response.data);
    // } catch (error) {
    //   console.error("Error fetching details:", error);
    // }
  };
  useEffect(() => {
    fetchAllMembertypedetails();
    
  }, []);

  // useEffect(() => {
  //   // Additional useEffect to log the memberoriginalData
  //   console.log(memberoriginalData);
  // }, [memberoriginalData]);

  const [lFormData, setLFormData] = useState({
    name: memberDetails.name,
    email: memberDetails.email,
    pnumber: memberDetails.pnumber,
    gender: memberDetails.gender,
    username: memberDetails.username,
    pwd: memberDetails.pwd,
    memberid: memberDetails.memberid,
    membertype: memberDetails.membertype,
    expiry_date: memberDetails.expiry_date,
    start_date: memberDetails.start_date,
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
    // console.log(lFormData);
    try {
      const cname = userData.clubname;
      console.log({
        clubname: cname,
        memberId: memberDetails.memberid,
        formData: lFormData,
      });
      console.log(lFormData)
      const response = await api.put("/organizationupdatememberdetails", {
        clubname: cname,
        memberId: memberDetails.memberid,
        formData: lFormData,
      });
      console.log("Response" + response.data.error);
      if (response.data.success !== false) {
        toast.success("Login Successfully");
        localStorage.removeItem("memberid");

        navigate("/organisationevents/organizationmemberdetails");
        console.log(response.data);
        setLFormData({
          name: "",
          email: "",
          pnumber: "",
          gender: "",
          username: "",
          pwd: "",
          memberid: "",
          membertype: "",
          expiry_date: "",
          start_date: "",
        });
        // setLFormData({
        //   name: memberoriginalData[0].name,
        //   email: memberoriginalData[0].email,
        //   pnumber: memberoriginalData[0].pnumber,
        //   gender: memberoriginalData[0].gender,
        //   username: memberoriginalData[0].username,
        //   pwd: memberoriginalData[0].pwd,
        //   memberid: memberoriginalData[0].memberid,
        //   membertype: memberoriginalData[0].membertype,
        //   expiry_date: memberoriginalData[0].expiry_date,
        // });
      } else {
        // toast.error(response.error);
        toast.error(response.error);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  return (
    <>
      <div>{<OrganisationNavbar />}</div>
      <div>hello</div>
      <div className="mb-3 rounded p-3">
        <form onSubmit={handleFormSubmit}>
          <div className="row gy-3 overflow-hidden">
            <div className="col-6">
              <div className="form-floating mb-3">
                <input
                  // onChange={handleInputChange}
                  type="text"
                  className="form-control"
                  id="clubname"
                  placeholder=""
                  name="clubname"
                  value={userData.clubname}
                  disabled
                />
                <label htmlFor="clubname" className="form-label">
                  Club Name
                </label>
              </div>
            </div>
            <div className="col-6">
              <div className="form-floating mb-3">
                <input
                  onChange={handleInputChange}
                  type="text"
                  className="form-control"
                  id="memberid"
                  placeholder=""
                  name="memberid"
                  value={lFormData.memberid}
                />
                <label htmlFor="memberid" className="form-label">
                  Member ID
                </label>
              </div>
            </div>
            <div className="col-6">
              <div className="form-floating mb-3">
                <input
                  onChange={handleInputChange}
                  type="text"
                  className="form-control"
                  id="name"
                  placeholder=""
                  name="name"
                  value={lFormData.name}
                />
                <label htmlFor="name" className="form-label">
                  Name
                </label>
              </div>
            </div>
            <div className="col-6">
              <div className="form-floating mb-3">
                <input
                  onChange={handleInputChange}
                  type="text"
                  className="form-control"
                  id="pnumber"
                  placeholder=""
                  name="pnumber"
                  value={lFormData.pnumber}
                />
                <label htmlFor="pnumber" className="form-label">
                  Number
                </label>
              </div>
            </div>
            <div className="col-6">
              <div className="form-floating mb-3">
                <input
                  onChange={handleInputChange}
                  type="email"
                  className="form-control"
                  id="email"
                  placeholder=""
                  name="email"
                  value={lFormData.email}
                />
                <label htmlFor="email" className="form-label">
                  Email
                </label>
              </div>
            </div>
            <div className="col-6">
              <div className="mt-3">
                <label htmlFor="gender" className="form-label me-3">
                  Gender
                </label>
                <input
                  type="radio"
                  name="gender"
                  value="Male"
                  checked={lFormData.gender === "Male"}
                  onChange={handleInputChange}
                />
                Male
                <input
                  type="radio"
                  name="gender"
                  value="Female"
                  checked={lFormData.gender === "Female"}
                  className="ms-2"
                  onChange={handleInputChange}
                />
                Female
              </div>
            </div>
            <div className="col-6">
              <div className="form-floating mb-3">
                <input
                  onChange={handleInputChange}
                  type="text"
                  className="form-control"
                  id="username"
                  placeholder=""
                  name="username"
                  value={lFormData.username}
                />
                <label htmlFor="username" className="form-label">
                  Username
                </label>
              </div>
            </div>
            <div className="col-6">
              <div className="form-floating mb-3">
                <input
                  onChange={handleInputChange}
                  type="password"
                  className="form-control"
                  id="pwd"
                  placeholder=""
                  name="pwd"
                  value={lFormData.pwd}
                />
                <label htmlFor="pwd" className="form-label">
                  Password
                </label>
              </div>
            </div>
            <div className="col-6">
              <div className="form-floating mb-3">
                <input
                  onChange={handleInputChange}
                  type="date"
                  className="form-control"
                  id="start_date"
                  placeholder=""
                  name="start_date"
                  value={formatDateForInput(lFormData.start_date)}
                />
                <label htmlFor="start_date" className="form-label">
                  Expiry Date
                </label>
              </div>
            </div>
            <div className="col-6">
              <div className="form-floating mb-3">
                <input
                  onChange={handleInputChange}
                  type="date"
                  className="form-control"
                  id="expiry_date"
                  placeholder=""
                  name="expiry_date"
                  value={formatDateForInput(lFormData.expiry_date)}
                />
                <label htmlFor="expiry_date" className="form-label">
                  Expiry Date
                </label>
              </div>
            </div>
            <div className="col-6">
              <div className="form-floating mb-3">
                <select
                  onChange={handleInputChange}
                  className="form-select"
                  id="membertype"
                  name="membertype"
                  value={lFormData.membertype}
                >
                  <option>Select Type</option>
                  {memType?.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
                <label htmlFor="membertype" className="form-label">
                  Type
                </label>
              </div>
            </div>
            <div className="col-12">
              <div className="d-grid">
                <button
                  style={{
                    color: "white",
                    backgroundColor: "#0e2643",
                    border: "none",
                    marginLeft: "1rem",
                    padding: "0.3rem 0.5rem 0.3rem 0.5rem",
                    borderRadius: "0.375rem",
                  }}
                  type="submit"
                >
                  UPDATE MEMBER
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </>
  );
}

export default UpdateMemberDetail;
