import React, { useEffect } from 'react'
import Navbar from '../../components/navbar'
import User from './components/User'
import { ROLE } from '../../helper/constants';
import { useNavigate } from 'react-router';
function Manager({profile}) {
  const navigate = useNavigate()

  useEffect(()=>{
    if(profile?.role === ROLE.USER){
      navigate("/")
    }
  },[profile])
  
  if(!profile) return null;
  return (
    <div className="flex h-full gap-3">
    <Navbar />
    <User/>
  </div>
  )
}

export default Manager