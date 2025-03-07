import React, { useEffect, useState } from "react";
import DnDResource from "../../components/calendar";
import Navbar from "../../components/navbar";
import { profile } from "../../service/user";
import { handleErrorMessage } from "../../helper";
import Cookies from "js-cookie";
import { useNavigate } from "react-router";

function HomePage() {
  const navigate = useNavigate();
  const [userProfile, setUserProfile] = useState(null);
  const isAuthenticated = !!Cookies.get("token");
  const handleLoadProfile = async () => {
    try {
      const dataProfile = await profile();
      setUserProfile(dataProfile);
    } catch (error) {
      handleErrorMessage(error);
    }
  };

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    handleLoadProfile();
  }, []);

  return (
    <div className="flex bg-[#f8fafd] h-full">
      <Navbar />
      <DnDResource userProfile={userProfile} />
    </div>
  );
}

export default HomePage;
