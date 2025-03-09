import React from 'react'
import { useNavigate } from 'react-router';
import Cookies from "js-cookie";
import { Button } from 'antd';

function Navbar() {
  const navigate = useNavigate()
  const handleLogout = () => {
    Cookies.remove("token");
    navigate("/login")
  }

  return (
    <div className='bg-[#f8fafd] min-w-[240px]'>
      <div className="flex flex-col justify-between h-full !py-6" >
        <h1 className="font-bold !text-2xl !lg:text-[32px] uppercase gradient-text !mt-4">
          My Calendar
        </h1>
        <div className='!px-5'>
          <Button className="cursor-pointer w-full !py-5" onClick={handleLogout} >Đăng xuất</Button>
        </div>
      </div>

    </div>
  )
}

export default Navbar