import React, {
  useEffect,
  lazy,
  Suspense,
  useState,
  useRef,
  useContext,
} from "react";
import "./Main.css";
import { HiUser } from "react-icons/hi";
import { useNavigate } from "react-router-dom";
import mixpanel from "mixpanel-browser";
import { motion } from "framer-motion";
import { Tilt } from "react-tilt";
import { BsArrowRight } from "react-icons/bs";

// Images and icons used in the page
import anchor from "../../../../Utils/Images/logo-invite-only.png";
import PNGIMG from "../../../../Utils/Images/default_user.png";
import first from "./home_images/first.webp";
import second from "./home_images/second.webp";
import third from "./home_images/third.webp";
import fourth from "./home_images/fourth.webp";
import fifth from "./home_images/fifth.webp";
import eight from "./home_images/eight.webp";
import nine from "./home_images/nine.webp";
import muscle from "./icons/muscle.svg";
import {
  FaLinkedinIn,
  FaTelegram,
  FaInstagram,
  FaYoutube,
} from "react-icons/fa";
import { RiVipCrownFill } from "react-icons/ri";

import { feedbackcontext } from "../../../../Context/FeedbackState";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { EPAcontext } from "../../../../Context/EPAState";

// Swiper js imported ---------------------------------
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/effect-flip";
import "swiper/css/pagination";
import "swiper/css/navigation";

// import required modules
import { Autoplay, EffectFlip } from "swiper/modules";
import { LoadThree } from "../../../Modals/Loading";
import Cards from "./Cards.js"
import Laptop from "./Laptop.js"
import Arrow from "./Arrow.js"
import UserDashboard2 from "../../../User Dashboard2/UserDashboard";

const UserDashboard = lazy(() =>
  import("../../../User Dashboard/UserDashboard")
);


const FAQDetails = [
  {
    question: "What is anchors? ",
    answer:
      "anchors is an invite-only exclusive platform for premium creators. It provides a space for creators from various social media platforms to monetize their content, skills, expertise, and time. The platform is designed to empower creators and help them grow their communities and income streams. With anchors, creators can unlock their full potential in the creator economy by accessing a range of features and benefits.",
  },
  {
    question: "Can I join this platform for free?",
    answer:
      "Absolutely! Joining our platform is completely free. There are no hidden charges or fees to join, and we also do not charge a monthly fee.",
  },
  {
    question: "How is anchors different from other platforms?",
    answer:
      "anchors isn't just another tool or SaaS platform. We are a creator's home, offering everything they need to unlock their full potential. Our mission is to constantly raise the bar, setting new standards in the creator economy and delivering the best experience possible. We're committed to competing with ourselves, continuously improving to empower creators and help them reach new heights.",
  },
  {
    question: "Why is there an eligibility criteria to join the platform?",
    answer:
      "anchors is an exclusive platform for premium creators. By maintaining exclusivity, we ensure a high-quality community that fosters growth and unlocks the full potential of the creator economy.",
  },
  {
    question: "What is an invite code for anchors?",
    answer:
      "An invite-code for anchors is a unique code provided by existing creators. By using an invite-code during the registration process, new creators can gain access to the platform and start their journey on anchors. It's a way to ensure that serious creators join our exclusive community.",
  },
  {
    question: "What is the process to be a part of anchors?",
    answer:
      "To become a part of anchors, you can request an invitation using the form on our website. If you meet the eligibility criteria, our team will review your application and send you an exclusive invite. Once you receive the invite, you can complete the registration process and start leveraging the features and benefits of anchors.",
  },
];

const defaultOptions = {
  reverse: false, // reverse the tilt direction
  max: 20, // max tilt rotation (degrees)
  perspective: 1000, // Transform perspective, the lower the more extreme the tilt gets.
  speed: 200, // Speed of the enter/exit transition
  scale: 1,
  transition: true, // Set a transition on enter/exit.
  axis: null, // What axis should be disabled. Can be X or Y.
  reset: true, // If the tilt effect has to be reset on exit.
  easing: "cubic-bezier(.03,.98,.52,.99)", // Easing on enter/exit.
};

// Motion varainsts ------------------
const textVariant01 = (timedelay = 0.85) => {
  return {
    from: {
      opacity: 0,
    },
    to: {
      opacity: 1,
      transition: {
        duration: timedelay,
        ease: "ease",
      },
    },
  };
};

const faqVariant = (index) => {
  return {
    from: {
      opacity: 0,
      y: "100px",
    },
    to: {
      opacity: 1,
      y: 0,
      transition: {
        duration: index * 0.2,
        ease: "easeInOut",
      },
    },
  };
};

const feedbackVariant = (index) => {
  return {
    from: {
      opacity: 0,
      y: "100px",
    },
    to: {
      opacity: 1,
      y: 0,
      transition: {
        duration: (index / 4) * 0.5,
        ease: "easeInOut",
      },
    },
  };
};

const navbarVariant = () => {
  return {
    from: {
      opacity: 0,
      y: "-50px",
    },
    to: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 1,
        ease: "easeInOut",
      },
    },
  };
};

const fadeInFromLeft = () => {
  return {
    from: {
      opacity: 0,
      x: "-100px",
    },
    to: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 1.5,
        ease: "easeInOut",
      },
    },
  };
};

const fadeInFromRight = () => {
  return {
    from: {
      opacity: 0,
      x: "100px",
    },
    to: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 1.5,
        ease: "easeInOut",
      },
    },
  };
};

const fadeInTheScreen = () => {
  return {
    from: {
      opacity: 0,
      scale: 0,
    },
    to: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.8,
        ease: "easeInOut",
      },
    },
  };
};

// Components of the page -----------------
const NavbarForPage = () => {
  const navigate = useNavigate();
  return (
    <>
      <motion.div
        className="navbar_home_page_outer"
        variants={navbarVariant()}
        initial="from" // here default type is tween and not spring because it has duration
        whileInView="to"
        viewport={{ once: true }}
      >
        <img src={anchor} />
        <div className="navbar_home_page_outer_frame">
          <div
            className="home_page_earning_potenial_button"
            onClick={() => {
              mixpanel.track("EPA header button");
              navigate("/earning-predictor");
            }}
          >
            Earning Potential Analyzer
          </div>
          <div
            className="home_page_earning_potenial_button"
            onClick={() => {
              mixpanel.track(
                `${
                  localStorage.getItem("jwtToken")
                    ? "My Account"
                    : "Clicked Creator Login on Navbar"
                }`
              );
              localStorage.getItem("jwtToken") &&
              localStorage.getItem("isUser") === ""
                ? window.open("/dashboard", "_self")
                : localStorage.getItem("jwtToken") &&
                  localStorage.getItem("isUser") !== ""
                ? window.open(localStorage.getItem("url"), "_self")
                : window.open("/login/creators", "_self");
            }}
          >
            <HiUser style={{ color: "white" }} />
            {localStorage.getItem("jwtToken")
              ? "My Account"
              : "Creator's Login"}
          </div>
        </div>
      </motion.div>
    </>
  );
};

const SuccessEligibilityPopups = ({ success, onClose }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (success) {
      mixpanel.track("Creator's Signup");
      navigate("/signup/creators");
      onClose();
    } else {
      mixpanel.track("Join Waitlist clicked on Failed Modal from Main Page");
      navigate("/signup/creators");
      onClose();
    }
  };

  return (
    <div className="landing_page__eligibility_popup_new_ui" onClick={onClose}>
      <motion.section
        onClick={(e) => {
          e?.stopPropagation();
        }}
        initial="from"
        animate="to"
        variants={fadeInTheScreen()}
      >
        {!success ? <img src={muscle} alt="" /> : <RiVipCrownFill />}

        <h1>{success ? "Hey there, superstar!" : "Oh, snap!"}</h1>

        {success && <span>Ready to join our elite crew?</span>}

        <p>
          {success
            ? "We know you've already accomplished so much, but guess what? There's even more awesomeness waiting for you! Let's team up and unlock your ultimate potential for endless adventures!"
            : "You're totally nailing it! Keep rocking that hard work, and before you know it, you'll be partying with us! While you wait for the grand entrance, hop on the waitlist and we will see you soon!"}
        </p>

        <button onClick={handleClick}>
          {success ? "Apply Now" : "Join the Waitlist"}
        </button>
      </motion.section>
    </div>
  );
};

const MainLanding = (props) => {
  const [platform, setPlatform] = useState(0);
  const [followers, setFollowers] = useState("");
  const [openModalSuccess, setOpenModalSuccess] = useState(false);
  const [openModalFail, setOpenModalFail] = useState(false);
  const [feedbackData, setFeedbackData] = useState("");
  const [videoId, setvideoId] = useState("");
  const navigate = useNavigate();
  const EligibilityRef = useRef();
  const { getallfb } = useContext(feedbackcontext);
  const { saveYoutubeData } = useContext(EPAcontext);

  // Feedback -----
  useEffect(() => {
    getallfb().then((e) => {
      setFeedbackData(e);
    });
  }, []);

  // Visited page mix panel
  useEffect(() => {
    // Not allow this event when a logined user goes to dahboard
    if (
      !localStorage.getItem("jwtToken") &&
      localStorage.getItem("isUser") !== true
    ) {
      mixpanel.track("Visited Main Page");
    }
  }, []);

  const handleFAQClick = (e) => {
    let accordionItemHeader = document.getElementById(e.target.id);
    accordionItemHeader.classList.toggle("active");
    const accordionItemBody = accordionItemHeader.nextElementSibling;
    if (accordionItemHeader.classList.contains("active")) {
      accordionItemBody.style.maxHeight = accordionItemBody.scrollHeight + "px";
    } else {
      accordionItemBody.style.maxHeight = 0;
    }
  };

  const handleStart = () => {
    if (EligibilityRef.current) {
      EligibilityRef.current.scrollIntoView({
        behavior: "smooth",
        // block: "start",
      });
    }
  };

  const handleCheckEligibility = () => {
    if (platform !== 0 && followers !== "") {
      mixpanel.track("Clicked Check Eligibility on Main Page", {
        platform:
          platform === 1
            ? "Linkedin"
            : platform === 2
            ? "Youtube"
            : platform === 3
            ? "Telegram"
            : platform === 4
            ? "Instagram"
            : "None",
        followers,
      });
      switch (platform) {
        case 1:
          if (parseInt(followers) >= 10000) {
            setOpenModalSuccess(true);
          } else {
            setOpenModalFail(true);
          }
          break;
        case 2:
          if (parseInt(followers) >= 10000) {
            setOpenModalSuccess(true);
          } else {
            setOpenModalFail(true);
          }
          break;
        case 3:
          if (parseInt(followers) >= 2000) {
            setOpenModalSuccess(true);
          } else {
            setOpenModalFail(true);
          }
          break;
        case 4:
          if (parseInt(followers) >= 5000) {
            setOpenModalSuccess(true);
          } else {
            setOpenModalFail(true);
          }
          break;
        default:
          break;
      }
    }
  };

  // Epa ---------------
  const handleChangePredictor = async (e) => {
    // Regular expression patterns to match valid YouTube video URLs
    var youtubeLongPattern =
      /^(https?:\/\/)?(www\.)?youtube\.com\/watch\?v=([a-zA-Z0-9_-]{11})(&.*)?$/;
    var youtubeShortPattern =
      /^(https?:\/\/)?(www\.)?youtu\.be\/([a-zA-Z0-9_-]{11})$/;

    let videoId;

    // Valid YouTube video URL entered
    if (youtubeLongPattern.test(e?.target?.value)) {
      mixpanel.track("Input URL");
      const url = new URL(e.target.value);
      const params = new URLSearchParams(url.search);
      videoId = params.get("v");
      setvideoId(videoId);
      getAndSaveData(videoId);
    } else if (youtubeShortPattern.test(e.target.value)) {
      mixpanel.track("Input URL");
      const url = new URL(e.target.value);
      videoId = url.pathname.slice(1);
      setvideoId(videoId);
      getAndSaveData(videoId);
    }
  };

  const handleSubmitEaarningPredictor = () => {
    mixpanel.track("Check earning predictor");
    navigate(`/earning-predictor/${videoId}`);
  };

  const getAndSaveData = async (videoId) => {
    // Calling the save function to save the data and the youtube api to get the data :-
    const response = await fetch(
      `https://youtube.googleapis.com/youtube/v3/videos?part=snippet%2CcontentDetails%2Cstatistics&id=${videoId}&key=${process.env.REACT_APP_GOOGLE_LIVE_API}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const videoDetails = await response.json();

    const response2 = await fetch(
      `https://www.googleapis.com/youtube/v3/channels?part=statistics%2Csnippet&id=${videoDetails?.items[0]?.snippet?.channelId}&key=${process.env.REACT_APP_GOOGLE_LIVE_API}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const channelDetails = await response2.json();

    // get total duration of the channel
    let totalYears = getDateDiff(
      channelDetails?.items[0]?.snippet?.publishedAt
    );

    // Active subs = Total Subs * (1 - 0.1)^(total time to the channel)
    const activeSubs = parseInt(
      channelDetails?.items[0]?.statistics?.subscriberCount *
        Math.pow(0.9, totalYears)
    );

    await saveYoutubeData(
      videoDetails?.items[0]?.snippet?.channelTitle,
      videoDetails?.items[0]?.snippet?.channelId,
      channelDetails?.items[0]?.statistics?.subscriberCount,
      activeSubs,
      channelDetails?.items[0]?.statistics?.viewCount,
      channelDetails?.items[0]?.snippet?.publishedAt,
      channelDetails,
      1
    );
  };

  function getDateDiff(date) {
    const currentDate = new Date();
    const specifiedDate = new Date(date);

    // Calculate the difference in milliseconds
    const diffInMs = currentDate - specifiedDate;

    // Convert milliseconds to days
    const diffInYears = diffInMs / (1000 * 60 * 60 * 24 * 365.25); // Account for leap years

    return Math.floor(diffInYears);
  }

  // No main page when user is logged in --------------------------
  if (
    localStorage.getItem("jwtToken") &&
    localStorage.getItem("isUser") === "true"
  ) {
    return (
      <Suspense fallback={<LoadThree />}>
        <UserDashboard2 progress={props.progress} />
      </Suspense>
    );
  }

  return (
    <>
      {openModalSuccess && (
        <SuccessEligibilityPopups
          success={true}
          onClose={() => {
            setOpenModalSuccess(false);
            setPlatform(0);
            setFollowers("");
          }}
        />
      )}
      {openModalFail && (
        <SuccessEligibilityPopups
          success={false}
          onClose={() => {
            setOpenModalFail(false);
            setPlatform(0);
            setFollowers("");
          }}
        />
      )}

      <div>
        <div className="home_page_outer" id="landing_page_imp_div">
          <NavbarForPage />

          <div
            className="home_page_outer_first_body"
            style={{
              backgroundImage: `url(${first})`,
            }}
          >
            <div className="home_page_earning_potenial_outer_01">
              <div
                className="home_page_outer_first_body_001"
                style={{ backgroundSize: "auto" }}
              >
                <motion.div
                  className="home_page_outer_first_body_01"
                  initial="from"
                  animate="to"
                  variants={textVariant01()}
                >
                  Monetise
                </motion.div>
                <motion.span
                  initial="from"
                  animate="to"
                  variants={textVariant01(1.7)}
                >
                  As You Thrive
                </motion.span>
                <motion.div
                  className="home_page_outer_first_body_02"
                  initial="from"
                  animate="to"
                  variants={textVariant01(2.4)}
                >
                  An Exclusive Platform for the Creator’s Community. Empower
                  your Creator's growth with our community.
                </motion.div>
                <motion.button
                  className="home_page_outer_first_body_03"
                  onClick={() => {
                    handleStart();
                    mixpanel.track("Join Now");
                  }}
                  initial="from"
                  animate="to"
                  variants={textVariant01(3.4)}
                >
                  Join Now
                </motion.button>
              </div>
            </div>
          </div>

            <div
              className="home_page_outer_first_body"
              style={{ backgroundImage: `url(${second})` }}
            >
              <motion.div
                className="home_page_outer_second_body_01"
                initial="from"
                whileInView="to"
                variants={textVariant01()}
              >
                Why
                <span> Anchors?</span>
              </motion.div>
              <motion.div
                className="home_page_outer_second_body_02"
                initial="from"
                whileInView="to"
                variants={textVariant01(1.7)}
              >
                Unlock a full-stack solution to monetize your expertise and
                skills like never before.
              </motion.div>

              <div className="home_page_outer_second_body_02_card">
                <Cards />
              </div>
            </div>

            <div
              className="home_page_outer_first_body"
              id="third"
              style={{ backgroundImage: `url(${third})` }}
            >
              <motion.div
                className="home_page_outer_second_body_01"
                initial="from"
                whileInView="to"
                variants={textVariant01()}
              >
                Supported Upload Formats
              </motion.div>
              <motion.div
                className="home_page_outer_second_body_02"
                style={{ width: "40%" }}
                initial="from"
                whileInView="to"
                variants={textVariant01(1.7)}
              >
                Your knowledge, your way - choose the perfect format to share
                your skills!
              </motion.div>
              <div className="home_page_outer_second_body_02_laptop">
                <Laptop />
              </div>
            </div>

            <div
              className="home_page_outer_first_body"
              style={{ backgroundImage: `url(${fourth})` }}
            >
              <div className="home_page_outer_second_body_001">
                <div className="home_page_outer_second_body_001_top">
                  <motion.div
                    className="home_page_outer_second_body_01"
                    initial="from"
                    whileInView="to"
                    variants={textVariant01()}
                  >
                    Anchor Yourself, Stand Out
                  </motion.div>
                  <motion.div
                    className="home_page_outer_second_body_02"
                    style={{ width: "80%", marginLeft: "40px" }}
                    initial="from"
                    whileInView="to"
                    variants={textVariant01(1.7)}
                  >
                    The pathway to hop on board and join us!
                  </motion.div>
                </div>
                <div className="home_page_outer_second_body_arrow_001">
                  <Arrow />
                </div>
              </div>
            </div>

          <div
            className="home_page_outer_first_body"
            style={{ backgroundImage: `url(${fifth})` }}
            id="eligibility"
            ref={EligibilityRef}
          >
            <motion.div
              className="home_page_outer_second_body_01"
              initial="from"
              whileInView="to"
              variants={textVariant01()}
            >
              Do you have what it takes ?
            </motion.div>
            <motion.div
              className="home_page_outer_second_body_02"
              style={{ paddingTop: "20px" }}
              initial="from"
              whileInView="to"
              variants={textVariant01(1.7)}
            >
              Unlocking the full potential of the creator economy through
              boundless innovation and sustainable growth
            </motion.div>
            <div className="home_page_outer_fifth_body_01">
              <div className="home_page_outer_sixth_body_020">
                <motion.div
                  className="home_page_outer_sixth_body_02"
                  initial="from"
                  whileInView="to"
                  variants={fadeInFromLeft()}
                  viewport={{ once: true }}
                >
                  Check Your Eligibility
                </motion.div>
              </div>
              <motion.div
                className="home_page_outer_fifth_body_03"
                initial="from"
                whileInView="to"
                variants={fadeInFromRight()}
                viewport={{ once: true }}
              >
                <section className="home_page_outer_fifth_body_03_heading">
                  Please select your social media platform
                </section>
                <div className="home_page_outer_fifth_body_03_middle">
                  <div className="home_page_outer_fifth_body_03_middle_button_group">
                    <div className="home_page_outer_fifth_body_03_middle_button_group_row">
                      <button
                        className={`home_page_outer_fifth_body_03_middle_button ${
                          platform === 1 &&
                          "home_page_outer_fifth_body_03_middle_button_active"
                        }`}
                        onClick={() => {
                          setPlatform(1);
                        }}
                      >
                        <FaLinkedinIn />
                        LinkedIn
                      </button>
                      <button
                        className={`home_page_outer_fifth_body_03_middle_button ${
                          platform === 2 &&
                          "home_page_outer_fifth_body_03_middle_button_active"
                        }`}
                        onClick={() => {
                          setPlatform(2);
                        }}
                      >
                        <FaInstagram />
                        Instagram
                      </button>
                    </div>
                    <div className="home_page_outer_fifth_body_03_middle_button_group_row">
                      <button
                        className={`home_page_outer_fifth_body_03_middle_button ${
                          platform === 3 &&
                          "home_page_outer_fifth_body_03_middle_button_active"
                        }`}
                        onClick={() => {
                          setPlatform(3);
                        }}
                      >
                        <FaTelegram />
                        Telegram
                      </button>
                      <button
                        className={`home_page_outer_fifth_body_03_middle_button ${
                          platform === 4 &&
                          "home_page_outer_fifth_body_03_middle_button_active"
                        }`}
                        onClick={() => {
                          setPlatform(4);
                        }}
                      >
                        <FaYoutube />
                        Youtube
                      </button>
                    </div>
                  </div>
                  <div className="home_page_outer_fifth_body_03_middle_down_input">
                    <input
                      placeholder="Enter your number of followers"
                      className="home_page_outer_fifth_body_03_middle_down_input_textarea"
                      value={followers}
                      onChange={(e) => {
                        setFollowers(e.target.value);
                      }}
                    />
                    <button
                      className="home_page_outer_fifth_body_03_middle_down_button"
                      onClick={handleCheckEligibility}
                    >
                      Check
                    </button>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>

          <div
            className="home_page_outer_first_body"
            style={{ backgroundImage: `url(${fifth})` }}
          >
            <div className="home_page_outer_fifth_body_01">
              <motion.div
                className="home_page_outer_sixth_body_020"
                initial="from"
                whileInView="to"
                variants={fadeInFromLeft()}
                viewport={{ once: true }}
              >
                <div className="home_page_outer_sixth_body_02">
                  Creators Who Trust Us
                </div>
                <div className="home_page_outer_sixth_body_021">
                  Creators and Trust: The Winning Combination
                </div>
              </motion.div>

              <Tilt
                options={defaultOptions}
                style={{ height: "87vh", width: "32vw" }}
              >
                <Swiper
                  effect={"flip"}
                  loop={true}
                  autoplay={{
                    delay: 2500,
                    disableOnInteraction: true,
                    pauseOnMouseEnter: true,
                  }}
                  modules={[Autoplay, EffectFlip]}
                  className="mySwiper"
                >
                  <SwiperSlide>
                    <motion.div
                      className="home_page_outer_sixth_body_01"
                      initial="from"
                      whileInView="to"
                      variants={fadeInFromRight()}
                      viewport={{ once: true }}
                    >
                      {/* <img src={require("./Images/himanshu1.jpg")} /> */}
                      <LazyLoadImage
                        src={require("./Images/himanshu1.jpeg")}
                        alt=""
                      />
                      <div className="home_page_outer_sixth_body_03">
                        <div className="home_page_outer_sixth_body_03_inside">
                          <section className="home_page_outer_sixth_body_03_creator_name">
                            Himanshu Shekhar
                          </section>
                          <section className="home_page_outer_sixth_body_03_creator_desc">
                            LinkedIn 71k Followers
                          </section>
                        </div>
                        <FaLinkedinIn
                          color="white"
                          className="home_page_outer_sixth_body_03_creator_desc_image"
                          onClick={(e) => {
                            e.stopPropagation();
                            mixpanel.track(
                              "Clicked Social Media of Creators on Main Page",
                              {
                                creator: "Himanshu Shekhar",
                              }
                            );
                            window.open(
                              "https://www.linkedin.com/in/himanshushekhar16/"
                            );
                          }}
                        />
                      </div>
                      <div className="home_page_outer_sixth_body_04">
                        “Anchors has played a crucial role in helping me
                        monetize my content and expand my audience's reach!”
                      </div>
                      <button
                        className="home_page_outer_sixth_body_05_button"
                        onClick={() => {
                          mixpanel.track("Clicked Explore on Main Page", {
                            creator: "Himanshu Shekhar",
                          });
                          navigate("/himanshu-shekhar");
                        }}
                      >
                        Explore
                        <BsArrowRight />
                      </button>
                    </motion.div>
                  </SwiperSlide>

                  <SwiperSlide>
                    <motion.div
                      className="home_page_outer_sixth_body_01"
                      initial="from"
                      whileInView="to"
                      variants={fadeInFromRight()}
                      viewport={{ once: true }}
                    >
                      <LazyLoadImage
                        src={require("./Images/himanshu2.jpeg")}
                        alt=""
                      />
                      <div className="home_page_outer_sixth_body_03">
                        <div className="home_page_outer_sixth_body_03_inside">
                          <section className="home_page_outer_sixth_body_03_creator_name">
                            Himanshu Kumar
                          </section>
                          <section className="home_page_outer_sixth_body_03_creator_desc">
                            LinkedIn 164k Followers
                          </section>
                        </div>
                        <FaLinkedinIn
                          color="white"
                          className="home_page_outer_sixth_body_03_creator_desc_image"
                          onClick={(e) => {
                            e.stopPropagation();
                            mixpanel.track(
                              "Clicked Social Media of Creators on Main Page",
                              {
                                creator: "Himanshu Kumar",
                              }
                            );
                            window.open(
                              "https://www.linkedin.com/in/himanshukumarmahuri/"
                            );
                          }}
                        />
                      </div>
                      <div className="home_page_outer_sixth_body_04">
                        “Monetising my content and increasing my audience size
                        has become attainable thanks to Anchors!”
                      </div>
                      <button
                        className="home_page_outer_sixth_body_05_button"
                        onClick={() => {
                          mixpanel.track("Clicked Explore on Main Page", {
                            creator: "Himanshu Kumar",
                          });
                          navigate("/himanshu-kumar");
                        }}
                      >
                        Explore
                        <BsArrowRight />
                      </button>
                    </motion.div>
                  </SwiperSlide>
                </Swiper>
              </Tilt>
            </div>
          </div>

          <div
            className="home_page_outer_first_body"
            style={{ backgroundImage: `url(${fifth})` }}
          >
            <div className="home_page_outer_fifth_body_01">
              <motion.div
                className="home_page_outer_sixth_body_020"
                initial="from"
                whileInView="to"
                variants={fadeInFromLeft()}
                viewport={{ once: true }}
              >
                <div className="home_page_outer_sixth_body_02">
                  Discover your earning potential
                </div>
                <div className="home_page_outer_sixth_body_021">
                  Turn your Youtube expertise into a lucrative income through
                  resource sharing
                </div>
              </motion.div>
              <motion.div
                className="home_page_right_frame_seven_01"
                initial="from"
                whileInView="to"
                variants={fadeInFromRight()}
                viewport={{ once: true }}
              >
                <section className="home_page_right_frame_seven_01_upper_desc">
                  Paste Your Youtube Link Here
                </section>
                <div className="home_page_outer_fifth_body_03_middle_down_input">
                  <input
                    placeholder="Youtube.com/c/be-anchors"
                    className="home_page_outer_fifth_body_03_middle_down_input_textarea"
                    onChange={handleChangePredictor}
                  />
                  <button
                    className="home_page_outer_fifth_body_03_middle_down_button"
                    onClick={handleSubmitEaarningPredictor}
                  >
                    Check
                  </button>
                </div>
              </motion.div>
            </div>
          </div>

          <div
            className="home_page_outer_first_body"
            style={{ backgroundImage: `url(${eight})`, paddingTop: "20px" }}
          >
            <div className="home_page_outer_eight_body_020">
              <motion.div
                className="home_page_outer_eight_body_02"
                initial="from"
                whileInView="to"
                variants={textVariant01()}
              >
                Frequently Asked Questions
              </motion.div>

              <div className="faq_section-new_main_page_table">
                {FAQDetails?.map((e, i) => {
                  return (
                    <motion.div
                      className="faq_section-new_main_page_table_item"
                      key={i}
                      variants={faqVariant(i)}
                      initial="from" // here default type is tween and not spring because it has duration
                      whileInView="to"
                      viewport={{ once: true }}
                    >
                      <div
                        className="faq_section-new_main_page_table_item-header"
                        onClick={handleFAQClick}
                        id={`FAQ${i}`}
                      >
                        {e?.question}
                      </div>
                      <div className="faq_section-new_main_page_table_item-body">
                        <div className="faq_section-new_main_page_table_item-body-content">
                          {e?.answer}
                        </div>
                      </div>
                      {/* <!-- /.accordion-item-body --> */}
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="home_page_outer_first_body2">
            <div
              className="home_page_outer_first_body3"
              style={{ backgroundImage: `url(${fourth})`, minHeight: "100vh" }}
            >
              <motion.div
                className="home_page_outer_sixth_body_02"
                style={{ fontSize: "50px" }}
                initial="from"
                whileInView="to"
                variants={textVariant01()}
              >
                Wall of Love
              </motion.div>
              <motion.div
                className="home_page_outer_sixth_body_021"
                initial="from"
                whileInView="to"
                variants={textVariant01(1.7)}
              >
                Check out the delightful words from our cherished clients!
              </motion.div>

              <div className="home_page_outer_sixth_body_card_group_outer_grid_row">
                {feedbackData
                  ? feedbackData
                      ?.filter((e1) => {
                        return e1?.userID?.name;
                      })
                      .map((e, index) => {
                        return (
                          <motion.div
                            key={e?.userID}
                            className="home_page_outer_sixth_body_card_group"
                            variants={feedbackVariant(index)}
                            initial="from" // here default type is tween and not spring because it has duration
                            whileInView="to"
                            viewport={{ once: true }}
                          >
                            <div className="home_page_outer_sixth_body_card_group_header">
                              <LazyLoadImage
                                src={e?.userID?.photo}
                                className="your-creator-class"
                                onError={({ currentTarget }) => {
                                  currentTarget.onerror = null; // prevents looping
                                  currentTarget.src = PNGIMG;
                                }}
                                alt="userimag"
                              />
                              <span className="your-span-class">
                                {e?.userID?.name}
                              </span>
                            </div>
                            <div className="home_page_outer_sixth_body_card_group_desc your-description-class">
                              {e?.desc}
                            </div>
                          </motion.div>
                        );
                      })
                  : ""}
              </div>
            </div>

            <div
              className="home_page_outer_first_body3"
              style={{ backgroundImage: `url(${nine})` }}
            >
              <div className="home_page_outer_nine_body_020">anchors</div>
              <div className="home_page_outer_nine_body_0201">
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
                  <div
                    className="home_page_outer_nine_body_021_individual"
                    onClick={() => {
                      window.open("/pricing");
                    }}
                  >
                    Pricing
                  </div>
                </div>
                <div className="home_page_outer_nine_body_022">
                  <div
                    className="home_page_outer_nine_body_0212_individual"
                    onClick={() => {
                      window.open("/privacy-policy");
                    }}
                  >
                    Privacy Policy
                  </div>
                  <div
                    className="home_page_outer_nine_body_0212_individual"
                    onClick={() => {
                      window.open("/termsConditions");
                    }}
                  >
                    Terms & Conditions
                  </div>
                  <div
                    className="home_page_outer_nine_body_0212_individual"
                    onClick={() => {
                      window.open("/aboutUs");
                    }}
                  >
                    About Us
                  </div>
                  <div
                    className="home_page_outer_nine_body_0212_individual"
                    onClick={() => {
                      window.open("/contactUs");
                    }}
                  >
                    Contact Us
                  </div>
                  <div
                    className="home_page_outer_nine_body_0212_individual"
                    onClick={() => {
                      window.open("/refundPolicy");
                    }}
                  >
                    Refund Policy
                  </div>
                </div>
                <button
                  className="home_page_outer_fifth_body_03_middle_down_button"
                  onClick={() => {
                    handleStart();
                    mixpanel.track("join anchors footer");
                  }}
                >
                  Join Our Exclusive Community
                </button>
                <img
                  src={anchor}
                  style={{
                    width: "161.464px",
                    margin: "0 auto",
                    marginTop: "40px",
                    cursor: "pointer",
                    height: "44px",
                  }}
                />
              </div>
            </div>
            <div></div>
          </div>
        </div>
      </div>
    </>
  );
};

export default MainLanding;
