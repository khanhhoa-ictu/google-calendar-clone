import Cookies from "js-cookie";
import React, { useEffect } from "react";
import { useNavigate } from "react-router";
import DnDResource from "../../components/calendar";
import Navbar from "../../components/navbar";

function HomePage() {
  const navigate = useNavigate();
  const isAuthenticated = !!Cookies.get("token");

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
  }, []);

  return (
    <div className="flex h-full gap-3">
      <Navbar />
      <DnDResource />
    </div>
  );
}

export default HomePage;
