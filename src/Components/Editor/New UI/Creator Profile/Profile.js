import React, { useContext, useEffect, useState } from "react";
import "./Profile.css";
import { FaTelegramPlane, FaLinkedinIn } from "react-icons/fa";
import {
  AiFillInstagram,
  AiFillYoutube,
  AiOutlineTwitter,
} from "react-icons/ai";
import DocsIcon from "./icons/Icondocs.svg";
import SheetIcon from "./icons/Iconsheet.svg";
import VideoIcon from "./icons/Iconvideo.svg";
import GiftIcon from "./icons/Icongift.svg";
import FlashIcon from "./icons/Iconflash.svg";
import StarIcon from "./icons/Iconstar.svg";
import Footer2 from "../../../Footer/Footer2";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { creatorContext } from "../../../../Context/CreatorState";
import { feedbackcontext } from "../../../../Context/FeedbackState";
import ServiceContext from "../../../../Context/services/serviceContext";
import { userContext } from "../../../../Context/UserState";
import { toast, ToastContainer } from "react-toastify";
import PNGIMG from "../../../Main Page/default_profile.png";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { SuperSEO } from "react-super-seo";
import mixpanel from "mixpanel-browser";
import User_login from "../../../Login/Users/User_login";
import Hamburger from "hamburger-react";
import Request_Modal from "../../../Modals/Request_Modal";

function Profile() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  // states -----------------------------------------
  const [showMore, setShowMore] = useState({
    resources: false,
    reviews: false,
  });
  const [UserDetails, setUserDetails] = useState();
  const [openModel, setOpenModel] = useState(false);
  const [openModelRequest, setOpenModelRequest] = useState(false);
  const [openUserMenu, setOpenUserMenu] = useState(false);

  // contexts -------------------------------------------------------------------------
  const { services, getallservicesusingid, workshops, getallworkshopsusingid } =
    useContext(ServiceContext);
  const { getcreatoridUsingSlug, basicCreatorInfo, basicCdata } =
    useContext(creatorContext);
  const { getallfeedback, feedbacks } =
    useContext(feedbackcontext);
  const { addSubscriber, checkSubscriber, getUserDetails } =
    useContext(userContext);

  //Scroll to top automatically ---------------------------------------------
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

  // Main Data of creator and all its services and mixpanel ---------------------------------------------------
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

    // eslint-disable-next-line
  }, []);

  // Getting the data of the user login
  useEffect(() => {
    getUserDetails().then((e) => {
      if (e.success) {
        setUserDetails(e?.user?.email);
      }
    });
  }, [localStorage.getItem("jwtToken")]);

  // Used functions----------------------------------------
 
  const userlogout = () => {
    navigate("/logout");
  };

  // restricts the movement of a user
  if (!localStorage.getItem("isUser") === "") {
    localStorage.removeItem("url");
  } else {
    localStorage.setItem("url", location.pathname);
  }

  // checks for a status 0 creator
  if (basicCdata.status === 0) return alert("The Creator doesn't exist");

  return (
    <>
      <ToastContainer />
      <Request_Modal
          open={openModelRequest}
          onClose={() => {
            setOpenModelRequest(false);
          }}
          id={basicCdata?._id}
          cname={basicCreatorInfo?.name}
          UserDetails={UserDetails ? UserDetails : ""}
        />

      <User_login
        open={openModel}
        onClose={() => {
          setOpenModel(false);
        }}
      />
      <div className="creator_profile_main_container">
        {/* Header of creator profile -------------------------------------------------------------------------------------------- */}
        <section className="top_header_creator_profile">
          {window.screen.width > 550 ? (
            <img
              className="logo_main_page"
              src={require("../../../Main Page/Images/logo-beta.png")}
              alt=""
            />
          ) : (
            <img
              className="logo_main_page"
              src={require("./anchors_logo.jpg")}
              alt=""
            />
          )}
          {localStorage.getItem("isUser") !== "" &&
          (!localStorage.getItem("jwtToken") ? (
            <button
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
              Signup
            </button>
          ) : (
            <span>
              {localStorage.getItem("user")?.slice(0, 12) ===
              localStorage.getItem("user")
                ? localStorage.getItem("user")
                : localStorage.getItem("user")?.slice(0, 12) + ".."}&nbsp;
              {window.screen.width > 700 ? <i
                className="fa-solid fa-caret-down"
                style={{cursor:"pointer"}}
                onClick={()=>{setOpenUserMenu(!openUserMenu)}}
              ></i> :
              <Hamburger
                className="hamburger-react"
                size={20}
                onToggle={(toggled) => {
                  if (toggled) {
                    setOpenUserMenu(true)
                  } else {
                    setOpenUserMenu(false)
                    // close a menu
                  }
                }}
              />}
              {window.screen.width > 700 ? (openUserMenu && <button className="logout_button_header" onClick={userlogout}>
                Logout
              </button>) :
              (openUserMenu && <ul className="hamburger_menu_profile">
                <li className="hamburger_item" onClick={userlogout}>
                  Logout
                </li>
              </ul>)}
            </span>
          ))}
        </section>

        {/* just for background and profile section----------------------------------- */}
        <section className="just_background_color_creator_profile">
          {/* Creator info section ------------------------------------------------------------------------------------------------- */}
          <section className="creator_details_section">
            <div>
              <img
                src={
                  basicCreatorInfo?.profile
                    ? basicCreatorInfo?.profile
                    : basicCdata?.photo
                }
                alt=""
                className="creator_profile_in_section"
                onError={({ currentTarget }) => {
                  currentTarget.onerror = null; // prevents looping
                  currentTarget.src = PNGIMG;
                }}
              />
              <div className="creator_main_details_parts_01">
                <h1 className="text_type_01_creator_profile">
                  {basicCreatorInfo?.name ?? basicCdata?.name}
                </h1>
                <span className="text_type_02_creator_profile">
                  Content Creator @anchors
                </span>
                {window.screen.width > 550 && (
                  <h3 className="text_type_03_creator_profile">About me</h3>
                )}
                <span
                  className="text_type_04_creator_profile"
                  id="about_creator_profile"
                >
                  {document.querySelector("#about_creator_profile")
                    ? (document.querySelector(
                        "#about_creator_profile"
                      ).innerHTML = basicCreatorInfo?.aboutMe
                        ? basicCreatorInfo?.aboutMe
                        : "")
                    : ""}
                </span>
              </div>
              {window.screen.width < 550 && (
                <button className="request_resource_button_creator_profile" onClick={()=>{setOpenModelRequest(true)}}>
                  Request Resources
                </button>
              )}
            </div>

            <div className="creator_main_details_parts_02">
              <div>
                {basicCreatorInfo?.teleLink && (
                  <FaTelegramPlane
                    onClick={() => {
                      window.open(basicCreatorInfo?.teleLink);
                    }}
                  />
                )}
                {basicCreatorInfo?.linkedInLink && (
                  <FaLinkedinIn
                    onClick={() => {
                      window.open(basicCreatorInfo?.linkedInLink);
                    }}
                  />
                )}
                {basicCreatorInfo?.instaLink && (
                  <AiFillInstagram
                    onClick={() => {
                      window.open(basicCreatorInfo?.instaLink);
                    }}
                  />
                )}
                {basicCreatorInfo?.ytLink && (
                  <AiFillYoutube
                    onClick={() => {
                      window.open(basicCreatorInfo?.ytLink);
                    }}
                  />
                )}
                {basicCreatorInfo?.twitterLink && (
                  <AiOutlineTwitter
                    onClick={() => {
                      window.open(basicCreatorInfo?.twitterLink);
                    }}
                  />
                )}
              </div>
              {window.screen.width > 550 && (
                <button className="request_resource_button_creator_profile" onClick={()=>{setOpenModelRequest(true)}}>
                  Request Resources
                </button>
              )}
            </div>
          </section>
        </section>

        {/* Creator resources section adjusting according to the about  section --------------------------------------------------------------------------- */}

        {services?.res?.filter((e1) => {
                  return e1.status === 1;
                }).length !==0 &&  <section
          id="resources"
          className="creator_resources_profile"
          style={{
            marginTop:
              window.screen.width > 550
                ? document.querySelector(".creator_main_details_parts_01")
                    ?.clientHeight
                : document.querySelector(".creator_main_details_parts_01")
                    ?.clientHeight + 150,
          }}
        >
          <h1 className="text_type_05_creator_profile">Creator Resources</h1>
          <div>
            {(showMore?.resources
              ? services.res?.filter((e1) => {
                  return e1.status === 1;
                })
              : services.res
                  ?.filter((e1) => {
                    return e1.status === 1;
                  })
                  ?.slice(0, 6)
            )?.map((e) => {
              return (
                <div
                  className={`resources_boxes_creator_profile ${
                    e?.stype === 1
                      ? "resources_background02_creator_profile"
                      : e?.stype === 2
                      ? "resources_background03_creator_profile"
                      : "resources_background01_creator_profile"
                  }`}
                  key={e._id}
                  onClick={() => {
                    navigate(`/s/${e?.slug}`);
                  }}
                >
                  <div style={{ display: "flex" }}>
                    <img
                      src={
                        e?.stype === 1
                          ? SheetIcon
                          : e?.stype === 2
                          ? VideoIcon
                          : DocsIcon
                      }
                      alt=""
                      className="icon_resources_creator_profile"
                    />{" "}
                    {window.screen.width < 550 && (
                      <span className="text_type_07_creator_profile">
                        {e?.stype === 1
                          ? "Excel Sheet"
                          : e?.stype === 2
                          ? "Video"
                          : "Document"}
                      </span>
                    )}{" "}
                  </div>
                  <p className="text_type_06_creator_profile">{e?.sname}</p>
                  {window.screen.width > 550 && (
                    <span className="text_type_07_creator_profile">
                      {e?.stype === 1
                        ? "Excel Sheet"
                        : e?.stype === 2
                        ? "Video"
                        : "Document"}
                    </span>
                  )}
                  <section>
                    <div className="extra_resource_info">
                      <span className="text_type_08_creator_profile">
                        <img src={FlashIcon} alt="" />{" "}
                        {e?.downloads ? e?.downloads : 40} Downloads
                      </span>
                      <span className="text_type_08_creator_profile">
                        <img src={GiftIcon} alt="" />{" "}
                        {e?.isPaid ? "Paid" : "Free"}
                      </span>
                    </div>
                    <button>
                      Explore{" "}
                      {window.screen.width < 550 && (
                        <i class="fa-solid fa-arrow-right"></i>
                      )}
                    </button>
                  </section>
                </div>
              );
            })}
          </div>
          {services?.res?.filter((e1) => {
                  return e1.status === 1;
                })?.length > 6 && <section className="More_or_less_section">
            <span
              onClick={() => {
                setShowMore({ ...showMore, resources: !showMore.resources });
              }}
            >
              {showMore?.resources ? "Less" : "More"}
            </span>
          </section>}
        </section>}

        {/* User reviews section -------------------------------------------------------------------- */}
        {feedbacks?.filter((e) => e.status === 1)?.length !== 0 && <section className="user_reviews_creator_profile">
          <h1 className="text_type_05_creator_profile">User Reviews</h1>
          <div>
            {(showMore?.reviews
              ? feedbacks?.filter((e) => e.status === 1)
              : feedbacks?.filter((e) => e.status === 1).slice(0, 4)
            )?.map((e2, index) => {
              return (
                <div className="user_review_boxes_creator_profile" key={index}>
                  <div className="user_profile_review_box">
                    <LazyLoadImage
                      src={e2?.photo}
                      alt=""
                      onError={({ currentTarget }) => {
                        currentTarget.onerror = null; // prevents looping
                        currentTarget.src =
                          "data:image/png;base64,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";
                      }}
                      className="user_profile_pic"
                    />
                    <section>
                      <span className="text_type_09_creator_profile">
                        {e2?.name
                          ? e2?.name.length > 10
                            ? e2?.name.slice(0, 10) + ".."
                            : e2?.name
                          : "--"}
                      </span>
                      <div className="review_stars_on_profile">
                        {Array(e2?.rating)
                          .fill("a")
                          ?.map((e, i) => {
                            return <img src={StarIcon} alt="" key={i} />;
                          })}
                      </div>
                    </section>
                  </div>

                  <p className="text_type_10_creator_profile">
                    {e2?.desc.length > 100
                      ? e2?.desc?.slice(0, 100) + "..."
                      : e2?.desc}
                  </p>
                </div>
              );
            })}
          </div>

          {feedbacks?.filter((e) => e.status === 1)?.length  > 4 && <section className="More_or_less_section">
            <span
              onClick={() => {
                setShowMore({ ...showMore, reviews: !showMore.reviews });
              }}
            >
              {showMore?.reviews ? "Less" : "More"}
            </span>
          </section>}
        </section>}
      </div>

      <Footer2 />
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
