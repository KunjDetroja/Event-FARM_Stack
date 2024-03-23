//AdminOrgFeedback
import React, { useEffect } from "react";
import AdminNavbar from "../Admin/AdminNavbar";
import { useLocation } from "react-router-dom";
import { useState } from "react";
import { MdDeleteSweep } from "react-icons/md";
import api from "../api";
import { toast } from "react-toastify";

function AdminOrgFeedback() {
  const location = useLocation();
  const [orgData, setOrgData] = useState();
  const [orgclub, setOrgclub] = useState(
    JSON.parse(localStorage.getItem("adminsingleorg"))
  );

  const fetchdata = async () => {
    // setOrgData(JSON.parse(localStorage.getItem("adminsingleorg")));
    console.log("inside fetchdata");
    try {
      const data = { "clubname": orgclub.clubname };
      console.log("inside fetchdata try");
      const response = await api.post("/admin/fetchingsingleorg", data);
      if (response.data.success !== false) {
        setOrgData(response.data);
      } else {
        toast.error(response.data.error);
      }
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    fetchdata();
  }, []);

  

  const handleorguserfeedbackdelete = async (index) => {
    console.log("delete user feedback");
    // fetchdata();
    try {
      let temp = orgData.feedback;
      console.log(temp);
      temp.splice(index, 1);
      const data = { orguserfeedback: temp, clubname: orgclub.clubname };
      console.log(temp);
      const response = await api.put("/admin/deleteuserorgfeedback", data);
      if (response.data.success !== false) {
        fetchdata();
      } else {
        toast.error(response.data.error);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <div>
        <AdminNavbar />
      </div>
      <div className="mt-2 d-flex justify-content-center align-items-center">
        <h2>{orgclub.clubname}'s Feedback</h2>
      </div>
      <div className="m-5">
        <table className="table table-hover">
          <thead>
            <tr>
              <th scope="col">User Name</th>
              <th scope="col">Feedback</th>
              <th scope="col">Delete</th>
            </tr>
          </thead>
          <tbody>
            {orgData && (
              <>
                {orgData.feedback.map((feedback, index) => {
                  return (
                    <tr key={index}>
                      <td>{feedback.username}</td>
                      <td>{feedback.feedbackdata}</td>
                      <td>
                        <MdDeleteSweep
                          onClick={() => handleorguserfeedbackdelete(index)}
                          style={{
                            color: "red",
                            cursor: "pointer",
                            fontSize: "2rem",
                            marginLeft: "10px",
                          }}
                        />
                      </td>
                    </tr>
                  );
                })}
              </>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}

export default AdminOrgFeedback;
