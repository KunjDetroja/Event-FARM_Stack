import React, { useState } from 'react'
import api from '../../../api';
import { toast } from 'react-toastify';

function OrganizationSignup({ setOBoolean }) {

    const [lFormData, setLFormData] = useState({
        clubname: "",
        ownname: "",
        email: "",
        address: "",
        city: "",
        pnumber: '',
        desc: "",
        memtype: [],
        members: [],
        username: "",
        pwd: "",
    });

    const handleInputChange = (event) => {
        setLFormData({
            ...lFormData,
            [event.target.name]: event.target.value,
        });
    };

    const handleFormSubmit = async (event) => {
        event.preventDefault();
        try {
            await api.post("/organisationsignup/", lFormData);
            
            document.getElementById('memtype').value = ""
            document.getElementById('members').value = ""
            setLFormData({
                clubname: "",
                ownname: "",
                email: "",
                address: "",
                city: "",
                pnumber: '',
                desc: "",
                memtype: [],
                members: [],
                username: "",
                pwd: "",
            });
            toast.success("SignUp Successful.")

        } catch (error) {
            toast.error("Error submitting form")
        }
    };

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const fileContent = e.target.result;
                try {
                    console.log("step4" + event.target.name);
                    const jsonData = JSON.parse(fileContent);
                    setLFormData({
                        ...lFormData,
                        [event.target.name]: jsonData,
                        // memtypeName : file?.name
                    });
                } catch (error) {
                    console.error('Error parsing JSON file:', error);
                }
            };

            reader.readAsText(file);
        }
    };
    return (
        <>
            <div className="col-12 col-md-6 col-xl-7">
                <div className="card border-0 rounded-4 ">
                    <div className="card-body p-3 p-md-4 p-xl-5">
                        <div className="row">
                            <div className="col-12">
                                <div className="mb-4">
                                    <h3>Organization Sign up</h3>
                                    <p>If you have an account? <button className='btn btn-primary' onClick={() => {
                                        setOBoolean(true)
                                    }}>Login</button></p>
                                </div>
                            </div>
                        </div>
                        <form onSubmit={handleFormSubmit}>
                            <div className="row  overflow-hidden" >
                                <div className="col-12">
                                    <div className="form-floating mb-3">
                                        <input
                                            onChange={handleInputChange}
                                            type="text"
                                            className="form-control"
                                            id="clubname"
                                            name="clubname"
                                            placeholder=''
                                            value={lFormData.clubname}
                                        />
                                        <label htmlFor="clubname" className="form-label">
                                            Name
                                        </label>
                                    </div>
                                </div>
                                <div className="col-12">
                                    <div className="form-floating mb-3">
                                        <input
                                            onChange={handleInputChange}
                                            type="text"
                                            className="form-control"
                                            id="ownername"
                                            name="ownname"
                                            placeholder=''
                                            value={lFormData.ownname}
                                        />
                                        <label htmlFor="ownername" className="form-label">
                                            Owner Name
                                        </label>
                                    </div>
                                </div>
                                <div className="col-12">
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
                                <div className="col-12">
                                    <div className="form-floating mb-3">
                                        <input
                                            onChange={handleInputChange}
                                            type="text"
                                            className="form-control"
                                            id="address"
                                            placeholder=""
                                            name="address"
                                            value={lFormData.address}
                                        />
                                        <label htmlFor="address" className="form-label">
                                            Address
                                        </label>
                                    </div>
                                </div>
                                <div className="col-12">
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
                                            City Name
                                        </label>
                                    </div>
                                </div>
                                <div className="col-12">
                                    <div className="form-floating mb-3">
                                        <input
                                            onChange={handleInputChange}
                                            type="number"
                                            className="form-control"
                                            id="number"
                                            placeholder=""
                                            name="pnumber"
                                            value={lFormData.pnumber}
                                        />
                                        <label htmlFor="pnumber" className="form-label">
                                            Phone Number:
                                        </label>
                                    </div>
                                </div>
                                <div className="col-12">
                                    <div className="form-floating mb-3">
                                        <textarea
                                            onChange={handleInputChange}
                                            className="form-control"
                                            id="desc"
                                            placeholder=""
                                            name="desc"
                                            value={lFormData.desc}
                                        ></textarea>
                                        <label htmlFor="desc" className="form-label">
                                            Organisation Description
                                        </label>
                                    </div>
                                </div>
                                <div className="col-12">
                                    <div className="form-floating mb-3">
                                        <input
                                            type="file"
                                            className="form-control"
                                            id="memtype"
                                            accept=".json"
                                            onChange={handleFileChange}
                                            
                                            multiple={false}
                                            name="memtype"
                                        />
                                        <label htmlFor="memtype" className="form-label">
                                            Membership Type .json File
                                        </label>
                                    </div>
                                </div>
                                <div className="col-12">
                                    <div className="form-floating mb-3">
                                        <input
                                            type="file"
                                            className="form-control"
                                            id="members"
                                            accept=".json"
                                            onChange={handleFileChange}
                                            multiple={false}
                                            name="members"
                                        />
                                        <label htmlFor="members" className="form-label">
                                            Members .json File
                                        </label>
                                    </div>
                                </div>
                                <div className="col-12">
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
                                            UserName:
                                        </label>
                                    </div>
                                </div>
                                <div className="col-12">
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
                                            Password:
                                        </label>
                                    </div>
                                </div>
                                <div className="col-12">
                                    <div className="d-grid">
                                        <button className="btn btn-primary btn-lg" type="submit">Log in now</button>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>

    )
}

export default OrganizationSignup
