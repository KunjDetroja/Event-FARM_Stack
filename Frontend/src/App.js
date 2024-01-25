import React from 'react'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from './Components/Home';
import Mainpage from './Components/Mainpage';
import LoginRegister from './Components/LoginRegister/LoginRegister';
import OrganizationMainPage from './Components/LoginRegister/Organization/OrganizationPage/OrganizationMainPage';
import { ToastContainer } from 'react-toastify';
import OrganizationEvent from './Components/LoginRegister/Organization/OrganizationPage/OrganizationEvent';
import NotFound from './Components/NotFound';
import OrganizationAddPost from './Components/LoginRegister/Organization/OrganizationPage/OrganizationAddPost';
import OrganizationMembers from './Components/LoginRegister/Organization/OrganizationPage/OrganizationMembers';
import OrganizationEventDetails from './Components/LoginRegister/Organization/OrganizationPage/OrganizationEventDetails';
import OrganizationAddMember from './Components/LoginRegister/Organization/OrganizationPage/OrganizationAddMember';
import OrganizationUpdateMember from './Components/LoginRegister/Organization/OrganizationPage/OrganizationUpdateMember';


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
          <Route path="/organizations/members" element={<OrganizationMembers/>} />
          <Route path="/organizations/addpost" element={<OrganizationAddPost/>} />
          <Route path="/organizations/addmember" element={<OrganizationAddMember/>} />
          <Route path="/organizations/eventdetails" element={<OrganizationEventDetails/>} />
          <Route path="/organizations/updatemember" element={<OrganizationUpdateMember/>} />
          <Route path="*" element={<NotFound/>} />
        </Routes>
      </Router>
    </>
  )
}

export default App
