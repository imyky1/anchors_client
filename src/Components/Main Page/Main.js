import React, { useEffect } from "react";
import "./Main.css";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { Swiper, SwiperSlide } from "swiper/react";
import { BsLinkedin, BsInstagram, BsYoutube } from "react-icons/bs";
import audienceIcon from "./icons/audience.svg";
import dataIcon from "./icons/data.svg";
import commIcon from "./icons/comm.svg";
import videoIcon from "./icons/video.svg";
import docIcon from "./icons/docicon.svg";
import excelIcon from "./icons/excelicon.svg";
import imageIcon from "./icons/imageicon.svg";
import heroIcon from "./Images/heroicon.svg";
import { getCalApi } from "@calcom/embed-react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import PNGIMG from "../default_user.png";
import { Autoplay, Pagination, Navigation } from "swiper";
import { useContext } from "react";
import { feedbackcontext } from "../../Context/FeedbackState";
import mixpanel from "mixpanel-browser";
import Footer from "../Footer/Footer";
import Modal1 from "../Modals/ModalType01/Modal1";
import Modal2 from "../Modals/ModalType01/Modal2";
import NavbarCreator from "../Layouts/Navbar Creator/Navbar";
import UserDashboard from "../User Dashboard/UserDashboard";

const whyanchors = [
  {
    icon: commIcon,
    title: "Exclusive Creator Community",
    subtitle:
      "anchors is an invite -only exclusive platform for premium creators.",
  },
  {
    icon: dataIcon,
    title: "Detailed Analysis ",
    subtitle:
      "Get complete analytics for audience insights and make informed decisions.",
  },
  {
    icon: videoIcon,
    title: "Offer free/paid content",
    subtitle: "Embrace the power of choice with anchors - free or paid, it's up to you.",
  },
  {
    icon: audienceIcon,
    title: "Know your audience",
    subtitle: "Enhance connection with your audience  - simplified query acceptance made possible.",
  },
];

const features = [
  {
    icon: videoIcon,
    title: "Video",
    subtitle: "Recordings, Lecture, Concepts etc",
  },
  {
    icon: docIcon,
    title: "Documents",
    subtitle: "Notes,Interview Questions concepts etc.",
  },
  {
    icon: excelIcon,
    title: "Excel Sheets",
    subtitle: "Curated Lists, Opportunity list etc.",
  },
  {
    icon: imageIcon,
    title: "Image Assets",
    subtitle: "Wallpapers, Artworks,Graphics etc",
  },
];

const FAQDetails = [
  {
    question: "What is anchors? ",
    answer:
      "anchors is an invite-only exclusive platform for premium creators. It provides a space for creators from various social media platforms to monetize their content, skills, expertise, and time. The platform is designed to empower creators and help them grow their communities and income streams. With anchors, creators can unlock their full potential in the creator economy by accessing a range of features and benefits."
  },
  {
    question: "Can I join this platform for free?",
    answer:
      "Absolutely! Joining our platform is completely free. There are no hidden charges or fees to join, and we also do not charge a monthly fee.",
  },
  {
    question: "How are anchors different from other platforms?",
    answer:
      "anchors isn't just another tool or SaaS platform. We are a creator's home, offering everything they need to unlock their full potential. Our mission is to constantly raise the bar, setting new standards in the creator economy and delivering the best experience possible. We're committed to competing with ourselves, continuously improving to empower creators and help them reach new heights."
  },
  {
    question: "Why is there an eligibility criteria to join the platform?",
    answer:
      "anchors is an exclusive platform for premium creators. By maintaining exclusivity, we ensure a high-quality community that fosters growth and unlocks the full potential of the creator economy.",
  },
  {
    question: "What is an invite-code for anchors?",
    answer:
      "An invite-code for anchors is a unique code provided by existing creators. By using an invite-code during the registration process, new creators can gain access to the platform and start their journey on anchors. It's a way to ensure that serious creators join our exclusive community."
  },
  {
    question: "What is the process to be a part of anchors?",
    answer:
      "To become a part of anchors, you can request an invitation using the form on our website. If you meet the eligibility criteria, our team will review your application and send you an exclusive invite. Once you receive the invite, you can complete the registration process and start leveraging the features and benefits of anchors."
  },
];

const EligibilitySection = () => {
  const [platform, setPlatform] = useState(0);
  const [followers, setFollowers] = useState("");
  const [openModalSuccess, setOpenModalSuccess] = useState(false);
  const [openModalFail, setOpenModalFail] = useState(false);

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
          if (parseInt(followers) >= 5000) {
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
          if (parseInt(followers) >= 10000) {
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

  return (
    <>
      <Modal1
        open={openModalSuccess}
        toClose={() => {
          setOpenModalSuccess(false);
          setPlatform(0);
          setFollowers("");
        }}
      />
      <Modal2
        open={openModalFail}
        toClose={() => {
          setOpenModalFail(false);
          setPlatform(0);
          setFollowers("");
        }}
      />
      <section className="eligibility_mainpage" id="eligibility">
        <h1 className="headers1_mainpage">Do you have what it takes?</h1>
        <p>
          Your Golden Ticket to the Exclusive Creators Community.
          {/* through boundless innovation and sustainable growth */}
        </p>
        <span>Choose a platform - Put your best foot forward</span>
        <div className="eligibility_check_section">
          <section>
            <span
              className={platform === 1 && "active_platform"}
              onClick={() => {
                setPlatform(1);
              }}
            >
              <i className="fa-brands fa-linkedin-in fa-2x"></i>
            </span>
            <span
              className={platform === 2 && "active_platform"}
              onClick={() => {
                setPlatform(2);
              }}
            >
              <i className="fa-brands fa-youtube fa-2x"></i>
            </span>
            <span
              className={platform === 3 && "active_platform"}
              onClick={() => {
                setPlatform(3);
              }}
            >
              <i className="fa-brands fa-telegram fa-2x"></i>
            </span>
            <span
              className={platform === 4 && "active_platform"}
              onClick={() => {
                setPlatform(4);
              }}
            >
              <i className="fa-brands fa-instagram fa-2x"></i>
            </span>
          </section>
          <input
            type="number"
            placeholder="Number of followers"
            value={followers}
            onChange={(e) => {
              setFollowers(e.target.value);
            }}
          />
        </div>
        <button onClick={handleCheckEligibility}>Check Eligibility</button>
      </section>
    </>
  );
};

const FeaturedCreators = () => {
  const navigate = useNavigate();
  return (
    <section className="featured_creators" id="featured-creators">
      <h1 className="headers1_mainpage">Creators who trust us </h1>
      <span>Creators and Trust: The Winning Combination</span>
      <div className="creator_section_cardsection">
        {/* Different for mobile and pc ---------------------------------------------------------------------------------------- */}
        {window.matchMedia("(max-width: 500px)").matches ? (
          <Swiper
            slidesPerView={
              window.matchMedia("(max-width: 500px)").matches ? 1 : 2
            }
            spaceBetween={
              window.matchMedia("(max-width: 500px)").matches ? 5 : 5
            }
            //autoplay={{
            //  delay: 3000,
            //  disableOnInteraction: false,
            //}}
            loop={
              window.matchMedia("(max-width: 500px)").matches ? true : false
            }
            //pagination={{
            //  dynamicBullets: true,
            //}}
            navigation={{
              nextEl: "#next_slide_button",
              prevEl: "#prev_slide_button",
            }}
            modules={[Pagination, Navigation]}
            className="mySwiper"
          >
            <SwiperSlide>
              <div
                className="creator_section_cardsection_card1"
                onClick={() => {
                  mixpanel.track("Clicked trusted Creators on Main Page", {
                    creator: "Himanshu Shekhar",
                  });
                  navigate("/c/himanshu-shekhar");
                }}
              >
                <img
                  src={require("./Images/himanshu1.jpg")}
                  alt="creator"
                ></img>
                <div className="creator_section_imagetext">
                  <div className="creator_section_imagewrap">
                    <div className="creator_section_imagetext_text">
                      <span>Himanshu Shekhar</span>
                      <span>Linkedin 65K Followers</span>
                    </div>
                    <div
                      className="creator_section_icon"
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
                    >
                      <BsLinkedin size={28} />
                    </div>
                  </div>
                </div>
              </div>{" "}
            </SwiperSlide>
            <SwiperSlide>
              <div
                className="creator_section_cardsection_card1"
                onClick={() => {
                  mixpanel.track("Clicked trusted Creators on Main Page", {
                    creator: "Himanshu Kumar",
                  });
                  navigate("/c/himanshu-kumar");
                }}
              >
                {" "}
                <img
                  src={require("./Images/himanshu2.jpg")}
                  alt="creator"
                ></img>
                <div className="creator_section_imagetext">
                  <div className="creator_section_imagewrap">
                    <div className="creator_section_imagetext_text">
                      <span>Himanshu Kumar</span>
                      <span>Linkedin 111K Followers</span>
                    </div>
                    <div
                      className="creator_section_icon"
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
                    >
                      <BsLinkedin size={28} />
                    </div>
                  </div>
                </div>
              </div>
            </SwiperSlide>
            {/* <SwiperSlide>
          <div className="creator_section_cardsection_card1">
            {" "}
            <img src={require("./Images/BG2.png")} alt="creator"></img>
            <div className="creator_section_imagetext">
              <div className="creator_section_imagewrap">
                <div className="creator_section_imagetext_text">
                  <span>Courtney Henry</span>
                  <span>Youtube 100K Followers</span>
                </div>
                <div className="creator_section_icon">
                  <BsYoutube size={28} />
                </div>
              </div>
            </div>
          </div>
        </SwiperSlide> */}
          </Swiper>
        ) : (
          <>
            <div
              className="creator_section_cardsection_card1"
              onClick={() => {
                mixpanel.track("Clicked trusted Creators on Main Page", {
                  creator: "Himanshu Shekhar",
                });
                navigate("/c/himanshu-shekhar");
              }}
            >
              <img src={require("./Images/himanshu1.jpg")} alt="creator"></img>
              <div className="creator_section_imagetext">
                <div className="creator_section_imagewrap">
                  <div className="creator_section_imagetext_text">
                    <span>Himanshu Shekhar</span>
                    <span>Linkedin 65K Followers</span>
                  </div>
                  <div className="creator_section_icon">
                    <BsLinkedin
                      size={28}
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
                </div>
              </div>
            </div>
            <div
              className="creator_section_cardsection_card1"
              onClick={() => {
                mixpanel.track("Clicked trusted Creators on Main Page", {
                  creator: "Himanshu Kumar",
                });
                navigate("/c/himanshu-kumar");
              }}
            >
              <img src={require("./Images/himanshu2.jpg")} alt="creator"></img>
              <div className="creator_section_imagetext">
                <div className="creator_section_imagewrap">
                  <div className="creator_section_imagetext_text">
                    <span>Himanshu Kumar</span>
                    <span>Linkedin 111K Followers</span>
                  </div>
                  <div className="creator_section_icon">
                    <BsLinkedin
                      size={28}
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
                </div>
              </div>
            </div>
          </>
        )}
      </div>
      {window.screen.width < 600 && (
        <div className="nav_buttons">
          <button id="prev_slide_button">
            <i className="fa-solid fa-arrow-left fa-2x"></i>
          </button>
          <button id="next_slide_button">
            <i className="fa-solid fa-arrow-right fa-2x"></i>
          </button>
        </div>
      )}
    </section>
  );
};

const WallOfLove = ({ data }) => {
  return (
    <section className="wall_of_love">
      <h1 className="headers1_mainpage">Wall of Love</h1>
      <div>
        {data
          ? data
              ?.filter((e1) => {
                return e1?.userID?.name;
              })
              .map((e) => {
                return (
                  <div className="feedback_box_mainpage" key={e?.userID}>
                    <section>
                      <LazyLoadImage
                        src={e?.userID?.photo}
                        onError={({ currentTarget }) => {
                          currentTarget.onerror = null; // prevents looping
                          currentTarget.src = PNGIMG;
                        }}
                        alt="userimag"
                      />
                      <div>
                        <span className="user_name_mainpage">
                          {e?.userID?.name.length > 13
                            ? e?.userID?.name.slice(0, 13) + "..."
                            : e?.userID?.name}
                        </span>
                        {/* <span className="user_email_mainpage">
                            abc@gmail.com
                          </span> */}
                      </div>
                    </section>
                    <p>
                      {e?.desc.length > 160
                        ? e?.desc.slice(0, 160) + "..."
                        : e?.desc}
                    </p>
                  </div>
                );
              })
          : ""}
      </div>
    </section>
  );
};

const MainFAQs = ({ data }) => {
  const handleClick = (e) => {
    let accordionItemHeader = document.getElementById(e.target.id);
    accordionItemHeader.classList.toggle("active");
    const accordionItemBody = accordionItemHeader.nextElementSibling;
    if (accordionItemHeader.classList.contains("active")) {
      accordionItemBody.style.maxHeight = accordionItemBody.scrollHeight + "px";
    } else {
      accordionItemBody.style.maxHeight = 0;
    }
  };

  return (
    <div className="faq_pricing_wrapper main_page_faq">
      <h1 className="headers1_mainpage">Frequently Asked Question</h1>
      <div className="accordion">
        {data?.map((e, i) => {
          return (
            <div className="accordion-item" key={i}>
              <div
                className="accordion-item-header"
                onClick={handleClick}
                id={`FAQ${i}`}
              >
                {e?.question}
              </div>
              <div className="accordion-item-body">
                <div className="accordion-item-body-content">{e?.answer}</div>
              </div>
              {/* <!-- /.accordion-item-body --> */}
            </div>
          );
        })}
      </div>
    </div>
  );
};

const ConnectWithUs = () => {
  useEffect(() => {
    (async function () {
      const cal = await getCalApi();
      cal("ui", {
        theme: "dark",
        styles: {
          branding: { brandColor: "#000000" },
        },
      });
    })();
  }, []);

  return (
    <section id="connect" className="connect_with_us_wrapper">
      <img src={require("./Images/illus2.png")} alt="" />
      <div>
        <h2 className="headers1_mainpage">Connect with us</h2>
        <p>
        Let's connect and make things happen ! Reach out to our team for any assistance or suggestions.
        </p>
        <button data-cal-link="anchors-team/15min" onClick={()=>{mixpanel.track("Connect with us")}}>Let’s Connect</button>
      </div>
    </section>
  );
};

function Main(props) {
  const [data, setData] = useState("");
  const navigate = useNavigate();
  const { getallfb } = useContext(feedbackcontext);

  useEffect(() => {
    getallfb().then((e) => {
      setData(e);
    });
  }, []);

  // Visited page mix panel
  useEffect(() => {
    mixpanel.track("Visited Main Page");
  }, []);

  const handleStart = () => {
    mixpanel.track("Join Now")
    let link = document.createElement("a");
    link.href = "#eligibility";
    mixpanel.track("Clicked Start Now in hero section");
    link.dispatchEvent(new MouseEvent("click"));
  };


  // No main page when user is logged in --------------------------
  if(localStorage.getItem("jwtToken") &&
  localStorage.getItem("isUser") === "true"){
    return (
      <UserDashboard progress={props.progress}/>
    )
  }

  return (
    <>
      <ToastContainer />

      <div className="mainLandingpage_body">
        {/* Logo and header section --------------------------------------------- */}
        <NavbarCreator/>

        {/* Hero Section --------------------------------------------------------------- */}
        <section className="hero_mainpage">
          <div className="left_hero_text">
            <div>
              <h1>Monetize as you Thrive</h1>
              <img src={heroIcon} alt="" />
            </div>
            <p>
              {/* An INVITE ONLY community for creators to monetize your{" "}
              <span style={{ color: "#ffffff" }}>Content, skill </span> &{" "}
              <span style={{ color: "#ffffff" }}>expertise.</span> */}
              An invite-only exclusive platform for premium creators
            </p>

            <section>
              <img src={require("./Images/peopleIcon.png")} alt="" />
              <span>
                Tap into our thriving ecosystem to monetize your expertise and
                grow with our community
              </span>
            </section>

            <button onClick={handleStart}>Join Now</button>
          </div>
          {/* <img
            src={require("./Images/hero_img.png")}
            alt=""
            className="hero_section_image"
          /> */}
        </section>

        {/* steps of anchors verification */}
        <section className="steps_anchors_mainpage">
          <h1 className="headers1_mainpage">Be an Anchor, stand out</h1>
          <div>
            <div className="steps">
              <div>
                <img src={require("./Images/stars.png")} alt="" />
                <h1 className="headers2_mainpage">1</h1>
                <p>Apply to join anchors</p>
              </div>
            </div>
            <div className="steps">
              <div>
                <img src={require("./Images/stars.png")} alt="" />
                <h1 className="headers2_mainpage">2</h1>
                <p>we will review your profile</p>
              </div>
            </div>
            <div className="steps">
              <div>
                <img src={require("./Images/stars.png")} alt="" />
                <h1 className="headers2_mainpage">3</h1>
                <p>Proud to be an anchor</p>
              </div>
            </div>
          </div>
        </section>

        {/* why to be an anchor */}
        <section className="why_anchors_section">
          <img src={require("./Images/illus1.png")} alt="" />
          <div className="why_anchors_desc">
            <h1 className="headers1_mainpage">
              Why <span style={{ color: "#FF0000" }}>anchors?</span>
            </h1>
            <span className="text_mainpage1">
              Unlock a full-stack solution to monetize your expertise and skills
              like never before.
            </span>
            <div>
              {whyanchors?.map((e, i) => {
                return (
                  <div className="why_anchors_steps_boxes" key={i}>
                    <img src={e?.icon} />
                    <span>{e?.title}</span>
                    <p>{e?.subtitle}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* What can you upload facilities of anchors */}
        <section className="facilities">
          <h1 className="headers1_mainpage">What all you can upload</h1>
          <span>
            Your knowledge, your way - choose the perfect format to share your
            skills..
          </span>
          <div className="facilities_boxes">
            {features?.map((e, i) => {
              return (
                <div key={e?.title}>
                  <img src={e?.icon} />
                  <span>{e?.title}</span>
                  <p>{e?.subtitle}</p>
                </div>
              );
            })}
          </div>
        </section>

        {/* join and eligibility section */}
        <EligibilitySection />

        {/* Connect with us section */}
        <ConnectWithUs />

        {/* featured creators section */}
        <FeaturedCreators />

        {/* Feedback or wall of love section */}
        <WallOfLove data={data} />

        {/* Faq sections */}
        <MainFAQs data={FAQDetails}/>

        <Footer />
      </div>
    </>
  );
}

export default Main;
