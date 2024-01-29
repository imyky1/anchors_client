import React, { Suspense, lazy, useContext, useEffect, useState } from "react";
import "./CreatorProfile.css";
import { RiStarSFill } from "react-icons/ri";

import InstagramIcon from "../../../../Utils/Icons/instagram.svg";
import fbIcon from "../../../../Utils/Icons/fb.svg";
import TelgramIcon from "../../../../Utils/Icons/telegram.svg";
import YoutubeIcon from "../../../../Utils/Icons/youtube.svg";
import topmateIcon from "../../../../Utils/Icons/topmate.svg";
import linkedinIcon from "../../../../Utils/Icons/linkedin.svg";
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
  
  const ExtraCard = ({ data, type }) => {
    const navigate = useNavigate();
    return (
      <div className="extra_card_new_profile_page">
        {/* <section>
          {type === "event" ? (
            <>
              <MdOutlineLaptop color="#EF4444" /> Event
            </>
          ) : (
            <>
              <AiOutlineFire color="#EF4444" /> Most Popular Service{" "}
            </>
          )}
        </section> */}
  
        <div className="extra_card_profile_details">
          <LazyLoadImage src={data?.simg} alt="" />
  
          <section>
            <h2>{data?.sname}</h2>
            <div>
              {type === "event" ? (
                <span>
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
  
            <section
              style={data?.isPaid ? { color: "#EF4444" } : { color: "#10B981" }}
            >
              {data?.isPaid ? "Paid" : "Free"}
            </section>
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


const CreatorProfile = ({
    openModelRequest,
    setOpenModelRequest,
    basicCreatorInfo,
    UserDetails,
    creatorRatingData,
    feedbacks,
    UpcomingExtraCardData,
    moreAbout,
    setMoreAbout,
    services
  }) =>{

    const navigate = useNavigate()
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
  
        <div className="new_creator_page_outer_wrapper">
          {/* Navbar */}
          <Navbar2 />
  
          <div className="outerframe_new_creator_page">
            {/* main details sections ---------------- */}
            <section className="main_creator_details_creator_page">
              <LazyLoadImage
                src={basicCreatorInfo?.profile}
                alt={basicCreatorInfo?.name}
                onError={({ currentTarget }) => {
                  currentTarget.onerror = null; // prevents looping
                  currentTarget.src = PNGIMG;
                }}
              />
  
              <div>
                <h1 className="text_creator_profile_page-01">
                  {basicCreatorInfo?.name}
                </h1>
                {creatorRatingData && (
                  <span>
                    {" "}
                    <RiStarSFill
                      rSFill
                      size={18}
                      color="rgba(255, 214, 0, 1)"
                    />{" "}
                    {creatorRatingData}/5
                    <span>
                      {feedbacks &&
                        feedbacks.length !== 0 &&
                        `(${feedbacks.length})`}
                    </span>
                  </span>
                )}
                {window.screen.width > 600 && (
                  <>
                    <p className="text_creator_profile_page-02">
                      {basicCreatorInfo?.tagLine}
                    </p>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "row-reverse",
                        width: "max-content",
                        gap: "20px",
                      }}
                    >
                      <div className="social-icons-new-creator-page">
                        {basicCreatorInfo?.linkedInLink?.length !== 0 && (
                          <div
                            onClick={() => {
                              mixpanel.track("Linkedin redirect");
                              window.open(basicCreatorInfo?.linkedInLink);
                            }}
                          >
                            <img src={linkedinIcon} alt="" />
                          </div>
                        )}
  
                        {basicCreatorInfo?.fbLink?.length !== 0 && (
                          <div
                            onClick={() => {
                              mixpanel.track("Fb redirect");
                              window.open(basicCreatorInfo?.fbLink);
                            }}
                          >
                            <img src={fbIcon} alt="" />
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
                            <img src={TelgramIcon} alt="" />
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
  
                        {basicCreatorInfo?.topmateLink?.length !== 0 && (
                          <div
                            onClick={() => {
                              mixpanel.track("Topmate redirect");
                              window.open(basicCreatorInfo?.topmateLink);
                            }}
                          >
                            <img src={topmateIcon} alt="" />
                          </div>
                        )}
                      </div>
                      <button
                        className="button01_new_crator_profile"
                        onClick={() => {
                          mixpanel.track("Request Resources");
                          setOpenModelRequest(true);
                        }}
                      >
                        Request Resource
                      </button>{" "}
                    </div>
                  </>
                )}
              </div>
            </section>
  
            {/* Deatils section for mobile --------- */}
            {window.screen.width < 600 && (
              <section style={{ width: "100%" }}>
                <p className="text_creator_profile_page-02">
                  {basicCreatorInfo?.tagLine}
                </p>
  
                <div className="social-icons-new-creator-page">
                  {basicCreatorInfo?.linkedInLink?.length !== 0 && (
                    <div
                      onClick={() => {
                        mixpanel.track("Linkedin redirect");
                        window.open(basicCreatorInfo?.linkedInLink);
                      }}
                    >
                      <img src={linkedinIcon} alt="" />
                    </div>
                  )}
  
                  {basicCreatorInfo?.fbLink?.length !== 0 && (
                    <div
                      onClick={() => {
                        mixpanel.track("Fb redirect");
                        window.open(basicCreatorInfo?.fbLink);
                      }}
                    >
                      <img src={fbIcon} alt="" />
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
                      <img src={TelgramIcon} alt="" />
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
  
                  {basicCreatorInfo?.topmateLink?.length !== 0 && (
                    <div
                      onClick={() => {
                        mixpanel.track("Topmate redirect");
                        window.open(basicCreatorInfo?.topmateLink);
                      }}
                    >
                      <img src={topmateIcon} alt="" />
                    </div>
                  )}
                </div>
  
                <button
                  className="button01_new_crator_profile"
                  onClick={() => {
                    mixpanel.track("Request Resources");
                    setOpenModelRequest(true);
                  }}
                >
                  Request Resource
                </button>
              </section>
            )}
  
            {/* About Section ------------- */}
            <section className="about_section_new_creator_profile">
              <h2 className="text_creator_profile_page-03">About</h2>
  
              <p
                className="text_creator_profile_page-04"
                id="about_creator_profile"
              ></p>
  
              {window.screen.width < 600 && (
                <div style={{ textAlign: "center", width: "100%" }}>
                  {moreAbout ? (
                    <AiOutlineUp
                      color="white"
                      onClick={() => {
                        setMoreAbout(!moreAbout);
                      }}
                    />
                  ) : (
                    <AiOutlineDown
                      color="white"
                      onClick={() => {
                        setMoreAbout(!moreAbout);
                      }}
                    />
                  )}
                </div>
              )}
            </section>
  
            {/* most popular section ---------------  */}
            {UpcomingExtraCardData &&
              (window.screen.width > 600
                ? ((UpcomingExtraCardData?.service &&
                    Object.keys(UpcomingExtraCardData?.service)?.length !== 0) ||
                    (UpcomingExtraCardData?.event &&
                      Object.keys(UpcomingExtraCardData?.event[0])?.length !==
                        0)) && (
                    <section className="extra_cards_section_new_creator_profile">
                      {UpcomingExtraCardData?.service && Object.keys(UpcomingExtraCardData?.service)?.length !==
                        0 && (
                        <ExtraCard
                          data={UpcomingExtraCardData?.service}
                          type="service"
                        />
                      )}
                      {Object.keys(UpcomingExtraCardData?.event[0])?.length !==
                        0 && (
                        <ExtraCard
                          data={UpcomingExtraCardData?.event?.[0]}
                          type="event"
                        />
                      )}
                    </section>
                  )
                : UpcomingExtraCardData &&
                  Object.keys(UpcomingExtraCardData?.event[0]).length !== 0 && (
                    <section className="extra_cards_mobile_view_new_creator_profile">
                      <h4>{UpcomingExtraCardData?.event?.[0]?.sname}</h4>
                      <span>
                        <AiOutlineClockCircle color="#94A3B8" />
                        {getDate(UpcomingExtraCardData?.event?.[0]?.startDate) +
                          " | " +
                          convertTime(
                            UpcomingExtraCardData?.event?.[0]?.time?.startTime
                          ) +
                          " - " +
                          convertTime(
                            UpcomingExtraCardData?.event?.[0]?.time?.endTime
                          )}
                      </span>
                      <div>
                        <span
                          style={
                            UpcomingExtraCardData?.event?.[0]?.isPaid
                              ? { color: "#EF4444" }
                              : { color: "#10B981" }
                          }
                        >
                          {UpcomingExtraCardData?.event?.[0]?.isPaid ? "Paid" : "Free"}
                        </span>
  
                        <p
                          onClick={() => {
                            navigate(`/e/${UpcomingExtraCardData?.event?.[0]?.slug}`);
                          }}
                        >
                          Explore
                          <span>
                            <AiOutlineArrowRight />
                          </span>
                        </p>
                      </div>
                    </section>
                  ))}
  
            {/* other services or events */}
            {services?.res?.filter((e1) => {
              return e1?.status === 1;
            })?.length !== 0 && (
              <section className="other_services_new_creator_profile">
                <section>
                  <h3 className="text_creator_profile_page-05">Service List</h3>
                  {/* <div className="filter_option_new_creator_profile">
                  Event <AiOutlineDown />
                </div> */}
                </section>
  
                <div>
                  {services.res
                    ?.filter((e1) => {
                      return e1?.status === 1;
                    })
                    .sort((a, b) => {
                      return b?.downloads - a?.downloads;
                    })
                    ?.sort((a, b) => {
                      return b?.smrp - a?.smrp;
                    })
                    ?.map((e, i) => {
                      return (
                        <ServiceCards
                          {...e}
                          key={i}
                          onClick={() => {
                            mixpanel.track("Explore resources");
                            navigate(`/s/${e?.slug}`);
                          }}
                        />
                      );
                    })}
                </div>
              </section>
            )}
  
            {/* user reviews */}
            {feedbacks?.filter((e) => e?.status === 1)?.length !== 0 && (
              <section className="other_reviews_new_creator_profile">
                <h3 className="text_creator_profile_page-05">User Reviews</h3>
  
                <div>
                  {feedbacks
                    ?.filter((e) => e?.status === 1)
                    ?.map((e, i) => {
                      return <ReviewCards {...e} key={i} />;
                    })}
                </div>
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
    )
  }

export default CreatorProfile  