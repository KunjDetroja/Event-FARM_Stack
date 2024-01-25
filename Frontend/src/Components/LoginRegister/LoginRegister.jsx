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
          <button style={{color: 'white',backgroundColor: '#0e2643',border: 'none',marginLeft: '1rem',padding: '0.3rem 0.5rem 0.3rem 0.5rem',borderRadius: '0.375rem'}} onClick={() => setBoolean(true)} >
          <p className="h3">User</p>
            
          </button>
          <button style={{color: 'white',backgroundColor: '#0e2643',border: 'none',marginLeft: '1rem',padding: '0.3rem 0.5rem 0.3rem 0.5rem',borderRadius: '0.375rem'}} onClick={() => setBoolean(false)} >
          <p className="h3">Organization</p>
          </button>
          </div>
      </h1>
      {booleanvalue ? <User /> : <Organization />}


    </div>
  )
}

export default LoginRegister
