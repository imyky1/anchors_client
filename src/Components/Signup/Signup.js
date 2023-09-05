import mixpanel from "mixpanel-browser";
import React, { useEffect, useState } from "react";
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

import { Autoplay, Pagination } from "swiper/modules";
import { ToastContainer, toast } from "react-toastify";

function Signup() {
  const [agreeterms, setAgreeTerms] = useState(false);

  // Visited page mix panel
  useEffect(() => {
    mixpanel.track("Visited Signup Page");
  }, []);

  const handleGoogle = async () => {
    if (agreeterms) {
      mixpanel.track("Google signup");
      localStorage.setItem("isUser", "");
      localStorage.setItem("from", "google");
      localStorage.setItem("authFor", "signUp");
      window.open(`${host}/google/auth`, "_self");
    } else {
      toast.info("Agree the terms and conditions to continue", {
        position: "top-center",
        autoClose: 2000,
      });
    }
  };

  const handlelinkedin = async () => {
    if (agreeterms) {
      mixpanel.track("Linkedin signup");
      localStorage.setItem("isUser", "");
      localStorage.setItem("from", "linkedin");
      localStorage.setItem("authFor", "signUp");
      window.open(`${host}/login/auth/linkedin`, "_self");
    } else {
      toast.info("Agree the terms and conditions to continue", {
        position: "top-center",
        autoClose: 2000,
      });
    }
  };

  if (
    localStorage.getItem("jwtToken") &&
    localStorage.getItem("isUser") === ""
  ) {
    window.open("/dashboard", "_self");
    return null;
  }

  return (
    <>
      <div className="signup_page">
        <div className="left_signup_side">
          <Link to="/" style={{ textDecoration: "none", color: "unset" }}>
            <img
              className="logo_signup_page"
              src={require("../../Utils/Images/logo-invite-only.png")}
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
          <h2>
            Join <span style={{ color: "red" }}>anchors</span>
          </h2>
          <p>
            Tap into our thriving ecosystem to monetize your expertise and grow
            with our community
          </p>
          <div className="signup_buttons">
            <button onClick={handleGoogle}>
              <FcGoogle /> Continue with Google
            </button>
            <button onClick={handlelinkedin}>
              <ImLinkedin2 style={{ color: "#2867B2" }} /> Continue with
              LinkedIn
            </button>
          </div>
          <div className="terms_cond_check_signup">
            <input
              type="checkbox"
              name="t&c"
              id="t&c"
              onChange={(e) => {
                setAgreeTerms(e?.target?.checked);
              }}
            />
            <label htmlFor="t&c">
              To proceed, kindly check the box to indicate your agreement with
              our{" "}
              <span
                style={{
                  textDecoration: "underLine",
                  color: "black",
                  cursor: "pointer",
                }}
                onClick={() => {
                  window.open("/termsConditions");
                }}
              >
                terms and conditions.
              </span>
            </label>
          </div>
        </div>
      </div>

      <ToastContainer />
      
      <SuperSEO title="Anchors - Signup Creators" />
    </>
  );
}

export default Signup;
