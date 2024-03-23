// AdminPlatformFeedback
// AdminUserEventFeedback
import React, { useEffect } from "react";
import AdminNavbar from "../Admin/AdminNavbar";
import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { MdDeleteSweep } from "react-icons/md";
import api from "../api";
import {toast} from 'react-toastify';

function AdminUserEventFeedback() {
  const location = useLocation();

  const [adminData, setAdmindata] = useState();

  const fetchdata = async () => {
    const response = await api.get("/admin/getadmin");
    if (response.data.success !== false) {
      setAdmindata(response.data);
    }
  };
  useEffect(() => {
    fetchdata();
  }, []);

  const [showuserfeedback, setShowuserfeedback] = useState(false);
  const handlefeedbackbtn = () => {
    setShowuserfeedback(!showuserfeedback);
    console.log("show user feedback");
  };

  const navigate = useNavigate();
  const handleuserfeedbackdelete = async (index) => {
    console.log("delete user feedback");
    let temp = adminData.userfeedback;
    temp.splice(index, 1);
    const response = await api.delete("/admin/deleteuserfeedback", {
      data: { userfeedback: temp },
    });
    if (response.data.success !== false) {
      fetchdata();
    }
    else{
      toast.error(response.data.error);
    }
  };
  const handleorgfeedbackdelete = async (index) => {
    console.log("delete user feedback");
    let temp = adminData.orgfeedback;
    temp.splice(index, 1);
    const response = await api.delete("/admin/deleteorgfeedback", {
      data: { orgfeedback: temp },
    });
    if (response.data.success !== false) {
      fetchdata();
    }
    else{
      toast.error(response.data.error);
    }
  };
  return (
    <>
      <div>
        <AdminNavbar />
      </div>
      <div>
        {showuserfeedback ? (
          <button className="addpostbtn" onClick={handlefeedbackbtn}>
            Users Feedback
          </button>
        ) : (
          <button className="addpostbtn" onClick={handlefeedbackbtn}>
            Organisations Feedback
          </button>
        )}
      </div>
      <div className="mt-2 d-flex justify-content-center align-items-center">
        <h2>
          {showuserfeedback ? "Organisations Feedback:" : "Users Feedback:"}
        </h2>
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
          {adminData && (
            <tbody>
              {showuserfeedback ? (
                <>
                  {adminData.orgfeedback.map((feedback, index) => {
                    return (
                      <tr key={index}>
                        <td>{feedback.username}</td>
                        <td>{feedback.feedbackdata}</td>
                        <td>
                          <MdDeleteSweep
                          onClick={() => handleorgfeedbackdelete(index)}
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
              ) : (
                <>
                  {adminData.userfeedback.map((feedback, index) => {
                    return (
                      <tr key={index}>
                        <td>{feedback.username}</td>
                        <td>{feedback.feedbackdata}</td>
                        <td>
                          <MdDeleteSweep
                            onClick={() => handleuserfeedbackdelete(index)}
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
          )}
        </table>
      </div>
    </>
  );
}

export default AdminUserEventFeedback;
