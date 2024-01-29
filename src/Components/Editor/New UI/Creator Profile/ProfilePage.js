import React, { Suspense, lazy, useContext, useEffect, useState } from "react";
import "./ProfilePage.css";
import { RiStarSFill } from "react-icons/ri";

import InstagramIcon from "../../../../Utils/Icons/instagram.svg";
import fbIcon from "../../../../Utils/Icons/fb.svg";
import TelgramIcon from "../../../../Utils/Icons/telegram.svg";
import YoutubeIcon from "../../../../Utils/Icons/youtube.svg";
import topmateIcon from "../../../../Utils/Icons/topmate.svg";
import linkedinIcon from "../../../../Utils/Icons/linkedin.svg";
import TwitterIcon from "../../../../Utils/Icons/twitter.svg"
import { TbBrandLinkedin } from "react-icons/tb";
import { FaSquareXTwitter } from "react-icons/fa6";
import { RiTelegramLine } from "react-icons/ri";
import { CiFacebook } from "react-icons/ci";
import { IoIosGlobe } from "react-icons/io";
import {
  AiOutlineArrowRight,
  AiOutlineClockCircle,
  AiOutlineDown,
  AiOutlineUp,
} from "react-icons/ai";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { creatorContext } from "../../../../Context/CreatorState";
import ServiceContext from "../../../../Context/services/serviceContext";
import { feedbackcontext } from "../../../../Context/FeedbackState";
import { ToastContainer, toast } from "react-toastify";
import ExcelIcon from "../../../../Utils/Icons/excel-service.svg";
import VideoIcon from "../../../../Utils/Icons/video-service.svg";
import DocIcon from "../../../../Utils/Icons/doc-service.svg";
import TrendIcon from "../../../../Utils/Icons/trend-service.svg";
import { userContext } from "../../../../Context/UserState";
import mixpanel from "mixpanel-browser";
import Seo from "../../../../Utils/Seo";
import PNGIMG from "../../../../Utils/Images/default_user.png";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { Navbar2 } from "../../../Layouts/Navbar User/Navbar";
import { Footer3 } from "../../../Footer/Footer2";
import Request_Modal from "../../../Modals/Request_Modal";
import { AiOutlineFire } from "react-icons/ai";

import { ReviewCards } from "../Service Page/Components/ReviewsSection";
import { ServiceCards } from "../Service Page/Components/MoreServices";
import { MdOutlineLaptop } from "react-icons/md";
import "react-toastify/dist/ReactToastify.css";
import CreatorProfile from "./CreatorProfile";

const convertTime = (inputTime) => {
  if (inputTime) {
    var timeParts = inputTime?.split(":");
    var hours = parseInt(timeParts[0]);
    var minutes = parseInt(timeParts[1]);

    var period = hours >= 12 ? "PM" : "AM";
    hours = hours > 12 ? hours - 12 : hours;

    var convertedTime =
      hours.toString().padStart(2, "0") +
      ":" +
      minutes.toString().padStart(2, "0") +
      " " +
      period;

    return convertedTime;
  }
};

const getDate = (date) => {
  let d = new Date(date);

  let newDate = d.toDateString().split(" ");

  return newDate[2] + " " + newDate[1];
};

const ExtraCard = ({ data, type, style }) => {
  const navigate = useNavigate();
  return (
    <div className="host_extra_card_new_profile_page">

      <div className="host_extra_card_profile_details">
        <LazyLoadImage src={data?.simg} alt="" />

        <section>
          <h2 style={{fontFamily:style}}>{data?.sname}</h2>
          <div>
            {type === "event" ? (
              <span style={{fontFamily:style}}>
                <AiOutlineClockCircle color="#94A3B8" size={14} />
                {getDate(data?.startDate) +
                  " | " +
                  convertTime(data?.time?.startTime) +
                  " - " +
                  convertTime(data?.time?.endTime)}
              </span>
            ) : (
              <>
                {data?.downloads ? (
                  <span>
                    <img src={TrendIcon} alt="" />
                    {data?.downloads} times
                  </span>
                ) : (
                  ""
                )}

                {data?.noOfPage && (
                  <span>
                    <img src={DocIcon} alt="" />
                    {data?.noOfPage} Pages
                  </span>
                )}
              </>
            )}
          </div>
        </section>

        <span>
          <AiOutlineArrowRight
            onClick={() => {
              navigate(
                type === "event" ? `/e/${data?.slug}` : `/s/${data?.slug}`
              );
            }}
          />
        </span>
      </div>
    </div>
  );
};

const HostProfile = ({
  openModelRequest,
  setOpenModelRequest,
  basicCreatorInfo,
  UserDetails,
  creatorRatingData,
  feedbacks,
  UpcomingExtraCardData,
}) => {
  const [eventCategory, SetEventCategory] = useState("Upcoming Event");
  const handleCategory = (value) => {
    SetEventCategory(value);
  };
  return (
    <>
      <ToastContainer theme="dark" />

      <Request_Modal
        open={openModelRequest}
        onClose={() => {
          setOpenModelRequest(false);
        }}
        id={basicCreatorInfo?.creatorID}
        cname={basicCreatorInfo?.name}
        UserDetails={UserDetails ? UserDetails : ""}
      />

      <div className="host_new_creator_page_outer_wrapper">
        {/* Navbar */}
        <Navbar2 LogoImage = {basicCreatorInfo?.profile} LogoName = {basicCreatorInfo?.name}/>

        <div className="host_outerframe_new_creator_page">
          {/* main details sections ---------------- */}
          <section className="host_main_creator_details_creator_page">
            <div
              style={{
                width: "100%",
                background:
                  "linear-gradient(180deg, #3E3E3E 0%, rgba(18, 18, 18, 0) 100%)",
              }}
            >
              <LazyLoadImage
                src={basicCreatorInfo?.profile}
                alt={basicCreatorInfo?.name}
                onError={({ currentTarget }) => {
                  currentTarget.onerror = null; // prevents looping
                  currentTarget.src = PNGIMG;
                }}
              />
            </div>
            <div>
              <h1 style={{fontFamily:basicCreatorInfo?.style}} className="host_text_creator_profile_page-01">
                {basicCreatorInfo?.name}
              </h1>
              
              <p style={{fontFamily:basicCreatorInfo?.style}} className="host_text_creator_profile_page-02">
                {basicCreatorInfo?.tagLine}
              </p>
              {window.screen.width > 600 && (
                <>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "row-reverse",
                      width: "max-content",
                      gap: "20px",
                    }}
                  >
                    <div className="host_social-icons-new-creator-page">
                      {basicCreatorInfo?.linkedInLink?.length !== 0 && (
                        <div
                          onClick={() => {
                            mixpanel.track("Linkedin redirect");
                            window.open(basicCreatorInfo?.linkedInLink);
                          }}
                        >
                          <TbBrandLinkedin size={24} color="#94A3B8"/>
                          {/* <img src={<TbBrandLinkedin / >} alt="" /> */}
                        </div>
                      )}

                      {basicCreatorInfo?.fbLink?.length !== 0 && (
                        <div
                          onClick={() => {
                            mixpanel.track("Fb redirect");
                            window.open(basicCreatorInfo?.fbLink);
                          }}
                        >
                          <CiFacebook size={24} color="#94A3B8"/>
                          {/* <img src={fbIcon} alt="" /> */}
                        </div>
                      )}

                      {basicCreatorInfo?.instaLink?.length !== 0 && (
                        <div
                          onClick={() => {
                            mixpanel.track("Instagram redirect");
                            window.open(basicCreatorInfo?.instaLink);
                          }}
                        >
                          <img src={InstagramIcon} alt="" />
                        </div>
                      )}

                      {basicCreatorInfo?.teleLink?.length !== 0 && (
                        <div
                          onClick={() => {
                            mixpanel.track("Telegram redirect");
                            window.open(basicCreatorInfo?.teleLink);
                          }}
                        >
                          <RiTelegramLine  size={24} color="#94A3B8"/>
                          {/* <img src={TelgramIcon} alt="" /> */}
                        </div>
                      )}

                      {basicCreatorInfo?.ytLink?.length !== 0 && (
                        <div
                          onClick={() => {
                            mixpanel.track("Youtube redirect");
                            window.open(basicCreatorInfo?.ytLink);
                          }}
                        >
                          <img src={YoutubeIcon} alt="" />
                        </div>
                      )}

                      {basicCreatorInfo?.twitterLink?.length !== 0 && (
                        <div
                          onClick={() => {
                            mixpanel.track("twitter redirect");
                            window.open(basicCreatorInfo?.twitterLink);
                          }}
                        >
                          {/* <FaSquareXTwitter size={24} color="#94A3B8"/> */}
                          <img src={TwitterIcon} alt="" />
                        </div>
                      )}
                      {basicCreatorInfo?.websiteLink?.length !== 0 && (
                        <div
                          onClick={() => {
                            mixpanel.track("website redirect");
                            window.open(basicCreatorInfo?.websiteLink);
                          }}
                        >
                          <IoIosGlobe size={24} color="#94A3B8"/>
                          {/* <img src={YoutubeIcon} alt="" /> */}
                        </div>
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>
          </section>
          {/* Deatils section for mobile --------- */}
          {window.screen.width < 600 && (
            <section style={{ width: "100%" }}>
              <div className="host_social-icons-new-creator-page">
                      {basicCreatorInfo?.linkedInLink?.length !== 0 && (
                        <div
                          onClick={() => {
                            mixpanel.track("Linkedin redirect");
                            window.open(basicCreatorInfo?.linkedInLink);
                          }}
                        >
                          <TbBrandLinkedin size={24} color="#94A3B8"/>
                          {/* <img src={<TbBrandLinkedin / >} alt="" /> */}
                        </div>
                      )}

                      {basicCreatorInfo?.fbLink?.length !== 0 && (
                        <div
                          onClick={() => {
                            mixpanel.track("Fb redirect");
                            window.open(basicCreatorInfo?.fbLink);
                          }}
                        >
                          <CiFacebook size={24} color="#94A3B8"/>
                          {/* <img src={fbIcon} alt="" /> */}
                        </div>
                      )}

                      {basicCreatorInfo?.instaLink?.length !== 0 && (
                        <div
                          onClick={() => {
                            mixpanel.track("Instagram redirect");
                            window.open(basicCreatorInfo?.instaLink);
                          }}
                        >
                          <img src={InstagramIcon} alt="" />
                        </div>
                      )}

                      {basicCreatorInfo?.teleLink?.length !== 0 && (
                        <div
                          onClick={() => {
                            mixpanel.track("Telegram redirect");
                            window.open(basicCreatorInfo?.teleLink);
                          }}
                        >
                          <RiTelegramLine  size={24} color="#94A3B8"/>
                          {/* <img src={TelgramIcon} alt="" /> */}
                        </div>
                      )}

                      {basicCreatorInfo?.ytLink?.length !== 0 && (
                        <div
                          onClick={() => {
                            mixpanel.track("Youtube redirect");
                            window.open(basicCreatorInfo?.ytLink);
                          }}
                        >
                          <img src={YoutubeIcon} alt="" />
                        </div>
                      )}

                      {basicCreatorInfo?.twitterLink?.length !== 0 && (
                        <div
                          onClick={() => {
                            mixpanel.track("twitter redirect");
                            window.open(basicCreatorInfo?.twitterLink);
                          }}
                        >
                          {/* <FaSquareXTwitter size={24} color="#94A3B8"/> */}
                          <img src={TwitterIcon} alt="" />
                        </div>
                      )}
                      {basicCreatorInfo?.websiteLink?.length !== 0 && (
                        <div
                          onClick={() => {
                            mixpanel.track("website redirect");
                            window.open(basicCreatorInfo?.websiteLink);
                          }}
                        >
                          <IoIosGlobe size={24} color="#94A3B8"/>
                          {/* <img src={YoutubeIcon} alt="" /> */}
                        </div>
                      )}
                    </div>
            </section>
          )}
          {/* About Section ------------- */}
          <section className="host_about_section_new_creator_profile">
            <h2 style={{fontFamily:basicCreatorInfo?.style}} className="host_text_creator_profile_page-03">About</h2>

            <p style={{fontFamily:basicCreatorInfo?.style}}
              className="host_text_creator_profile_page-04"
              id="about_creator_profile"
            ></p>
          </section>

          {/* past and upcoming events section */}
          <section className="host_past_and_upcoming_section_profile">
            <button style={{fontFamily:basicCreatorInfo?.style}}
              className={eventCategory === "Upcoming Event" ? "selected" : ""}
              onClick={() => {
                handleCategory("Upcoming Event");
              }}
            >
              Upcoming Event
            </button>
            <button style={{fontFamily:basicCreatorInfo?.style}}
              className={eventCategory === "Past Event" ? "selected" : ""}
              onClick={() => {
                handleCategory("Past Event");
              }}
            >
              Past Event
            </button>
          </section>
          {eventCategory === "Upcoming Event" && UpcomingExtraCardData && (
            <section className="host_extra_cards_section_new_creator_profile">
              {UpcomingExtraCardData?.event?.map((item) => {
                return <ExtraCard data={item} type="event" style={basicCreatorInfo?.style}cd an/>;
              })}
            </section>
          )}
          {eventCategory === "Past Event" && UpcomingExtraCardData && (
            <section className="host_extra_cards_section_new_creator_profile">
              {UpcomingExtraCardData?.past?.map((item) => {
                return <ExtraCard data={item} type="event" style={basicCreatorInfo?.style} />;
              })}
            </section>
          )}
        </div>
        <Footer3 />
      </div>

      {/* SEO friendly changes -------------------------------- */}
      <Seo
        title={`Meet ${basicCreatorInfo?.name} on anchors`}
        description={basicCreatorInfo?.tagLine}
        keywords={`${basicCreatorInfo?.name},${basicCreatorInfo?.name} profile,Content creator ${basicCreatorInfo?.name},Social media influencer ${basicCreatorInfo?.name},Creative portfolio ${basicCreatorInfo?.name},${basicCreatorInfo?.name}'s online presence,Collaborations ${basicCreatorInfo?.name},${basicCreatorInfo?.name}'s creations,Anchors community ${basicCreatorInfo?.name},Creator economy ${basicCreatorInfo?.name},Monetization opportunities ${basicCreatorInfo?.name},Engagement metrics ${basicCreatorInfo?.name},Audience insights ${basicCreatorInfo?.name},Influencer marketing ${basicCreatorInfo?.name},Partnership opportunities ${basicCreatorInfo?.name}`}
        imgUrl={basicCreatorInfo?.profile}
      />
    </>
  );
};



function ProfilePage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [openModelRequest, setOpenModelRequest] = useState(false);
  const [UserDetails, setUserDetails] = useState();
  const [creatorRatingData, setCreatorRatingData] = useState(0); // creator rating data
  const [moreAbout, setMoreAbout] = useState(false);
  const [UpcomingExtraCardData, setUpcomingExtraCardData] = useState();
  const [status, setStatus] = useState();
  const [eventStatus, setEventStatus] = useState();
  const [eventCategory, SetEventCategory] = useState("Upcoming Event");

  //   Contexts ----------------------
  const { services, getallservicesusingid } = useContext(ServiceContext);
  const {
    getcreatoridUsingSlug,
    basicCreatorInfo,
    basicCdata,
    getCreatorUpcomingData,
  } = useContext(creatorContext);

  const { getallfeedback, feedbacks, getRatingCreator } =
    useContext(feedbackcontext);
  const { getUserDetails } = useContext(userContext);

  //Scroll to top automatically ---------------------------------------------
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

  // Main Data of creator and all its services and mixpanel ---------------------------------------------------
  useEffect(() => {
    const process = async () => {
      getcreatoridUsingSlug(slug).then((data) => {
        setStatus(data.status);
        setEventStatus(data.eventStatus);
        getallfeedback(data._id);
        getRatingCreator(data._id).then((e) => {
          // getting the creator's rating
          setCreatorRatingData(e);
        });
        getallservicesusingid(data._id).then((e) => {});
        getCreatorUpcomingData(data._id).then((e) => {
          // console.log(e);
          setUpcomingExtraCardData(e);
        });
      });
    };
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

    process();

    // mixpanel tracking
    mixpanel.track("Page Visit", {
      user: UserDetails ? UserDetails : "",
      creator: basicCdata?.slug,
    });

    // restricts the movement of a user
    if (!localStorage.getItem("isUser") === "true") {
      localStorage.removeItem("url");
    } else {
      localStorage.setItem("url", location.pathname);
    }

    // eslint-disable-next-line
  }, []);

  // Getting the data of the user login
  useEffect(() => {
    getUserDetails(localStorage.getItem("isUser") === "").then((e) => {
      if (e.success) {
        setUserDetails(e?.user?.email);
      }
    });
  }, [localStorage.getItem("jwtToken")]);

  // loading more about section -----------------

  useEffect(() => {
    let doc = document.querySelector("#about_creator_profile");
    if (doc) {
      doc.innerHTML = "";
      if (window.screen.width < 600) {
        if (moreAbout) {
          doc.innerHTML = basicCreatorInfo?.aboutMe;
        } else {
          doc.innerHTML = basicCreatorInfo?.aboutMe?.slice(0, 200);
        }
      } else {
        doc.innerHTML = basicCreatorInfo?.aboutMe;
      }
    }
  }, [moreAbout, basicCreatorInfo]);

  // checks for a status 0 creator
  if (basicCdata?.status === 0 && eventStatus === 0) {
    navigate("/");
    return alert("The Creator doesn't exist");
  }

  const handleCategory = (value) => {
    SetEventCategory(value);
  };


  return (
    <>
      {
        status === 1 && 
        (
          <CreatorProfile
            openModelRequest={openModelRequest}
            setOpenModelRequest={setOpenModelRequest}
            basicCreatorInfo={basicCreatorInfo}
            UserDetails={UserDetails}
            creatorRatingData={creatorRatingData}
            feedbacks={feedbacks}
            UpcomingExtraCardData={UpcomingExtraCardData}
            moreAbout = {moreAbout}
            setMoreAbout = {setMoreAbout}
            services = {services}
          />
        )
      }
      {status === 0 && eventStatus === 1 && (
        <HostProfile
          openModelRequest={openModelRequest}
          setOpenModelRequest={setOpenModelRequest}
          basicCreatorInfo={basicCreatorInfo}
          UserDetails={UserDetails}
          creatorRatingData={creatorRatingData}
          feedbacks={feedbacks}
          UpcomingExtraCardData={UpcomingExtraCardData}
        />
      )}
    </>
  );
}

export default ProfilePage;
