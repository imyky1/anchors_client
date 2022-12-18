import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./Components/Home/Home";
import ServiceState from "./Context/services/ServiceState";
import Creators_login from "./Components/Login/Creators/Creators_login";
import Profile from "./Components/Creator Profile/Profile";
import CreatorState from "./Context/CreatorState";
import UserState from "./Context/UserState";
import Service from "./Components/Service Page/Service";
import { useState,useEffect } from "react";
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

mixpanel.init(mixPanelToken, { debug: true });


function App() {

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);


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
                    <LoadingBar color="#f11946" progress={progress} />
                    <Routes>
                      <Route
                        path="*"
                        element={<Home progress={changeprogress} />}
                      ></Route>
                      <Route path="/" element={<Main />}></Route>
                      <Route
                        exact
                        path="/c/:slug"
                        element={<Profile progress={changeprogress} />}
                      ></Route>
                      <Route
                        path="/s/:slug"
                        element={<Service progress={changeprogress} />}
                      ></Route>
                      <Route
                        path="/w/:slug"
                        element={<Workshop progress={changeprogress} />}
                      ></Route>

                      <Route
                        path="/privacy-policy"
                        element={<Privacy />}
                      ></Route>
                      <Route path="/pricing" element={<Pricing />}></Route>
                      <Route path="/waitlist" element={<Waitlist />}></Route>
                      <Route path="/r/:id" element={<Redirect_serv />}></Route>
                      <Route
                        path="/developer/count"
                        element={<UserCount />}
                      ></Route>
                      <Route path="/developer/admin" element={<View />}></Route>
                      <Route
                        path="/developer/login"
                        element={<Login />}
                      ></Route>
                      <Route path="/developer/test" element={<Test />}></Route>
                      <Route
                        path="/feedback"
                        element={<Feedback progress={changeprogress} />}
                      ></Route>
                      {localStorage.getItem("jwtToken") && (
                        <Route
                          path="/logout"
                          element={<Logout_Model progress={progress} />}
                        />
                      )}
                      <Route path="/login">
                        <Route
                          path="creators"
                          element={<Creators_login progress={changeprogress} />}
                        />
                      </Route>
                      <Route path="/sitemapac" element={<Sitemap />}></Route>
                    </Routes>
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
