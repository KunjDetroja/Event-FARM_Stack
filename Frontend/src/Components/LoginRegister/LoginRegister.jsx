import React,{useState} from 'react'
import Navbar from '../Navbar'
import User from './User/User';
import Organization from './Organization/Organization';


const LoginRegister  = () => {
  const [booleanvalue, setBoolean] = useState(true);
  return (
    <div>
      <Navbar />
      <h1 className='mt-3'>
        <div className="text-center ">
          <button className="btn btn-primary btn-lg mx-2 " onClick={() => setBoolean(true)} >
          <p className="h3">User</p>
            
          </button>
          <button className="btn btn-primary btn-lg mx-2" onClick={() => setBoolean(false)} >
          <p className="h3">Organization</p>
          </button>
          </div>
      </h1>
      {booleanvalue ? <User /> : <Organization />}


    </div>
  )
}

export default LoginRegister
