import mixpanel from "mixpanel-browser";
import React, { useEffect } from "react";
import { SuperSEO } from "react-super-seo";
import "./Signup.css";

function Signup() {

  // Visited page mix panel
  useEffect(() => {
    mixpanel.track("Visited Signup Page")

  }, [])


  return (
    <>
    <div className="signup_page">
      <div className="left_signup_side">
        <img
          className="logo_signup_page"
          src={require("../Main Page/Images/logo-beta.png")}
          alt=""
        />
        <img
          className="signup_img1"
          src={require("./images/signup1.png")}
          alt=""
        />
      </div>
      <div className="right_signup_side">
        <h1 className="signup_header_01">Great you are one step ahead</h1>
        <div>
          <div className="signup_points">
            <section>
              <img src={require("./images/img1.png")} alt="" />
              <span>
                Anchors is for exclusive creator only, and every creator has to
                cross benchmark to be on anchor.
              </span>
            </section>
            <section>
              <img src={require("./images/img2.png")} alt="" />
              <span>
                We prefer to Signup with invite code to ,this make process
                faster to get approved to be an anchor.
              </span>
            </section>
            <section>
              <img src={require("./images/img3.png")} alt="" />
              <span>
                Ask existing creator/anchor to share their invite code to join
                anchors or you have to wait for waitlist.
              </span>
            </section>
          </div>
          <div className="signup_buttons">
            <button>
            <i class="fa-brands fa-google fa-m"></i> Continue with Google
            </button>
            <button>
              <i class="fa-brands fa-linkedin-in fa-m"></i> Continue with LinkedIn
            </button>
          </div>
        </div>
      </div>
    </div>
    <SuperSEO
        title="Anchors - Signup Creators"
      />
    </>
  );
}

export default Signup;