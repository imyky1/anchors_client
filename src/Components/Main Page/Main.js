import React, { useEffect } from "react";
import "./Main.css";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { Swiper, SwiperSlide } from "swiper/react";
import { BsLinkedin, BsInstagram, BsYoutube } from "react-icons/bs";

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

function Main() {
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

  const [openModalSuccess, setOpenModalSuccess] = useState(false);
  const [openModalFail, setOpenModalFail] = useState(false);
  const [platform, setPlatform] = useState(0);
  const [followers, setFollowers] = useState("");

  const handleCheckEligibility = () => {
    if (platform !== 0 && followers !== "") {
      mixpanel.track("Clicked Check Eligibility on Main Page",{
        platform : platform === 1 ? "Linkedin" : platform === 2 ? "Youtube" : platform === 3 ? "Telegram" : platform === 4 ? "Instagram" : "None",
        followers 
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

  const handleStart = () => {
    let link = document.createElement("a");
    link.href = "#eligibility";
    mixpanel.track("Clicked Start Now in hero section");
    link.dispatchEvent(new MouseEvent("click"));
  };

  return (
    <>
      <ToastContainer />
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

      <div className="mainLandingpage_body">
        {/* Logo and header section --------------------------------------------- */}
        <section className="mainPage_headers">
          <img
            className="logo_main_page"
            src={require("./Images/logo-beta.png")}
            alt=""
          />
          <button
            className="login_creator_mainpage"
            onClick={() => {
              mixpanel.track("Clicked Creator's Login on Main Page");
              localStorage.getItem("jwtToken") ? navigate("/dashboard") : navigate("/login/creators");
            }}
          >
            {localStorage.getItem("jwtToken") ? "My Account" : "Creator's Login"}
          </button>
        </section>

        {/* Hero Section --------------------------------------------------------------- */}
        <section className="hero_mainpage">
          <div className="left_hero_text">
            <h1>
              Become <span style={{ color: "#fc6262" }}>Anchor</span>
            </h1>
            <p>
              Monetize your{" "}
              <span style={{ color: "#ffffff" }}>
                Content, skill, Expertise{" "}
              </span>
              and help your audience to grow.
            </p>

            <button onClick={handleStart}>Start Now</button>
          </div>
          <img
            src={require("./Images/hero_img.jpg")}
            alt=""
            className="hero_section_image"
          />
        </section>

        {/* steps of anchors verification */}
        <section className="steps_anchors_mainpage">
          <h1 className="headers1_mainpage">Just a step ahead</h1>
          <div>
            <div className="steps">
              <div>
                <img src={require("./Images/stars.png")} alt="" />
                <h1 className="headers2_mainpage">1</h1>
                <p>Apply to be an anchor</p>
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
                <p>Hurray,proud to be an anchor</p>
              </div>
            </div>
          </div>
        </section>

        {/* why to be an anchor */}
        <section className="why_anchors_section">
          <img src={require("./Images/main-4.png")} alt="" />
          <div className="why_anchors_desc">
            <h1 className="headers1_mainpage">
              Why to be an <span style={{ color: "#fc6262" }}>anchor</span>
            </h1>
            <span className="text_mainpage1">
              Get access of full stack solution to monetize and help your
              audience
            </span>
            <div>
              <div className="why_anchors_steps_boxes">
                <i class="fa-solid fa-people-group fa-2x"></i>
                <span>Exclusive Creator Community</span>
                <p>
                  anchors is only for exclusive creators from all social
                  platforms.
                </p>
              </div>
              <div className="why_anchors_steps_boxes">
                <i class="fa-solid fa-chart-bar fa-2x"></i>
                <span>Detailed Analysis </span>
                <p>
                  Get Completed analytics for service,profile audience and make
                  decision accordingly.
                </p>
              </div>
              <div className="why_anchors_steps_boxes">
                <i class="fa-solid fa-circle-play fa-2x"></i>
                <span>Offer Free/Paid Content</span>
                <p>
                  Complete control on your service whether you want to use
                  free/paid content.
                </p>
              </div>
              <div className="why_anchors_steps_boxes">
                <i class="fa-solid fa-masks-theater fa-2x"></i>
                <span>Know your Audience</span>
                <p>
                  anchors enable your audience to accept your query and send to
                  you.
                </p>
              </div>
            </div>
            {/* <div>
            <span className="text_mainpage1">
              <i class="fa-solid fa-check"></i>Detailed Analysis Report
            </span>
            <span className="text_mainpage1">
              <i class="fa-solid fa-check"></i>Offer workshops based on your
              content
            </span>
            <span className="text_mainpage1">
              <i class="fa-solid fa-check"></i>Accept payment directly from
              audience.
            </span>
            <span className="text_mainpage1">
              <i class="fa-solid fa-check"></i>Communicate with audience
            </span>
            <span className="text_mainpage1">
              <i class="fa-solid fa-check"></i>Premium community access
            </span>
            <span className="text_mainpage1">
              <i class="fa-solid fa-check"></i>Connect with audience to know
              insights{" "}
            </span>
          </div> */}
          </div>
        </section>

        {/* What can you upload facilities of anchors */}
        <section className="facilities">
          <h1 className="headers1_mainpage">What all you can upload </h1>
          <span>
            Anchors empower you to share curated content and expertise in
            various formats to a targeted audience
          </span>
          <div className="facilities_boxes">
            <div>
              <i class="fa-solid fa-circle-play fa-xl"></i>
              <span>Video</span>
              <p>Recordings, Lecture, Concepts etc</p>
            </div>
            <div>
              <i class="fa-regular fa-file-lines fa-xl"></i>
              <span>Documents</span>
              <p>Notes,Interview Questions concepts etc.</p>
            </div>
            <div>
              <i class="fa-regular fa-file-excel fa-xl"></i>
              <span>Excel Sheets</span>
              <p>Curated Lists, Opportunity list etc.</p>
            </div>
            <div>
              <i class="fa-regular fa-image fa-xl"></i>
              <span>Image Assets</span>
              <p>Wallpapers, Artworks,Graphics etc</p>
            </div>
          </div>
        </section>

        {/* join and eligibility section */}
        <section className="eligibility_mainpage" id="eligibility">
          <h1 className="headers1_mainpage">Join our team as an anchor</h1>
          <p>
            Unlocking the full potential of the creator economy through
            boundless innovation and sustainable growth
          </p>
          <span>Choose a platform </span>
          <div className="eligibility_check_section">
            <section>
              <span
                className={platform === 1 && "active_platform"}
                onClick={() => {
                  setPlatform(1);
                }}
              >
                <i class="fa-brands fa-linkedin-in fa-2x"></i>
              </span>
              <span
                className={platform === 2 && "active_platform"}
                onClick={() => {
                  setPlatform(2);
                }}
              >
                <i class="fa-brands fa-youtube fa-2x"></i>
              </span>
              <span
                className={platform === 3 && "active_platform"}
                onClick={() => {
                  setPlatform(3);
                }}
              >
                <i class="fa-brands fa-telegram fa-2x"></i>
              </span>
              <span
                className={platform === 4 && "active_platform"}
                onClick={() => {
                  setPlatform(4);
                }}
              >
                <i class="fa-brands fa-instagram fa-2x"></i>
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
          <button onClick={handleCheckEligibility}>
            {window.screen.width < 600
              ? "Let’s Get Started"
              : "Check Eligibility"}
          </button>
        </section>

        {/* featured creators section */}
        <section className="featured_creators" id="featured-creators">
          <h1 className="headers1_mainpage">People who Trust us </h1>
          <span>
            Building Trust: The Key to Strong and Lasting Relationships
          </span>
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
                      mixpanel.track("Clicked trusted Creators on Main Page",{
                        creator:"Himanshu Shekhar"
                      });
                      navigate("/c/himanshu-shekhar");
                    }}
                  >
                    <img src={require("./Images/himanshu1.jpg")} alt="creator"></img>
                    <div className="creator_section_imagetext">
                      <div className="creator_section_imagewrap">
                        <div className="creator_section_imagetext_text">
                          <span>Himanshu Shekhar</span>
                          <span>Linkedin 60K Followers</span>
                        </div>
                        <div
                          className="creator_section_icon"
                          onClick={(e) => {
                            e.stopPropagation();
                            mixpanel.track("Clicked Social Media of Creators on Main Page",{
                              creator:"Himanshu Shekhar"
                            });
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
                      mixpanel.track("Clicked trusted Creators on Main Page",{
                        creator:"Himanshu Kumar"
                      });
                      navigate("/c/himanshu-kumar");
                    }}
                  >
                    {" "}
                    <img src={require("./Images/himanshu2.jpg")} alt="creator"></img>
                    <div className="creator_section_imagetext">
                      <div className="creator_section_imagewrap">
                        <div className="creator_section_imagetext_text">
                          <span>Himanshu Kumar</span>
                          <span>Linkedin 94K Followers</span>
                        </div>
                        <div
                          className="creator_section_icon"
                          onClick={(e) => {
                            e.stopPropagation();
                            mixpanel.track("Clicked Social Media of Creators on Main Page",{
                              creator:"Himanshu Kumar"
                            });
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
                    mixpanel.track("Clicked trusted Creators on Main Page",{
                      creator:"Himanshu Shekhar"
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
                        <span>Linkedin 60K Followers</span>
                      </div>
                      <div className="creator_section_icon">
                        <BsLinkedin
                          size={28}
                          onClick={(e) => {
                            e.stopPropagation();
                            mixpanel.track("Clicked Social Media of Creators on Main Page",{
                              creator:"Himanshu Shekhar"
                            });
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
                    mixpanel.track("Clicked trusted Creators on Main Page",{
                      creator:"Himanshu Kumar"
                    });
                    navigate("/c/himanshu-kumar");
                  }}
                >
                  <img
                    src={require("./Images/himanshu2.jpg")}
                    alt="creator"
                  ></img>
                  <div className="creator_section_imagetext">
                    <div className="creator_section_imagewrap">
                      <div className="creator_section_imagetext_text">
                        <span>Himanshu Kumar</span>
                        <span>Linkedin 94K Followers</span>
                      </div>
                      <div className="creator_section_icon">
                        <BsLinkedin
                          size={28}
                          onClick={(e) => {
                            e.stopPropagation();
                            mixpanel.track("Clicked Social Media of Creators on Main Page",{
                              creator:"Himanshu Kumar"
                            });
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
                <i class="fa-solid fa-arrow-left fa-2x"></i>
              </button>
              <button id="next_slide_button">
                <i class="fa-solid fa-arrow-right fa-2x"></i>
              </button>
            </div>
          )}
        </section>

        {/* Feedback or wall of love section */}
        <section className="wall_of_love">
          <h1 className="headers1_mainpage">Wall of Love</h1>
          <div>
            {data
              ? data
                  ?.filter((e1) => {
                    return e1?.userID?.name;
                  })
                  .map((e) => {
                    return  <div className="feedback_box_mainpage" key={e?.userID}>
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
                          {e?.userID?.name.length > 13 ? e?.userID?.name.slice(0,13) + "..." : e?.userID?.name}
                          </span>
                          {/* <span className="user_email_mainpage">
                            abc@gmail.com
                          </span> */}
                        </div>
                      </section>
                      <p>
                      {e?.desc.length > 190 ? e?.desc.slice(0,190) + "..." : e?.desc}
                      </p>
                    </div>;
                  })
              : ""}
          </div>
        </section>
        <Footer />
      </div>
    </>
  );
}

export default Main;
