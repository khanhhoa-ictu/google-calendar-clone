import React from "react";
import { Link, useNavigate } from "react-router";
import Cookies from "js-cookie";
import { Button } from "antd";
import useProfile from "../../hook/useProfile";
import { ROLE } from "../../helper/constants";

function Navbar() {
  const { profile } = useProfile();
  const navigate = useNavigate();
  const handleLogout = () => {
    Cookies.remove("token");
    navigate("/login");
  };
  
  return (
    <div className="bg-[#f8fafd] min-w-[240px]">
      <div className="flex flex-col justify-between h-full !py-6">
        <div>
          <h1 className="font-bold !text-2xl !lg:text-[32px] uppercase gradient-text !mt-4">
            My Calendar
          </h1>
          {profile?.role === ROLE.ADMIN && (
            <div className="flex flex-col text-left !ml-6 !mt-10 gap-5 text-xl">
              <Link to="/" className="!text-[#333]">
                Trang chủ
              </Link>
              <Link to="/manager" className="!text-[#333]">
                Trang quản lý
              </Link>
            </div>
          )}
        </div>

        <div className="!px-5">
          <Button
            className="cursor-pointer w-full !py-5"
            onClick={handleLogout}
          >
            Đăng xuất
          </Button>
        </div>
      </div>
    </div>
  );
}

export default Navbar;
