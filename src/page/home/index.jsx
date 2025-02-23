import React from "react";
import DnDResource from "../../components/calendar"
import Navbar from "../../components/navbar";
function HomePage() {
  return (
    <div className="flex bg-[#f8fafd]" >
      <Navbar/>
      <DnDResource />
    </div>
  );
}

export default HomePage;
