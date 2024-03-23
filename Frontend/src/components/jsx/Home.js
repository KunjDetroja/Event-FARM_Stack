import React, { useState, useEffect } from "react";
import api from "./api";
import "../css/Home.css";
import Navbar from "./Navbar";

function Home() {
  const [details, setDetails] = useState([]);
  const [formdata, setFormdata] = useState({
    name: "",
    email: "",
    password: "",
  });
 
  
  const fetchAllDetails = async () => {
    try {
      const response = await api.get("/");
      setDetails(response.data);
    } catch (error) {
      console.error("Error fetching details:", error);
    }
  };

  useEffect(() => {
    fetchAllDetails();
  }, []);

  const handleInputChange = (event) => {
    setFormdata({
      ...formdata,
      [event.target.name]: event.target.value,
    });
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    try {
      await api.post("/", formdata);
      fetchAllDetails();
      setFormdata({
        name: "",
        email: "",
        password: "",
      });
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  const handleDelete = async (userID) => {
    console.log("Inside handleDelete");
    try {
      console.log("Deleting user with ID:", userID);
    
      const response = await api.delete(`/deletingUser/${userID}`);

      console.log("Delete response:", response);
      fetchAllDetails();
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  return (
    <>
      <div>
        
          <>
            <div>{<Navbar />}</div>
            <div className="afterNavbar">
              <div>
                <form onSubmit={handleFormSubmit}>
                  <div className="mb-3">
                    <label htmlFor="exampleInputName1" className="form-label">
                      Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      className="form-control"
                      id="exampleInputName1"
                      aria-describedby="nameHelp"
                      onChange={handleInputChange}
                      value={formdata.name}
                    />
                  </div>

                  <div className="mb-3">
                    <label htmlFor="exampleInputEmail1" className="form-label">
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      className="form-control"
                      id="exampleInputEmail1"
                      aria-describedby="emailHelp"
                      onChange={handleInputChange}
                      value={formdata.email}
                    />
                    <div id="emailHelp" className="form-text">
                      We'll never share your email with anyone else.
                    </div>
                  </div>
                  <div className="mb-3">
                    <label htmlFor="exampleInputPassword1" className="form-label">
                      Password
                    </label>
                    <input
                      type="text"
                      name="password"
                      className="form-control"
                      id="exampleInputPassword1"
                      onChange={handleInputChange}
                      value={formdata.password}
                    />
                  </div>

                  <button type="submit" className="btn btn-primary">
                    Submit
                  </button>
                </form>
              </div>
              
              <div className="userDetails">
                <h1>All User Details:</h1>{" "}
                {details.length ? (
                  details.map((detail) => (
                    <div key={detail._id}>
                      <button onClick={() => handleDelete(detail._id)}>
                        Delete User
                      </button>
                      <p>ID: {detail._id}</p>
                      <p>Name: {detail.clubname}</p>
                      <p>Email: {detail.email}</p>
                      <p>Password: {detail.pwd}</p>

                      <hr />
                    </div>
                  ))
                ) : (
                  <p>No Records...</p>
                )}
              </div>
            </div>
          </>
        
      </div>
    </>
  );
}

export default Home;
