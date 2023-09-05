import "./App.css";
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";
import ServiceState from "./Context/services/ServiceState";
import Creators_login from "./Components/Login/Creators/Login2";
import CreatorState from "./Context/CreatorState";
import UserState from "./Context/UserState";
import { useState } from "react";
import LoadingBar from "react-top-loading-bar";
import Feedback from "./Components/Feedback/Feedback";
import LinkedinState from "./Context/LinkedinState";
import FeedbackState from "./Context/FeedbackState";
import Privacy from "./Components/Privacy Policy/Privacy";
import Logout_Model from "./Components/Modals/Logout_Model";
import UserCount from "./Developers/Count/UserCount";
import mixpanel from "mixpanel-browser";
import { mixPanelToken } from "./config/config.js";
import Main from "./Components/Main Page/Main";
import View from "./Developers/Dashboard/View";
import Login from "./Developers/Login/Login";
import PaymentState from "./Context/PaymentState";
import Redirect_serv from "./Components/Redirect_serv";
import Test from "./Components/Editor/Test";
import EmailState from "./Context/EmailState";
import Pricing from "./Components/Pricing/Pricing";
import Sitemap from "./Components/sitemap/Sitemap";
import WorkshopFeedback from "./Components/Feedback/Workshopfeedback";
import UserDashboardState from "./Context/userdashbaord";
import Signup from "./Components/Signup/Signup";
import ExcelViewer from "./Components/Editor/excelviewer/ExcelViewer";
import PDFReader from "./Components/Editor/pdfViewer/Components/PDFReader";
import VideoDisplay from "./Components/Editor/VideoDisplay/VideoDisplay";
import HomeUI from "./Components/Editor/New UI/Home/Home";
import PDFReaderPreview from "./Components/Editor/pdfViewer/pdfViewerPreview/Components/PDFReader";
import Seo from "./Utils/Seo";
import UserDashboard from "./Components/User Dashboard/UserDashboard";
import Predictor from "./Components/Earning Potential/Predictor";
import PredictorData from "./Components/Earning Potential/PredictorData";
import EPAState from "./Context/EPAState";
import { SkeletonTheme } from "react-loading-skeleton";
import Event from "./Components/Editor/New UI/Event Page/Event";
import About from "./Components/Static pages/About";
import RefundPolicy from "./Components/Static pages/Refund";
import Contact from "./Components/Static pages/Contact";
import TermsAndConditions from "./Components/Static pages/Terms";
import Success from "./Components/Editor/New UI/Event Success Page/Success";
import Sample from "./Components/Editor/New UI/Sample Page/Sample";
import StaticSuccess from "./Components/Editor/New UI/Event Success Page/StaticSuccess";

// import fonts ---------------------
import "./fonts/Gilroy-Black.ttf";
import "./fonts/Gilroy-Bold.ttf";
import "./fonts/Gilroy-Medium.ttf";
import "./fonts/Gilroy-Light.ttf";
import "./fonts/Gilroy-SemiBold.ttf";
import "./fonts/Gilroy-Regular.ttf";
import ServicePage from "./Components/Editor/New UI/Service Page/ServicePage";
import ProfilePage from "./Components/Editor/New UI/Creator Profile/ProfilePage";
import PreviewPage from "./Components/Editor/New UI/Service Page/PreviewPage";
import Upload from "./Developers/Upload/Upload";
import Creator from "./Components/ApprovedCreators/Creator.js";
import MainLanding from "./Components/Editor/New UI/Main Page/Main";
import UserDashboard2 from "./Components/User Dashboard2/UserDashboard";
import EventPricing from "./Components/Pricing/EventPricing";

mixpanel.init(mixPanelToken, { debug: true });

function App() {
  const [progress, setprogress] = useState(0);

  const changeprogress = (progress) => {
    setprogress(progress);
  };

  return (
    <>
      <Seo />

      <SkeletonTheme baseColor="#313131" highlightColor="#525252">
        <Router>
          <LinkedinState>
            <ServiceState>
              <CreatorState>
                <PaymentState>
                  <UserState>
                    <EmailState>
                      <EPAState>
                        <FeedbackState>
                          <UserDashboardState>
                            <LoadingBar color="#f11946" progress={progress} />
                            <Routes>
                              {/* Landing Page routes ---------------------------------------------------------- */}
                              <Route
                                path="/"
                                element={
                                  window.screen.width > 600 ? (
                                    <MainLanding progress={changeprogress} />
                                  ) : (
                                    <Main progress={changeprogress} />
                                  )
                                }
                              ></Route>
                              {/* Home route to creator dashboard ------------------------------------------------ */}
                              <Route
                                path="/dashboard/*"
                                element={<HomeUI progress={changeprogress} />}
                              ></Route>
                              {/* Creator profile routes and service reoutes --------------------------------------------------- */}
                              <Route
                                exact
                                path="/:slug"
                                element={
                                  <ProfilePage progress={changeprogress} />
                                }
                              ></Route>
                              <Route
                                exact
                                path="/s/:slug"
                                element={
                                  <ServicePage progress={changeprogress} />
                                }
                              ></Route>
                              <Route
                                exact
                                path="/s/preview/:slug"
                                element={
                                  <PreviewPage progress={changeprogress} />
                                }
                              ></Route>
                              <Route
                                path="/e/:slug"
                                element={<Event progress={changeprogress} />}
                              ></Route>
                              <Route
                                path="/success/:slug"
                                element={<Success />}
                              />
                              {/* Anchors details routes ------------------------------------------------------- */}
                              <Route
                                path="/privacy-policy"
                                element={<Privacy />}
                              ></Route>
                              <Route
                                path="/approved-creators"
                                element={<Creator />}
                              ></Route>
                              <Route
                                path="/earning-predictor"
                                element={<Predictor />}
                              ></Route>
                              <Route
                                path="/earning-predictor/:url"
                                element={<PredictorData />}
                              ></Route>
                              {/* Static Pages */}
                              <Route
                                path="/termsConditions"
                                element={<TermsAndConditions />}
                              ></Route>
                              <Route
                                path="/aboutUs"
                                element={<About />}
                              ></Route>
                              <Route
                                path="/contactUs"
                                element={<Contact />}
                              ></Route>
                              <Route
                                path="/refundPolicy"
                                element={<RefundPolicy />}
                              ></Route>
                              <Route
                                path="/static/success"
                                element={<StaticSuccess />}
                              ></Route>
                              <Route
                                path="/pricing"
                                element={<Pricing />}
                              ></Route>
                              <Route
                                path="/eventpricing"
                                element={<EventPricing />}
                              ></Route>
                              {/* Demo Page */}
                              <Route
                                path="/hostevent"
                                element={<Sample />}
                              ></Route>
                              {/* Redirection routes ---------------------------------------------------------------------- */}
                              <Route
                                path="/r/:id"
                                element={<Redirect_serv />}
                              ></Route>
                              <Route
                                path="/c/:id"
                                element={<Redirect_serv />}
                              ></Route>
                              {/* Developer routes --------------------------------------------------------------- */}
                              <Route
                                path="/developer/count"
                                element={<UserCount />}
                              ></Route>
                              <Route
                                path="/developer/admin"
                                element={<View />}
                              ></Route>
                              <Route
                                path="/developer/admin/upload"
                                element={<Upload />}
                              ></Route>
                              <Route
                                path="/developer/login"
                                element={<Login />}
                              ></Route>
                              <Route
                                path="/developer/test"
                                element={<Test />}
                              ></Route>
                              {/* User feedback routes ----------------------------------------------------------- */}
                              <Route
                                path="/feedback"
                                element={<Feedback progress={changeprogress} />}
                              ></Route>
                              <Route
                                path="/feedback/workshop/:id"
                                element={
                                  <WorkshopFeedback progress={changeprogress} />
                                }
                              ></Route>
                              {/* Logout routes ---------------------------------------------------------------------------- */}
                              <Route
                                path="/logout"
                                element={
                                  <Logout_Model progress={changeprogress} />
                                }
                              />
                                <Route
                                  path="/user/dashboard"
                                  element={
                                    <UserDashboard2 progress={changeprogress} />
                                  }
                                />
                              {/* Login and Signup for creators -------------------------------------- */}{" "}
                              <Route path="/login">
                                <Route
                                  path="creators"
                                  element={
                                    <Creators_login progress={changeprogress} />
                                  }
                                />
                              </Route>
                              <Route
                                path="/signup/creators"
                                element={<Signup />}
                              />{" "}
                              {/* Sitemap route -------------------------------------------------------------- */}
                              <Route
                                path="/sitemapac"
                                element={<Sitemap />}
                              ></Route>
                              {/* Testing routes --------------------------------------------------------------- */}
                              {/**EXCEL FILE VIEWING ROUTE : ) */}
                              <Route
                                path="/viewExcel"
                                element={
                                  <ExcelViewer /*url="https://sample-videos.com/xls/Sample-Spreadsheet-5000-rows.xls"*/
                                  />
                                }
                              />
                              <Route
                                path="/viewPdf"
                                element={
                                  <PDFReader /*url="https://sample-videos.com/xls/Sample-Spreadsheet-5000-rows.xls"*/
                                  />
                                }
                              />
                              <Route
                                path="/viewPdfPreview"
                                element={
                                  <PDFReaderPreview /*url="https://sample-videos.com/xls/Sample-Spreadsheet-5000-rows.xls"*/
                                  />
                                }
                              />
                              <Route
                                path="/viewVideo"
                                element={
                                  <VideoDisplay /*url="https://sample-videos.com/xls/Sample-Spreadsheet-5000-rows.xls"*/
                                  />
                                }
                              />
                            </Routes>
                          </UserDashboardState>
                        </FeedbackState>
                      </EPAState>
                    </EmailState>
                  </UserState>
                </PaymentState>
              </CreatorState>
            </ServiceState>
          </LinkedinState>
        </Router>
      </SkeletonTheme>
    </>
  );
}

export default App;
