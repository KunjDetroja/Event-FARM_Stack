import React from "react";
import AdminNavbar from "./AdminNavbar";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import api from "../api";
import AdminDashboardSec1 from "./AdminDashboardSec1";
import AdminDashboardSec2 from "./AdminDashboardSec2";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

function AdminHome() {
  const [content, setContent] = useState();
  const [eventContent, setEventContent] = useState();
  const [totalClubname, setTotalClubname] = useState();
  const [orgProfit, setOrgProfit] = useState();
  const [selectedOption, setSelectedOption] = useState();

  const handleSelectClub = (e) => {
    setSelectedOption(e.target.value);
  };

  const handleClubname = async () => {
    try {
      const response = await api.get("/clubnames/");
      if (response.data.success !== false) {
        setTotalClubname(response.data);
        setSelectedOption(response.data[0]);
      } else {
        toast.error("error in fetching data");
      }
    } catch (error) {
      console.log(error);
    }
  };
  const handleorgcontent = async () => {
    const data = { clubname: selectedOption };

    try {
      const response = await api.post("/profitperorg", data);
      if (response.data.success !== false) {
        console.log(response.data);
        setOrgProfit(response.data);
      } else {
        toast.error("error in fetching data");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handlefetchingcontent = async () => {
    try {
      const response = await api.get("/subscribeprofitadmin");
      if (response.data.success !== false) {
        console.log(response.data);
        setContent(response.data);
      } else {
        toast.error("error in fetching data");
      }
    } catch (error) {
      console.log(error);
    }
  };
  const handlefetchingeventcontent = async () => {
    try {
      const response = await api.get("/eventprofitadmin");
      if (response.data.success !== false) {
        console.log(response.data);
        setEventContent(response.data);
      } else {
        toast.error("error in fetching data");
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    handleorgcontent();
  }, [selectedOption]);
  useEffect(() => {
    handleClubname();
    handlefetchingeventcontent();
    handlefetchingcontent();
  }, []);
  return (
    <>
      <div>{<AdminNavbar />}</div>
      <div>
        <AdminDashboardSec1 />
      </div>
      
      <div>
        <h1>Subscribers and Events Profit</h1>
        <div className="row mt-5 justify-content-center">
          <div className="col-md-5  border rounded p-2 me-3">
            {content && (
              <div style={{ height: 300 }}>
                <ResponsiveContainer>
                  <AreaChart
                    width={500}
                    height={400}
                    data={content}
                    margin={{ right: 30 }}
                  >
                    <YAxis tick={{ fill: "#0e2643" }} />
                    <XAxis dataKey="year" tick={{ fill: "#0e2643" }} />
                    {/* <CartesianGrid strokeDasharray="5 5" /> */}
                    <Tooltip />
                    <Legend />
                    <Area
                      type="monotone"
                      dataKey="Subscribers"
                      stroke="#0e2643"
                      fill="#47A2EC"
                      stackId="1"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>
          <div className="col-md-5  border rounded p-2 me-2">
            {eventContent && (
              <div style={{ height: 300 }}>
                <ResponsiveContainer>
                  <AreaChart
                    width={500}
                    height={400}
                    data={eventContent}
                    margin={{ right: 30 }}
                  >
                    <YAxis tick={{ fill: "#0e2643" }} />
                    <XAxis dataKey="year" tick={{ fill: "#0e2643" }} />
                    {/* <CartesianGrid strokeDasharray="5 5" /> */}
                    <Tooltip />
                    <Legend />
                    <Area
                      type="monotone"
                      dataKey="Events"
                      stroke="#0e2643"
                      fill="#47A2EC"
                      stackId="1"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>
        </div>

        {orgProfit && (
          <div className="">
            <div className="row justify-content-center">
              <div className="col-12 d-flex align-items-center justify-content-center text-center mb-5 mt-5">
                <h1>EventWiz Subscribed Users</h1>
                <div>
                  {totalClubname && (
                    <>
                      <select
                        value={selectedOption}
                        onChange={handleSelectClub}
                        style={{ color: 'white', backgroundColor: '#0e2643', border: 'none', marginLeft: '1rem', padding: '0.7rem 0.9rem 0.7rem 0.6rem', borderRadius: '0.375rem' }}
                      >
                        {totalClubname.map((option, index) => (
                          <option key={index} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                    </>
                  )}
                </div>
              </div>
              <div className="col-md-7 border rounded p-2 me-2">
                <div style={{ height: 300 }}>
                  <ResponsiveContainer>
                    <AreaChart
                      width={500}
                      height={400}
                      data={orgProfit}
                      margin={{ right: 30 }}
                    >
                      <YAxis tick={{ fill: "#0e2643" }} />
                      <XAxis dataKey="year" tick={{ fill: "#0e2643" }} />
                      {/* <CartesianGrid strokeDasharray="5 5" /> */}
                      <Tooltip />
                      <Legend />
                      <Area
                        type="monotone"
                        dataKey="Revenue"
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
      <br />
      <div>
        <AdminDashboardSec2 />
      </div>
    </>
  );
}

export default AdminHome;
