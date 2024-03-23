import React, { useEffect, useState } from "react";
import OrganisationNavbar from "../OrganisationNavbar";
import api from "../api";
import OrgDashboardSec1 from "./OrgDashboardSec1";
import { toast } from "react-toastify";
import { PieChart, Pie, Legend, Tooltip, ResponsiveContainer } from "recharts";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid } from "recharts";
import OrgDashboardSec2 from "./OrgDashboardSec2";
import Footer from "../Footer";

function OrgDashboard() {
  const [orgdata, setOrgData] = useState(
    JSON.parse(localStorage.getItem("organisers"))
  );
  const [content, setContent] = useState();
  const [yearValueslist, setYearValueslist] = useState();
  // const data = [
  //   {
  //     name: "January",
  //     value1: 120,
  //   },
  //   {
  //     name: "February",
  //     value1: 50,
  //   },
  //   {
  //     name: "March",
  //     value1: 170,
  //   },
  //   {
  //     name: "April",
  //     value1: 120,
  //   },
  //   {
  //     name: "May",
  //     value1: 140,
  //   },
  //   {
  //     name: "June",
  //     value1: 60,
  //   },
  //   {
  //     name: "July",
  //     value1: 150,
  //   },
  //   {
  //     name: "August",
  //     value1: 70,
  //   },
  //   {
  //     name: "September",
  //     value1: 180,
  //   },
  //   {
  //     name: "October",
  //     value1: 10,
  //   },
  //   {
  //     name: "November",
  //     value1: 90,
  //   },
  //   {
  //     name: "December",
  //     value1: 66,
  //   },
  // ];
  const [selectedOption, setSelectedOption] = useState();
  const handleSelectYear = (e) => {
    console.log("heyy inside changing yaer");
    // setSelectedOption(e.target.value);
    const selectedYear = e.target.value;
    setSelectedOption(parseInt(selectedYear));
    // console.log(e.target.value);
    // console.log(selectedOption);
    if (selectedOption == selectedYear) {
      handlefetchingcontent();
    }
  };
  console.log(orgdata["clubname"]);

  const handlesubscribedyear = async () => {
    const data = { clubname: orgdata["clubname"] };
    try {
      const subscribedyears = await api.post("/getallsubscribedyear", data);
      if (subscribedyears.data.success !== false) {
        // console.log(subscribedyears.data);
        setYearValueslist(subscribedyears.data);
        setSelectedOption(subscribedyears.data[0]);
      } else {
        toast.error(subscribedyears.data.error);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handlefetchingcontent = async () => {
    console.log("heyy");
    if (selectedOption) {
      const data = { clubname: orgdata["clubname"], datayear: selectedOption };
      console.log(data);
      try {
        const response = await api.post("/orgdashboardgraph", data);
        if (response.data.success !== false) {
          // console.log(response.data);
          setContent(response.data);
          // console.log(content);
        } else {
          toast.error(response.data.error);
        }
      } catch (error) {
        console.log(error);
      }
    }
  };
  const [content1, setContent1] = useState();
  const [yearValueslist1, setYearValueslist1] = useState();
  const [selectedOption1, setSelectedOption1] = useState();

  const handleSelectPostYear = (e) => {
    setSelectedOption1(e.target.value);
  };

  const handlefetchingpostcontent = async () => {
    console.log("heyy");

    const data = { clubname: orgdata["clubname"], year: parseInt(selectedOption1) };

    try {
      const response = await api.post("/geteventpostbyyear", data);
      if (response.data.success !== false) {
        console.log(response.data);
        setContent1(response.data)
      } else {
        toast.error("error in fetching data");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleeventyear = async () => {
    const data = { clubname: orgdata["clubname"] };
    try {
      const eventyears = await api.post("/getalleventyear", data);
      if (eventyears.data.success !== false) {
        // console.log(subscribedyears.data);
        setYearValueslist1(eventyears.data);
        setSelectedOption1(eventyears.data[0]);
        // console.log(selectedOption);
      } else {
        toast.error("error in fetching data");
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    handlesubscribedyear();
    handleeventyear();
  }, []);

  useEffect(() => {
    handlefetchingcontent();
  }, [selectedOption]);

  useEffect(() => {
    // console.log(selectedOption1);
    handlefetchingpostcontent();
  }, [selectedOption1]);

  // console.log(content);

  return (
    <>
      <div>
        <OrganisationNavbar />
      </div>
      <div>
        <OrgDashboardSec1 />
      </div>
      <div>
    

        {content && (
          <div className="">
            <div className="row">
              <div className="col-12 d-flex align-items-center justify-content-center text-center mb-3">
                <h1>EventWiz Subscribed Users:</h1>
                <div>
                  {yearValueslist && (
                    <>
                      <select
                        style={{ color: 'white', backgroundColor: '#0e2643', border: 'none', marginLeft: '1rem', padding: '0.8rem 1rem 0.8rem 0.6rem', borderRadius: '0.375rem' }}

                        value={selectedOption}
                        onChange={handleSelectYear}
                      >
                        {yearValueslist.map((option, index) => (
                          <option key={index} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                    </>
                  )}
                </div>
                <br />
              </div>
            </div>
            <div className="row justify-content-center">
              <div className="col-md-5 border rounded p-2 me-2">
                <div style={{ height: 300 }}>
                  <ResponsiveContainer>
                    <AreaChart
                      width={500}
                      height={400}
                      data={content[0]}
                      margin={{ right: 30 }}
                    >
                      <YAxis tick={{ fill: "#0e2643" }} />
                      <XAxis dataKey="month" tick={{ fill: "#0e2643" }} />
                      {/* <CartesianGrid strokeDasharray="5 5" /> */}
                      <Tooltip />
                      <Legend />
                      <Area
                        type="monotone"
                        dataKey="subscribers"
                        stroke="#0e2643"
                        fill="#47A2EC"
                        stackId="1"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
              <div className="col-md-5 border rounded p-2 me-2">
                <div style={{ height: 300 }}>
                  <ResponsiveContainer>
                    <AreaChart
                      width={500}
                      height={400}
                      data={content[1]}
                      margin={{ right: 30 }}
                    >
                      <YAxis tick={{ fill: "#0e2643" }} />
                      <XAxis dataKey="month" tick={{ fill: "#0e2643" }} />
                      {/* <CartesianGrid strokeDasharray="5 5" /> */}
                      <Tooltip />
                      <Legend />
                      <Area
                        type="monotone"
                        dataKey="profit"
                        stroke="#0e2643"
                        fill="#47A2EC"
                        stackId="1"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
             
            </div>
          </div>
        )}

        <div className="mt-5">
          
          {content1 && (
            <div className="">
              <div className="row justify-content-center">
              <div className="col-12 d-flex align-items-center justify-content-center text-center mb-3">
                <h1>{orgdata.clubname} Event Posts:</h1>
                <div>
                  {yearValueslist1 && (
                    <>
                      <select
                        style={{ color: 'white', backgroundColor: '#0e2643', border: 'none', marginLeft: '1rem', padding: '0.8rem 1rem 0.8rem 0.6rem', borderRadius: '0.375rem' }}
                        value={selectedOption1}
                        onChange={handleSelectPostYear}
                      >
                        {yearValueslist1.map((option, index) => (
                          <option key={index} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                    </>
                  )}
                </div>
                <br />
              </div>
                <div className="col-md-5 border rounded p-2 me-2">
                  <div style={{ height: 300 }}>
                    <ResponsiveContainer>
                      <AreaChart
                        width={500}
                        height={400}
                        data={content1[0]}
                        margin={{ right: 30 }}
                      >
                        <YAxis tick={{ fill: "#0e2643" }} />
                        <XAxis dataKey="month" tick={{ fill: "#0e2643" }} />
                        {/* <CartesianGrid strokeDasharray="5 5" /> */}
                        <Tooltip />
                        <Legend />
                        <Area
                          type="monotone"
                          dataKey="events"
                          stroke="#0e2643"
                          fill="#47A2EC"
                          stackId="1"
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

      </div>
      <div><OrgDashboardSec2/></div>
      <div className="footersection">
        <Footer/>
      </div>
    </>
  );
}

export default OrgDashboard;
