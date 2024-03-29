import React, { useState } from "react";
import "./Footer.css";
import "../Editor/New UI/Main Page/Main.css";
import { Link, useNavigate } from "react-router-dom";
import mixpanel from "mixpanel-browser";
import HelpModal from "../Modals/ModalType01/HelpModal";
import nine from "../Editor/New UI/Main Page/home_images/nine.webp";
import tenth from "../Editor/New UI/Main Page/home_images/tenth.webp";
import anchor from "../../Utils/Images/logo-invite-only.png";
import anchorEvents from "../../Utils/Images/logo-events.png";
import { MdEventSeat } from "react-icons/md";
//import { Modal, Fade, Typography, Box, Backdrop } from "@mui/material";

function Footer() {
  const navigate = useNavigate();

  const [openHelpModal, setopenHelpModal] = useState(false);

  return (
    <>
      <HelpModal
        open={openHelpModal}
        toClose={() => {
          setopenHelpModal(false);
        }}
      />
      <div className="main_footer_section">
        <div>
          {window.screen.width > 600 && (
            <img
              className="logo_footer"
              src={require("../Main Page/Images/logo-beta.png")}
              onClick={() => {
                mixpanel.track("footer logo");
              }}
              alt=""
            />
          )}
          <section className="upper_footer_section">
            <div className="anchors_details">
              {/* <span>Monetize your <span style={{color: "rgb(255 255 255)",fontWeight: "600"}}>Content, skill, Expertise</span> and help your audience to grow.</span> */}
              <span>
                An invite-only exclusive platform for premium creators
              </span>
              <button
                onClick={() => {
                  navigate("/login/creators");
                  mixpanel.track("join anchors footer");
                }}
              >
                Join Exclusive Community
              </button>
            </div>
            <div className="footer_support_menu">
              {window.location.pathname !== "/aboutUs" && (
                <Link
                  to="/aboutUs"
                  target="_blank"
                  rel="no_referrer"
                  onClick={() => {
                    mixpanel.track(
                      "Clicked about us in footer from Landing Page"
                    );
                  }}
                >
                  About Us
                </Link>
              )}

              {window.location.pathname !== "/pricing" && (
                <Link
                  to="/pricing"
                  target="_blank"
                  rel="no_referrer"
                  onClick={() => {
                    mixpanel.track(
                      "Clicked Pricing in footer from Landing Page"
                    );
                  }}
                >
                  Pricing
                </Link>
              )}

              {window.location.pathname !== "/contactUs" && (
                <Link
                  to="/contactUs"
                  target="_blank"
                  rel="no_referrer"
                  onClick={() => {
                    mixpanel.track(
                      "Clicked contact us in footer from Landing Page"
                    );
                  }}
                >
                  Contact Us
                </Link>
              )}

              {window.location.pathname !== "/refundPolicy" && (
                <Link
                  to="/refundPolicy"
                  target="_blank"
                  rel="no_referrer"
                  onClick={() => {
                    mixpanel.track(
                      "Clicked refund policy in footer from Landing Page"
                    );
                  }}
                >
                  Refund Policy
                </Link>
              )}

              {window.location.pathname !== "/privacy-policy" && (
                <Link
                  to="/privacy-policy"
                  target="_blank"
                  rel="no_referrer"
                  onClick={() => {
                    mixpanel.track(
                      "Clicked Privacy policy in footer from Landing Page"
                    );
                  }}
                >
                  Privacy Policy
                </Link>
              )}

              {window.location.pathname !== "/termsConditions" && (
                <Link
                  to="/termsConditions"
                  target="_blank"
                  rel="no_referrer"
                  onClick={() => {
                    mixpanel.track(
                      "Clicked Terms and Condition in footer from Landing Page"
                    );
                  }}
                >
                  Terms & Conditions
                </Link>
              )}

              {/* <span onClick={(e)=>{e?.stopPropagation(); mixpanel.track("Clicked on Help in Landing Page");
                 setopenHelpModal(true)}}>Help & Support</span> */}

              {/* <Link to="/privacy-policy" target="_blank" rel="no_referrer">
                Terms & Conditions
              </Link> */}
              {/* <a
                href="https://www.linkedin.com/company/beanchorite/"
                target="_blank"
                rel="no_referrer"
              >
                Linkedin
              </a> */}
            </div>
            {window.screen.width < 600 && (
              <img
                className="logo_footer"
                src={require("../Main Page/Images/logo-beta.png")}
                onClick={() => {
                  mixpanel.track("footer logo");
                }}
                alt=""
              />
            )}
          </section>
          <section className="some_extra">
            <i
              className="fa-brands fa-linkedin-in fa-xl"
              style={{
                cursor: "pointer",
                color: "white",
                marginBottom: "15px",
              }}
              onClick={() => {
                window.open("https://www.linkedin.com/company/beanchorite/");
              }}
            ></i>
            <span>Anchors.in All rights reserved</span>
            {/* {window.screen.width > 600 && <span style={{textDecoration:"underline",cursor:"pointer"}} onClick={()=>{window.open("/termsConditions");mixpanel.track("Privacy policy")}}>Terms of use</span>} */}
          </section>
        </div>
        <section className="lower_footer_section">
          2023 &#169; &nbsp; anchors.in &nbsp; Made in &nbsp;{" "}
          <img
            className="india_logo"
            src={require("./India-logo.png")}
            alt="India"
          />
        </section>
      </div>
    </>
  );
}

export const MainNewFooter = ({
  handleButton,
  footerOptions1,
  noPrivacyPolicy = true,
  noRefund = true,
  onEvents = false, //
  useEventsLogo = false,
  hostEventButton = false,
}) => {
  return (
    <>
      <div
        className="home_page_outer_first_body3"
        style={{
          backgroundImage: `url(${
            window.screen.width > 600 && !onEvents ? nine : tenth
          })`,
        }}
      >
        <div className="home_page_outer_nine_body_020">anchors</div>
        {hostEventButton && <button
          onClick={() => {
            window.open("/hostevent", "_self");
            mixpanel.track("Host Your Own Event footer");
          }}
        >
          <MdEventSeat /> Host Your Own Event
        </button>}
        <div className="home_page_outer_nine_body_0201">
          {!footerOptions1 ? (
            <div className="home_page_outer_nine_body_021">
              <div
                className="home_page_outer_nine_body_021_individual"
                onClick={() => {
                  window.open("https://events.anchors.in/");
                }}
              >
                Events
              </div>
              <div
                className="home_page_outer_nine_body_021_individual"
                onClick={() => {
                  window.open("/earning-predictor");
                }}
              >
                EPA
              </div>
              {window.location.pathname !== "/pricing" && (
                <div
                  className="home_page_outer_nine_body_021_individual"
                  onClick={() => {
                    window.open("/pricing");
                  }}
                >
                  Pricing
                </div>
              )}
            </div>
          ) : (
            <div className="home_page_outer_nine_body_021">
              {footerOptions1?.map((e, i) => {
                return (
                  <div
                    className="home_page_outer_nine_body_021_individual"
                    onClick={() => {
                      window.open(e?.link);
                    }}
                  >
                    {e?.title}
                  </div>
                );
              })}
            </div>
          )}

          <div className="home_page_outer_nine_body_022">
            {noPrivacyPolicy &&
              window.location.pathname !== "/privacy-policy" && (
                <div
                  className="home_page_outer_nine_body_0212_individual"
                  onClick={() => {
                    window.open("/privacy-policy");
                  }}
                >
                  Privacy Policy
                </div>
              )}
            {window.location.pathname !== "/termsConditions" && (
              <div
                className="home_page_outer_nine_body_0212_individual"
                onClick={() => {
                  window.open("/termsConditions");
                }}
              >
                Terms & Conditions
              </div>
            )}
            {window.location.pathname !== "/aboutUs" && (
              <div
                className="home_page_outer_nine_body_0212_individual"
                onClick={() => {
                  window.open("/aboutUs");
                }}
              >
                About Us
              </div>
            )}
            {window.location.pathname !== "/contactUs" && (
              <div
                className="home_page_outer_nine_body_0212_individual"
                onClick={() => {
                  window.open("/contactUs");
                }}
              >
                Contact Us
              </div>
            )}
            {noRefund && window.location.pathname !== "/refundPolicy" && (
              <div
                className="home_page_outer_nine_body_0212_individual"
                onClick={() => {
                  window.open("/refundPolicy");
                }}
              >
                Refund Policy
              </div>
            )}
          </div>
          {handleButton && (
            <button
              className="home_page_outer_fifth_body_03_middle_down_button"
              onClick={() => {
                handleButton();
                mixpanel.track("join anchors footer");
              }}
            >
              Join Our Exclusive Community
            </button>
          )}
          <img
            src={useEventsLogo ? anchorEvents : anchor}
            style={{
              width: window.screen.width > 600 ? "161.464px" : "81px",
              margin: "0 auto",
              marginTop: window.screen.width > 600 ? "40px" : "10px",
              cursor: "pointer",
              height: window.screen.width > 600 ? "44px" : "24px",
            }}
          />
        </div>
      </div>
    </>
  );
};

export default Footer;
