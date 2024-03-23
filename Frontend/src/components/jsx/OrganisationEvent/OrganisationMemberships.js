import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../api";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import OrganisationNavbar from "../OrganisationNavbar";
import "../../css/OrganisationEvent/OrganisationMembership.css";

function OrganisationMemberships() {
  const [memTypeTable, setMemTypetable] = useState([]);
  const [bUpdate, setBUpdate] = useState(false)
  const [userData, setUserData] = useState(
    JSON.parse(localStorage.getItem("organisers"))
  );
  const [showAddMembership, setShowAddMembership] = useState(false);
  const [newMembershipForm, setNewMembershipForm] = useState({
    type: "",
    price: "",
  });

  const fetchAllMembershipdetails = async () => {
    try {
      const cname = userData.clubname;
      const response = await api.post("/getallmembership/", { "clubname": cname });
      setMemTypetable(response.data);
      console.log(response.data);
    } catch (error) {
      console.error("Error fetching details:", error);
    }
  };
  useEffect(() => {
    fetchAllMembershipdetails();
    // console.log(memType)
  }, []);

  const handleAddMembershipClick = () => {
    setShowAddMembership(!(showAddMembership));
    setBUpdate(false)
    setNewMembershipForm({
      type: "",
      price: "",
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewMembershipForm({
      ...newMembershipForm,
      [name]: value,
    });
  };

  const handleAddMembershipSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.put(`/addmembership/${userData.clubname}`, newMembershipForm);
      if (response.data.success !== false) {
        toast.success(response.data.data)
        setShowAddMembership(false);
      }
      else {
        toast.error(response.data.error)
      }
      setNewMembershipForm({
        type: "",
        price: "",
      });
      fetchAllMembershipdetails();
    } catch (error) {
      console.error("Error adding membership:", error);
      toast.error("Error adding membership. Please try again.");
    }
  };

  const handlememberupdate = async (data) => {
    setShowAddMembership(!(showAddMembership));
    setBUpdate(true)
    setNewMembershipForm({
      type: data["type"],
      price: data["price"],
    });

  }

  return (
    <div>
      <OrganisationNavbar />
      <div>
        <button className="addpostbtn mt-3" onClick={handleAddMembershipClick}>
          Add New Membership
        </button>
      </div>
      <div className="container">
        {showAddMembership && (
          <form onSubmit={handleAddMembershipSubmit} className='m-3'>
            <div className="row gy-3 overflow-hidden">
              <div className="col-4">
                <div className="form-floating mb-3">
                  <input
                    onChange={handleInputChange}
                    type="text"
                    className="form-control"
                    id="type"
                    placeholder=""
                    name="type"
                    {...(bUpdate ? { disabled: true } : {})}
                    value={newMembershipForm.type}
                  />
                  <label htmlFor="type" className="form-label">
                    Type
                  </label>
                </div>
              </div>
              <div className="col-4">
                <div className="form-floating mb-3">
                  <input
                    onChange={handleInputChange}
                    type="number"
                    className="form-control"
                    id="price"
                    placeholder=""
                    name="price"
                    value={newMembershipForm.price}
                  />
                  <label htmlFor="price" className="form-label">
                    Price
                  </label>
                </div>
              </div>
              <div className="col-4">
                <div>
                  <button style={{ color: 'white', backgroundColor: '#0e2643', border: 'none', marginTop: "10px", padding: '0.5rem 1.5rem 0.5rem 1.5rem', borderRadius: '0.375rem' }} type="submit">
                    Save
                  </button>
                </div>
              </div>
            </div>
          </form>
        )}

        {memTypeTable && memTypeTable.length ? (
          <table className="table table-bordered m-3">
            <thead>
              <tr>
                <th scope="col" className="tablehead align-middle">
                  Sno
                </th>
                <th scope="col" className="tablehead align-middle">
                  Membership Type
                </th>
                <th scope="col" className="tablehead align-middle">
                  Price
                </th>
                <th scope="col" className="tablehead align-middle">
                  Update
                </th>
                {/* <th scope="col" className="tablehead align-middle">
                  Delete
                </th> */}
              </tr>
            </thead>
            <tbody>
              {memTypeTable.map((type, index) => (
                <tr key={type.memberid}>
                  <td className="trtext">{index + 1}</td>
                  <td className="trtext">{type.type}</td>
                  <td className="trtext">{type.price}</td>
                  <td className="trtext">
                    <button
                      className="addmembtn"
                      onClick={() => handlememberupdate(type)}
                    >
                      Update
                    </button>
                  </td>
                  {/* <td className="trtext">
                    <div class="form-check form-switch">
                      <input
                        class="form-check-input"
                        type="checkbox"
                        role="switch"
                        id="flexSwitchCheckChecked"
                      />
                    </div>
                  </td> */}
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No Records...</p>
        )}
      </div>
    </div>
  )
}

export default OrganisationMemberships;
