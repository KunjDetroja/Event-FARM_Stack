import React, { useState } from 'react'
import OrganizeLogin from "./OrganizeLogin";
import OrganizeRegister1 from "./OrganizeRegister1";

function Organize() {
  const [Obooleanvalue, setOBoolean] = useState(true);
  return (
    <>
      <section className=" py-3 py-md-5 py-xl-8" style={{backgroundColor: '#0e2643' , color:"white"}}>
        <div className="container">
          <div className="row gy-4 align-items-center">
            {Obooleanvalue ? (
              <div className="col-12 col-md-6 col-xl-7">
                <div className="d-flex justify-content-center">
                  <div className="col-12 col-xl-9">
                    <hr className="border-primary-subtle mb-4" />
                    <h2 className="h1 mb-4">You can Share your Wonderful Upcoming Event To the User</h2>
                    <p className="lead mb-5">So User can be the Part of your Wonderful Event's Memory</p>
                    <div className="text-endx">
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="col-12 col-md-6 col-xl-5">
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
            {/* <div className="col-12 col-md-6 col-xl-7">
              <div className="d-flex justify-content-center text-bg-primary">
                <div className="col-12 col-xl-9">
                  <hr className="border-primary-subtle mb-4" />
                  <h2 className="h1 mb-4">You can Share your Wonderful Upcoming Event To the User</h2>
                  <p className="lead mb-5">So User can be the Part of your Wonderful Event's Memory</p>
                  <div className="text-endx">
                  </div>
                </div>
              </div>
            </div> */}
            {Obooleanvalue ? <OrganizeLogin setOBoolean={setOBoolean} /> : <OrganizeRegister1 setOBoolean={setOBoolean} />}
          </div>
        </div>
      </section>
    </>
  )
}

export default Organize
