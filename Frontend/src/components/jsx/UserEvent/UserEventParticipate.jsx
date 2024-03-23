import React, { useState } from 'react'
import Navbar from '../Navbar'
import api from "../api"
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'

function UserEventParticipate() {
    const userData = JSON.parse(localStorage.getItem("users"))
    const post_id = JSON.parse(localStorage.getItem("postid"))
    const navigate = useNavigate()

    const [lFormData, setLFormData] = useState({
        name: userData.name,
        email: userData.email,
        pnumber: userData.pnumber,
        gender: userData.gender,
        username: userData.username,
        age: "",
        upi_id: "",
        city: "",
    });
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setLFormData({
            ...lFormData,
            [name]: value,
        });
    };

    const handleFormSubmit = async (event) => {
        event.preventDefault();
        console.log(post_id)
        console.log(lFormData)
        try {
            const checking = await api.put(`/eventparticipate/${post_id}`, lFormData);
            // console.log(checking);
            if (checking.data.success !== false) {
              toast.success(checking.data.data)
              setLFormData({
                  name: "",
                  email: "",
                  pnumber: "",
                  gender: "",
                  username: "",
                  age: "",
                  upi_id: "",
                  city: "",
              });
              localStorage.removeItem('postid');
              navigate("/events");
            } else {
              toast.error(checking.data.error)
            }
        }
        catch (error) {
            console.error("Error submitting form:", error);
        }
    };
    return (
        <>
            <Navbar />
            <h2 className='text-center mt-4'>Participation </h2>
            <div className="container mb-3 border rounded p-3">
                <form onSubmit={handleFormSubmit}>
                    <div className="row gy-3 overflow-hidden">
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
                                    {...(userData.membertype !== "Family Membership" ? { disabled: true } : {})}
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
                                    type="email"
                                    className="form-control"
                                    id="email"
                                    placeholder=""
                                    name="email"
                                    value={lFormData.email}
                                    {...(userData.membertype !== "Family Membership" ? { disabled: true } : {})}
                                />
                                <label htmlFor="event_title" className="form-label">
                                    Email
                                </label>
                            </div>
                        </div>
                        <div className="col-6">
                            <div className="form-floating mb-3">
                                <input
                                    onChange={handleInputChange}
                                    type="number"
                                    step="0.01"
                                    className="form-control"
                                    id="pnumber"
                                    placeholder=""
                                    name="pnumber"
                                    value={lFormData.pnumber}
                                    {...(userData.membertype !== "Family Membership" ? { disabled: true } : {})}
                                />
                                <label htmlFor="pnumber" className="form-label">
                                    Phone
                                </label>
                            </div>
                        </div>
                        
                        <div className="col-6">
                            <div className="">
                                <label htmlFor="gender" className="form-label me-3">
                                    Gender
                                </label>
                                <input
                                    type="radio"
                                    name="gender"
                                    value="Male"
                                    checked={lFormData.gender === "Male"}
                                    onChange={handleInputChange}
                                    {...(userData.membertype !== "Family Membership" ? { disabled: true } : {})}
                                />
                                Male
                                <input
                                    type="radio"
                                    name="gender"
                                    value="Female"
                                    checked={lFormData.gender === "Female"}
                                    className='ms-2'
                                    onChange={handleInputChange}
                                    {...(userData.membertype !== "Family Membership" ? { disabled: true } : {})}
                                />
                                Female
                            </div>
                        </div>
                        <div className="col-4">
                            <div className="form-floating mb-3">
                                <input
                                    onChange={handleInputChange}
                                    type="text"
                                    className="form-control"
                                    id="city"
                                    placeholder=""
                                    name="city"
                                    value={lFormData.city}
                                />
                                <label htmlFor="city" className="form-label">
                                    City
                                </label>
                            </div>
                        </div>
                        <div className="col-4">
                            <div className="form-floating mb-3">
                                <input
                                    onChange={handleInputChange}
                                    type="number"
                                    step="0.01"
                                    className="form-control"
                                    id="age"
                                    placeholder=""
                                    name="age"
                                    value={lFormData.age}
                                />
                                <label htmlFor="age" className="form-label">
                                    Age
                                </label>
                            </div>
                        </div>
                        <div className="col-4">
                            <div className="form-floating mb-3">
                                <input
                                    onChange={handleInputChange}
                                    type="text"
                                    className="form-control"
                                    id="upi_id"
                                    placeholder=""
                                    name="upi_id"
                                    value={lFormData.upi_id}
                                />
                                <label htmlFor="upi_id" className="form-label">
                                    UPI ID
                                </label>
                            </div>
                        </div>
                        
                        <div className="col-12">
                            <div className="d-grid">
                                <button style={{ color: 'white', backgroundColor: '#0e2643', border: 'none', marginLeft: '1rem', padding: '0.3rem 0.5rem 0.3rem 0.5rem', borderRadius: '0.375rem' ,
                            fontSize:"1.2rem"}} type="submit">Participate now</button>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </>
    )
}

export default UserEventParticipate