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
            An INVITE ONLY community for creators to monetize your {" "}
              <span style={{ color: "#ffffff" }}>
                Content, skill{" "}
              </span> & {" "}
              <span style={{ color: "#ffffff" }}>
                expertise.
              </span>
            </p>

            <button onClick={handleStart}>I want to Join</button>
          </div>
          <img
            src={require("./Images/hero_img.jpg")}
            alt=""
            className="hero_section_image"
          />
        </section>

        {/* steps of anchors verification */}
        <section className="steps_anchors_mainpage">
          <h1 className="headers1_mainpage">Few Clicks Away</h1>
          <div>
            <div className="steps">
              <div>
                <img src={require("./Images/stars.png")} alt="" />
                <h1 className="headers2_mainpage">1</h1>
                <p>Check Eligibility</p>
              </div>
            </div>
            <div className="steps">
              <div>
                <img src={require("./Images/stars.png")} alt="" />
                <h1 className="headers2_mainpage">2</h1>
                <p>Apply to be an Anchor</p>
              </div>
            </div>
            <div className="steps">
              <div>
                <img src={require("./Images/stars.png")} alt="" />
                <h1 className="headers2_mainpage">3</h1>
                <p>Unlock the gates to EXCLUSIVITY</p>
              </div>
            </div>
          </div>
        </section>

        {/* why to be an anchor */}
        <section className="why_anchors_section">
          <img src={require("./Images/main-4.png")} alt="" />
          <div className="why_anchors_desc">
            <h1 className="headers1_mainpage">
            Why am I <span style={{ color: "#fc6262" }}>here?</span>
            </h1>
            <span className="text_mainpage1">
            To avail the benefits of a helpful, like-minded yet diverse community! 
            </span>
            <div>
              <div className="why_anchors_steps_boxes">
                <i class="fa-solid fa-people-group fa-2x"></i>
                <span>An All-Access Pass</span>
                <p>
                anchors is an EXCLUSIVE creator community from across platforms brought together to achieve greatness.
                </p>
              </div>
              <div className="why_anchors_steps_boxes">
                <i class="fa-solid fa-chart-bar fa-2x"></i>
                <span>Crunched Numbers & Data</span>
                <p>
                A detailed analysis of all things important to streamline & amplify your growth.
                </p>
              </div>
              <div className="why_anchors_steps_boxes">
                <i class="fa-solid fa-circle-play fa-2x"></i>
                <span>Complete Autonomy!</span>
                <p>
                Want to charge for some content but share the rest for free? You're free to make your decisions.
                </p>
              </div>
              <div className="why_anchors_steps_boxes">
                <i class="fa-solid fa-masks-theater fa-2x"></i>
                <span>Meaningful Interactions</span>
                <p>
                Let your followers tell you they love you and for what. A simple, clean way to steer your growth.
                </p>
              </div>
            </div>
            
          </div>
        </section>

        {/* What can you upload facilities of anchors */}
        <section className="facilities">
          <h1 className="headers1_mainpage">What all can I do?</h1>
          <span>
          Empower yourself by sharing content in your choice of format.
          </span>
          <div className="facilities_boxes">
            <div>
              <i class="fa-solid fa-circle-play fa-xl"></i>
              <span>Video</span>
              <p>Add a personal touch with Interview Q&A's, How-to Tutorials, Lectures etc. to engage your audience</p>
            </div>
            <div>
              <i class="fa-regular fa-file-lines fa-xl"></i>
              <span>Documents</span>
              <p>Express yourself and share concepts, tricks and tips and many more things via any document format</p>
            </div>
            <div>
              <i class="fa-regular fa-file-excel fa-xl"></i>
              <span>Excel Sheets</span>
              <p>From curated lists to opportunity lists, you can upload whatever you want via simple (or complex) Excel sheets</p>
            </div>
            <div>
              <i class="fa-regular fa-image fa-xl"></i>
              <span>Image Assets</span>
              <p>Artworks, Wallpapers & other graphics are indispensible. Upload photos that hook your audience</p>
            </div>
          </div>
        </section>

        {/* join and eligibility section */}
        <section className="eligibility_mainpage" id="eligibility">
          <h1 className="headers1_mainpage">Do you have what it takes?</h1>
          <p>
          To unlock your full potential in a community exclusively for you! 
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
             Check Eligibility
          </button>
        </section>

        {/* featured creators section */}
        <section className="featured_creators" id="featured-creators">
          <h1 className="headers1_mainpage">Where's the trust?  </h1>
          <span>
          Creators that came, that saw, that loved
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
                          <span>Linkedin 65K Followers</span>
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
                          <span>Linkedin 111K Followers</span>
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
                        <span>Linkedin 65K Followers</span>
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
                        <span>Linkedin 111K Followers</span>
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
          <h1 className="headers1_mainpage">Nothing beats Audience Reviews</h1>
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
        <Footer/>
      </div>
        
    </>
  );
}

export default Main;
