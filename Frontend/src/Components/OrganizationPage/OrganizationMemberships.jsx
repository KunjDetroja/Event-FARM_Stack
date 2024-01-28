import React, { useState,useEffect } from 'react'
import { Link } from 'react-router-dom'
import api from '../../api';
import { toast } from "react-toastify"
import { useNavigate } from 'react-router-dom';
import OrganizationNavbar from "./OrganizationNavbar"

function OrganizationMemberships() {

  const [memType,setMemType] = useState();
  const navigate = useNavigate();
    const [userData, setUserData] = useState(
        JSON.parse(localStorage.getItem("organization"))
    );

  const fetchAllMembershipdetails = async () => {
    try {
        const cname = userData.clubname;
        const response = await api.post("/getallmembership/", { "clubname": cname });
        setMemType(response.data);
        console.log(response.data);
    } catch (error) {
        console.error("Error fetching details:", error);
    }
};
useEffect(() => {
  fetchAllMembershipdetails();
  console.log(memType)
}, []);



  return (
    <div>
      <OrganizationNavbar />
      <div>
        <Link to="/organizations/membership/addmembership">
          <button className="addpostbtn mt-3">Add New Membership</button>
        </Link>
      </div>
      <div className="container">
      {memType && memType.length ? (
            <table className="table table-bordered m-3">
              <thead >
                <tr>
                  <th scope="col" className='tablehead align-middle'>Sno</th>
                  <th scope="col" className='tablehead align-middle'>ID</th>
                  <th scope="col" className='tablehead align-middle'>Username</th>
                  <th scope="col" className='tablehead align-middle'>Update</th>
                  <th scope="col" className='tablehead align-middle'>Delete</th>
                  {/* <th scope="col">Username</th>
                  <th scope="col">Password</th> */}
                </tr>
              </thead>
              <tbody>
                {memType.map((type, index) => (
                  <tr key={type.memberid} >
                    <td className='trtext'>{index + 1}</td>
                    <td className='trtext'>{type.type}</td>
                    <td className='trtext'>{type.price}</td>
                    <td className='trtext'>
                      <button className="addmembtn"
                        // onClick={() => handlememberupdate(type)}
                      >
                        Update
                      </button>
                    </td>
                    <td className='trtext'>
                      <button className="addmembtn"
                        // onClick={() => deleteMember(type)}
                      >
                        Delete
                      </button>
                    </td>
                    {/* <td scope="col">{post.username}</td>
                    <td scope="col">{post.pwd}</td> */}
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

export default OrganizationMemberships
