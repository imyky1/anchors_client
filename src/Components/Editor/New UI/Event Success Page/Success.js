import React, { useContext, useEffect, useRef, useState } from "react";
import "./Success.css";
import { BsWhatsapp } from "react-icons/bs";
import { AiOutlineArrowRight } from "react-icons/ai";
import { IoCopyOutline } from "react-icons/io5";
import { Navbar2 } from "../../../Layouts/Navbar User/Navbar";
import tick from "../../../../Utils/Icons/tick.svg";
import { userContext } from "../../../../Context/UserState";
import { useNavigate, useParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import ServiceContext from "../../../../Context/services/serviceContext";
import { paymentContext } from "../../../../Context/PaymentState";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { FiDownload } from "react-icons/fi";
import mixpanel from "mixpanel-browser";
import { MainNewFooter } from "../../../Footer/Footer";
import { HiOutlineCheckBadge } from "react-icons/hi2";
import { LiaDownloadSolid } from "react-icons/lia";
import { MdDateRange } from "react-icons/md";
import { CiGlobe } from "react-icons/ci";
import { AddToCalendarButton } from "add-to-calendar-button-react";

function TableComponent({ userComponent, name, points, index }) {
  return (
    <div
      className="table_body_leaderboard_success"
      style={
        userComponent
          ? {
              background: "#FF5E5E",
            }
          : {}
      }
    >
      <span>{index}</span>
      <span>{name?.split(" ")[0]}</span>
      <span>{points}</span>
    </div>
  );
}

const EventCountDown = ({ duration }) => {
  const [time, setTime] = useState(duration);

  const [finalData, setFinalData] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  function convertMilliseconds(milliseconds) {
    // Calculate days, hours, minutes, and seconds
    const days = Math.floor(milliseconds / (1000 * 60 * 60 * 24));
    milliseconds %= 1000 * 60 * 60 * 24;

    const hours = Math.floor(milliseconds / (1000 * 60 * 60));
    milliseconds %= 1000 * 60 * 60;

    const minutes = Math.floor(milliseconds / (1000 * 60));
    milliseconds %= 1000 * 60;

    const seconds = Math.floor(milliseconds / 1000);

    return {
      days: days,
      hours: hours,
      minutes: minutes,
      seconds: seconds,
    };
  }

  useEffect(() => {
    setTime(duration);
  }, [duration]);

  useEffect(() => {
    if (time) {
      setTimeout(() => {
        setTime(time - 1000);
      }, 1000);
      let data = convertMilliseconds(time);
      setFinalData({ ...data });
    }
  }, [time]);

  return (
    <div className="event_countdown_event_success_page">
      <h2>Event Starts In</h2>

      <section>
        <div>
          <span>{finalData?.days}</span>
          <p>DAYS</p>
        </div>
        <span>:</span>
        <div>
          <span>{finalData?.hours}</span>
          <p>HOURS</p>
        </div>
        <span>:</span>
        <div>
          <span>{finalData?.minutes}</span>
          <p>MINUTES</p>
        </div>
        <span>:</span>
        <div>
          <span>{finalData?.seconds}</span>
          <p>SECONDS</p>
        </div>
      </section>
    </div>
  );
};

const SuccessModal = ({ onClose }) => {
  const handlebutton = () => {
    const url = window.location.href;

    // Remove the query parameters by splitting the URL and taking only the base part
    const baseUrl = url.split("?")[0];

    // Replace the current URL with the base URL (without query parameters)
    window.history.replaceState({}, document.title, baseUrl);

    onClose();
  };

  return (
    <div className="successModal_success_page_wrapper" onClick={onClose}>
      <div className="successPage_main_modal_box">
        <img src={tick} alt="" />
        <span>You have successfully registered for the event!</span>

        <button onClick={handlebutton}>
          Explore your benefits <AiOutlineArrowRight />
        </button>
      </div>
    </div>
  );
};

function Success() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const benefitRef = useRef();

  const [openSuccessModal, setOpenSuccessModal] = useState(false); // User Modal open
  const [userDetails, setUserDetails] = useState(); // stores the user data
  const [shareLink, setShareLink] = useState(); // stores the user data
  const [leaderBoardData, setLeaderBoardData] = useState();
  const [eligible, setEligible] = useState({ success: true, order: {} });
  const [countDownDuration, setCountDownDuration] = useState();

  // User Contexts --------------------
  const { getUserDetails } = useContext(userContext);
  const { checkfororder } = useContext(paymentContext);
  const { geteventinfo, eventInfo, getLeaderBoardData } =
    useContext(ServiceContext);
  const params = new URLSearchParams(window.location.search);
  // console.log(leaderBoardData);
  // Countdonw timer difference
  let getDateDiff = () => {
    // Parse the given date string
    let originalDate = new Date(eventInfo?.event?.startDate);
    originalDate.setHours(eventInfo?.event?.time?.startTime?.split(":")[0]);
    originalDate.setMinutes(eventInfo?.event?.time?.startTime?.split(":")[1]);

    let currentDate = new Date();

    if (currentDate > originalDate) {
      setCountDownDuration(null);
    } else {
      setCountDownDuration(originalDate - currentDate);
    }
  };
  useEffect(() => {
    // Loading mixpanel ------
    mixpanel.track("Page Visit");

    if (params.get("placedOrder") === "success") {
      setOpenSuccessModal(true);
    }

    geteventinfo(slug).then((id) => {
      if (!id[0]) {
        // handles any irregular slug
        navigate("/");
        return null;
      }
      getLeaderBoardData(id[1], localStorage.getItem("isUser") === "").then(
        (e) => {
          if (e?.success) {
            setLeaderBoardData(e);
          }
        }
      );
    });
  }, []);

  useEffect(() => {
    if (benefitRef?.current) {
      benefitRef.current.innerHTML = eventInfo?.event?.benefits;
    }

    checkfororder(
      eventInfo?.event?._id,
      localStorage.getItem("isUser") === "true" ? "user" : "creator",
      "event"
    ).then((e) => {
      setEligible(e);
    });

    getDateDiff();
  }, [eventInfo]);

  // Fetches the user details
  useEffect(() => {
    if (localStorage.getItem("jwtToken")) {
      getUserDetails(localStorage.getItem("isUser") === "").then((e) => {
        setUserDetails(e?.user);
        let value =
          eligible?.order?.shareShortUrl ??
          "https://www.anchors.in/e/" +
            slug +
            `?referredFrom=${e?.user?.referralCode}`;

        setShareLink(value);
      });
    }
  }, [localStorage.getItem("jwtToken"), eventInfo, eligible]);

  const handleDonwload = async (e) => {
    mixpanel.track("Download Invite Banner");
    const link = document.createElement("a");
    link.href = eligible?.order?.eventBannerImage;
    link.download = `${userDetails?.name}.png`;
    link.click();
  };

  if (!localStorage.getItem("jwtToken") || !eligible?.success) {
    navigate(`/e/${slug}`);
    return null;
  }

  // handling the status 0 of services ------------------
  if (
    (eventInfo?.event?.status === 0 || eventInfo?.event?.c_id?.status === 0) &&
    eventInfo?.event?.c_id?.eventStatus === 0
  ) {
    navigate("/");
    return null;
  }

  return (
    <>
      {/* creates custom banner for the user on the basis of the event */}

      {openSuccessModal && (
        <SuccessModal onClose={() => setOpenSuccessModal(false)} />
      )}

      <ToastContainer theme="dark" />

      <div className="success_page_wrapper">
        {/* main hero section details */}
        <section className="main_header_component_success_page">
          <Navbar2 />

          <div className="main_hero_details_benefits">
            <section className="left_benefit_section_hero_success">
              <div className="benefit_section_check_badge">
                <HiOutlineCheckBadge />
              </div>
              <h2>Registration Successful</h2>
              <div className="banner_success_page">
                <LazyLoadImage
                  src={
                    eligible?.order?.eventBannerImage ??
                    "https://wallpaperaccess.com/full/2439064.png"
                  }
                  alt="Event Banner"
                />

                {/* <span
                 
                >
                  <FiDownload
                    size={20}
                    style={{ position: "relative", left: "5px", bottom: "5px" }}
                  />
                </span> */}
              </div>
              <div
                className="left_benefit_section_hero_success_download_image"
                onClick={(e) =>
                  {mixpanel.track("Download Your Content Card");
                  eligible?.order?.eventBannerImage && handleDonwload(e)}
                }
              >
                <LiaDownloadSolid /> Download Your Content Card
              </div>
              <AddToCalendarButton
                styleLight="--btn-background: transparent; --btn-text: #BDBDBD; --btn-border: #3460DC; --btn-border-radius: 100px;--btn-padding-x:20px;--btn-padding-y:8px"
                name={eventInfo?.event?.sname}
                startDate={eventInfo?.event?.startDate?.slice(0, 10)}
                startTime={eventInfo?.event?.time?.startTime}
                endTime={eventInfo?.event?.time?.endTime}
                options={["Apple", "Google", "Yahoo", "iCal"]}
                timeZone="Asia/Kolkata"
              ></AddToCalendarButton>
              <h3 className="left_benefit_section_hero_success_referal_message">
                Share your referral link to your friends to climb the
                leaderboard and secure <b> Referral Benefit</b>
              </h3>
              <div className="left_benefit_section_hero_success_referal_link">
                <CiGlobe />
                {shareLink?.slice(0, 30)}...{" "}
                <IoCopyOutline
                  style={{ cursor: "pointer" }}
                  onClick={() => {
                    mixpanel.track("Copy Invite Code link");
                    navigator.clipboard.writeText(shareLink);
                    toast.success("Copied Link Successfully", {
                      position: "top-center",
                      autoClose: 2000,
                    });
                  }}
                />
              </div>
              <button
                onClick={() => {
                  mixpanel.track("Share Invite Code on WhatsApp");
                  window.open(`https://api.whatsapp.com/send?text=Hey,%0A
I just signed up for this amazing event, *${eventInfo?.event?.sname}*, and I thought you might be interested too!%0A%0A

🎉 Join me by registering here: ${shareLink} %0A%0A

Let's experience this together!%0A
Catch you there`);
                }}
                className="left_benefit_section_hero_success_share_button"
              >
                <BsWhatsapp />
                Share on WhatsApp
              </button>
            </section>

            {/* {window.screen.width > 600 && (
              <section className="right_benefit_section_hero_success">
                <EventCountDown duration={countDownDuration} />
              </section>
            )} */}
            <section className="right_benefit_section_hero_success">
              <div className="leaderboard_rest_data_success_wrapper">
                {
                  <section className="leaderboard_rest_data_success_page">
                    <section className="leader_board_referral_benefit">
                      <h1>Referral Benefit</h1>

                      <div ref={benefitRef}></div>
                    </section>
                    <section className="leader_board_table_heading">
                      <h1>Referral Rank Leaderboard</h1>
                    </section>

                    {/* Table for other ranks ------------- */}

                    <div className="leader_board_table_success">
                      <section className="table_head_leaderboard_success">
                        <span>Rank</span>
                        <span>Name</span>
                        <span>Referral Count</span>
                      </section>

                      <div>
                        {leaderBoardData?.data
                          ?.filter((e) => {
                            return e?.isUser;
                          })
                          ?.map((element, i) => {
                            return (
                              <>
                                <div
                                  className="table_body_leaderboard_success"
                                  style={{
                                    background: "#FF5E5E",
                                  }}
                                >
                                  <span>{element?.userRank ?? "--"}</span>
                                  <span>{element?.name?.split(" ")[0]}</span>
                                  <span>{element?.points}</span>
                                </div>
                              </>
                            );
                          })}

                        {leaderBoardData?.data
                          ?.filter((e) => {
                            return !e?.isUser;
                          })
                          .map((element, i) => {
                            return (
                              <>
                                <TableComponent
                                  key={element?.id}
                                  {...element}
                                  index={
                                    leaderBoardData?.showUserInExtra?.value ||
                                    element?.points === 0
                                      ? "--"
                                      : i + 1
                                  }
                                />
                              </>
                            );
                          })}
                      </div>
                    </div>
                  </section>
                }
              </div>
            </section>
          </div>
        </section>

        {/* <section className="referal_benefits_section_event_success_page">
          <h1>Top Referral Benefits</h1>
          <p id="benefits-success"></p>
        </section> */}
        <MainNewFooter
          onEvents={true}
          hostEventButton={true}
          footerOptions1={[
            {
              title: "Event Pricing",
              link: "https://events.anchors.in/pricing",
            },
            {
              title: "Sample Event Page",
              link: "https://www.anchors.in/e/how-to-become-a-product-manager",
            },
            {
              title: "Sample Referral Page",
              link: "https://www.anchors.in/static/success",
            },
          ]}
          noPrivacyPolicy={false}
          noRefund={false}
          useEventsLogo={true}
        />
      </div>
    </>
  );
}

export default Success;
