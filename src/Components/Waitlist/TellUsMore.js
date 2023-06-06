import React, { useContext, useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "./Waitlist.css";
import { SuperSEO } from "react-super-seo";
import { toast, ToastContainer } from "react-toastify";
import { creatorContext } from "../../Context/CreatorState";
import mixpanel from "mixpanel-browser";
import SignupModal from "../Modals/ModalType01/SignupModal";
import Confetti from "react-confetti";
import InviteModal from "../Modals/ModalType01/InviteModal";
import { Swiper, SwiperSlide } from "swiper/react";
import {
  IoIosArrowDown,
  IoIosArrowForward,
  IoIosArrowUp,
} from "react-icons/io";
import { AiOutlineArrowLeft, AiOutlineCheck } from "react-icons/ai";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

import { Autoplay, Navigation, Pagination } from "swiper";
import Navbar from "../Layouts/Navbar Creator/Navbar";

// Intro tell us more -------------
const IntroTellUsMore = ({ nextClick }) => {
  return (
    <div className="intro_tellUsMore">
      <h1>
        Hello, Creator <br /> You are just a Step Away!{" "}
      </h1>
      <p>
        Many creators are already applying to join anchors. Jump the queue and
        get approved faster by letting us know you better.
      </p>
      <button onClick={nextClick}>Let me jump the Queue</button>
      <span>*it takes 30seconds</span>
    </div>
  );
};

// Subcomponent fields ----------
const DropdownField = ({ question, dropdownData, selectedDropdownValue }) => {
  const [openDropdown, setOpenDropdown] = useState(false);
  const [dropdownValue, setDropdownValue] = useState("");

  return (
    <section className="form_fields_tellusmore">
      <label>{question}</label>

      <section
        onClick={(e) => {
          e?.stopPropagation();
          setOpenDropdown(!openDropdown);
        }}
        className="Dropdown_input_wrapper_tellUsMore"
      >
        <input
          className="input_form_tellUsMore"
          type="text"
          disabled={true}
          value={dropdownValue}
        />
        {openDropdown ? <IoIosArrowUp /> : <IoIosArrowDown />}
      </section>

      {openDropdown && (
        <div className="dropdown_tellUsMore">
          {dropdownData?.map((e, i) => {
            return (
              <span
                key={i}
                className="normal_span_dropdown_tell_us_more"
                onClick={() => {
                  setDropdownValue(e);
                  setOpenDropdown(false);
                  selectedDropdownValue(e);
                }}
              >
                {e}
              </span>
            );
          })}
        </div>
      )}
    </section>
  );
};

const FormTellUsMore = ({ prevClick, setVerifiedCodeModal }) => {
  const navigate = useNavigate();
  const [qNo, setQNo] = useState(1); // keeps the qno
  const [verifiedCode, setVerifiedCode] = useState(false);
  const [incorrectCode, setIncorrectCode] = useState(false);
  const [formAlreadyFilled, setFormAlreadyFilled] = useState(false);
  const [formPassed, setFormPassed] = useState(false);
  const [formData, setformData] = useState({
    inviteCode: "",
    contactNumber: 0,
    platform: "",
    followers: 0,
    socialLink: "",
    knownFrom: "",
  });

  //  Contexts -------------------
  const {
    verifyInviteCode,
    fillTellUsMoreForm,
    getTellUsMoreFormData,
    updateStatus,
  } = useContext(creatorContext);

  // handles already sent data
  useEffect(() => {
    getTellUsMoreFormData().then((e) => {
      if (e?.success && e?.already) {
        setformData(e?.form);
        setFormAlreadyFilled(true);
        toast.info("You have already filled the form", {
          position: "top-center",
          autoClose: 2000,
        });
        setTimeout(() => {
          navigate("/dashboard");
        }, 3000);
      }
    });
  }, []);

  const handlePrevButton = () => {
    if (qNo === 1) {
      prevClick();
    } else {
      setQNo(qNo - 1);
    }
  };

  const handleChange = (e) => {
    setformData({ ...formData, [e.target.name]: e.target.value });
    if (e.target.name === "inviteCode") {
      setVerifiedCode(false);
      setIncorrectCode(false);
    }
  };

  const VerifyCode = () => {
    mixpanel.track("Verify invite code");
    if (formData?.inviteCode) {
      let process = verifyInviteCode(formData.inviteCode).then((e) => {
        if (e?.success) {
          if (e?.verified) {
            setVerifiedCode(true);
            setVerifiedCodeModal(true);
          } else {
            setIncorrectCode(true);
          }
        } else {
          toast.error(
            "Some error occured while checking, fill the form normally",
            {
              position: "top-center",
              autoClose: 1500,
            }
          );
        }
      });

      toast.promise(
        process,
        {
          pending: "Please Wait..",
          error: "Try Again by reloading the page!",
        },
        {
          position: "top-center",
          autoClose: 2000,
        }
      );
    }
  };

  const handleSubmit = async () => {
    try {
      if (
        formData.contactNumber?.toString().length > 1 &&
        formData.platform !== "" &&
        formData.followers?.toString().length > 1 &&
        formData.socialLink !== "" &&
        formData.knownFrom !== ""
      ) {
        // if (
        //   verifiedCode ||
        //   formData.inviteCode === ""
        // ) {
        fillTellUsMoreForm(
          // saving the data in tell us more in database
          verifiedCode ? formData?.inviteCode?.toUpperCase() : "",
          formData?.contactNumber,
          formData?.platform,
          formData?.followers,
          formData?.socialLink,
          formData?.knownFrom
        ).then((e) => {
          if (e?.success) {
            switch (formData?.platform) {
              case "LinkedIn":
                if (parseInt(formData?.followers) > 10000 && verifiedCode) {
                  updateStatus().then((e) => {
                    setFormPassed(true);
                  });
                } else {
                  window.open("/waitlist", "_self");
                }
                break;
              case "Youtube":
                if (parseInt(formData?.followers) > 10000 && verifiedCode) {
                  updateStatus().then((e) => {
                    setFormPassed(true);
                  });
                } else {
                  window.open("/waitlist", "_self");
                }
                break;
              case "Instagram":
                if (parseInt(formData?.followers) > 10000 && verifiedCode) {
                  updateStatus().then((e) => {
                    setFormPassed(true);
                  });
                } else {
                  window.open("/waitlist", "_self");
                }
                break;
              case "Telegram":
                if (parseInt(formData?.followers) > 5000 && verifiedCode) {
                  updateStatus().then((e) => {
                    setFormPassed(true);
                  });
                } else {
                  window.open("/waitlist", "_self");
                }
                break;
              case "Facebook":
                if (parseInt(formData?.followers) > 5000 && verifiedCode) {
                  updateStatus().then((e) => {
                    setFormPassed(true);
                  });
                } else {
                  window.open("/waitlist", "_self");
                }
                break;

              default:
                break;
            }
          } else {
            toast.error("Form not saved, Please try again", {
              position: "top-center",
              autoClose: 1500,
            });
          }
        });
        // } else {
        //   toast.info("Enter a correct invite code and verify", {
        //     position: "top-center",
        //     autoClose: 2500,
        //   });
        // }
      } else {
        toast.info("Please fill all the mandatory fields", {
          position: "top-center",
          autoClose: 2500,
        });
      }
    } catch (error) {
      toast.error("Some error occured! Please try again or ask for help", {
        position: "top-center",
        autoClose: 3000,
      });
    }
  };

  return (
    <>
      {formPassed && (
        <>
          <SignupModal />
          <Confetti width={window.screen.width} height={window.screen.height} />
        </>
      )}

      <div
        className="tellUsMore_form"
        onKeyDown={(e) => {
          e.keyCode === 9 &&
            // Prevent default action of Tab key
            e.preventDefault();
        }}
      >
        <AiOutlineArrowLeft
          id="prev_ques_slide_button"
          onClick={handlePrevButton}
        />
        <h1>You are increasing your chances of getting approved.</h1>
        <p>QUESTIONS {qNo} OF 6</p>

        <div>
          <Swiper
            navigation={{
              nextEl: "#next_ques_slide_button",
              prevEl: "#prev_ques_slide_button",
            }}
            className="mySwiper"
            spaceBetween={1000}
            allowTouchMove={false}
            modules={[Navigation]}
            style={{ width: "100%", minHeight: "130px" }}
          >
            <SwiperSlide>
              <section className="form_fields_tellusmore">
                <label htmlFor="contactNumber">Your Whatsapp number</label>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    position: "relative",
                  }}
                >
                  <span className="placeholder_Number_tellUsMore">+91-</span>
                  <input
                    className="input_form_tellUsMore"
                    style={{ paddingLeft: "50px" }}
                    type="number"
                    name="contactNumber"
                    id="contactNumber"
                    onChange={handleChange}
                    value={
                      formData?.contactNumber !== 0 && formData?.contactNumber
                    }
                  />
                </div>
              </section>
            </SwiperSlide>
            <SwiperSlide>
              <DropdownField
                question="On which platform do you have the strongest presence as a creator or influencer?"
                dropdownData={[
                  "Instagram",
                  "LinkedIn",
                  "Telegram",
                  "Youtube",
                  "Other",
                ]}
                selectedDropdownValue={(e) => {
                  setformData({ ...formData, platform: e });
                }}
              />
            </SwiperSlide>
            <SwiperSlide>
              <section className="form_fields_tellusmore">
                <label htmlFor="followers">What’s your Size of audience?</label>
                <input
                  className="input_form_tellUsMore"
                  type="number"
                  name="followers"
                  id="followers"
                  value={formData?.followers !== 0 && formData?.followers}
                  onChange={handleChange}
                />
              </section>
            </SwiperSlide>
            <SwiperSlide>
              <section className="form_fields_tellusmore">
                <label htmlFor="socialLink">Your Profile Link</label>
                <input
                  className="input_form_tellUsMore"
                  type="text"
                  id="socialLink"
                  name="socialLink"
                  value={formData?.socialLink}
                  onChange={handleChange}
                />
              </section>
            </SwiperSlide>
            <SwiperSlide>
              <DropdownField
                question="How did you discover us ?"
                dropdownData={[
                  "Friends",
                  "Creators",
                  "Social media platorms",
                  "Google",
                  "Other",
                ]}
                selectedDropdownValue={(e) => {
                  setformData({ ...formData, knownFrom: e });
                }}
              />
            </SwiperSlide>
            <SwiperSlide>
              <section className="form_fields_tellusmore">
                <label htmlFor="inviteCode">
                  Enter your Invite Code <span>(Optional)</span>
                </label>
                <div className="input_section_tellUsMore">
                  <section
                    style={{
                      display: "flex",
                      alignItems: "center",
                      position: "relative",
                    }}
                  >
                    <input
                      className="input_form_tellUsMore"
                      type="text"
                      id="inviteCode"
                      name="inviteCode"
                      onChange={handleChange}
                      value={formData?.inviteCode}
                    />
                    {verifiedCode && (
                      <AiOutlineCheck
                        color="#58D96E"
                        style={{ position: "absolute", right: "10px" }}
                      />
                    )}
                  </section>
                  <button
                    className="verify_tellusmore"
                    onClick={!verifiedCode ? VerifyCode : undefined}
                  >
                    {!verifiedCode ? "Verify" : "Verified"}
                  </button>
                </div>
                <div className="wrong_code_tellUsMore">
                  <p
                    onClick={() => {
                      window.open("https://bit.ly/anchors-invite-code");
                      mixpanel.track("redirect to notion link");
                    }}
                  >
                    KNOW ABOUT INVITE CODE
                  </p>
                  {incorrectCode && <span>*Wrong Code</span>}
                </div>
              </section>
            </SwiperSlide>
          </Swiper>
        </div>

        <span
          style={qNo === 6 ? { display: "none" } : {}}
          id="next_ques_slide_button"
          onClick={(e) => {
            setQNo(qNo + 1);
          }}
        >
          <IoIosArrowForward />
        </span>

        {qNo === 6 && !formAlreadyFilled && (
          <button className="tellUsMore_submitbutton" onClick={handleSubmit}>
            Submit
          </button>
        )}
      </div>
    </>
  );
};

function TellUsMore() {
  const [tackleIntro, setTackleIntro] = useState(true);

  // Visited page mix panel
  useEffect(() => {
    mixpanel.track("Visited Tell us more Page");
  }, []);

  const [verifiedCodeModal, setVerifiedCodeModal] = useState(false);

  if (!localStorage.getItem("jwtToken") || !localStorage.getItem("c_id")) {
    window.open("/", "_self");
    return null;
  }

  return (
    <>
      <ToastContainer />
      {verifiedCodeModal && (
        <InviteModal toClose={() => setVerifiedCodeModal(false)} />
      )}

      <div
        className={
          window.screen.width > 600 ? `signup_page` : `tellUsMoreMobilePage`
        }
      >
        {window.screen.width > 600 ? (
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
                  src={require("../Signup/images/illus1.png")}
                  alt=""
                />
              </SwiperSlide>
              <SwiperSlide>
                <img
                  className="signup_img1"
                  src={require("../Signup/images/illus2.png")}
                  alt=""
                />
              </SwiperSlide>
            </Swiper>
          </div>
        ) : (
          <Navbar noAccount={true} />
        )}

        <div
          className={
            window.screen.width > 600 ? `right_signup_side` : `right_tellUSmore`
          }
        >
          {/* Intro section tell us more */}
          {tackleIntro && (
            <IntroTellUsMore
              nextClick={() => {
                setTackleIntro(false);
              }}
            />
          )}

          {!tackleIntro && (
            <FormTellUsMore
              prevClick={() => {
                setTackleIntro(true);
              }}
              setVerifiedCodeModal={(bool) => {
                setVerifiedCodeModal(bool);
              }}
            />
          )}
        </div>
      </div>

      <SuperSEO title="Anchors - Tell us More" />
    </>
  );
}

export default TellUsMore;
