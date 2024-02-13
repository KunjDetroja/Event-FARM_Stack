import React, { useState, useEffect } from 'react'
import OrganizationNavbar from './OrganizationNavbar'
import api from '../../api'
import { toast } from "react-toastify";
import { PieChart, Pie, Legend, Tooltip, ResponsiveContainer } from "recharts";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid } from "recharts";


function OrganizationMainPage() {
  const [orgdata, setOrgData] = useState(
    JSON.parse(localStorage.getItem("organization"))
  );
  const [content, setContent] = useState();
  const [content1, setContent1] = useState();
  const [yearValueslist, setYearValueslist] = useState();
  const [selectedOption, setSelectedOption] = useState();
  const [yearValueslist1, setYearValueslist1] = useState();
  const [selectedOption1, setSelectedOption1] = useState();
  const handleSelectYear = (e) => {
    setSelectedOption(e.target.value);
  };
  const handleSelectPostYear = (e) => {
    setSelectedOption1(e.target.value);
  };

  const handlesubscribedyear = async () => {
    const data = { clubname: orgdata["clubname"] };
    try {
      const subscribedyears = await api.post("/getallsubscribedyear", data);
      if (subscribedyears.data.success !== false) {
        // console.log(subscribedyears.data);
        setYearValueslist(subscribedyears.data);
        setSelectedOption(subscribedyears.data[0]);
        // console.log(selectedOption);
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

  const handlefetchingcontent = async () => {
    console.log("heyy");

    const data = { clubname: orgdata["clubname"], year: parseInt(selectedOption) };

    try {
      const response = await api.post("/orgdashboardgraph", data);
      if (response.data.success !== false) {
        console.log(response.data);
        setContent(response.data)
      } else {
        toast.error("error in fetching data");
      }
    } catch (error) {
      console.log(error);
    }
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

  // useEffect(() => {
  //   handlesubscribedyear();
  //   handlefetchingcontent();
  //   console.log(yearValueslist);
  // }, []);

  useEffect(() => {
    handlesubscribedyear();
    handleeventyear();
  }, []);

  useEffect(() => {
    console.log(selectedOption);
    handlefetchingcontent();

  }, [selectedOption]);

  useEffect(() => {
    console.log(selectedOption1);
    handlefetchingpostcontent();

  }, [selectedOption1]);

  // console.log(content)

  return (
    <>
      <div>
        <OrganizationNavbar />
      </div>
      <div>
        <h1>hello everyone this is the main organisation page</h1>
        {/* <div style={{ width: "100%", height: 300 }}>
        <ResponsiveContainer>
          <PieChart width={400} height={400}>
            <Pie
              dataKey="value1"
              isAnimationActive={false}
              data={data}
              cx="50%"
              cy="50%"
              outerRadius={80}
              fill="#8884d8"
              label
            />

            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div> */}

        <div>
          {yearValueslist && (
            <>
              <select value={selectedOption} onChange={handleSelectYear}>
                {yearValueslist.map((option, index) => (
                  <option key={index} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </>
          )}
        </div>

        {content && (
          <div className=''>
            <div className="row">
              <div className="col-12">
                <h2>EventWiz Subscribed Users:</h2>
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
                        fill="#8b5cf6"
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
                        fill="#8b5cf6"
                        stackId="1"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>
        )}

        <div>
          {yearValueslist1 && (
            <>
              <select value={selectedOption1} onChange={handleSelectPostYear}>
                {yearValueslist1.map((option, index) => (
                  <option key={index} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </>
          )}
          {content1 && (
            <div className=''>
              <div className="row justify-content-center">
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
                          fill="#8b5cf6"
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
    </>
  );
}

export default OrganizationMainPage
