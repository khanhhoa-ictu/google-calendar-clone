import Cookies from "js-cookie";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import DnDResource from "../../components/calendar";
import Navbar from "../../components/navbar";
import {
  getTokenByGoogleCalendar,
  syncGoogleCalendar,
} from "../../service/event";
import { message, notification } from "antd";
import { handleErrorMessage } from "../../helper";

function HomePage({ profile }) {
  const navigate = useNavigate();
  const isAuthenticated = !!Cookies.get("token");
  const [loading, setLoading] = useState(false);

  const handleGetTokenByGoogle = async (code) => {
    setLoading(true);
    try {
      let accessToken = localStorage.getItem("accessToken");
      let refreshToken = localStorage.getItem("refreshToken");
      if (!accessToken) {
        const data = await getTokenByGoogleCalendar(code);
        localStorage.setItem("accessToken", data.access_token);
        localStorage.setItem("refreshToken", data.refresh_token);
        accessToken = localStorage.getItem("accessToken");
        refreshToken = localStorage.getItem("refreshToken");
      }

      await syncGoogleCalendar({
        userId: profile?.id,
        accessToken: accessToken,
        refreshToken: refreshToken,
      });
      notification.success({message: "đồng bộ lên google calendar thành công"})
      navigate("/");
    } catch (error) {
      handleErrorMessage(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
  }, []);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get("code");
    if (code && profile) {
      handleGetTokenByGoogle(code);
    }
  }, [profile]);

  return (
    <div className="flex h-full gap-3">
      <Navbar />
      <DnDResource profile={profile} />
    </div>
  );
}

export default HomePage;
