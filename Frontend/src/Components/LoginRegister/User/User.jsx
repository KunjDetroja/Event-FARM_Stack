import React, { useState } from 'react'
import UserLogin from './UserLogin';
import UserSignup from './UserSignup';

function User() {
  const [Ubooleanvalue, setUBoolean] = useState(true);
  return (
    <>
      <section className=" py-3 py-md-5 py-xl-8" style={{ backgroundColor: '#0e2643', color: "white" }}>
        <div className="container">
          <div className="row gy-4 align-items-center">
            {Ubooleanvalue ? <UserLogin setUBoolean={setUBoolean} /> : <UserSignup setUBoolean={setUBoolean} />}
            {Ubooleanvalue ? (
              <div className="col-12 col-md-6 col-xl-7">
                <div className="d-flex justify-content-center">
                  <div className="col-12 col-xl-9">
                    <hr className="border-primary-subtle mb-4" />
                    <h2 className="h1 mb-4">You can Share your Wonderful Upcoming Event To the User</h2>
                    <p className="lead mb-5">So User can be the Part of your Wonderful Event's Memory</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="col-12 col-md-6 col-xl-6">
                <div className="d-flex justify-content-center">
                  <div className="col-12 col-xl-9">
                    <hr className="border-primary-subtle mb-4" />
                    <h2 className="h1 mb-4">You can Share your Wonderful Upcoming Event To the User</h2>
                    <p className="lead mb-5">So User can be the Part of your Wonderful Event's Memory</p>
                    <div className="text-endx">
                    </div>
                  </div>
                </div>
              </div>)}
          </div>
        </div>
      </section>
    </>
  )
}

export default User
