import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
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
  IoMdInformationCircleOutline,
  IoIosArrowUp,
} from "react-icons/io";
import { RxCross2 } from "react-icons/rx";
import { AiOutlineArrowLeft, AiOutlineCheck } from "react-icons/ai";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

import { Autoplay, Navigation, Pagination } from "swiper";
import Navbar from "../Layouts/Navbar Creator/Navbar";
import { useCookies } from "react-cookie";
import { host } from "../../config/config";

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

const OTPVerificationModel = ({ onClose }) => {
  const [cookies, setCookie] = useCookies();
  const [formData, setFormData] = useState({
    number: "",
    otp: "",
  });

  const [sentOTP, setSentOTP] = useState(false);

  //  Contexts -------------------
  const { fillTellUsMoreForm } = useContext(creatorContext);

  const verfiyOTP = async () => {
    if (formData?.otp?.length !== 6) {
      toast.info("Enter a proper code", {
        position: "top-center",
        autoClose: 2000,
      });
    } else {
      let code = cookies?.ccoondfe;
      if (!code) {
        toast.error("OTP was valid for 2 minute, Please retry again", {
          position: "top-center",
          autoClose: 2000,
        });
      } else {
        if (parseInt(formData?.otp) === parseInt(parseInt(code) / 562002)) {
          // Save the form data in the tell us more form ----------
          await fillTellUsMoreForm(formData?.number, true);
          onClose(formData?.number, true);
        } else {
          toast.error("Invalid OTP!!!. Try again!!!", {
            position: "top-center",
            autoClose: 2000,
          });
        }
      }
    }
  };

  const sendOTP = async () => {
    if (formData?.number?.length === 10) {
      const response = await fetch(
        `${host}/api/email/sendMsg?message=Mobile Number&number=${formData?.number}&subject=Anchors`,
        {
          method: "GET",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            "Access-Control-Allow-Credentials": true,
          },
        }
      );
      const json = await response.json();
      if (json.MessageID) {
        toast.success("OTP sent successfully", {
          position: "top-center",
          autoClose: 2000,
        });

        // Saving the number in the backend db
        await fillTellUsMoreForm(formData?.number);

        setSentOTP(true);
        let otpcode = parseInt(json.code - 145626) * 562002;
        setCookie("ccoondfe", otpcode, { maxAge: 120 }); // valid for one minute
      }
    } else {
      toast.error("Enter a proper mobile number", {
        position: "top-center",
        autoClose: 2000,
      });
    }
  };

  return (
    <div
      className="outside_wrapper_earning"
      style={
        window.screen.width < 600
          ? { background: "rgba(18, 18, 18, 0.80)" }
          : {}
      }
    >
      <div
        className="otp_main_container_earning"
        style={{ background: "#F7F4F2" }}
      >
        <h2 style={{ color: "#1E293B" }}>
          Please verify phone number to continue
        </h2>

        <section>
          <input
            type="number"
            name="number"
            placeholder="Enter Mobile Number"
            style={{ color: "black" }}
            value={formData?.number}
            onChange={(e) => {
              setSentOTP(false);
              setFormData({ ...formData, [e.target.name]: e.target.value });
            }}
          />
          <input
            type="number"
            name="otp"
            placeholder="OTP"
            style={{ color: "black" }}
            value={formData?.otp}
            onChange={(e) => {
              setFormData({ ...formData, [e.target.name]: e.target.value });
            }}
          />
        </section>

        {sentOTP ? (
          <button
            style={{ minWidth: "unset", background: "rgba(33, 33, 33, 1)" }}
            onClick={verfiyOTP}
          >
            Verify OTP
          </button>
        ) : (
          <button
            style={{ minWidth: "unset", background: "rgba(33, 33, 33, 1)" }}
            onClick={sendOTP}
          >
            Send OTP
          </button>
        )}
      </div>
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
  const [formAlreadyFilled, setFormAlreadyFilled] = useState({
    openOTP: false,
    restData: false,
  }); // verified for the otp model openeing and thwe rest is to redirect the page to the next page
  const [formPassed, setFormPassed] = useState(false);
  const [inviteCodeSection, setInviteCodeSection] = useState(false);
  const [formData, setformData] = useState({
    inviteCode: "",
    contactNumber: 0,
    platform: "",
    followers: 0,
    socialLink: "",
    knownFrom: "",
    verifiedContact: false,
  });

  //  Contexts -------------------
  const {
    verifyInviteCode,
    fillTellUsMoreForm,
    UpdateCodeInTellUsMoreForm,
    getTellUsMoreFormData,
    updateStatus,
  } = useContext(creatorContext);

  // handles already sent data
  useEffect(() => {
    getTellUsMoreFormData().then((e) => {
      if (e?.success && e?.already) {
        setformData(e?.form);
        setFormAlreadyFilled({
          openOTP: !e?.form?.verifiedContact,
          restData: e?.form?.followers ? true : false,
        });
        if (e?.form?.followers && e?.form?.verifiedContact) {
          toast.info("You have already filled the form", {
            position: "top-center",
            autoClose: 2000,
          });
          setTimeout(() => {
            navigate("/dashboard");
          }, 3000);
        }
      } else if (e?.success) {
        setFormAlreadyFilled({ openOTP: true, restData: false });
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
      let process = verifyInviteCode(formData?.inviteCode).then((e) => {
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

  // Get he platform from the url

  function getPlatformFromURL(url) {
    // Regex patterns for each platform
    const linkedinRegex = /linkedin\.com\/.*$/;
    const youtubeRegex = /youtube\.com\/.*$|youtu\.be\/.*$/;
    const instagramRegex = /instagram\.com\/.*$/;
    const telegramRegex = /t\.me\/.*$/;
    const facebookRegex = /facebook\.com\/.*$/;

    // Test the URL against each pattern
    if (linkedinRegex.test(url)) {
      return "LinkedIn";
    } else if (youtubeRegex.test(url)) {
      return "Youtube";
    } else if (instagramRegex.test(url)) {
      return "Instagram";
    } else if (telegramRegex.test(url)) {
      return "Telegram";
    } else if (facebookRegex.test(url)) {
      return "Facebook";
    } else {
      return "Unknown";
    }
  }

  const handleSubmit = async () => {
    try {
      if (
        formData?.contactNumber?.toString().length > 1 &&
        formData?.verifiedContact &&
        formData?.followers?.length > 1 &&
        formData?.socialLink !== ""
      ) {
        if (
          formData?.inviteCode &&
          formData?.inviteCode?.length !== 0 &&
          !verifiedCode
        ) {
          toast.error("Verify the code first", {
            position: "top-center",
            autoClose: 2000,
          });
          return true;
        }
        const platform = getPlatformFromURL(formData?.socialLink);

        fillTellUsMoreForm(
          // saving the data in tell us more in database
          formData?.contactNumber,
          formData?.verifiedContact,
          verifiedCode ? formData?.inviteCode?.toUpperCase() : "",
          platform,
          formData?.followers,
          formData?.socialLink,
          formData?.knownFrom
        ).then((e) => {
          if (e?.success) {
            setInviteCodeSection(true);
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

  const handleInviteCodeSubmit = async () => {
    if (
      formData?.inviteCode &&
      formData?.inviteCode?.length !== 0 &&
      !verifiedCode
    ) {
      toast.error("Verify the code first", {
        position: "top-center",
        autoClose: 2000,
      });
      return true;
    } else if (!formData?.inviteCode || formData?.inviteCode?.length === 0) {
      navigate("/dashboard");
    } else {
      const platform = getPlatformFromURL(formData?.socialLink);

      UpdateCodeInTellUsMoreForm(formData?.inviteCode).then((e) => {
        if (e) {
          switch (platform) {
            case "LinkedIn":
              if (parseInt(formData?.followers) > 10000 && verifiedCode) {
                updateStatus().then((e) => {
                  setFormPassed(true);
                });
              } else {
                window.open("/dashboard/waitlist", "_self");
              }
              break;
            case "Youtube":
              if (parseInt(formData?.followers) > 10000 && verifiedCode) {
                updateStatus().then((e) => {
                  setFormPassed(true);
                });
              } else {
                window.open("/dashboard/waitlist", "_self");
              }
              break;
            case "Instagram":
              if (parseInt(formData?.followers) > 10000 && verifiedCode) {
                updateStatus().then((e) => {
                  setFormPassed(true);
                });
              } else {
                window.open("/dashboard/waitlist", "_self");
              }
              break;
            case "Telegram":
              if (parseInt(formData?.followers) > 5000 && verifiedCode) {
                updateStatus().then((e) => {
                  setFormPassed(true);
                });
              } else {
                window.open("/dashboard/waitlist", "_self");
              }
              break;
            case "Facebook":
              if (parseInt(formData?.followers) > 5000 && verifiedCode) {
                updateStatus().then((e) => {
                  setFormPassed(true);
                });
              } else {
                window.open("/dashboard/waitlist", "_self");
              }
              break;

            default:
              toast.error("Improper social link, Refresh to proceed", {
                position: "top-center",
                autoClose: 2000,
              });
              break;
          }
        } else {
          toast.error("Some error occured while uploading the invite code", {
            position: "top-center",
            autoClose: 3000,
          });
        }
      });
    }
  };

  return (
    <>
      {formAlreadyFilled?.openOTP && (
        <OTPVerificationModel
          onClose={(number, verified) => {
            setFormAlreadyFilled({ ...formAlreadyFilled, openOTP: false });
            setformData({
              ...formData,
              contactNumber: number,
              verifiedContact: verified,
            });
          }}
        />
      )}

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
        {/* <AiOutlineArrowLeft
          id="prev_ques_slide_button"
          onClick={handlePrevButton}
        /> */}
        <h1>
          {!inviteCodeSection
            ? "Help us understand you better. Tell us more !"
            : "Skip the Waitlist"}
        </h1>
        {/* <p>QUESTIONS {qNo} OF 6</p> */}

        {!inviteCodeSection ? (
          <div>
            <section className="form_fields_tellusmore">
              <label htmlFor="socialLink">
                Your Profile Link <span>*</span>
              </label>
              <input
                className="input_form_tellUsMore"
                type="text"
                id="socialLink"
                name="socialLink"
                value={formData?.socialLink}
                onChange={handleChange}
              />
            </section>

            <section className="form_fields_tellusmore">
              <label htmlFor="followers">
                What’s your Size of audience? <span>*</span>
              </label>
              <input
                className="input_form_tellUsMore"
                type="number"
                name="followers"
                id="followers"
                value={formData?.followers !== 0 && formData?.followers}
                onChange={handleChange}
              />
            </section>
          </div>
        ) : (
          <div>
            <section className="form_fields_tellusmore">
              <label htmlFor="inviteCode">
                Enter your Invite Code{" "}
                {window.screen.width < 600 && (
                  <IoMdInformationCircleOutline
                    color="grey"
                    onClick={() => {
                      window.open("/approved-creators");
                      mixpanel.track("redirect to approved creators page");
                    }}
                  />
                )}
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

                  {incorrectCode && (
                    <RxCross2
                      color="red"
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
                    window.open("/approved-creators");
                    mixpanel.track("redirect to approved creators page");
                  }}
                >
                  KNOW ABOUT INVITE CODE
                </p>
              </div>
            </section>
          </div>
        )}

        {/* {qNo === 6 && !formAlreadyFilled && ( */}

        <section>
          {inviteCodeSection && (
            <button
              className="tellUsMore_submitbutton"
              style={{
                background: "transparent",
                color: "#212121",
                border: "1px solid #212121",
              }}
              onClick={() => {
                navigate("/dashboard");
              }}
            >
              Skip
            </button>
          )}

          <button
            className="tellUsMore_submitbutton"
            onClick={inviteCodeSection ? handleInviteCodeSubmit : handleSubmit}
          >
            Submit
          </button>
        </section>
        {/* )} */}
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
          {/* {tackleIntro && (
            <IntroTellUsMore
              nextClick={() => {
                setTackleIntro(false);
              }}
            />
          )} */}

          {/* {!tackleIntro && ( */}
          <FormTellUsMore
            prevClick={() => {
              setTackleIntro(true);
            }}
            setVerifiedCodeModal={(bool) => {
              setVerifiedCodeModal(bool);
            }}
          />
          {/* )} */}
        </div>
      </div>

      <SuperSEO title="Anchors - Tell us More" />
    </>
  );
}

export default TellUsMore;
