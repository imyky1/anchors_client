import React, { useContext, useEffect, useState } from "react";
import "./ProfilePage.css";
import { Navbar2 } from "../../../Layouts/Navbar User/Navbar";
import { RiStarSFill } from "react-icons/ri";
import { Footer3 } from "../../../Footer/Footer2";

import InstagramIcon from "../../../../Utils/Icons/instagram.svg";
import fbIcon from "../../../../Utils/Icons/fb.svg";
import TelgramIcon from "../../../../Utils/Icons/telegram.svg";
import YoutubeIcon from "../../../../Utils/Icons/youtube.svg";
import topmateIcon from "../../../../Utils/Icons/topmate.svg";
import linkedinIcon from "../../../../Utils/Icons/linkedin.svg";
import { AiOutlineArrowRight, AiOutlineDown } from "react-icons/ai";
import { ReviewCards, ServiceCards } from "../Service Page/ServicePage";
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
import Request_Modal from "../../../Modals/Request_Modal";
import mixpanel from "mixpanel-browser";
import Seo from "../../../../Utils/Seo";
import PNGIMG from "../../../../Utils/Images/default_user.png";

const ExtraCard = () => {
  return (
    <div className="extra_card_new_profile_page">
      <section>Most Popular Services</section>

      <div className="extra_card_profile_details">
        <img
          src="https://images.pexels.com/photos/255379/pexels-photo-255379.jpeg?cs=srgb&dl=pexels-miguel-%C3%A1-padri%C3%B1%C3%A1n-255379.jpg&fm=jpg"
          alt=""
        />

        <section>
          <h2>DSA Interview question for 2023</h2>
          <div>
            <span>
              <img src={TrendIcon} alt="" />
              985 times
            </span>
            <span>
              <img src={DocIcon} alt="" />
              28 Pages
            </span>
          </div>

          <section>Free</section>
        </section>

        <span>
          <AiOutlineArrowRight />
        </span>
      </div>
    </div>
  );
};

function ProfilePage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [openModelRequest, setOpenModelRequest] = useState(false);
  const [UserDetails, setUserDetails] = useState();
  const [creatorRatingData, setCreatorRatingData] = useState(0); // creator rating data

  //   Contexts ----------------------
  const { services, getallservicesusingid } = useContext(ServiceContext);
  const { getcreatoridUsingSlug, basicCreatorInfo, basicCdata } =
    useContext(creatorContext);
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
        getallfeedback(data);
        getRatingCreator(data).then((e) => {
          // getting the creator's rating
          setCreatorRatingData(e);
        });
        getallservicesusingid(data).then(() => {});
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

  // checks for a status 0 creator
  if (basicCdata?.status === 0) {
    navigate("/");
    return alert("The Creator doesn't exist");
  }

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
            <img
              src={basicCreatorInfo?.profile}
              alt={basicCreatorInfo?.name}
              onError={({ currentTarget }) => {
                currentTarget.onerror = null; // prevents looping
                currentTarget.src = PNGIMG
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
                </>
              )}
            </div>
          </section>

          {/* Deatils section for mobile --------- */}
          {window.screen.width < 600 && (
            <section>
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
            >
              {document.querySelector("#about_creator_profile")
                ? (document.querySelector("#about_creator_profile").innerHTML =
                    basicCreatorInfo?.aboutMe ? basicCreatorInfo?.aboutMe : "")
                : ""}
            </p>
          </section>

          {/* most popular section ---------------  */}
          {/* <section className="extra_cards_section_new_creator_profile">
            <ExtraCard />
            <ExtraCard />
          </section> */}

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
  );
}

export default ProfilePage;
