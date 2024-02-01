import React, { useEffect, useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from './Components/Home';
import Mainpage from './Components/Mainpage';
import LoginRegister from './Components/LoginRegister/LoginRegister';
import OrganizationMainPage from './Components/OrganizationPage/OrganizationMainPage';
import { ToastContainer } from 'react-toastify';
import OrganizationEvent from './Components/OrganizationPage/OrganizationEvent';
import NotFound from './Components/NotFound';
import OrganizationAddPost from './Components/OrganizationPage/OrganizationAddPost';
import OrganizationMembers from './Components//OrganizationPage/OrganizationMembers';
import OrganizationEventDetails from './Components/OrganizationPage/OrganizationEventDetails';
import OrganizationAddMember from './Components/OrganizationPage/OrganizationAddMember';
import OrganizationUpdateMember from './Components/OrganizationPage/OrganizationUpdateMember';
import OrganizationMemberships from './Components/OrganizationPage/OrganizationMemberships';
import OrganizationMemberApplied from './Components/OrganizationPage/OrganizationMemberApplied';
import AdminLogin from './Components/Admin/AdminLogin';
import AdminHome from './Components/Admin/AdminHome';
import AdminUser from './Components/Admin/AdminUser';
import UserEvent from './Components/UserPage/UserEvent';
import UserEventDetails from './Components/UserPage/UserEventDetails';
import UserEventParticipate from './Components/UserPage/UserEventParticipate';
import UserSubscribe from './Components/UserPage/UserSubscribe';
import UserSubscribeOrgDetails from './Components/UserPage/UserSubscribeOrgDetails';
import UserSubscribeForm from './Components/UserPage/UserSubscribeForm';
import UserParticipatedEvents from './Components/UserPage/UserParticipatedEvents';
import UserSubscribeForm1 from './Components/UserPage/UserSubscribeForm1';
import AdminOrg from './Components/Admin/AdminOrg';
import AdminOrgDetail from './Components/Admin/AdminOrgDetail';
import AdminAuthority from './Components/Admin/AdminAuthority';
import AdminAuthorityOrgDetails from './Components/Admin/AdminAuthorityOrgDetails';


const App = () => {
  const [orgData, setOrgData] = useState(
    JSON.parse(localStorage.getItem("organization"))
  );

  return (
    <>
      <ToastContainer />
      <Router>
        <Routes>

          <Route path="/" element={<Mainpage />} />
          <Route path="/loginregister" element={<LoginRegister />} />
          <Route path="/home" element={<Home />} />
          <Route path="/events" element={<UserEvent />} />
          <Route path="/subscribe" element={<UserSubscribe />} />
          <Route path="/partcipate" element={<UserParticipatedEvents />} />
          <Route path="/subscribe/orgdetails" element={<UserSubscribeOrgDetails />} />
          <Route path="/subscribe/form" element={<UserSubscribeForm />} />
          <Route path="/subscribe/form1" element={<UserSubscribeForm1 />} />
          <Route path="/event/details" element={<UserEventDetails />} />
          <Route path="/event/partcipate" element={<UserEventParticipate />} />
          {/* {orgData ? (
            <> */}
          <Route path="/organization" element={<OrganizationMainPage />} />
          <Route path="/organizations/event" element={<OrganizationEvent />} />
          <Route path="/organizations/event/eventdetails" element={<OrganizationEventDetails />} />
          <Route path="/organizations/event/addpost" element={<OrganizationAddPost />} />
          <Route path="/organizations/members" element={<OrganizationMembers />} />
          <Route path="/organizations/members/addmember" element={<OrganizationAddMember />} />
          <Route path="/organizations/members/updatemember" element={<OrganizationUpdateMember />} />
          <Route path="/organizations/membership" element={<OrganizationMemberships />} />
          <Route path="/organizations/memberapplied" element={<OrganizationMemberApplied />} />
          {/* </>
          ) : (
            <Route path="*" element={<NotFound />} />
          )} */}

          <Route path="/admin" element={<AdminLogin />} />
          <Route path="/admin/home" element={<AdminHome />} />
          <Route path="/admin/allorg" element={<AdminOrg />} />
          <Route path="/admin/orgdetailspage" element={<AdminOrgDetail />} />
          <Route path="/admin/allusers" element={<AdminUser />} />
          <Route path="/admin/accepetrejectorg" element={<AdminAuthority />} />
          <Route path="/admin/appliedorgdetails" element={<AdminAuthorityOrgDetails />} />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </>
  )
}

export default App
