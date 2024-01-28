import React, { useState, useEffect } from 'react'
import OrganizationNavbar from './OrganizationNavbar'
import api from '../../api';
import { toast } from "react-toastify"
import { useNavigate } from 'react-router-dom';

function OrganizationAddMembership() {
    const navigate = useNavigate();
    const [userData, setUserData] = useState(
        JSON.parse(localStorage.getItem("organization"))
    );

    const [lFormData, setLFormData] = useState({
        type: "",
        price: ""
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
        try {
            const checking = await api.put(`/addmembership/${userData.clubname}`, lFormData);
            if (checking.data.success !== false) {
                toast.success("Membership Added Successfully")
                navigate("/organizations/membership");
                setLFormData({
                    type: "",
                    price: ""
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
            <OrganizationNavbar />
            <h2 className='text-center mt-4'>Add Membership</h2>
            <div className="container mb-3 border rounded p-3">
                <form onSubmit={handleFormSubmit}>
                    <div className="row gy-3 overflow-hidden">
                        <div className="col-6">
                            <div className="form-floating mb-3">
                                <input
                                    onChange={handleInputChange}
                                    type="text"
                                    className="form-control"
                                    id="type"
                                    placeholder=""
                                    name="type"
                                    value={lFormData.type}
                                />
                                <label htmlFor="type" className="form-label">
                                    Type
                                </label>
                            </div>
                        </div>
                        <div className="col-6">
                            <div className="form-floating mb-3">
                                <input
                                    onChange={handleInputChange}
                                    type="number"
                                    className="form-control"
                                    id="price"
                                    placeholder=""
                                    name="price"
                                    value={lFormData.price}
                                />
                                <label htmlFor="price" className="form-label">
                                    Price
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

export default OrganizationAddMembership
