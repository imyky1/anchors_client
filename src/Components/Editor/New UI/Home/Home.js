import React, { useContext, useEffect, useState } from "react";
import CreatorInfo from "../../../Modals/CreatorProfile/Modal1";
import Dashboard from "../Dashboard/Dashboard";
import Navbar from "../Navbar/Navbar";
import ServiceDetailPage from "../ServiceDetail/ServiceList";
import Sidebar from "../SideBar/Sidebar";
import "./Home.css";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import Create from "../Create Services/Create";
import EditProfile from "../EditProfile/EditProfile";
import { creatorContext } from "../../../../Context/CreatorState";
import { ToastContainer } from "react-toastify";
import { feedbackcontext } from "../../../../Context/FeedbackState";
import UserReviews from "../UserReviews/UserReviews";
import UserRequest from "../userRequest/UserRequest";
import ServiceStats from "../ServiceStats/ServiceStats";

function Home() {
  const [openCreatorInfo, setopenCreatorInfo] = useState(false);
  const [Rating, setRating] = useState("");
  const [creatorData, setcreatorData] = useState({ Reviews: "", Services: "" });
  const [progress, setProgress] = useState(0);
  const {
    getAllCreatorInfo,
    allCreatorInfo,
    basicNav,
    getCreatorExtraDetails,
  } = useContext(creatorContext);
  const { getRatingCreator } = useContext(feedbackcontext);

  useEffect(() => {
    getCreatorExtraDetails().then((e) => {
      setcreatorData({
        ...creatorData,
        Reviews: e?.data?.reviews,
        Services: e?.data?.services,
      });
    });

    getAllCreatorInfo().then((e) => {
      getRatingCreator(e).then((e1) => {
        setRating(e1);
      });
    });

    // eslint-disable-next-line
  }, []);


  return (
    <>
      <div className="main_home_page_container">
        <Sidebar userData={basicNav} moreInfo={{ ...creatorData, Rating }} alternateInfo={allCreatorInfo}/>
        <div className="right_side_home_page">
          <Navbar
            ModalState={openCreatorInfo}
            ChangeModalState={(e) => setopenCreatorInfo(e)}
            userData={basicNav}
            alternateInfo={allCreatorInfo}
          />
          <CreatorInfo
            open={openCreatorInfo}
            userData={basicNav}
            alternateInfo={allCreatorInfo}
            moreInfo={{ ...creatorData, Rating }}
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
              <Route
                path="/reviews"
                element={<UserReviews progress={setProgress} />}
              />
              <Route
                path="/requests"
                element={<UserRequest progress={setProgress} />}
              />
              <Route
                path="/servicestats/:slug"
                element={<ServiceStats progress={setProgress} />}
              />
            </Routes>
            
          </div>
        </div>
      </div>
      <ToastContainer />
    </>
  );
}

export default Home;
