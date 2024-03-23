import React from 'react'
import OrganisationNavbar from '../OrganisationNavbar'
import { useLocation } from 'react-router-dom';
import { useState } from 'react';

function OrgUserEventFeedback() {
    const location = useLocation();
    const [post, setPost] = useState(JSON.parse(location.state));


  return (
    <>
    <div>
        <OrganisationNavbar/>
    </div>
    <div className='mt-2 d-flex justify-content-center align-items-center'>
        <h2>"{post.event_title}"  Event     Feedback</h2>
    </div>
    <div className='m-5'>
        <table className="table table-striped">
            <thead>
                <tr>
                    <th scope="col">User Name</th>
                    <th scope="col">Feedback</th>
                </tr>
            </thead>
            <tbody>
                {
                    post.feedback.map((feedback, index) => {
                        return (
                            <tr key={index}>
                                <td>{feedback.username}</td>
                                <td>{feedback.feedbackdata}</td>
                            </tr>
                        )
                    })
                }
            </tbody>
        </table>
    </div>
    </>
  )
}

export default OrgUserEventFeedback