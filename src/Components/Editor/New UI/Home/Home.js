import React, { useState } from "react";
import CreatorInfo from "../../../Modals/CreatorProfile/Modal1";
import Dashboard from "../Dashboard/Dashboard";
import Navbar from "../Navbar/Navbar";
import ServiceDetailPage from "../ServiceDetail/ServiceList";
import Sidebar from "../SideBar/Sidebar";
import "./Home.css";

function Home() {
  const [openCreatorInfo, setopenCreatorInfo] = useState(false);
  const [openPage, setOpenPage] = useState(0);
  const [progress, setProgress] = useState(0);
  console.log(openPage);
  return (
    <div className="main_home_page_container">
      <Sidebar openPage={openPage} setOpenPage={setOpenPage} />
      <div className="right_side_home_page">
        <Navbar
          ModalState={openCreatorInfo}
          ChangeModalState={(e) => setopenCreatorInfo(e)}
        />
        <CreatorInfo
          open={openCreatorInfo}
          toClose={() => {
            setopenCreatorInfo(false);
          }}
        />
        <div className="remaining">
          {openPage === 0 ? (
            <Dashboard />
          ) : (
            <ServiceDetailPage progress={setProgress} />
          )}
        </div>
      </div>
    </div>
  );
}

export default Home;
