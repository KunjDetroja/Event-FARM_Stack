import React, { useState, useEffect } from 'react'
import Navbar from '../Navbar'
import api from '../api'
import { toast } from "react-toastify"
import { useNavigate } from 'react-router-dom';

function UserSubscribeForm() {
    const navigate = useNavigate();
    const [memType, setMemType] = useState()
    const orgname = JSON.parse(localStorage.getItem("orgname"))
    const userData = JSON.parse(localStorage.getItem("users"))

    const [lFormData, setLFormData] = useState({
        clubname: orgname,
        name: "",
        email: "",
        pnumber: "",
        gender: "",
        username: "",
        pwd: "",
        membertype: '',

    });

    function formatDateForInput(dateString) {
        const date = new Date(dateString);
        if (isNaN(date.getTime())) {
            return ''; // Invalid date, return an empty string
        }
        return date.toISOString().split('T')[0];
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
        console.log(lFormData)
        try {
            const checking = await api.put("/usersubscribe", lFormData);
            if (checking.data.success !== false) {
                toast.success(checking.data.data)
                navigate("/");
                setLFormData({
                    clubname: "",
                    name: "",
                    email: "",
                    pnumber: "",
                    gender: "",
                    username: "",
                    pwd: "",
                    membertype: "",
                });
            } else {
                toast.error(checking.data.error);
            }

        }
        catch (error) {
            console.error("Error submitting form:", error);
        }
    };

    const fetchAllMemTypedetails = async () => {
        try {
            console.log(userData.username)
            console.log(orgname)
            const data = { "username": userData.username, "clubname": orgname }
            const response = await api.post("/filtermemtype", data);
            setMemType(response.data);
            console.log(response.data);
        } catch (error) {
            console.error("Error fetching details:", error);
        }
    };
    useEffect(() => {
        fetchAllMemTypedetails();
        if (userData.membertype == "Public"){
            setLFormData({
                clubname: orgname,
                name: userData.name,
                email: userData.email,
                pnumber: userData.pnumber,
                gender: userData.gender,
                username: userData.username,
                pwd: userData.pwd,
                membertype: "",
            })
        }
    }, []);

    

    return (
        <>
            <Navbar />
            <h2 className='text-center mt-4'>You have to create New Account </h2>
            <div className="container mb-3 border rounded p-3 col-md-8">
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
                                    value={orgname}
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
                                    id="name"
                                    placeholder=""
                                    name="name"
                                    value={lFormData.name}
                                    {...(userData.membertype == "Public" ? { disabled: true } : {})}
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
                                    type="number"
                                    className="form-control"
                                    id="pnumber"
                                    placeholder=""
                                    name="pnumber"
                                    value={lFormData.pnumber}
                                    {...(userData.membertype == "Public" ? { disabled: true } : {})}
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
                                    {...(userData.membertype == "Public" ? { disabled: true } : {})}
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
                                    {...(userData.membertype == "Public" ? { disabled: true } : {})}
                                />
                                Male
                                <input
                                    type="radio"
                                    name="gender"
                                    value="Female"
                                    checked={lFormData.gender === "Female"}
                                    className='ms-2'
                                    onChange={handleInputChange}
                                    {...(userData.membertype == "Public" ? { disabled: true } : {})}
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
                                    {...(userData.membertype == "Public" ? { disabled: true } : {})}
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
                                    {...(userData.membertype == "Public" ? { disabled: true } : {})}
                                />
                                <label htmlFor="pwd" className="form-label">
                                    Password
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
                                    <option >Select Membership Type</option>
                                    {memType?.map((type) => (
                                        <option key={type} value={type.type}>
                                            {type.type}
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
                                <button style={{ color: 'white', backgroundColor: '#0e2643', border: 'none', marginLeft: '1rem', padding: '0.4rem 0.5rem 0.4rem 0.5rem', borderRadius: '0.375rem' }} type="submit">Submit</button>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </>
    )
}

export default UserSubscribeForm