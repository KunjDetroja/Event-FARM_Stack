import React from 'react'
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
import OrganizationAddMembership from './Components/OrganizationPage/OrganizationAddMembership';


const App = () => {

  return (
    <>
  <ToastContainer/>
        <Router>
        <Routes>
          <Route path="/" element={<Mainpage/>} />
          <Route path="/loginregister" element={<LoginRegister/>} />
          <Route path="/home" element={<Home/>} />
          <Route path="/organization" element={<OrganizationMainPage/>} />
          <Route path="/organizations/event" element={<OrganizationEvent/>} />
          <Route path="/organizations/event/eventdetails" element={<OrganizationEventDetails/>} />
          <Route path="/organizations/event/addpost" element={<OrganizationAddPost/>} />
          <Route path="/organizations/members" element={<OrganizationMembers/>} />
          <Route path="/organizations/members/addmember" element={<OrganizationAddMember/>} />
          <Route path="/organizations/members/updatemember" element={<OrganizationUpdateMember/>} />
          <Route path="/organizations/membership" element={<OrganizationMemberships/>} />
          <Route path="/organizations/membership/addmembership" element={<OrganizationAddMembership/>} />
          <Route path="/organizations/memberapplied" element={<OrganizationMemberApplied/>} />
          <Route path="*" element={<NotFound/>} />
        </Routes>
      </Router>
    </>
  )
}

export default App
