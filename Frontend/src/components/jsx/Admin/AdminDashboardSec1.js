// AdminDashboardSec1
import React from "react";
import api from "../api";
import { useEffect, useState } from "react";

function AdminDashboardSec1() {
  const [orgdata, setOrgData] = useState(
    JSON.parse(localStorage.getItem("admin"))
  );

  const [content1, setContent1] = useState();
  const [content2, setContent2] = useState();
  const [content3, setContent3] = useState();
  const [content4, setContent4] = useState();
  const [content5, setContent5] = useState();

  const fetchdata = async () => {
    // const data = { clubname: orgdata.clubname };
    try {
      const response = await api.post("/admindashboardcards");
      console.log(response.data);

      setContent1(response.data[0]);
      setContent2(response.data[1]);
      setContent3(response.data[2]);
      setContent4(response.data[3]);
      setContent5(response.data[4]);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    fetchdata();
  }, []);

  return (
    <>
      {content1 && content2 && content3 && content4 && (
        <div className="m-5">
          {/*  */}
          <div class="row justify-content-center">
            <div class="col-xl-2 col-md-4 mb-4">
              <div class="card border-left-primary shadow h-100 py-2">
                <div class="card-body">
                  <div class="row no-gutters align-items-center">
                    <div class="col mr-2">
                      <div class="text-xs font-weight-bold text-primary text-uppercase mb-1">
                      Total Profit
                      </div>
                      <div class="h5 mb-0 font-weight-bold text-gray-800">
                      Rs.{content5.totalprofit}
                      </div>
                    </div>
                    <div class="col-auto">
                      {/* <i class="fas fa-calendar fa-2x text-gray-300"></i> */}
                      <i class="fas fa-solid fa-rupee-sign fa-2x text-gray-300"></i>
                      
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="col-xl-2 col-md-4 mb-4">
              <div class="card border-left-success shadow h-100 py-2">
                <div class="card-body">
                  <div class="row no-gutters align-items-center">
                    <div class="col mr-2">
                      <div class="text-xs font-weight-bold text-success text-uppercase mb-1">
                      Total Users
                      </div>
                      <div class="h5 mb-0 font-weight-bold text-gray-800">
                      {content2.totalusers}
                      </div>
                    </div>
                    <div class="col-auto">
                      {/* <i class="fas fa-dollar-sign fa-2x text-gray-300"></i> */}
                      <i class="fas fa-solid fa-users fa-2x text-gray-300"></i>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="col-xl-2 col-md-4 mb-4">
              <div class="card border-left-info shadow h-100 py-2">
                <div class="card-body">
                  <div class="row no-gutters align-items-center">
                    <div class="col mr-2">
                      <div class="text-xs font-weight-bold text-info text-uppercase mb-1">
                      Total Organisations
                      </div>
                      <div class="row no-gutters align-items-center">
                        <div class="col-auto">
                          <div class="h5 mb-0 mr-3 font-weight-bold text-gray-800">
                          {content3.totalorg}
                          </div>
                        </div>
                        
                      </div>
                    </div>
                    <div class="col-auto">
                      <i class="fas fa-clipboard-list fa-2x text-gray-300"></i>
                      
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="col-xl-2 col-md-4 mb-4">
              <div class="card border-left-warning shadow h-100 py-2">
                <div class="card-body">
                  <div class="row no-gutters align-items-center">
                    <div class="col mr-2">
                      <div class="text-xs font-weight-bold text-warning text-uppercase mb-1">
                      Total Event Posts
                      </div>
                      <div class="h5 mb-0 font-weight-bold text-gray-800">
                      {content1.totalposts}
                      </div>
                    </div>
                    <div class="col-auto">
                      {/* <i class="fas fa-comments fa-2x text-gray-300"></i> */}
                      <i class="fas fa-solid fa-indent fa-2x text-gray-300"></i>
                    </div>
                  </div>
                </div>
              </div>
              
            </div>
            <div class="col-xl-3 col-md-5 mb-4">
              <div class="card border-left-warning shadow h-100 py-2">
                <div class="card-body">
                  <div class="row no-gutters align-items-center">
                    <div class="col mr-2">
                      <div class="text-xs font-weight-bold text-secondary text-uppercase mb-1">
                      Average Participants per Event
                      </div>
                      <div class="h5 mb-0 font-weight-bold text-gray-800">
                      {content4.avgparticipants}
                      </div>
                    </div>
                    <div class="col-auto">
                      {/* <i class="fas fa-comments fa-2x text-gray-300"></i> */}
                      <i class="fas fa-solid fa-user fa-2x text-gray-300"></i>
                    </div>
                  </div>
                </div>
              </div>
              
            </div>
          </div>
        
        </div>
      )}
    </>
  );
}

export default AdminDashboardSec1;
