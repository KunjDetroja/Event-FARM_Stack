import React, { useState } from 'react'
import UserLogin from "./UserLogin";
import UserRegister1 from "./UserRegister1";

function User() {
  const [Ubooleanvalue, setUBoolean] = useState(true);
  return (
    <>
      <section className=" py-3 py-md-5 py-xl-8" style={{backgroundColor: '#0e2643',color:"white"}}>
        <div className="container">
          <div className="row gy-4 align-items-center">
          {Ubooleanvalue ? <UserLogin setUBoolean={setUBoolean} /> : <UserRegister1 setUBoolean={setUBoolean} />}
            <div className="col-12 col-md-6 col-xl-7">
              <div className="d-flex justify-content-center">
                <div className="col-12 col-xl-9">
                  <hr className="border-primary-subtle mb-4" />
                  <h2 className="h1 mb-4">We gives you Information of Club Event</h2>
                  <p className="lead mb-5">So you can get the tickets for the Wonderful Club event</p>
                  <div className="text-endx">
                  </div>
                </div>
              </div>
            </div>
            
          </div>
        </div>
      </section>
    </>
  )
}

export default User
