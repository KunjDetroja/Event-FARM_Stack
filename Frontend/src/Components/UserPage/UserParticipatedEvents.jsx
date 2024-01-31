import React, { useEffect, useState } from 'react'
import Navbar from '../Navbar'
import api from "../../api"
import {
    FaRupeeSign,
} from "react-icons/fa";
import { useNavigate } from 'react-router-dom';

function UserParticipatedEvents() {
    const [post, setPost] = useState([])
    const [posterror, setPostError] = useState("")

    const userData = JSON.parse(localStorage.getItem("users"))
    const fetchAllPostdetails = async () => {
        console.log("fetching post function")
        try {
            // console.log(userData.username)
            const checking = await api.post(`/userparticipated/${userData.username}`);
            if (checking.data.success !== false) {
                // toast.success(checking.data.data)
                setPost(checking.data);

            } else {
                setPostError(checking.data.error)
            }
        } catch (error) {
            console.error("Error fetching details:", error);
        }
    };

    useEffect(() => {
        fetchAllPostdetails();

    }, []);
    const navigate = useNavigate();
    const handlepostdetails = (post) => {
        navigate("/event/details", {
            state: JSON.stringify(post),
        });
    };
    return (
        <div>
            <Navbar />
            <h2 className='text-center mt-4'>Participated</h2>
            <div className="row">
                {post && post.length ? (
                    post.map((post) => (
                        <div
                            key={post._id}
                            className="col-3 maincardbody"
                        >
                            <div className="usereventsmain">
                                <ul className="usereventscards">
                                    <li className="usereventscards_item">
                                        <div className="usereventscard">
                                            <div className="usereventscard_image">
                                                <img
                                                    className="usereventsmaincardimage"
                                                    src={post.event_image}
                                                    alt="event"
                                                    onClick={() => handlepostdetails(post)}
                                                    style={{ cursor: "pointer" }}
                                                />
                                                <span className="card_price cardspantag">
                                                    <span>
                                                        <FaRupeeSign />
                                                        {post.ticket_price}
                                                    </span>
                                                </span>
                                            </div>
                                            <div className="usereventscard_content">
                                                <h2
                                                    className="usereventscard_title"
                                                    onClick={() => handlepostdetails(post)}
                                                    style={{ cursor: "pointer" }}
                                                >
                                                    {post.event_title}
                                                </h2>
                                                <div className="usereventscard_text">
                                                    <p className="cardptag">
                                                        Venue: {post.venue_name}
                                                    </p>
                                                    <span className="cardptag">
                                                        Venue City: {post.venue_city}
                                                    </span>
                                                    <hr />
                                                    <span className="cardptag">
                                                        Club: {post.clubname}
                                                    </span>
                                                    <hr />
                                                    <p className="cardptag">
                                                        Event Type:
                                                        <strong> {post.type} </strong>{" "}
                                                    </p>
                                                    <hr className="cardhrtag" />
                                                    <p className="cardptag">
                                                        Event Dates:
                                                        <strong>
                                                            {" "}
                                                            {post.event_start_date}{" "}
                                                        </strong>{" "}
                                                        <span> TO </span>
                                                        <strong> {post.event_end_date}</strong>
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    ))
                ) : (
                    <p>{posterror}</p>
                )}
            </div>
        </div>
    )
}

export default UserParticipatedEvents