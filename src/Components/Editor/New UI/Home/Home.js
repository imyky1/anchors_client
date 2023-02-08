import React, { useState } from "react";
import CreatorInfo from "../../../Modals/CreatorProfile/Modal1";
import Dashboard from "../Dashboard/Dashboard";
import Navbar from "../Navbar/Navbar";
import ServiceDetailPage from "../ServiceDetail/ServiceList";
import Sidebar from "../SideBar/Sidebar";
import "./Home.css";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import Create from "../Create Services/Create";
import EditProfile from "../EditProfile/EditProfile";

function Home() {
  const [openCreatorInfo, setopenCreatorInfo] = useState(false);
  const [progress, setProgress] = useState(0);

  return (
    <div className="main_home_page_container">
      <Sidebar />
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
          <Routes>
            {/* Dashboard Route ---------------------------------------------------- */}
            <Route path="/dashboard" element={<Dashboard />} />

            {/* Service List Route ---------------------------------------------------- */}
            <Route
              path="/mycontents"
              element={<ServiceDetailPage progress={setProgress} />}
            />

            {/* Service List Route ---------------------------------------------------- */}
            <Route
              path="/createservice"
              element={<Create progress={setProgress} />}
            />
            <Route
              path="/editprofile"
              element={<EditProfile progress={setProgress} />}
            />
          </Routes>
          {/* {openPage === 0 ? (
            <Dashboard />
          ) : (
            <ServiceDetailPage progress={setProgress} />
          )} */}
        </div>
      </div>
    </div>
  );
}

export default Home;
