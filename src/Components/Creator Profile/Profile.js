import React, { useContext, useEffect, useState, useRef } from "react";
import "./Profile.css";
import ServiceContext from "../../Context/services/serviceContext";
import { creatorContext } from "../../Context/CreatorState";
import { userContext } from "../../Context/UserState";
import { Link, useParams, useLocation, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import User_login from "../Login/Users/User_login";
import { Cross as Hamburger } from "hamburger-react";
import mixpanel from "mixpanel-browser";
import { feedbackcontext } from "../../Context/FeedbackState";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, Pagination } from "swiper";
import Footer from "../Footer/Footer.js";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { SuperSEO } from "react-super-seo";
import { Button } from "@mui/material";

function Profile(props) {
  const services_list = useRef();
  const workshop_list = useRef();
  const about = useRef();
  const reviews = useRef();
  const requests = useRef();
  const navigate = useNavigate();

  const location = useLocation();
  const context = useContext(ServiceContext);
  const { slug } = useParams();
  const [openModel, setOpenModel] = useState(false);
  const [willPay, setwillPay] = useState();
  const [amount, setAmount] = useState();
  const [requestQuery, setRequestQuery] = useState("");
  const [UserDetails, setUserDetails] = useState();

  const { services, getallservicesusingid, workshops, getallworkshopsusingid } =
    context;
  const { getcreatoridUsingSlug, basicCreatorInfo, basicCdata } =
    useContext(creatorContext);

  const { getallfeedback, feedbacks, createRequest } =
    useContext(feedbackcontext);

  const { addSubscriber, checkSubscriber, getUserDetails } =
    useContext(userContext);

  let count = 0;
  let countworkshop = 0;

  useEffect(() => {
    const process = async () => {
      getcreatoridUsingSlug(slug).then((data) => {
        getallfeedback(data);
        getallservicesusingid(data).then(() => {});
        getallworkshopsusingid(data).then(() => {});
      });
      if (
        localStorage.getItem("isUser") === "true" &&
        localStorage.getItem("jwtToken")
      ) {
        await checkSubscriber(basicCreatorInfo.creatorID);
      }
    };
    toast.promise(
      process,
      {
        pending: "Please Wait for few seconds..",
        error: "Try Again by reloading the page!",
      },
      {
        position: "top-center",
        autoClose: 2000,
      }
    );

    process();

    // eslint-disable-next-line
  }, []);

  //Scroll to top automatically

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    getUserDetails().then((e) => {
      if (e.success) {
        setUserDetails(e?.user?.email);
      }
    });
  }, [localStorage.getItem("jwtToken")]);

  const dox1 = document.getElementById("unsubscribe");
  const dox2 = document.getElementById("subscribe");

  setTimeout(() => {
    if (
      localStorage.getItem("isUser") === "true" &&
      localStorage.getItem("jwtToken")
    ) {
      checkSubscriber(basicCreatorInfo.creatorID).then((data) => {
        if (data) {
          if (dox1 && dox2) {
            dox1.style.display = "none";
            dox2.style.display = "inline-block";
          }
        }
      });
    }
  }, 100);

  useEffect(() => {
    if (window.screen.width < 500) {
      const doc = document.querySelector(".mobile_nav_menu");
      window.addEventListener("scroll", () => {
        if (window.scrollY > 410) {
          doc.style.display = "flex";
        } else if (window.scrollY < 60) {
          doc.style.display = "none";
        }
      });
    }

    mixpanel.track("Page Visit", {
      user: UserDetails ? UserDetails : "",
      creator: basicCdata?.slug,
    });
    // eslint-disable-next-line
  }, []);

  if (!localStorage.getItem("isUser") === "") {
    localStorage.removeItem("url");
  } else {
    localStorage.setItem("url", location.pathname);
  }

  const handledropdown = () => {
    document.querySelector(".user_logout").style.display !== "none"
      ? (document.querySelector(".user_logout").style.display = "none")
      : (document.querySelector(".user_logout").style.display = "inline-block");
  };

  const userlogout = () => {
    window.location.pathname = "/logout";
  };
  const handleServiceClick = (slug) => {
    mixpanel.track("Service Card Clicked", {
      creator: basicCdata?.slug,
      user: UserDetails ? UserDetails : "",
      service: slug,
    });
  };

  const subscribeMe = async () => {
    if (!localStorage.getItem("jwtToken")) {
      mixpanel.track("Clicked Subscribe button on creators page before login", {
        creator: slug,
      });
      return setOpenModel(true); //open the user model for authentication
    }
    props.progress(8);
    const subscribe = addSubscriber(basicCreatorInfo.creatorID, 0);
    if (subscribe) {
      document.querySelector("#unsubscribe").style.display = "none";
      document.querySelector("#subscribe").style.display = "inline-block";
      mixpanel.track("Subscribed Creator on Creator Page", {
        creator: basicCdata?.slug,
        user: UserDetails ? UserDetails : "",
      });
    } else {
      toast.info("You are Already Subscribed", {
        position: "top-center",
        autoClose: 2000,
      });
    }

    props.progress(75);
    props.progress(100);
  };

  const handleNavigation = (e1, e) => {
    e.preventDefault();
    const doc = document.querySelectorAll(
      window.screen.width < 550 ? ".mobile_nav_menu" : ".nav_left_side_profile"
    );
    window.scrollTo({
      top: e1.current.offsetTop - 70,
      behavior: "smooth",
    });
    doc[0].children[0].className = "";
    doc[0].children[1].className = "";
    doc[0].children[2].className = "";
    doc[0].children[3].className = "";
    doc[0].children[4].className = "";

    if (e.target.innerText === "About") {
      e.target.className = "active_nav_item";
    } else if (e.target.innerText === "Resources") {
      e.target.className = "active_nav_item";
    } else if (e.target.innerText === "Reviews") {
      e.target.className = "active_nav_item";
    } else if (e.target.innerText === "Workshops") {
      e.target.className = "active_nav_item";
    } else if (e.target.innerText === "Request") {
      e.target.className = "active_nav_item";
    }
  };

  const handleRequestClick = (e) => {
    e.preventDefault();
    //const doc1 = document.querySelectorAll(".checkbox_yesno")
    //let v1 = doc1[0].checked
    //let v2 = doc1[1].checked
    if (
      localStorage.getItem("jwtToken") &&
      localStorage.getItem("isUser") === "true"
    ) {
      //if (requestQuery !== "" && (v1 || v2) ) {
      if (requestQuery !== "") {
        createRequest(
          basicCreatorInfo?.creatorID,
          requestQuery,
          //v1 ? true : false,
          amount === 0 || !amount ? false : true,
          amount ? amount : 0
        ).then((e) => {
          if (e.success) {
            toast.success("Request Captured Successfully", {
              position: "bottom-center",
              autoClose: 2500,
            });
            setRequestQuery("");
            setAmount("");
          } else if (e.already) {
            toast.info("You had already passed a request to the creator", {
              position: "bottom-center",
              autoClose: 2500,
            });
            setRequestQuery("");
            setAmount("");
          } else {
            toast.error("Some error occured, try again after some time!!", {
              position: "bottom-center",
              autoClose: 2500,
            });
          }
        });
      } else {
        toast.error("Please fill the mandatory fields", {
          position: "bottom-center",
          autoClose: 2500,
        });
      }
    } else {
      setOpenModel(true);
    }
  };

  if (
    window.location.search === "?goto=services" ||
    (window.location.search === "?goto=services" &&
      window.location.hash === "#services")
  ) {
    setTimeout(() => {
      window.location.hash = "#services";
    }, 500);
  }
  if (
    window.location.search === "?goto=about" ||
    (window.location.search === "?goto=about" &&
      window.location.hash === "#about")
  ) {
    setTimeout(() => {
      window.location.hash = "#about";
    }, 500);
  }
  if (
    window.location.search === "?goto=workshops" ||
    (window.location.search === "?goto=workshops" &&
      window.location.hash === "#workshops")
  ) {
    setTimeout(() => {
      window.location.hash = "#workshops";
    }, 500);
  }
  if (
    window.location.search === "?goto=reviews" ||
    (window.location.search === "?goto=reviews" &&
      window.location.hash === "#reviews")
  ) {
    setTimeout(() => {
      window.location.hash = "#reviews";
    }, 500);
  }
  if (
    window.location.search === "?goto=requests" ||
    (window.location.search === "?goto=requests" &&
      window.location.hash === "#requests")
  ) {
    setTimeout(() => {
      window.location.hash = "#requests";
    }, 500);
  }

  if (basicCdata.status === 0) return alert("The Creator doesn't exist");

  return (
    <>
      <ToastContainer />
      <div className="profile_section">
        <User_login
          open={openModel}
          onClose={() => {
            setOpenModel(false);
          }}
        />
        <div className="profile_header">
          <div className="logo">
            <img src={require("../logo.png")} alt="Logo" />
            <span>anchors</span>
          </div>
          {localStorage.getItem("isUser") === "" ? (
            ""
          ) : (
            <div className="user_login">
              <span>
                {!localStorage.getItem("jwtToken") ? (
                  <>
                    <span
                      className="login_button_user"
                      onClick={() => {
                        mixpanel.track(
                          "Clicked Login button on creators profile page",
                          {
                            creator: slug,
                          }
                        );
                        setOpenModel(true);
                      }}
                    >
                      Login
                    </span>
                  </>
                ) : (
                  <>
                    {" "}
                    <Button
                      className="cprofile-userdashbutton"
                      variant="contained"
                      onClick={() => {
                        window.open("/user/dashboard");
                      }}
                    >
                      Dashboard
                    </Button>
                    <span className="user_login_name">
                      {localStorage.getItem("user").slice(0, 12) ===
                      localStorage.getItem("user")
                        ? localStorage.getItem("user")
                        : localStorage.getItem("user").slice(0, 12) + ".."}
                      <i
                        className="fa-solid fa-caret-down"
                        onClick={handledropdown}
                      ></i>
                      <Hamburger
                        className="hamburger-react"
                        size={20}
                        onToggle={(toggled) => {
                          if (toggled) {
                            document.querySelector(
                              ".hamburger-menu"
                            ).style.display = "block";
                          } else {
                            document.querySelector(
                              ".hamburger-menu"
                            ).style.display = "none";
                            // close a menu
                          }
                        }}
                      />
                      <button className="user_logout" onClick={userlogout}>
                        Logout
                      </button>
                      <ul className="hamburger-menu">
                        <li className="hamburger-item" onClick={userlogout}>
                          Logout
                        </li>
                      </ul>
                    </span>
                  </>
                )}
              </span>
            </div>
          )}
        </div>

        <div className="profile_page">
          <div className="profile_page_left">
            <div className="service_page_creator creator_box_profile">
              <img
                src={basicCdata?.photo}
                alt="creator"
                className="service_page_profile_pic profile_pic_creator"
                onClick={(e) => {
                  e.preventDefault();
                  mixpanel.track(
                    "Clicked Creators profile pic on service page",
                    {
                      service: slug,
                      user: UserDetails ? UserDetails : "",
                      creator: basicCdata?.slug,
                    }
                  );
                }}
              />

              <div className="serv_profile_data profile_data">
                <span className="c_name creator_name">{basicCdata?.name}</span>
                <span className="c_tagline creator_tagline">
                  {basicCreatorInfo?.tagLine?.slice(0, 100)}
                </span>
                <section>
                  {basicCreatorInfo?.linkedInLink && (
                    <a
                      target="_blank"
                      without
                      rel="noreferrer"
                      href={basicCreatorInfo?.linkedInLink}
                      className=""
                      style={{ textDecoration: "none" }}
                    >
                      <i className="fa-brands fa-linkedin fa-xl linkedin_icon"></i>
                    </a>
                  )}
                  {basicCreatorInfo?.ytLink && (
                    <a
                      target="_blank"
                      without
                      rel="noreferrer"
                      href={basicCreatorInfo?.ytLink}
                      className=""
                      style={{ textDecoration: "none" }}
                    >
                      <i className="fa-brands fa-youtube fa-xl youtube_icon"></i>
                    </a>
                  )}
                  {basicCreatorInfo?.teleLink && (
                    <a
                      target="_blank"
                      without
                      rel="noreferrer"
                      href={basicCreatorInfo?.teleLink}
                      className=""
                      style={{ textDecoration: "none" }}
                    >
                      <i className="fa-brands fa-telegram fa-xl telegram_icon"></i>
                    </a>
                  )}
                  {basicCreatorInfo?.instaLink && (
                    <a
                      target="_blank"
                      without
                      rel="noreferrer"
                      href={basicCreatorInfo?.instaLink}
                      className=""
                      style={{ textDecoration: "none" }}
                    >
                      <i className="fa-brands fa-instagram fa-xl insta_icon"></i>
                    </a>
                  )}
                  {basicCreatorInfo?.twitterLink && (
                    <a
                      target="_blank"
                      without
                      rel="noreferrer"
                      href={basicCreatorInfo?.twitterLink}
                      className=""
                      style={{ textDecoration: "none" }}
                    >
                      <i className="fa-brands fa-twitter fa-xl twitter_icon"></i>
                    </a>
                  )}
                  {basicCreatorInfo?.fbLink && (
                    <a
                      target="_blank"
                      without
                      rel="noreferrer"
                      href={basicCreatorInfo?.fbLink}
                      className=""
                      style={{ textDecoration: "none" }}
                    >
                      <i className="fa-brands fa-facebook fa-xl fb_icon"></i>
                    </a>
                  )}
                </section>

                {localStorage.getItem("isUser") === "" &&
                localStorage.getItem("jwtToken") ? (
                  ""
                ) : (
                  <>
                    <button
                      onClick={subscribeMe}
                      className="subscribe_now "
                      id="unsubscribe"
                    >
                      <i className="fa-solid fa-user-plus"></i> Subscribe Free
                    </button>
                    <button className="subscribe_now" id="subscribe">
                      <i className="fa-solid fa-check"></i> Subscribed
                    </button>
                    <span
                      style={{
                        fontSize: "0.7rem",
                        textAlign: "center",
                        marginTop: "5px",
                      }}
                    >
                      Subscribe me free and get latest updates on your email
                    </span>
                  </>
                )}
              </div>
            </div>

            <div
              className={
                window.screen.width < 550
                  ? "mobile_nav_menu"
                  : "nav_left_side_profile"
              }
            >
              <span
                className="active_nav_item"
                onClick={(e) => handleNavigation(about, e)}
              >
                About
              </span>
              {services?.res?.length === 0 ? (
                ""
              ) : (
                <span onClick={(e) => handleNavigation(services_list, e)}>
                  Resources
                </span>
              )}
              {workshops?.res?.length === 0 ? (
                ""
              ) : (
                <span onClick={(e) => handleNavigation(workshop_list, e)}>
                  Workshops
                </span>
              )}
              {feedbacks?.filter((e) => e.status === 1).length === 0 ? (
                ""
              ) : (
                <span onClick={(e) => handleNavigation(reviews, e)}>
                  Reviews
                </span>
              )}
              <span onClick={(e) => handleNavigation(requests, e)}>
                Request
              </span>
            </div>
          </div>

          <div className="profile_page_right">
            <div className="about_creator_profile" id="about" ref={about}>
              <h2 className="headers_tag">About me</h2>
              <div className="about_details_c">
                {document.querySelector(".about_details_c")
                  ? (document.querySelector(".about_details_c").innerHTML =
                      basicCreatorInfo?.aboutMe)
                  : ""}
              </div>
            </div>

            {services?.res?.length === 0 ? (
              ""
            ) : (
              <div ref={services_list} id="services">
                <h2 className="headers_tag">Available Resources</h2>
                <div className="display_services_list">
                  {services.res?.map((e) => {
                    if (e.status === 1) {
                      count++;
                      return (
                        <Link
                          to={`/s/${e.slug}`}
                          key={e._id}
                          style={{ textDecoration: "none" }}
                        >
                          <div
                            className="item_displayed"
                            onClick={() => handleServiceClick(e.slug)}
                          >
                            <img src={e.simg} alt="..." />
                            <h2>{e.sname}</h2>
                            {/* <span
                    className={`${
                      e.isPaid === true ? "paid" : "free"
                    }_tag_dispalyed`}
                  >
                    {e.isPaid === true ? "Paid" : "Free"}
                  </span> */}
                          </div>
                        </Link>
                      );
                    } else {
                      return "";
                    }
                  })}
                  {count === 0 ? (
                    <h1 className="no_services">No services to display</h1>
                  ) : (
                    ""
                  )}
                </div>
              </div>
            )}
            {workshops?.res?.length === 0 ? (
              ""
            ) : (
              <div ref={workshop_list} id="workshops">
                <h2 className="headers_tag">Workshops</h2>
                <div className="display_services_list">
                  {workshops.res?.map((e) => {
                    if (e.status === 1) {
                      countworkshop++;
                      return (
                        <Link
                          to={`/w/${e.slug}`}
                          key={e._id}
                          style={{ textDecoration: "none" }}
                        >
                          <div
                            className="item_displayed"
                            onClick={() => handleServiceClick(e.slug)}
                          >
                            <img src={e.simg} alt="..." />
                            <h2>{e.sname}</h2>
                            <span className="profile_page_display_date">
                              {new Date(e.startDate).toLocaleDateString(
                                "en-US",
                                {
                                  year: "numeric",
                                  month: "short",
                                  day: "numeric",
                                  timeZone: "Asia/Kolkata",
                                }
                              )}
                              <span>
                                <i
                                  class="fa-solid fa-location-dot fa-xl"
                                  style={{ color: "red" }}
                                ></i>{" "}
                                &nbsp; Online{" "}
                              </span>
                            </span>
                            {/* <span
                            className={`${
                              e.isPaid === true ? "paid" : "free"
                            }_tag_dispalyed`}
                          >
                            {e.isPaid === true ? "Paid" : "Free"}
                          </span> */}
                          </div>
                        </Link>
                      );
                    } else {
                      return "";
                    }
                  })}
                  {countworkshop === 0 ? (
                    <h1 className="no_services">No Workshops to display</h1>
                  ) : (
                    ""
                  )}
                </div>
              </div>
            )}
            {console.log(feedbacks.length)}
            {feedbacks?.filter((e) => e.status === 1).length === 0 ? (
              ""
            ) : (
              <div className="user_comments_lists" ref={reviews} id="reviews">
                <div className="review_header">
                  <h2 className="headers_tag">Resources Reviews</h2>
                  <p className="slide_button">
                    <span>
                      <i
                        className="fa-solid fa-angle-left fa-xl"
                        id="prev_slide_button"
                      ></i>
                    </span>
                    <span>
                      <i
                        className="fa-solid fa-angle-right fa-xl"
                        id="next_slide_button"
                      ></i>
                    </span>
                  </p>
                </div>
                <Swiper
                  slidesPerView={
                    window.matchMedia("(max-width: 500px)").matches ? 1 : 3
                  }
                  spaceBetween={
                    window.matchMedia("(max-width: 500px)").matches ? 5 : 20
                  }
                  //autoplay={{
                  //  delay: 3000,
                  //  disableOnInteraction: false,
                  //}}
                  loop={
                    feedbacks?.filter((e) => e.status === 1).length > 3
                      ? true
                      : false
                  }
                  pagination={{
                    dynamicBullets: true,
                  }}
                  navigation={{
                    nextEl: "#next_slide_button",
                    prevEl: "#prev_slide_button",
                  }}
                  modules={[Pagination, Navigation]}
                  className="mySwiper"
                >
                  {feedbacks?.filter((e) => e.status === 1).length !== 0 ? (
                    feedbacks
                      ?.filter((e) => e.status === 1)
                      .map((e2, index) => {
                        return (
                          <SwiperSlide key={index}>
                            <div className="comment_box">
                              <section>
                                <img
                                  src={e2?.photo}
                                  alt="user"
                                  className="user_profile_pic"
                                />
                                <span className="review_name_stars">
                                  <span className="user_name">
                                    {e2?.name
                                      ? e2?.name.length > 15
                                        ? e2?.name.slice(0, 15) + ".."
                                        : e2?.name
                                      : "--"}
                                  </span>
                                  <span className="review_stars">
                                    {Array(e2?.rating)
                                      .fill("a")
                                      ?.map((e, i) => {
                                        return (
                                          <i className="fa-solid fa-star"></i>
                                        );
                                      })}
                                  </span>
                                </span>
                              </section>
                              <p className="fb_desc">{e2?.desc}</p>
                            </div>
                          </SwiperSlide>
                        );
                      })
                  ) : (
                    <h1 className="no_services">No reviews to display</h1>
                  )}
                </Swiper>
              </div>
            )}

            <div className="request_query_section" ref={requests} id="request">
              <div>
                <h2 className="headers_tag">Request New Resources</h2>
                <span className="span_t1">
                  you can request for any other resource
                </span>
              </div>
              <span>
                Let {basicCreatorInfo?.name} know what you want in the next
                document.
              </span>
              <textarea
                type="text"
                placeholder="Ex: Please share resources for DSA.."
                value={requestQuery}
                onChange={(e) => setRequestQuery(e.target.value)}
              />
              <span>How much will you pay for the document (in INR)?</span>
              <div className="selection">
                <input
                  type="number"
                  className="request_amount_input"
                  name="amount"
                  id="amount"
                  value={amount}
                  onChange={(e) => {
                    setAmount(parseInt(e.target.value));
                  }}
                  placeholder="Ex. 99"
                />
                {/* <span>
                  <input type="checkbox" name="yes" id="yesvalue" className="checkbox_yesno" onClick={()=>{document.querySelectorAll(".checkbox_yesno")[1].checked = false}}/>
                  <label htmlFor="yesvalue">Yes</label>
                </span>
                <span>
                  <input type="checkbox" name="yes" id="novalue" className="checkbox_yesno" onClick={()=>{document.querySelectorAll(".checkbox_yesno")[0].checked = false}}/>
                  <label htmlFor="novalue">No</label>
                </span> */}
              </div>
              <button className="submit_request" onClick={handleRequestClick}>
                Submit
              </button>
            </div>
          </div>
        </div>
        <Footer />
      </div>
      <SuperSEO
        title={`Anchors - ${basicCdata?.name} `}
        description={basicCreatorInfo?.aboutMe}
        lang="en"
        openGraph={{
          ogImage: {
            ogImage: basicCdata?.photo,
            ogImageAlt: basicCdata?.name,
            ogImageType: "image/jpeg",
          },
        }}
        twitter={{
          twitterSummaryCard: {
            summaryCardImage: basicCdata?.photo,
            summaryCardImageAlt: basicCdata?.name,
            summaryCardSiteUsername: basicCdata?.name,
          },
        }}
      />
    </>
  );
}

export default Profile;
