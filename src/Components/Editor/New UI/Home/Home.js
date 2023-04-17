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
import { toast, ToastContainer } from "react-toastify";
import { feedbackcontext } from "../../../../Context/FeedbackState";
import UserReviews from "../UserReviews/UserReviews";
import UserRequest from "../userRequest/UserRequest";
import ServiceStats from "../ServiceStats/ServiceStats";
import Users from "../userList/Users";
import PaymentSummary from "../Payment Summary/paymentSummary";
import PaymentInfo from "../Payment Information/PaymentInfo";
import { LoadOne } from "../../../Modals/Loading";
import { linkedinContext } from "../../../../Context/LinkedinState";
import Waitlist from "../../../Waitlist/Waitlist";
import HelpModal from "../../../Modals/ModalType01/HelpModal";
import Edit from "../../../Edit Service/Edit";
import EditService from "../Edit Services/EditService";

function Home(props) {
  const location = useLocation();
  const navigate = useNavigate();
  const [openCreatorInfo, setopenCreatorInfo] = useState(false);
  const [openHelpModal, setOpenHelpModal] = useState(false);
  const [Rating, setRating] = useState("");
  const [creatorData, setcreatorData] = useState({ Reviews: "", Services: "" });
  const {
    getAllCreatorInfo,
    allCreatorInfo,
    basicNav,
    getCreatorExtraDetails,
  } = useContext(creatorContext);
  const {
    loginlinkedinUser,
    usergooglelogin,
    creatorLinkedinLogin,
    creatorGoogleLogin,
  } = useContext(linkedinContext);
  const { getRatingCreator } = useContext(feedbackcontext);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

  // useeffct to give direction to the flow to users + creator + developers
  useEffect(() => {
    // for users only
    if (
      localStorage.getItem("isUser") === "true" &&
      localStorage.getItem("from")
    ) {
      if (localStorage.getItem("jwtToken")) {
        navigate(`${localStorage.getItem("url")}`);
      } else if (localStorage.getItem("from") === "linkedin") {
        loginlinkedinUser();
      } else {
        usergooglelogin();
      }
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

  useEffect(() => {
    if (localStorage.getItem("jwtToken") && localStorage.getItem("c_id")) {
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
    }
    // eslint-disable-next-line
  }, [localStorage.getItem("jwtToken")]);

  return (
    <>
      {/* at /check the loader comes into role */}
      {location.pathname === "/check" && <LoadOne />}

      {localStorage.getItem("jwtToken") &&
        localStorage.getItem("c_id") &&
        basicNav?.name &&
        // checking for the status and hence removing all other routes-------------
        (basicNav?.status === 0 ? (
          <Waitlist />
        ) : (
          <div className="main_home_page_container">
            <Sidebar
              userData={basicNav}
              moreInfo={{ ...creatorData, Rating }}
              alternateInfo={allCreatorInfo}
            />
            <HelpModal
              open={openHelpModal}
              toClose={() => {
                setOpenHelpModal(false);
              }}
            />

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
                openHelp={() => {
                  setOpenHelpModal(true);
                }}
                moreInfo={{ ...creatorData, Rating }}
                toClose={() => {
                  setopenCreatorInfo(false);
                }}
              />
              <div className="remaining">
                {/* if invite code does not exist then it should be created ------------------------------- */}
                {!basicNav?.inviteCode ? (
                  <Routes>
                    <Route
                      path="/*"
                      element={<EditProfile progress={props.progress} />}
                    />
                  </Routes>
                ) : (
                  <Routes>
                    {/* Dashboard Route ---------------------------------------------------- */}
                    <Route path="/dashboard" element={<Dashboard />} />

                    {/* Service List Route ---------------------------------------------------- */}
                    <Route
                      path="/mycontents"
                      element={<ServiceDetailPage progress={props.progress} />}
                    />
                    {/* Create service Route ---------------------------------------------------- */}
                    <Route
                      path="/createservice"
                      element={<Create progress={props.progress} />}
                    />
                    <Route
                      path="/editprofile"
                      element={<EditProfile progress={props.progress} />}
                    />
                    <Route
                      path="/editservice/:slug/:servicetype"
                      element={<EditService progress={props.progress} />}
                    />
                    <Route
                      path="/reviews"
                      element={<UserReviews progress={props.progress} creatorSlug={basicNav?.slug}/>}
                    />
                    <Route
                      path="/servicereviews/:slug"
                      element={<UserReviews progress={props.progress} creatorSlug={basicNav?.slug}/>}
                    />
                    <Route
                      path="/requests"
                      element={<UserRequest progress={props.progress} creatorSlug={basicNav?.slug}/>}
                    />
                    <Route
                      path="/servicestats/:slug"
                      element={<ServiceStats progress={props.progress} />}
                    />
                    <Route
                      path="/paymentSummary"
                      element={<PaymentSummary progress={props.progress} />}
                    />
                    <Route
                      path="/paymentInfo"
                      element={<PaymentInfo progress={props.progress} />}
                    />
                    <Route
                      path="/viewUserDetails/:slug"
                      element={<Users progress={props.progress} />}
                    />

                    {/* exception  Route for false input ---------------------------------------------------- */}
                    <Route path="/*" element={<Dashboard />} />
                  </Routes>
                )}
              </div>
            </div>
          </div>
        ))}
      <ToastContainer />
    </>
  );
}

export default Home;
