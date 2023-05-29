import mixpanel from "mixpanel-browser";
import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { SuperSEO } from "react-super-seo";
import { host } from "../../config/config";
import "./Signup.css";
import { Swiper, SwiperSlide } from "swiper/react";
import { FcGoogle } from "react-icons/fc";
import { ImLinkedin2 } from "react-icons/im";

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";

import { Autoplay, Pagination } from "swiper";

function Signup() {
  // Visited page mix panel
  useEffect(() => {
    mixpanel.track("Visited Signup Page");
  }, []);

  const handleGoogle = async () => {
    localStorage.setItem("isUser", "");
    localStorage.setItem("from", "google");
    localStorage.setItem("authFor", "signUp");
    window.open(`${host}/google/auth`, "_self");
  };

  const handlelinkedin = async () => {
    localStorage.setItem("isUser", "");
    localStorage.setItem("from", "linkedin");
    localStorage.setItem("authFor", "signUp");
    window.open(`${host}/login/auth/linkedin`, "_self");
  };

  return (
    <>
      <div className="signup_page">
        <div className="left_signup_side">
          <Link to="/" style={{ textDecoration: "none", color: "unset" }}>
            <img
              className="logo_signup_page"
              src={require("../Main Page/Images/logo-beta.png")}
              alt=""
            />
          </Link>
          <span>TOP CREATORS</span>
          <Swiper
            spaceBetween={10}
            centeredSlides={true}
            loop={true}
            autoplay={{
              delay: 3500,
              disableOnInteraction: false,
            }}
            pagination={{
              clickable: true,
              // el: `swiper-container swiper-container-testClass`,
              bulletClass: `swiper-pagination-bullet swiper-pagination-testClass`,
            }}
            style={{ width: "100%" }}
            modules={[Autoplay, Pagination]}
            className="mySwiper"
          >
            <SwiperSlide>
              <img
                className="signup_img1"
                src={require("./images/illus1.png")}
                alt=""
              />
            </SwiperSlide>
            <SwiperSlide>
              <img
                className="signup_img1"
                src={require("./images/illus2.png")}
                alt=""
              />
            </SwiperSlide>
          </Swiper>
        </div>
        <div className="right_signup_side">
          <h2>Join <span style={{color:"red"}}>anchors</span></h2>
          <p>Tap into our thriving ecosystem to monetize your expertise and grow with our community</p>
          <div className="signup_buttons">
            <button onClick={handleGoogle}>
              <FcGoogle /> Continue with Google
            </button>
            <button onClick={handlelinkedin}>
              <ImLinkedin2 style={{color:"#2867B2"}}/> Continue with LinkedIn
            </button>
          </div>
        </div>
      </div>
      <SuperSEO title="Anchors - Signup Creators" />
    </>
  );
}

export default Signup;
