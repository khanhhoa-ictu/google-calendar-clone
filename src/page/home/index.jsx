import Cookies from "js-cookie";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import DnDResource from "../../components/calendar";
import Navbar from "../../components/navbar";
import {
  getTokenByGoogleCalendar,
  registerWebhook,
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
      if (!accessToken) {
        const data = await getTokenByGoogleCalendar({
          code,
          userId: profile?.id,
        });
        if(data?.access_token){
          localStorage.setItem("accessToken", data.access_token);
        }
        accessToken = localStorage.getItem("accessToken");
      }

      await syncGoogleCalendar({
        userId: profile?.id,
        accessToken: accessToken,
      });
      notification.success({
        message: "đồng bộ lên google calendar thành công",
      });
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
    let accessToken = localStorage.getItem("accessToken");
    if (accessToken && profile) {
      registerWebhook(accessToken, profile?.email);
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
