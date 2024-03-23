import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./components/jsx/HomePage";
import Home from "./components/jsx/Home";
import About from "./components/jsx/About";
import NotFound from "./components/jsx/NotFound";
// //////////////////////////////// USER //////////

import UserEvent1 from "./components/jsx/UserEvent/UserEvent1";
import UserSubscribe from "./components/jsx/UserEvent/UserSubscribe";
import UserParticipatedEvents from "./components/jsx/UserEvent/UserParticipatedEvents";
import UserSubscribeOrgDetails from "./components/jsx/UserEvent/UserSubscribeOrgDetails";
import UserSubscribeForm from "./components/jsx/UserEvent/UserSubscribeForm";
import UserSubscribeForm1 from "./components/jsx/UserEvent/UserSubscribeForm1";
import UserEventDetails from "./components/jsx/UserEvent/UserEventDetails";
import UserEventParticipate from "./components/jsx/UserEvent/UserEventParticipate";

// ///////////////////////  /////////////
import LoginPage from "./components/jsx/LoginRegister/LoginPage";
// import OrganisationEvent from "./components/jsx/OrganisationEvent/OrganisationEvent";
import OrgAddPost from "./components/jsx/OrganisationEvent/OrgAddPost"
import OrgEvent from "./components/jsx/OrganisationEvent/OrgEvent";
import { ToastContainer } from "react-toastify";
import EventDetailedView from "./components/jsx/OrganisationEvent/EventDetailedView";
import OrgMemberDetails from "./components/jsx/OrganisationEvent/OrgMemberDetails";
import OrgAddMember from "./components/jsx/OrganisationEvent/OrgAddMember";
import UpdateMemberDetail from "./components/jsx/OrganisationEvent/UpdateMemberDetail";
import OrganisationMemberships from "./components/jsx/OrganisationEvent/OrganisationMemberships";
import OrgOtherEvents from "./components/jsx/OrganisationEvent/OrgOtherEvents";
import AdminLogin from "./components/jsx/Admin/AdminLogin";
import AdminHome from "./components/jsx/Admin/AdminHome";
import AdminOrg from "./components/jsx/Admin/AdminOrg";
import AdminOrgDetailed from "./components/jsx/Admin/AdminOrgDetailed";
import AdminUser from "./components/jsx/Admin/AdminUser";
import AdminAuthority from "./components/jsx/Admin/AdminAuthority";
import AdminAuthorityOrgDetails from "./components/jsx/Admin/AdminAuthorityOrgDetails";
import OrgAuthorization from "./components/jsx/OrganisationEvent/OrgAuthorization";
import AdminEventPosts from "./components/jsx/Admin/AdminEventPosts";
import UserSubscribePastEvents from "./components/jsx/UserEvent/UserSubscribePastEvents";
import UserEventFeedback from "./components/jsx/UserEvent/UserEventFeedback";
import UserOrgFeedback from "./components/jsx/UserEvent/UserOrgFeedback";
import UserPlatformFeedback from "./components/jsx/UserEvent/UserPlatformFeedback";
import OrgPlatformFeedback from "./components/jsx/OrganisationEvent/OrgPlatformFeedback";
import OrgUserEventFeedback from "./components/jsx/OrganisationEvent/OrgUserEventFeedback";
import OrgUsersFeedback from "./components/jsx/OrganisationEvent/OrgUsersFeedback";
import AdminOrgFeedback from "./components/jsx/Admin/AdminOrgFeedback";
import AdminUserEventFeedback from "./components/jsx/Admin/AdminUserEventFeedback";
import AdminPlatformFeedback from "./components/jsx/Admin/AdminPlatformFeedback";
import OrgDashboard from "./components/jsx/OrganisationEvent/OrgDashboard";
import OrgDashboardSec1 from "./components/jsx/OrganisationEvent/OrgDashboardSec1";
import AdminDashboardSec1 from "./components/jsx/Admin/AdminDashboardSec1";
import AdminDashboardSec2 from "./components/jsx/Admin/AdminDashboardSec2";
import OrgDashboardSec2 from "./components/jsx/OrganisationEvent/OrgDashboardSec2";

// import Admin  from "./Admin/Views/Admin";


function App() {
  return (
    <>
    <ToastContainer/>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          
          <Route path="/loginregister" element={<LoginPage />} />
          <Route path="/aboutus" element={<About />} />
          {/* User -------------------------------------- */}
          <Route path="/events" element={<UserEvent1 />} />
          <Route path="/subscribe" element={<UserSubscribe />} />
          <Route path="/partcipate" element={<UserParticipatedEvents />} />
          <Route path="/subscribe/orgdetails" element={<UserSubscribeOrgDetails />} />
          <Route path="/subscribe/form" element={<UserSubscribeForm />} />
          <Route path="/subscribe/form1" element={<UserSubscribeForm1 />} />
          <Route path="/event/details" element={<UserEventDetails />} />
          <Route path="/event/partcipate" element={<UserEventParticipate />} />
          <Route path="/subscribe/pastevents" element={<UserSubscribePastEvents />} />
          <Route path="/event/feedback" element={<UserEventFeedback />} />
          <Route path="/organisation/feedback" element={<UserOrgFeedback />} />
          <Route path="/userplatformfeedback" element={<UserPlatformFeedback />} />
          {/* Organisation----------------------------------- */}
          <Route path="/organisationdashboard" element={<OrgDashboard/>} />
          <Route path="/organisationevents/addpost" element={<OrgAddPost/>} />
          <Route path="/organisationevents/orgevents" element={<OrgEvent/>} />
          <Route path="/organisationevents/detailedview" element={<EventDetailedView/>} />
          <Route path="/organisationevents/organizationmemberdetails" element={<OrgMemberDetails/>} />
          <Route path="/organisationevents/organizationupdatememberdetails" element={<UpdateMemberDetail/>} />
          <Route path="/organisationevents/organizationaddmember" element={<OrgAddMember/>} />
          <Route path="/organisationevents/organisationmemberships" element={<OrganisationMemberships/>} />
          <Route path="//organisationevents/authorization" element={<OrgAuthorization/>} />
          <Route path="/organisationevents/otherevents" element={<OrgOtherEvents/>} />
          <Route path="/orgplatformfeedback" element={<OrgPlatformFeedback/>} />
          <Route path="/organisationevents/orgeventfeedback" element={<OrgUserEventFeedback/>} />
          <Route path="/usersfeedbacks" element={<OrgUsersFeedback/>} />
          <Route path="/organisationdashboardsec1" element={<OrgDashboardSec1/>} />
          <Route path="/organisationdashboardsec2" element={<OrgDashboardSec2/>} />


          {/* ----------------------------------- */}
         
         {/* Admin------------------------------------ */}
         <Route path="/admin" element={<AdminLogin/>} />
         <Route path="/admin/home" element={<AdminHome/>} />
         <Route path="/admin/allorg" element={<AdminOrg/>} />
         <Route path="/admin/orgdetailspage" element={<AdminOrgDetailed/>} />
         <Route path="/admin/allusers" element={<AdminUser/>} />
         <Route path="/admin/accepetrejectorg" element={<AdminAuthority/>} />
         <Route path="/admin/appliedorgdetails" element={<AdminAuthorityOrgDetails/>} />
         <Route path="/admin/alleventposts" element={<AdminEventPosts/>} />
         <Route path="/admin/orgfeedback" element={<AdminOrgFeedback/>} />
         <Route path="/admin/usereventfeedback" element={<AdminUserEventFeedback/>} />
         <Route path="/admin/platformfeedback" element={<AdminPlatformFeedback/>} />
         <Route path="/admin/homecards" element={<AdminDashboardSec1/>} />
         <Route path="/admin/homecarousels" element={<AdminDashboardSec2/>} />
         
         
         {/* ----------------------------------------- */}
          <Route path="*" element={<NotFound/>} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
