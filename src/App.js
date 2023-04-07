import "./App.css";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import Home from "./Components/Home/Home";
import ServiceState from "./Context/services/ServiceState";
import Creators_login from "./Components/Login/Creators/Login2";
import Profile from "./Components/Creator Profile/Profile";
import CreatorState from "./Context/CreatorState";
import UserState from "./Context/UserState";
import Service from "./Components/Service Page/Service";
import { useState, useEffect } from "react";
import LoadingBar from "react-top-loading-bar";
import Feedback from "./Components/Feedback/Feedback";
import LinkedinState from "./Context/LinkedinState";
import FeedbackState from "./Context/FeedbackState";
import Privacy from "./Components/Privacy Policy/Privacy";
import Waitlist from "./Components/Waitlist/Waitlist";
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
import Workshop from "./Components/Service Page/Workshop";
import Pricing from "./Components/Pricing/Pricing";
import Sitemap from "./Components/sitemap/Sitemap";
import WorkshopFeedback from "./Components/Feedback/Workshopfeedback";
import Dashboarduser from "./Components/User Dashboard/Dashboarduser";
import Logout_Model_user from "./Components/Modals/Logout_Model_user";
import UserDashboardState from "./Context/userdashbaord";
import Redirect_servworkshop from "./Components/Redirect_servworkshop";
import Signup from "./Components/Signup/Signup";
import ExcelViewer from "./Components/Editor/excelviewer/ExcelViewer";
import PDFReader from "./Components/Editor/pdfViewer/Components/PDFReader";
import VideoDisplay from "./Components/Editor/VideoDisplay/VideoDisplay";
import HomeUI from "./Components/Editor/New UI/Home/Home";
import NewProfile from "./Components/Editor/New UI/Creator Profile/Profile";
import NewService from "./Components/Editor/New UI/Service Page/Service";
import TellUsMore from "./Components/Waitlist/TellUsMore";
import PDFReaderPreview from "./Components/Editor/pdfViewer/pdfViewerPreview/Components/PDFReader";

mixpanel.init(mixPanelToken, { debug: true });

function App() {
  const [progress, setprogress] = useState(0);

  const changeprogress = (progress) => {
    setprogress(progress);
  };

  return (
    <Router>
      <LinkedinState>
        <ServiceState>
          <CreatorState>
            <PaymentState>
              <UserState>
                <EmailState>
                  <FeedbackState>
                    <UserDashboardState>
                      <LoadingBar color="#f11946" progress={progress} />
                      <Routes>
                        {/* Home route to creator dashboard ------------------------------------------------ */}
                        <Route
                          path="*"
                          element={<HomeUI progress={changeprogress} />}
                        ></Route>

                        {/* User dashboard routes ---------------------------------------------------------- */}
                        <Route
                          path="/"
                          element={
                            localStorage.getItem("jwtToken") &&
                            localStorage.getItem("isUser") === "true" ? (
                              <Dashboarduser progress={progress} />
                            ) : (
                              <Main />
                            )
                          }
                        ></Route>

                        {/* Creator profile routes and service reoutes --------------------------------------------------- */}
                        <Route
                          exact
                          path="/c/:slug"
                          element={<NewProfile progress={changeprogress} />}
                        ></Route>
                        <Route
                          path="/s/:slug"
                          element={<NewService progress={changeprogress} />}
                        ></Route>
                        <Route
                          path="/w/:slug"
                          element={<Workshop progress={changeprogress} />}
                        ></Route>

                        {/* Anchors details routes ------------------------------------------------------- */}
                        <Route
                          path="/privacy-policy"
                          element={<Privacy />}
                        ></Route>
                        <Route path="/pricing" element={<Pricing />}></Route>

                        {localStorage.getItem("jwtToken") &&
                          localStorage.getItem("c_id") && (
                            <>
                              <Route
                                path="/waitlist"
                                element={<Waitlist />}
                              ></Route>
                              <Route
                                path="/tellUsMore"
                                element={<TellUsMore />}
                              ></Route>
                            </>
                          )}

                        {/* Redirection routes ---------------------------------------------------------------------- */}
                        <Route
                          path="/r/:id"
                          element={<Redirect_serv />}
                        ></Route>
                        <Route
                          path="/rw/:id"
                          element={<Redirect_servworkshop />}
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
                        {localStorage.getItem("jwtToken") && (
                          <Route
                            path="/logout"
                            element={<Logout_Model progress={progress} />}
                          />
                        )}
                        {localStorage.getItem("jwtToken") && (
                          <Route
                            path="/logout/user"
                            element={<Logout_Model_user progress={progress} />}
                          />
                        )}
                        {localStorage.getItem("jwtToken") && (
                          <Route
                            path="/user/dashboard"
                            element={<Dashboarduser progress={progress} />}
                          />
                        )}

                        {/* Login and Signup for creators -------------------------------------- */}
                        <Route path="/login">
                          <Route
                            path="creators"
                            element={
                              <Creators_login progress={changeprogress} />
                            }
                          />
                        </Route>
                        <Route path="/signup/creators" element={<Signup />} />

                        {/* Sitemap route -------------------------------------------------------------- */}
                        <Route path="/sitemapac" element={<Sitemap />}></Route>

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
                        <Route
                          path="/newservice/:slug"
                          element={<NewService />}
                        />
                      </Routes>
                    </UserDashboardState>
                  </FeedbackState>
                </EmailState>
              </UserState>
            </PaymentState>
          </CreatorState>
        </ServiceState>
      </LinkedinState>
    </Router>
  );
}

export default App;
