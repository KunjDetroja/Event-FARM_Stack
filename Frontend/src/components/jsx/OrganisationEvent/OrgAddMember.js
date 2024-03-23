import React, {useState,useEffect} from 'react'
import OrganizationNavbar from '../OrganisationNavbar'
import api from '../api';
import {toast} from "react-toastify"
import { useNavigate } from 'react-router-dom';

function OrgAddMember() {

    const [memType, setMemType] = useState()
    const navigate = useNavigate();
    const [userData, setUserData] = useState(
        JSON.parse(localStorage.getItem("organisers"))
    );

    const fetchAllPostdetails = async () => {
        try {
            const cname = userData.clubname;
            const response = await api.post("/getmemtype/", { "clubname": cname });
            setMemType(response.data);
            console.log(response.data);
        } catch (error) {
            console.error("Error fetching details:", error);
        }
    };
    useEffect(() => {
        fetchAllPostdetails();
    }, []);

    const [lFormData, setLFormData] = useState({
        name: "",
        email: "",
        pnumber: "",
        gender: "",
        username: "",
        pwd: "",
        memberid: "",
        membertype: '',
        expiry_date: "",
        start_date: "",
        
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
            const checking = await api.put(`/addorganizationmember/${userData._id}`, lFormData);
            if (checking.data.success !== false) {
                toast.success("Login Successfully")
                navigate("/organisationevents/organizationmemberdetails");
                setLFormData({
                    name: "",
                    email: "",
                    pnumber: "",
                    gender: "",
                    username: "",
                    pwd: "",
                    memberid: "",
                    membertype: '',
                    expiry_date: "",
                    start_date: "",
                });
              } else {
                toast.error(checking.data.error);
              }
            
        }
        catch (error) {
            console.error("Error submitting form:", error);
        }
    };

  return (
    <>
    <div><OrganizationNavbar/></div>
     <h2 className='text-center mt-4'>Add Member</h2>
            <div className="container mt-3 mb-3 border rounded p-0 col-md-9">
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
                                    className='ms-2'
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
                                    Starting Date
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
                                <button style={{ color: 'white', backgroundColor: '#0e2643', border: 'none', marginLeft: '1rem', padding: '0.3rem 0.5rem 0.3rem 0.5rem', borderRadius: '0.375rem' }} type="submit">ADD MEMBER</button>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
    </>
  )
}

export default OrgAddMember