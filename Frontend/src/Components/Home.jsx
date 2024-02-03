import React, { useState } from 'react'
import Navbar from './Navbar'
import api from '../api';

function Home() {
    const [lFormData, setLFormData] = useState({
        clubname: '',
        event_title: '',
        event_image: "",
        event_start_date: '',
        event_end_date: '',
        start_time: '',
        end_time: '',
        venue_name: '',
        venue_address: '',
        venue_city: '',
        ticket_price: '',
        event_highlight: '',
        event_desc: '',
        event_organizer_name: '',
        event_organizer_email: '',
        event_organizer_pnumber: '',
    });

    const handleFileChange = (event) => {
        const file = event.target.files[0];

        if (file) {
            const reader = new FileReader();

            reader.onloadend = () => {
                // reader.result contains the base64-encoded string
                const base64String = reader.result;

                setLFormData({
                    ...lFormData,
                    [event.target.name]: base64String,
                });

            };

            reader.readAsDataURL(file);
        }
    };

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
        // console.log(lFormData)
        document.getElementById('event_image').value = ""
        try {
            const checking = await api.post("/eventpost/", lFormData);
            // console.log(checking);
            // if (checking.data) {
            //   // Use the navigate function to go to the home page
            //   console.log("form data: " + JSON.stringify(lFormData))
            //   navigate("/home", { state: JSON.stringify(lFormData) });
            // } else {
            //   toast.error("Wrong Username & Password!");
            // }
            setLFormData({
                clubname: '',
                event_title: '',
                event_image: "",
                event_start_date: '',
                event_end_date: '',
                start_time: '',
                end_time: '',
                venue_name: '',
                venue_address: '',
                venue_city: '',
                ticket_price: '',
                event_highlight: '',
                event_desc: '',
                event_organizer_name: '',
                event_organizer_email: '',
                event_organizer_pnumber: '',
            });
        }
        catch (error) {
            console.error("Error submitting form:", error);
        }
    };
    return (
        <>
            <Navbar />
            <h2 className='text-center mt-4'>Hey Guys,  </h2>
            <h2 className='text-center mt-4'>This page not finished yet </h2>
            <div className="container mb-3 border rounded p-3">
                <form onSubmit={handleFormSubmit}>
                    <div className="row gy-3 overflow-hidden">
                        <div className="col-6">
                            <div className="form-floating mb-3">
                                <input
                                    onChange={handleInputChange}
                                    type="text"
                                    className="form-control"
                                    id="clubname"
                                    placeholder=""
                                    name="clubname"
                                    value={lFormData.clubname}
                                />
                                <label htmlFor="clubname" className="form-label">
                                    Club Name
                                </label>
                            </div>
                        </div>
                        <div className="col-6">
                            <div className="form-floating mb-3">
                                <input
                                    onChange={handleFileChange}
                                    type="file"
                                    className="form-control"
                                    id="event_image"
                                    placeholder=""
                                    name="event_image"
                                // value={lFormData.event_image}
                                />
                                <label htmlFor="event_image" className="form-label">
                                    Image
                                </label>
                            </div>
                        </div>
                        <div className="col-6">
                            <div className="form-floating mb-3">
                                <input
                                    onChange={handleInputChange}
                                    type="text"
                                    className="form-control"
                                    id="event_title"
                                    placeholder=""
                                    name="event_title"
                                    value={lFormData.event_title}
                                />
                                <label htmlFor="event_title" className="form-label">
                                    Event Title
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
                                    id="ticket_price"
                                    placeholder=""
                                    name="ticket_price"
                                    value={lFormData.ticket_price}
                                />
                                <label htmlFor="ticket_price" className="form-label">
                                    Ticket Price (In Rupees)
                                </label>
                            </div>
                        </div>
                        <div className="col-6">
                            <div className="form-floating mb-3">
                                <input
                                    onChange={handleInputChange}
                                    type="date"
                                    className="form-control"
                                    id="event_start_date"
                                    placeholder=""
                                    name="event_start_date"
                                    value={formatDateForInput(lFormData.event_start_date)}
                                />
                                <label htmlFor="event_start_date" className="form-label">
                                    Start Date
                                </label>
                            </div>
                        </div>
                        <div className="col-6">
                            <div className="form-floating mb-3">
                                <input
                                    onChange={handleInputChange}
                                    type="date"
                                    className="form-control"
                                    id="event_end_date"
                                    placeholder=""
                                    name="event_end_date"
                                    value={formatDateForInput(lFormData.event_end_date)}
                                />
                                <label htmlFor="event_end_date" className="form-label">
                                    End Date
                                </label>
                            </div>
                        </div>
                        <div className="col-6">
                            <div className="form-floating mb-3">
                                <input
                                    onChange={handleInputChange}
                                    type="time"
                                    className="form-control"
                                    id="start_time"
                                    name="start_time"
                                    value={lFormData.start_time}
                                />
                                <label htmlFor="start_time" className="form-label">
                                    Start Time
                                </label>
                            </div>
                        </div>
                        <div className="col-6">
                            <div className="form-floating mb-3">
                                <input
                                    onChange={handleInputChange}
                                    type="time"
                                    className="form-control"
                                    id="end_time"
                                    name="end_time"
                                    value={lFormData.end_time}
                                />
                                <label htmlFor="end_time" className="form-label">
                                    End Time
                                </label>
                            </div>
                        </div>
                        <div className="col-6">
                            <div className="form-floating mb-3">
                                <input
                                    onChange={handleInputChange}
                                    type="text"
                                    className="form-control"
                                    id="venue_name"
                                    placeholder=""
                                    name="venue_name"
                                    value={lFormData.venue_name}
                                />
                                <label htmlFor="venue_name" className="form-label">
                                    Venue Name
                                </label>
                            </div>
                        </div>
                        <div className="col-6">
                            <div className="form-floating mb-3">
                                <input
                                    onChange={handleInputChange}
                                    type="text"
                                    className="form-control"
                                    id="venue_city"
                                    placeholder=""
                                    name="venue_city"
                                    value={lFormData.venue_city}
                                />
                                <label htmlFor="venue_city" className="form-label">
                                    Venue City
                                </label>
                            </div>
                        </div>
                        <div className="col-12">
                            <div className="form-floating mb-3">
                                <input
                                    onChange={handleInputChange}
                                    type="text"
                                    className="form-control"
                                    id="venue_address"
                                    placeholder=""
                                    name="venue_address"
                                    value={lFormData.venue_address}
                                />
                                <label htmlFor="venue_address" className="form-label">
                                    Venue Address
                                </label>
                            </div>
                        </div>

                        <div className="col-12">
                            <div className="form-floating mb-3">
                                <textarea
                                    onChange={handleInputChange}
                                    type="text"
                                    className="form-control"
                                    id="event_highlight"
                                    placeholder=""
                                    name="event_highlight"
                                    value={lFormData.event_highlight}
                                />
                                <label htmlFor="event_highlight" className="form-label">
                                    Event Highlight
                                </label>
                            </div>
                        </div>
                        <div className="col-12">
                            <div className="form-floating mb-3">
                                <textarea
                                    onChange={handleInputChange}
                                    className="form-control"
                                    id="event_desc"
                                    placeholder=""
                                    name="event_desc"
                                    value={lFormData.event_desc}
                                ></textarea>
                                <label htmlFor="event_desc" className="form-label">
                                    Event Description
                                </label>
                            </div>
                        </div>
                        <div className="col-6">
                            <div className="form-floating mb-3">
                                <input
                                    onChange={handleInputChange}
                                    type="text"
                                    className="form-control"
                                    id="event_organizer_name"
                                    placeholder=""
                                    name="event_organizer_name"
                                    value={lFormData.event_organizer_name}
                                />
                                <label htmlFor="event_organizer_name" className="form-label">
                                    Event Organizer Name
                                </label>
                            </div>
                        </div>
                        <div className="col-6">
                            <div className="form-floating mb-3">
                                <input
                                    onChange={handleInputChange}
                                    type="email"
                                    className="form-control"
                                    id="event_organizer_email"
                                    placeholder=""
                                    name="event_organizer_email"
                                    value={lFormData.event_organizer_email}
                                />
                                <label htmlFor="event_organizer_email" className="form-label">
                                    Event Organizer Email
                                </label>
                            </div>
                        </div>
                        <div className="col-6  align-items-center justify-content-center">
                            <div className="form-floating mb-3">
                                <input
                                    onChange={handleInputChange}
                                    type="number"
                                    className="form-control"
                                    id="event_organizer_pnumber"
                                    placeholder=""
                                    name="event_organizer_pnumber"
                                    value={lFormData.event_organizer_pnumber}
                                />
                                <label htmlFor="event_organizer_pnumber" className="form-label">
                                    Event Organizer Phone Number
                                </label>
                            </div>
                        </div>
                        <div className="col-12">
                            <div className="d-grid">
                                <button style={{color: 'white',backgroundColor: '#0e2643',border: 'none',marginLeft: '1rem',padding: '0.3rem 0.5rem 0.3rem 0.5rem',borderRadius: '0.375rem'}} type="submit">Log in now</button>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </>
    )
}

export default Home
