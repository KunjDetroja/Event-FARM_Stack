// AdminUserEventFeedback
import React from "react";
import AdminNavbar from "../Admin/AdminNavbar";
import { useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { MdDeleteSweep } from "react-icons/md";
import api from "../api";
import { toast } from "react-toastify";

function AdminUserEventFeedback() {
  const location = useLocation();
  const [post, setPost] = useState(JSON.parse(location.state));

  const [postdata, setPostdata] = useState();

  const fetchdata = async () => {
    // setOrgData(JSON.parse(localStorage.getItem("adminsingleorg")));
    console.log("inside fetchdata");
    try {
      const data = { clubname: post.clubname, eventid: post._id };
      console.log("inside fetchdata try");
      const response = await api.post("/admin/fetchingsingleorgpostfeedback", data);
      if (response.data.success !== false) {
        console.log(response.data);
        setPostdata(response.data);
      } else {
        toast.error(response.data.error);
      }
    } catch (e) {
      console.log(e);
    }
  };


  const handleorgeventfeedbackdelete = async (index) => {
    console.log("delete user feedback");
    // fetchdata();
    try {
      let temp = post.feedback;
      console.log(temp);
      temp.splice(index, 1);
      const data = { postfeedback: temp, postid: post._id };
      console.log(temp);
      const response = await api.put("/admin/deleteorgeventfeedback", data);
      if (response.data.success !== false) {
        fetchdata();
      } else {
        toast.error(response.data.error);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchdata();
  }
  , []);

  return (
    <>
      <div>
        <AdminNavbar />
      </div>
      <div className="mt-2 d-flex justify-content-center align-items-center">
        <h2>"{post.event_title}" Event Feedback</h2>
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
            {postdata && (
              <>
                {postdata.map((feedback, index) => {
                  return (
                    <tr key={index}>
                      <td>{feedback.username}</td>
                      <td>{feedback.feedbackdata}</td>
                      <td>
                        <MdDeleteSweep
                          onClick={() => handleorgeventfeedbackdelete(index)}
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

export default AdminUserEventFeedback;
