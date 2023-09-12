import React, { Suspense, useContext, useEffect, useState } from "react";
import "./Home.css";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import { creatorContext } from "../../../../Context/CreatorState";
import { toast, ToastContainer } from "react-toastify";
import { feedbackcontext } from "../../../../Context/FeedbackState";
import { linkedinContext } from "../../../../Context/LinkedinState";

// Pages lazy loading or code spilliting -------------------
import CreatorInfo from "../../../Modals/CreatorProfile/Modal1";
import Dashboard from "../Dashboard/Dashboard";
import Navbar from "../Navbar/Navbar";
import ServiceDetailPage from "../ServiceDetail/ServiceList";
import Sidebar from "../SideBar/Sidebar";
import Create from "../Create Services/Create2";
import EditProfile from "../EditProfile/EditProfile";
import UserReviews from "../UserReviews/UserReviews";
import UserRequest from "../userRequest/UserRequest";
import ServiceStats from "../ServiceStats/ServiceStats";
import Users from "../userList/Users";
import PaymentSummary from "../Payment Summary/paymentSummary";
import PaymentInfo from "../Payment Information/PaymentInfo";
import { LoadOne, LoadThree } from "../../../Modals/Loading";
import Waitlist from "../../../Waitlist/Waitlist";
import HelpModal from "../../../Modals/ModalType01/HelpModal";
import EditService from "../Edit Services/EditService";
import { CreatorFeedbackModal } from "../../../Modals/CreatorProfile/CreatorFeedback";

import DefaultBanner from "../../../Modals/Default Banner/DefaultBanner";
import TellUsMore from "../../../Waitlist/TellUsMore";
import CreateEvent from "../Create Services/CreateEvent";
import FirstTimeModal from "../../../Modals/FirstTimeModal";
import Stats from "../Stats/stats";
import NoMobileScreen from "../../../Layouts/Error Pages/NoMobileScreen";
import EditEvent from "../Edit Services/EditEvent";
import ServiceStats2 from "../ServiceStats/ServiceStats2";

function Home(props) {
  const location = useLocation();
  const navigate = useNavigate();
  const [openCreatorInfo, setopenCreatorInfo] = useState(false);
  const [openHelpModal, setOpenHelpModal] = useState(false);
  const [openFirstTimeModal, setOpenFirstTimeModal] = useState(false);
  const [openCreatorFbModal, setOpenCreatorFbModal] = useState(false);
  const [openDefaultBannerModal, setOpenDefaultBannerModal] = useState(false);
  const [dataDefaultBanner, setDataDefaultBanner] = useState({
    fillingData: {},
    finalFormData: {},
    objectUrl: null,
  });
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

      // const script = document.createElement("script");
      // script.innerHTML = `
      //   (function (w, d, s, c, r, a, m) {
      //     w["KiwiObject"] = r;
      //     w[r] =
      //       w[r] ||
      //       function () {
      //         (w[r].q = w[r].q || []).push(arguments);
      //       };
      //     w[r].l = 1 * new Date();
      //     a = d.createElement(s);
      //     m = d.getElementsByTagName(s)[0];
      //     a.async = 1;
      //     a.src = c;
      //     m.parentNode.insertBefore(a, m);
      //   })(
      //     window,
      //     document,
      //     "script",
      //     "https://app.interakt.ai/kiwi-sdk/kiwi-sdk-17-prod-min.js?v=" +
      //       new Date().getTime(),
      //     "kiwi"
      //   );
      //   window.addEventListener("load", function () {
      //     kiwi.init("", "5iLlXa3nOrSCBGdtkweRO8tws2xujgB0", {});
      //   });
      // `;
      // document.body.appendChild(script);

      // return () => {
      //   // Clean up the script when the component is unmounted
      //   document.body.removeChild(script);
      // };
    }
    // eslint-disable-next-line
  }, [localStorage.getItem("jwtToken")]);

  return (
    <>
      {/* at /check the loader comes into role */}
      {location.pathname === "/dashboard/check" && <LoadOne />}

      <Suspense fallback={<LoadThree />}>
        {localStorage.getItem("jwtToken") &&
          localStorage.getItem("c_id") &&
          basicNav?.name &&
          // checking for the status and hence removing all other routes-------------
          (basicNav?.status === 0 ? (
            <Routes>
              <Route path="/*" element={<Waitlist />}></Route>
              <Route path="/tellUsMore" element={<TellUsMore />}></Route>
            </Routes>
          ) : window.screen.width < 600 ? (
            <NoMobileScreen />
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

              <CreatorFeedbackModal
                open={openCreatorFbModal}
                onClose={() => {
                  setOpenCreatorFbModal(false);
                }}
              />

              {/* First time details modal --------------------- */}
              {openFirstTimeModal && (
                <FirstTimeModal
                  onClose={() => {
                    setOpenFirstTimeModal(false);
                  }}
                />
              )}

              {/* Default Banner modal controlled through craete service -------- */}
              <DefaultBanner
                open={openDefaultBannerModal}
                onClose={() => {
                  setOpenDefaultBannerModal(false);
                }}
                dataToRender={dataDefaultBanner?.fillingData}
                setFinalData={(formdata, objectUrl) => {
                  setDataDefaultBanner({
                    ...dataDefaultBanner,
                    finalFormData: formdata,
                    objectUrl,
                  });
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
                  openFb={() => {
                    setOpenCreatorFbModal(true);
                  }}
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
                        element={
                          <EditProfile
                            progress={props.progress}
                            moreInfo={{ ...creatorData, Rating }}
                          />
                        }
                      />
                    </Routes>
                  ) : (
                    <Routes>
                      {/* Dashboard Route ---------------------------------------------------- */}
                      <Route
                        path="/"
                        element={
                          <Dashboard
                            setOpenFirstTimeModal={setOpenFirstTimeModal}
                            reviews={creatorData?.Reviews}
                          />
                        }
                      />

                      {/* Service List Route ---------------------------------------------------- */}
                      <Route
                        path="mycontents"
                        element={
                          <ServiceDetailPage progress={props.progress} />
                        }
                      />
                      {/* Create service Route ---------------------------------------------------- */}
                      <Route
                        path="createservice"
                        element={
                          <Create
                            progress={props.progress}
                            openDefaultBanner={() => {
                              setOpenDefaultBannerModal(true);
                            }}
                            setDefaultBannerData={(e) =>
                              setDataDefaultBanner({
                                ...dataDefaultBanner,
                                fillingData: e,
                              })
                            }
                            defaultImageobjectUrl={dataDefaultBanner?.objectUrl}
                            FinalDefaultBannerFormData={
                              dataDefaultBanner?.finalFormData
                            }
                            cname={allCreatorInfo?.name}
                          />
                        }
                      />
                      {/* Create event route */}
                      <Route
                        path="createevent"
                        element={
                          <CreateEvent
                            progress={props.progress}
                            openDefaultBanner={() => {
                              setOpenDefaultBannerModal(true);
                            }}
                            cname={allCreatorInfo?.name ?? basicNav?.name}
                            ctagline={allCreatorInfo?.tagLine}
                            crating={Rating}
                            cprofile={
                              allCreatorInfo?.profile ?? basicNav?.photo
                            }
                            setDefaultBannerData={(e) =>
                              setDataDefaultBanner({
                                ...dataDefaultBanner,
                                fillingData: e,
                              })
                            }
                            FinalDefaultBannerFormData={
                              dataDefaultBanner?.finalFormData
                            }
                          />
                        }
                      />
                      <Route
                        path="editprofile"
                        element={
                          <EditProfile
                            progress={props.progress}
                            moreInfo={{ ...creatorData, Rating }}
                          />
                        }
                      />
                      <Route
                        path="editservice/:slug/:servicetype"
                        element={
                          <EditService
                            progress={props.progress}
                            openDefaultBanner={() => {
                              setOpenDefaultBannerModal(true);
                            }}
                            setDefaultBannerData={(e) =>
                              setDataDefaultBanner({
                                ...dataDefaultBanner,
                                fillingData: e,
                              })
                            }
                            FinalDefaultBannerFormData={
                              dataDefaultBanner?.finalFormData
                            }
                            cname={allCreatorInfo?.name}
                          />
                        }
                      />
                      <Route
                        path="editevent/:slug"
                        element={
                          <EditEvent
                            progress={props.progress}
                            openDefaultBanner={() => {
                              setOpenDefaultBannerModal(true);
                            }}
                            setDefaultBannerData={(e) =>
                              setDataDefaultBanner({
                                ...dataDefaultBanner,
                                fillingData: e,
                              })
                            }
                            FinalDefaultBannerFormData={
                              dataDefaultBanner?.finalFormData
                            }
                            cname={allCreatorInfo?.name}
                          />
                        }
                      />
                      <Route
                        path="reviews"
                        element={
                          <UserReviews
                            progress={props.progress}
                            creatorSlug={basicNav?.slug}
                          />
                        }
                      />
                      <Route
                        path="servicereviews/:slug"
                        element={
                          <UserReviews
                            progress={props.progress}
                            creatorSlug={basicNav?.slug}
                          />
                        }
                      />
                      <Route
                        path="requests"
                        element={
                          <UserRequest
                            progress={props.progress}
                            creatorSlug={basicNav?.slug}
                          />
                        }
                      />
                      <Route
                        path="stats"
                        element={
                          <Stats
                            progress={props.progress}
                            creatorSlug={basicNav?.slug}
                          />
                        }
                      />

                      <Route
                        path="servicestats/:slug"
                        element={<ServiceStats2 progress={props.progress} />}
                      />
                      <Route
                        path="paymentSummary"
                        element={<PaymentSummary progress={props.progress} />}
                      />
                      <Route
                        path="paymentInfo"
                        element={<PaymentInfo progress={props.progress} />}
                      />
                      <Route
                        path="viewUserDetails/:slug"
                        element={<Users progress={props.progress} />}
                      />

                      {/* exception  Route for false input ---------------------------------------------------- */}
                      <Route
                        path="/*"
                        element={
                          <Dashboard
                            reviews={creatorData?.Reviews}
                            setOpenFirstTimeModal={setOpenFirstTimeModal}
                          />
                        }
                      />
                    </Routes>
                  )}
                </div>
              </div>
            </div>
          ))}
      </Suspense>
      <ToastContainer theme="dark" />
    </>
  );
}

export default Home;
