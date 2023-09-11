import "./App.css";
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";
import { Suspense, lazy, useEffect, useState } from "react";
import mixpanel from "mixpanel-browser";
import { mixPanelToken } from "./config/config.js";
import PDFReaderPreview from "./Components/Editor/pdfViewer/pdfViewerPreview/Components/PDFReader";
import { SkeletonTheme } from "react-loading-skeleton";
import LoadingBar from "react-top-loading-bar"

// import fonts ---------------------
import "./fonts/Gilroy-Black.ttf";
import "./fonts/Gilroy-Bold.ttf";
import "./fonts/Gilroy-Medium.ttf";
import "./fonts/Gilroy-Light.ttf";
import "./fonts/Gilroy-SemiBold.ttf";
import "./fonts/Gilroy-Regular.ttf";

// Pages lazy loading or code spilliting -------------------
import ServiceState from "./Context/services/ServiceState"
import CreatorState from "./Context/CreatorState"
import UserState from "./Context/UserState"
import LinkedinState from "./Context/LinkedinState"
import FeedbackState from "./Context/FeedbackState"
import PaymentState from "./Context/PaymentState"
import EmailState from "./Context/EmailState"
import EPAState from "./Context/EPAState"
import UserDashboardState from "./Context/userdashbaord"
import { LoadThree } from "./Components/Modals/Loading";
import Seo from "./Utils/Seo"
import Main from "./Components/Main Page/Main"
import MainLanding from "./Components/Editor/New UI/Main Page/Main"
import Sample from "./Components/Editor/New UI/Sample Page/Sample"

const Creators_login = lazy(()=>import("./Components/Login/Creators/Login2"))
const Feedback = lazy(()=>import("./Components/Feedback/Feedback"))
const Privacy = lazy(()=>import("./Components/Privacy Policy/Privacy"))
const Logout_Model = lazy(()=>import("./Components/Modals/Logout_Model"))
const UserCount = lazy(()=>import("./Developers/Count/UserCount"))
const View = lazy(()=>import("./Developers/Dashboard/View"))
const Login = lazy(()=>import("./Developers/Login/Login"))
const Redirect_serv = lazy(()=>import("./Components/Redirect_serv"))
const Test = lazy(()=>import("./Components/Editor/Test"))
const Pricing = lazy(()=>import("./Components/Pricing/Pricing"))
const Sitemap = lazy(()=>import("./Components/sitemap/Sitemap"))
const Signup = lazy(()=>import("./Components/Signup/Signup"))
const ExcelViewer = lazy(()=>import("./Components/Editor/excelviewer/ExcelViewer"))
const PDFReader = lazy(()=>import("./Components/Editor/pdfViewer/Components/PDFReader"))
const VideoDisplay = lazy(()=>import("./Components/Editor/VideoDisplay/VideoDisplay"))
const HomeUI = lazy(()=>import("./Components/Editor/New UI/Home/Home"))
const Predictor = lazy(()=>import("./Components/Earning Potential/Predictor"))
const PredictorData = lazy(()=>import("./Components/Earning Potential/PredictorData"))
const Event = lazy(()=>import("./Components/Editor/New UI/Event Page/Event"))
const About = lazy(()=>import("./Components/Static pages/About"))
const RefundPolicy = lazy(()=>import("./Components/Static pages/Refund"))
const Contact = lazy(()=>import("./Components/Static pages/Contact"))
const TermsAndConditions = lazy(()=>import("./Components/Static pages/Terms"))
const Success = lazy(()=>import("./Components/Editor/New UI/Event Success Page/Success"))
const StaticSuccess = lazy(()=>import("./Components/Editor/New UI/Event Success Page/StaticSuccess"))
const ServicePage = lazy(()=> import ("./Components/Editor/New UI/Service Page/ServicePage"))
const ProfilePage = lazy(()=> import ("./Components/Editor/New UI/Creator Profile/ProfilePage"))
const PreviewPage = lazy(()=> import ("./Components/Editor/New UI/Service Page/PreviewPage"))
const Upload = lazy(()=> import ("./Developers/Upload/Upload"))
const Creator = lazy(()=> import ("./Components/ApprovedCreators/Creator.js"))
const EventPricing = lazy(()=> import ("./Components/Pricing/EventPricing"))
const UserDashboard2 = lazy(() => import('./Components/User Dashboard2/UserDashboard'));

mixpanel.init(mixPanelToken, { debug: true });

// Various script loading --------------
function loadGoogleTagManager() {
  // Create a script element
  const script = document.createElement('script');
  script.async = true;
  script.src = 'https://www.googletagmanager.com/gtag/js?id=G-LCHM48D5F0';

  // Add an onload callback to ensure the script has loaded
  script.onload = () => {
    // You can initialize Google Tag Manager or any other setup here
    // For example, initializing GTM:
    window.dataLayer = window.dataLayer || [];
    function gtag() {
      window.dataLayer.push(arguments);
    }
    gtag('js', new Date());
    gtag('config', 'G-LCHM48D5F0');
  };

  // Append the script to the document's head
  document.head.appendChild(script);
}

// Function to load Clarity
function loadClarity() {
  // Create a script element
  const script = document.createElement('script');
  script.type = 'text/javascript';
  script.async = true;
  script.innerHTML = `
    (function(c, l, a, r, i, t, y) {
      c[a] =
        c[a] ||
        function() {
          (c[a].q = c[a].q || []).push(arguments);
        };
      t = l.createElement(r);
      t.async = 1;
      t.src = 'https://www.clarity.ms/tag/h24wmzm6la';
      y = l.getElementsByTagName(r)[0];
      y.parentNode.insertBefore(t, y);
    })(window, document, 'clarity', 'script', 'h24wmzm6la');
  `;

  script.onload = function () {
    console.log('Clarity script loaded successfully.');
  };

  // Append the script to the document's head
  const head = document.getElementsByTagName('head')[0];
  head.appendChild(script);
}

function loadFontAwesome() {
  // Create a script element
  const script = document.createElement('script');
  script.src = 'https://kit.fontawesome.com/79f672096d.js';
  script.crossOrigin = 'anonymous';

  // Append the script to the document's head
  const head = document.getElementsByTagName('head')[0];
  head.appendChild(script);
}

// Function to load Easebuzz
function loadEasebuzz() {
  // Create a script element
  const script = document.createElement('script');
  script.src = 'https://ebz-static.s3.ap-south-1.amazonaws.com/easecheckout/easebuzz-checkout.js';

  // Append the script to the document's head
  const head = document.getElementsByTagName('head')[0];
  head.appendChild(script);
}

// Function to load Hotjar
function loadHotjar() {
  // Create a script element
  const script = document.createElement('script');
  script.type = 'text/javascript';
  script.async = true;
  script.innerHTML = `
    (function(h, o, t, j, a, r) {
      h.hj =
        h.hj ||
        function() {
          (h.hj.q = h.hj.q || []).push(arguments);
        };
      h._hjSettings = { hjid: 3256165, hjsv: 6 };
      a = o.getElementsByTagName('head')[0];
      r = o.createElement('script');
      r.async = 1;
      r.src = t + h._hjSettings.hjid + j + h._hjSettings.hjsv;
      a.appendChild(r);
    })(window, document, 'https://static.hotjar.com/c/hotjar-', '.js?sv=');
  `;

  script.onload = function () {
    console.log('Hotjar script loaded successfully.');
  };

  // Append the script to the document's head
  const head = document.getElementsByTagName('head')[0];
  head.appendChild(script);
}

function App() {
  const [progress, setprogress] = useState(0);


  // load script after the primary pages load ------------
  useEffect(() => {
    window.onload = function () {
      loadGoogleTagManager();
      loadClarity();
      loadFontAwesome();
      loadEasebuzz();
      loadHotjar();
    };
  }, []);


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
                            <Suspense fallback={<LoadThree/>}> 
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
                              {/* <Route
                                path="/feedback/workshop/:id"
                                element={
                                  <WorkshopFeedback progress={changeprogress} />
                                }
                              ></Route> */}
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
                            </Suspense>
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
