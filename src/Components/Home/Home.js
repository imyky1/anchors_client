import React, { useContext, useEffect, useState } from "react";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import Create from "../Create Service/Create";
import Info_creator from "../Creator info/Info_creator";
import Dashboard from "../Dashboard/Dashboard";
import Service from "../Services/Service";
import Navbar from "../Side Navbar/Navbar";
import Subscribers from "../Subscribers/Subscribers";
import { linkedinContext } from "../../Context/LinkedinState";
import { ToastContainer } from "react-toastify";
import "./Home.css";
import { LoadOne } from "../Modals/Loading";
import Redirect_serv from "../Redirect_serv";
import Reviews from "../Reviews/Reviews";
import Requests from "../Requests/Requests";
import Edit from "../Edit Service/Edit";
import Editworkshop from "../Edit Service/Editworkshop";

import IndexCreator from "../Create Service/index";
import Stats from "../Service Stats/Stats";
import Details from "../User Detail Lists/Details";
import PaymentsTab from "../Payments Tab/paymentab";
import PersonalInfoModal from "../Modals/PersonalInfoModal";
import { creatorContext } from "../../Context/CreatorState";
import Document from "../Services/Document";

function Home(props) {
  const navigate = useNavigate();
  const location = useLocation();
  const {
    loginlinkedinUser,
    usergooglelogin,
    creatorLinkedinLogin,
    creatorGoogleLogin,
  } = useContext(linkedinContext);
  const { allCreatorInfo, getAllCreatorInfo } = useContext(creatorContext);
  const [createWorkshoppopup, constCreateWorkshoppopup] = useState(false);
  const [personalInfoModalOpen, setpersonalInfoModalOpen] = useState(false);

  useEffect(() => {
    // for users only
    if (
      localStorage.getItem("isUser") === "true" &&
      localStorage.getItem("from")
    ) {
      if (localStorage.getItem("from") === "linkedin") {
        loginlinkedinUser();
      } else {
        usergooglelogin();
      }
      navigate(`${localStorage.getItem("url")}`);
    }

    // for creators only
    else if (
      localStorage.getItem("isUser") === "" &&
      localStorage.getItem("from")
    ) {
      if (localStorage.getItem("jwtToken")) {
        //getAllCreatorInfo().then((e) => {});
      } else if (localStorage.getItem("from") === "linkedin") {
        creatorLinkedinLogin();
      } else {
        creatorGoogleLogin();
      }
    }

    // for developers only
    else if (
      localStorage.getItem("isDev") === "true" &&
      localStorage.getItem("jwtTokenD")
    ) {
      console.log("Welcome Developers");
    }

    // not logined people
    else {
      if (localStorage.getItem("url")) {
        navigate(`${localStorage.getItem("url")}`);
      } else {
        navigate("/");
      }
    }
    // eslint-disable-next-line
  }, []);

  //useEffect(() => {
  //  if (allCreatorInfo) {
  //    setTimeout(() => {
  //      if (
  //        !allCreatorInfo?.name ||
  //        !allCreatorInfo?.phone ||
  //        !allCreatorInfo?.tagLine ||
  //        !allCreatorInfo?.dob ||
  //        !allCreatorInfo?.aboutMe ||
  //        !allCreatorInfo?.linkedInLink
  //      ) {
  //          setpersonalInfoModalOpen(true);
  //
  //      } else {
  //        setpersonalInfoModalOpen(false);
  //      }
  //    }, 5000);
  //  }
  //}, [allCreatorInfo]);

  return (
    <>
      {/* {createWorkshoppopup ? (
        <div className="popup_create_workshop_background"></div>
      ) : (
        ""
      )} */}

      <ToastContainer />

      {/* check after login */}
      {location.pathname === "/check" && <LoadOne />}

      {/* check for personal info filled or not checking all the mandatory  */}
      {/* {allCreatorInfo?.completedInfo !== "1"  && location.pathname !== "/creator_info" && (
        <PersonalInfoModal open={personalInfoModalOpen} allCreatorInfo />
      )} */}

      {/* Check if creator is loggined or not if not then passage should not be given ------------------------------- */}

      {localStorage.getItem("jwtToken") && localStorage.getItem("c_id") && (
        <div className="main_box">
          <Navbar />
          <div className="right_container">
            <Routes>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route
                path="/creator_info"
                element={<Info_creator progress={props.progress} />}
              />
              <Route
                path="/createservice"
                element={
                  <IndexCreator
                    progress={props.progress}
                    showpopup={createWorkshoppopup}
                    setShowPopup={constCreateWorkshoppopup}
                  />
                }
              />
              <Route
                path="/editservice/:slug"
                element={
                  <Edit
                    progress={props.progress}
                    showpopup={createWorkshoppopup}
                    setShowPopup={constCreateWorkshoppopup}
                  />
                }
              />
              {/**EDIT WORKSHOP ROUTE */}
              <Route
                path="/editworkshop/:slug"
                element={<Editworkshop progress={props.progress} />}
              />
              {/**view stats of services ROUTE */}
              <Route
                path="/serviceStats/:slug"
                element={<Stats progress={props.progress} />}
              />
              {/**view user details of services ROUTE */}
              <Route
                path="/viewusersdetails/:slug"
                element={<Details progress={props.progress} />}
              />
              <Route
                path="/paymentstab"
                element={<PaymentsTab progress={props.progress} />}
              />
              <Route
                path="/servicelist"
                //element={<Service progress={props.progress} />
                element={<Document progress={props.progress} />}
              />
              <Route path="/subscriberlist" element={<Subscribers />} />
              <Route
                path="/user_reviews"
                element={<Reviews />}
                progress={props.progress}
              />
              <Route path="/user_requests" element={<Requests />} />
            </Routes>
          </div>
        </div>
      )}
    </>
  );
}

export default Home;
