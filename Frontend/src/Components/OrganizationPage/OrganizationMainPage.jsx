import React from 'react'
import OrganizationNavbar from './OrganizationNavbar'
// import {  useSelector } from 'react-redux'

function OrganizationMainPage() {
  // const auth = useSelector(state => state.data)
  // const status = useSelector(state => state.orgstatus)
  return (
    <div>
      <OrganizationNavbar />
      heyyyyyyyy
      <div className="container-fluid">
      {/* <div>{auth?.clubname}</div>
      <div>{status}</div> */}
      </div>
    </div>
  )
}

export default OrganizationMainPage
