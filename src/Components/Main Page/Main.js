import React, { useEffect } from "react";
import "./Main.css";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { Swiper, SwiperSlide } from "swiper/react";


// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import PNGIMG from "./default_profile.png";
import { Autoplay, Pagination } from "swiper";
import { useContext } from "react";
import { feedbackcontext } from "../../Context/FeedbackState";
import mixpanel from "mixpanel-browser";
import Footer from "../Footer/Footer";

function Main() {
  const [data, setData] = useState("");
  const navigate = useNavigate();
  const [platform, setPlatform] = useState("Choose Platform");
  const [followers, setFollowers] = useState();
  const [showResult, setShowResult] = useState(false);
  const [result, setResult] = useState(false);

  const { getallfb } = useContext(feedbackcontext);

  

  const handleChange = (e) => {
    setPlatform(e.target.value);
  };

  const handleCheckEligibility = () => {
    mixpanel.track("Clicked Check Eligibility on Anchors Main Page");
    if (platform !== "Choose Platform" && parseInt(followers) > 0) {
      mixpanel.track("Eligibility on Anchors Main Page",{
        platform:platform,
        followers:followers
      });
      if (platform === "youtube") {
        if (parseInt(followers) >= 5000) {
          setResult(true);
        } else {
          setResult(false);
        }
      } else if (platform === "insta") {
        if (parseInt(followers) >= 10000) {
          setResult(true);
        } else {
          setResult(false);
        }
      } else if (platform === "telegram") {
        if (parseInt(followers) >= 2000) {
          setResult(true);
        } else {
          setResult(false);
        }
      } else if (platform === "linkedin") {
        if (parseInt(followers) >= 10000) {
          setResult(true);
        } else {
          setResult(false);
        }
      }
      setShowResult(true);
    } else {
      toast.info("Fill all the mandatory fields", {
        position: "top-center",
        autoClose: 3000,
      });
    }
  };

  useEffect(() => {
    getallfb().then((e) => {
      setData(e);
    });
  }, []);

  // Visited page mix panel
  useEffect(() => {
    mixpanel.track("Visited Main Page")

  }, [])

  return (
    <>
      <div className="main_creator_page">
        <div className="mainpage_header creator_login_header ">
          <div className="logo">
            <LazyLoadImage effect="blur" src={require("../logo.png")} alt="Logo" />
            <span>anchors</span>
            <p className="beta_tagname">beta</p>
          </div>
          <Link
            to={
              localStorage.getItem("jwtToken")
                ? "/dashboard"
                : "/login/creators"
            }
          >
            <button
              className="waitlist"
              style={{
                backgroundColor: "black",
                color: "white",
                border: "2px solid black",
              }}
            >
              {localStorage.getItem("jwtToken") &&
              localStorage.getItem("isUser") === ""
                ? "My Account"
                : "Login as Creator"}
            </button>
          </Link>
        </div>

        <div className="main_page_contents">
          <section className="hero">
            <div className="leftHero">
              <h1>
                Become <span className="stressWord">anchor</span>
              </h1>
              <p>
                & Start Monetizing your
                <br /> <b>Content</b>, <b>Skills</b>, <b>Expertise</b>
                <br /> and help your audience to grow
              </p>
              <a href="#eligibility">
                <button>Check Eligibility</button>
              </a>
            </div>
            <div className="rightHero">
              <img src={require("../main2.png")} alt="" />
            </div>
          </section>

          <section className="whyanchors">
            <div className="mainheaders1">
              <h2>Why to be an anchor</h2>
              <span>
                Get access of full stack solution to monitise and help your
                audience
              </span>
            </div>
            <div className="features">
              <div>
                <i class="fa-solid fa-dollar-sign fa-2x"></i>
                <h2 className="main_headers2">Offer Free / Paid Services</h2>
                <p>
                  Offer paid service to your follower/audience ( content,
                  workshop etc. )
                </p>
              </div>
              <div>
                <i class="fa-solid fa-chart-simple fa-2x"></i>
                <h2 className="main_headers2">Detailed Analysis</h2>
                <p>Detailed Analysis Report for Services and Audiences</p>
              </div>
              <div>
                <i class="fa-solid fa-hand-holding-dollar fa-2x"></i>
                <h2 className="main_headers2">Collect Payment</h2>
                <p>Accept Payment directly from audience</p>
              </div>
              <div>
                <i class="fa-regular fa-comment-dots fa-2x"></i>
                <h2 className="main_headers2">Communication with audience</h2>
                <p>
                  Communicate wth your audience and let them know your next
                  service
                </p>
              </div>
              <div>
                <i class="fa-regular fa-circle-question fa-2x"></i>
                <h2 className="main_headers2">Know your audience demand</h2>
                <p>
                  Allow your audience to connect with you and let you know what
                  they want
                </p>
              </div>
              <div>
                <i class="fa-solid fa-users-line fa-2x"></i>
                <h2 className="main_headers2">Premium Community</h2>
                <p>Become a part of Premium Creator Community</p>
              </div>
            </div>
          </section>

          <section className="featuredcreators">
            <Swiper
              pagination={{
                dynamicBullets: true,
              }}
              //autoplay={{
              //  delay: 2500,
              //  disableOnInteraction: false,
              //}}
              loop={true}
              modules={[Autoplay, Pagination]}
              className="mySwiper"
            >
              {/* <SwiperSlide><div className="creatordetails">
            <img
              src="https://cdn.hswstatic.com/gif/play/0b7f4e9b-f59c-4024-9f06-b3dc12850ab7-1920-1080.jpg"
              alt=""
            />
            <div className="main_creator">
              <h2>Himanshu Kumar</h2>
              <span>78K+ Followers on LinkedIn</span>
              <div className="social_main">
                <i className="fa-brands fa-linkedin fa-xl"></i>
                <i className="fa-brands fa-telegram fa-xl "></i>
                <i className="fa-brands fa-instagram fa-xl "></i>
                <i className="fa-brands fa-twitter fa-xl "></i>
                <i className="fa-brands fa-facebook fa-xl "></i>
              </div>
              <button>View Anchor Profile</button>
            </div>
          </div></SwiperSlide> */}
              <SwiperSlide>
                <div className="creatordetails">
                  <img src={require("../himanshu.jpg")} alt="" />
                  <div className="main_creator">
                    <h2>Himanshu Shekhar</h2>
                    <span>47K+ Followers on LinkedIn</span>
                    <div className="social_main">
                      <a
                        href="https://www.linkedin.com/in/himanshushekhar16/"
                        target="_black"
                        rel="no_referrer"
                        style={{ color: "black" }}
                      >
                        <i className="fa-brands fa-linkedin fa-xl"></i>
                      </a>
                      <a
                        href="https://www.instagram.com/himanshushekhar_official/"
                        target="_black"
                        rel="no_referrer"
                        style={{ color: "black" }}
                      >
                        <i className="fa-brands fa-instagram fa-xl "></i>
                      </a>
                      <a
                        href="https://mobile.twitter.com/hszone07"
                        target="_black"
                        rel="no_referrer"
                        style={{ color: "black" }}
                      >
                        <i className="fa-brands fa-twitter fa-xl "></i>
                      </a>
                    </div>
                    <button
                      onClick={() => {
                        mixpanel.track(
                          "Clicked Featured creators on Anchors Main Page",
                          { creator: "Himanshu Shekhar" }
                        );
                        window.open("/c/himanshu-shekhar", "_blank");
                      }}
                    >
                      View Anchor Profile
                    </button>
                  </div>
                </div>
              </SwiperSlide>
            </Swiper>
          </section>

          <section className="proceedwithanchors">
            <div className="mainheaders1">
              <h2>How do we proceed</h2>
            </div>
            <div className="proceed_steps">
              <div>
                <span>
                  <i class="fa-solid fa-hands-clapping fa-2x"></i>
                </span>
                <p>Apply to be anchor</p>
              </div>
              <div>
                <span>
                  <i class="fa-solid fa-user-check fa-2x"></i>
                </span>
                <p>We will review your social Profile</p>
              </div>
              <div>
                <span>
                  <i class="fa-solid fa-handshake fa-2x"></i>
                </span>
                <p>Proud to be an anchor</p>
              </div>
            </div>
          </section>

          <section className="checkeligibility" id="eligibility">
            <h1>Stand out and get a chance to be an anchor</h1>
            <span>I am influencer/creator at</span>
            <div className="input_eligibility">
              <select value={platform} onChange={handleChange}>
                <option default disabled>
                  Choose Platform
                </option>
                <option value="linkedin">LinkedIn</option>
                <option value="youtube">Youtube</option>
                <option value="telegram">Telegram</option>
                <option value="insta">Instagram</option>
              </select>
              <input
                type="number"
                placeholder="Number of Followers"
                value={followers}
                onChange={(e) => {
                  setFollowers(e.target.value);
                }}
              />
              <button onClick={handleCheckEligibility}>
                Check Eligibility
              </button>
            </div>
            {showResult ? (
              <div className="eligibilityresult">
                {result ? (
                  <>
                    <span style={{ color: "#0DD70D" }}>
                      Congratulation you are eligible to be an anchor
                    </span>
                    <button
                      onClick={() => {
                        navigate("/login/creators");
                      }}
                    >
                      Apply to be anchor
                    </button>
                  </>
                ) : (
                  <>
                    <span style={{ color: "#6A6161" }}>
                      oops, seems like you are not matched criteria to be anchor
                    </span>
                    <button
                      onClick={() => {
                        window.location =
                          "https://izsxcwa0cfw.typeform.com/to/R9poKEJD";
                      }}
                    >
                      Join wishlist
                    </button>
                  </>
                )}
              </div>
            ) : (
              ""
            )}
          </section>

          <section className="walloflove">
            <div className="mainheaders1">
              <h2>Wall of love</h2>
              <span>Love from audience to their anchor</span>
            </div>
            <div className="feedbacks_mainpage">
              {data
                ? data
                    ?.filter((e1) => {
                      return e1?.userID?.name;
                    })
                    .map((e, i) => {
                      return (
                        <div>
                          <p>{e?.desc}</p>
                          <div className="user_details_fb_main">
                            {e?.userID.photo ===
                            "https://media-exp1.licdn.com/dms/image/C5603AQHbuisFLZQv7w/profile-displayphoto-shrink_100_100/0/1597657855604?e=1673481600&v=beta&t=tMsAXmN2WayqLTDKFPl3ZuugC7vsoBXdNJ2KeK-lN88" ? (
                              <LazyLoadImage src={PNGIMG} alt="" />
                            ) : (
                              <LazyLoadImage src={e?.userID?.photo} alt="" />
                            )}

                            <span>
                              {e?.userID?.name ? e?.userID?.name : "unknown"}
                            </span>
                          </div>
                        </div>
                      );
                    })
                : ""}
            </div>
          </section>
        </div>
      </div>
      <Footer/>
      <ToastContainer />

      
    </>
  );
}

export default Main;
