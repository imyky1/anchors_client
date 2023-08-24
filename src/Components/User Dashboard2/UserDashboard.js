import React, { useContext, useEffect, useState } from "react";
import "./UserDashboard.css";
import Navbar, { Navbar2 } from "../Layouts/Navbar User/Navbar";
import { BsChevronDown, BsFillCalendar3WeekFill } from "react-icons/bs";
import {
  AiOutlineCheck,
  AiOutlineCalendar,
  AiOutlineClockCircle,
} from "react-icons/ai";
import Footer2, { Footer3 } from "../Footer/Footer2";
// import DocIcon from "../../Utils/Icons/iconDocs.svg";
// import SheetIcon from "../../Utils/Icons/iconSheet.svg";
import VideoIcon from "../../Utils/Icons/iconVideo.svg";
import EventIcon from "../../Utils/Icons/iconEvent.svg";
import ImageIcon from "../../Utils/Icons/iconImage.svg";
import { UserDashbaord } from "../../Context/userdashbaord";
import { LoadThree } from "../Modals/Loading";
import { useLocation, useNavigate } from "react-router-dom";
import FeedbackModal from "../Modals/Feedback_Modal";
import { ToastContainer } from "react-toastify";
import mixpanel from "mixpanel-browser";
import Dummyimg from "../../Utils/Images/default_user.png";
import { BsArrowRight } from "react-icons/bs";
import SheetIcon from "./exceldesign.svg";
import DocIcon from "./pdfdesign.svg";
import excelIcon from "./excelicon.svg";
import pdfIcon from "./pdfIcon.svg";
import { FiTrendingUp } from "react-icons/fi";
import { TiDocumentText } from "react-icons/ti";
import { BiRightArrowAlt } from "react-icons/bi";
import redpdf from "./redpdf.svg";
import { SlNote, SlArrowLeft, SlArrowRight } from "react-icons/sl";
import { TbEye } from "react-icons/tb";
import { AiFillStar } from "react-icons/ai";
import { MdOutlineEventNote } from "react-icons/md";
import redlaptop from "./redlaptop.svg";

const PageOptions = [
  { id: "all", name: "All" },
  { id: "documents", name: "Documents" },
  { id: "excel", name: "Excel Sheets" },
  // { id: "videos", name: "Videos" },
  { id: "event", name: "Events" },
  // { id: "image", name: "Image Assets" },
];

const CreatorCard = ({
  tagline,
  name,
  photo,
  setSelectedCreator,
  selected,
}) => {
  // console.log("tag", tagline);
  return (
    <div className="creator_card_user_dashboard" onClick={setSelectedCreator}>
      <div
        className={`outline_stroke_selected_creator ${
          selected && "active_stroke_selected_creator"
        }`}
      >
        <img
          src={photo ? photo : Dummyimg}
          alt=""
          onError={({ currentTarget }) => {
            currentTarget.onerror = null; // prevents looping
            currentTarget.src = Dummyimg;
          }}
        />
      </div>
      <span>{name?.split(" ")[0]}</span>
    </div>
  );
};

const SelectedCreatorCard = ({ serviceCount, name, photo, slug, tagline }) => {
  return (
    <div className="selected_creator_user_db">
      <img
        src={photo ? photo : Dummyimg}
        onError={({ currentTarget }) => {
          currentTarget.onerror = null; // prevents looping
          currentTarget.src = Dummyimg;
        }}
        alt=""
        onClick={() => {
          mixpanel.track("Dashboard Creator Profile", {
            creatorSlug: slug,
          });
          window.open(`/${slug}`);
        }}
      />
      <section>
        <span>By {name}</span>
        <p>
          <b>{serviceCount}</b> Unlocked Items
        </p>
      </section>
    </div>
  );
};

const SelectedCreatorCardBelow = ({ name, photo, slug, tagline, rating }) => {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  // console.log('rating',rating);
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const exploreText =
    windowWidth <= 600
      ? "Explore more about creator"
      : `Explore more about ${name} `;

  const handleExploreClick = () => {
    mixpanel.track("Dashboard Creator Profile", {
      creatorSlug: slug,
    });
    window.open(`/${slug}`);
  };

  return (
    <div className="Selected_Creator_Card_Below_header">
      <div className="Selected_Creator_Card_Below_header_inside">
        <img
          src={photo ? photo : Dummyimg}
          onError={({ currentTarget }) => {
            currentTarget.onerror = null;
            currentTarget.src = Dummyimg;
          }}
          alt=""
        />
        <div className="Selected_Creator_Card_Below_header_inside_average_details_name_creator">
          <div className="Selected_Creator_Card_Below_header_inside_average_name">
            <span> {name}</span>
            <div className="Selected_Creator_Card_Below_header_inside_average_name_userating">
              <AiFillStar color="yellow" />
              {rating === "0" ? "5" : rating }/5
            </div>
          </div>
          <div className="Selected_Creator_Card_Below_header_inside_average_desc">
            {tagline}
          </div>
        </div>
      </div>
      <div
        className="Selected_Creator_Card_Below_header_inside_explore"
        onClick={handleExploreClick}
      >
        {exploreText} <BiRightArrowAlt />{" "}
      </div>
    </div>
  );
};

const ServiceCard = ({
  date,
  pages,
  img,
  name,
  type,
  slug,
  surl,
  reviewed,
  openFbModal,
}) => {
  // console.log("img", img, pages);
  const navigate = useNavigate();

  const handleView = (e) => {
    e?.stopPropagation();
    mixpanel.track("View Now", {
      serviceSlug: slug,
    });
    sessionStorage.setItem("link", surl);

    if (type === 1) {
      navigate("/viewExcel");
    } else {
      navigate("/viewPdf");
    }
  };

  return (
    <>
      <div
        className="service_card_user_db"
        onClick={() => {
          window.open(`/s/${slug}`);
        }}
      >
        {/* <span className="service_card_tag">
          {type === 1 ? "Excel Sheet" : type === 2 ? "Videos" : "Document"}
        </span> */}

        <section className="service_card_details">
          <img src={img} alt="" />
          <span>{name?.length > 40 ? name?.slice(0, 40) + "..." : name}</span>
        </section>

        <div className="service_card_details_no_of_pages">
          <img
            src={type === 1 ? SheetIcon : type === 2 ? SheetIcon : DocIcon}
            alt=""
          />
          <span>
            {pages}
            {type === 1 ? " Items" : " Pages"}
          </span>
        </div>

        <section className="service_card_buttons">
          {reviewed ? (
            <button
              onClick={(e) => {
                e?.stopPropagation();
              }}
            >
              {" "}
              <AiOutlineCheck
                color="#369D6E"
                style={{ paddingRight: "8px" }}
              />{" "}
              Reviewed{" "}
            </button>
          ) : (
            <button
              onClick={(e) => {
                e?.stopPropagation();
                mixpanel.track("Write Review", {
                  serviceSlug: slug,
                });
                openFbModal();
              }}
            >
              <SlNote style={{ paddingRight: "12px" }} />
              Write a Review{" "}
            </button>
          )}
          <button onClick={handleView}>
            <TbEye style={{ paddingRight: "12px" }} />
            View
          </button>
        </section>
      </div>
    </>
  );
};

const NoServiceHanlder = ({ option, selectedCreator }) => {
  return (
    <section className="optional_info_service_section_user_db">
      <img
        src={
          option === "image"
            ? ImageIcon
            : option === "event"
            ? EventIcon
            : option === "excel"
            ? SheetIcon
            : option === "videos"
            ? VideoIcon
            : DocIcon
        }
        alt=""
      />
      <span>
        Oops you have no {option !== "event" && "services of"}{" "}
        {`${
          option === "image"
            ? "Image assets"
            : option === "event"
            ? "Events"
            : option === "excel"
            ? "Excel Sheets"
            : option === "videos"
            ? "Videos"
            : "Documents"
        }`}{" "}
        from creator{" "}
      </span>
      {selectedCreator?.id && (
        <button
          onClick={() => {
            window.open(`/${selectedCreator?.slug}`);
          }}
        >
          Explore{" "}
        </button>
      )}
    </section>
  );
};

const EventsSectionData = ({ liveData, upcomingData }) => {
  // console.log('event',liveData,upcomingData);
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

  const scrollLeft2 = () => {
    const container = document.getElementById("upcomingContainer");
    container.scrollLeft -= 1000;
  };

  const scrollRight2 = () => {
    const container = document.getElementById("upcomingContainer");
    container.scrollLeft += 1000;
  };

  const getDate = (date) => {
    let d = new Date(date);

    let newDate = d.toDateString().split(" ");

    return (
      newDate[0] + " | " + newDate[1] + " " + newDate[2] + " " + newDate[3]
    );
  };


  return (
    <>
      {liveData?.length !== 0 && (
        <div className="user_dashboard_event_data_section_wrapper">
          <>
            <span className="live_events_wrapper_user_dashboard_page_live_event">
              &bull; Live
            </span>
            <section className="live_events_wrapper_user_dashboard_page_content">
              {liveData?.map((e, index) => {
                return (
                  <>
                    <section className="live_events_wrapper_user_dashboard_page_content_image_desc">
                      <img
                        src={
                          e?.eventID?.simg ??
                          "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d5/No_sign.svg/300px-No_sign.svg.png"
                        }
                        alt=""
                      />
                      <span>
                        {e?.eventID?.sname?.length > 30
                          ? e?.eventID?.sname?.slice(0, 30) + "..."
                          : e?.eventID?.sname}
                      </span>
                    </section>

                    <div className="live_events_wrapper_user_dashboard_page_date_time">
                      <span>
                        <AiOutlineCalendar style={{ paddingRight: "8px" }} />
                        {getDate(e?.eventID?.startDate)}
                      </span>
                      <span>
                        <AiOutlineClockCircle style={{ paddingRight: "8px" }} />
                        {`${convertTime(
                          e?.eventID?.time?.startTime
                        )} - ${convertTime(e?.eventID?.time?.endTime)}`}
                      </span>
                    </div>

                    {/* <button
                    onClick={() => {
                      window.open(`/e/${e?.eventID?.slug}`);
                      mixpanel.track(" Live Event Details", {
                        slug: e?.eventID?.slug,
                      });
                    }}
                  >
                    Event Details
                  </button> */}

                    <button
                      className="live_events_wrapper_user_dashboard_page_content_join_now_button"
                      onClick={() => {
                        window.open(e?.eventID?.meetlink);
                        mixpanel.track("Join Now", {
                          slug: e?.eventID?.slug,
                        });
                      }}
                    >
                      Join Now
                      <BsArrowRight style={{ color: "white" }} />
                    </button>
                  </>
                );
              })}
            </section>
          </>
        </div>
      )}
      {upcomingData?.length !== 0 && (
        <div className="user_dashboard_event_data_section_wrapper">
          <section className="upcoming_events_wrapper_user_dashboard_page_outer_section">
            <div className="upcoming_events_wrapper_user_dashboard_page_outer_section_upper">
              <span>
                <BsFillCalendar3WeekFill />
                Upcoming Events
              </span>
              <div className="upcoming_events_wrapper_user_dashboard_page_arrow_sign">
                <SlArrowLeft onClick={scrollLeft2} />
                <SlArrowRight onClick={scrollRight2} />
              </div>
            </div>

            <section
              className="upcoming_events_wrapper_user_dashboard_page_arrow_sign_section"
              id="upcomingContainer"
            >
              {upcomingData?.map((e, index) => {
                return (
                  <div
                    className="upcoming_event_cards_user_dashboard_event_page_outer_section"
                    key={index}
                  >
                    <section>
                      <img
                        src={
                          e?.eventID?.simg ??
                          "https://www.pngitem.com/pimgs/m/123-1236078_straight-line-transparent-straight-white-line-no-background.png"
                        }
                        alt=""
                      />
                      <span>{e?.eventID?.sname?.length > 30
                          ? e?.eventID?.sname?.slice(0, 30) + "..."
                          : e?.eventID?.sname}</span>
                    </section>

                    <div>
                      <span>
                        <AiOutlineCalendar />
                        {getDate(e?.eventID?.startDate)}
                      </span>
                      <span>
                        <AiOutlineClockCircle />
                        {`${convertTime(
                          e?.eventID?.time?.startTime
                        )} - ${convertTime(e?.eventID?.time?.endTime)}`}
                      </span>
                    </div>

                    <button
                      onClick={() => {
                        window.open(`/e/${e?.eventID?.slug}`);
                        mixpanel.track("Upcoming Event Details", {
                          slug: e?.eventID?.slug,
                        });
                      }}
                    >
                      Event Details
                    </button>
                  </div>
                );
              })}
            </section>
          </section>
        </div>
      )}
    </>
  );
};

const MaxService = ({
  selectedCreator,
  CreatorName,
  selectedEvent,
  selectedService,
}) => {

  return (
    <div style={{ width: "100%" }}>
      <span className="creators_top_service_inside_dashboard_latest_name">
        Latest by {CreatorName?.name}
      </span>
      <div className="creators_top_service_inside_dashboard">
        {selectedService &&
        <section
          className={`creators_top_service_inside_dashboard_max_service ${
            selectedEvent !== undefined ? "width-45" : ""
          }`}
        >
          <div className="creators_top_service_inside_dashboard_max_service_tag">
            <img src={redpdf} />
            Document
          </div>
          <div className="creators_top_service_inside_dashboard_image_title_desc_views">
            <img
              src={selectedCreator?.service?.simg}
              style={{ width: "100px", height: "50px", borderRadius: "8px" }}
            />
            <div style={{ display: "flex", flexDirection: "column" }}>
              <span className="creators_top_service_inside_dashboard_image_title_desc_views_name">
                {selectedCreator?.service?.sname?.length > 30
                  ? selectedCreator?.service?.sname?.slice(0, 30) + "..."
                  : selectedCreator?.service?.sname}
              </span>
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  gap: "16px",
                  paddingTop: "8px",
                  alignItems: "center",
                }}
              >
                <div className="creators_top_service_inside_dashboard_image_title_desc_views_stats">
                  <FiTrendingUp style={{ paddingRight: "6px" }} />
                  {selectedCreator?.service?.downloads} times
                </div>
                <div className="creators_top_service_inside_dashboard_image_title_desc_views_stats">
                  <TiDocumentText style={{ paddingRight: "6px" }} />
                  {selectedCreator?.service?.noOfPages} Pages
                </div>
              </div>
            </div>
          </div>
          <div className="creators_top_service_inside_dashboard_image_title_desc_free_paid">
            <span>
              {selectedCreator?.service?.isPaid !== undefined
                ? selectedCreator.service.isPaid
                  ? "Paid"
                  : "Free"
                : "Not Available"}
            </span>

            <div
              className="creators_top_service_inside_dashboard_image_title_desc_free_paid_arrow"
              onClick={() => {
                window.open(`/s/${selectedCreator?.service?.slug}`);
              }}
            >
              <BiRightArrowAlt
                style={{
                  color: "white",
                  fontSize: "24px",
                  paddingTop: "8px",
                  paddingLeft: "7px",
                }}
              />
            </div>
          </div>
        </section>}

        {selectedEvent != undefined && (
          <section className="creators_top_service_inside_dashboard_max_service">
            <div className="creators_top_service_inside_dashboard_max_service_tag">
              <img src={redlaptop} />
              Event
            </div>
            <div className="creators_top_service_inside_dashboard_image_title_desc_views">
              <img
                src={selectedEvent?.eventID?.simg}
                style={{ width: "100px", height: "50px", borderRadius: "8px" }}
              />
              <div style={{ display: "flex", flexDirection: "column" }}>
                <span className="creators_top_service_inside_dashboard_image_title_desc_views_name">
                  {selectedEvent?.eventID?.sname}
                </span>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    gap: "16px",
                    paddingTop: "8px",
                    alignItems: "center",
                  }}
                >
                  <div className="creators_top_service_inside_dashboard_image_title_desc_views_stats">
                    <FiTrendingUp style={{ paddingRight: "6px" }} />
                    {selectedEvent?.eventID?.registrations} registration
                  </div>
                  <div className="creators_top_service_inside_dashboard_image_title_desc_views_stats">
                    <MdOutlineEventNote
                      style={{ paddingRight: "6px", fontSize: "22px" }}
                    />
                    {selectedEvent?.eventID?.stype === 0 ? "Offline" : "Online"}{" "}
                    Mode
                  </div>
                </div>
              </div>
            </div>
            <div className="creators_top_service_inside_dashboard_image_title_desc_free_paid">
              <span>
                {selectedEvent?.eventID?.isPaid !== undefined
                  ? selectedEvent?.eventID?.isPaid
                    ? "Paid"
                    : "Free"
                  : "Not Available"}
              </span>

              <div
                className="creators_top_service_inside_dashboard_image_title_desc_free_paid_arrow"
                onClick={() => {
                  window.open(`/e/${selectedEvent?.eventID?.slug}`);
                }}
              >
                <BiRightArrowAlt
                  style={{
                    color: "white",
                    fontSize: "24px",
                    paddingTop: "8px",
                    paddingLeft: "7px",
                  }}
                />
              </div>
            </div>
          </section>
        )}

        {/* {selectedService !== undefined && selectedEvent == undefined && (
          <section
            className={`creators_top_service_inside_dashboard_max_service width-45`}
          >
            <div className="creators_top_service_inside_dashboard_max_service_tag">
              <img src={redpdf} />
              Document
            </div>
            <div className="creators_top_service_inside_dashboard_image_title_desc_views">
              <img
                src={selectedService?.service?.simg}
                style={{ width: "100px", height: "50px", borderRadius: "8px" }}
              />
              <div style={{ display: "flex", flexDirection: "column" }}>
                <span className="creators_top_service_inside_dashboard_image_title_desc_views_name">
                  {selectedService?.service?.sname}
                </span>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    gap: "16px",
                    paddingTop: "8px",
                    alignItems: "center",
                  }}
                >
                  <div className="creators_top_service_inside_dashboard_image_title_desc_views_stats">
                    <FiTrendingUp style={{ paddingRight: "6px" }} />
                    {selectedService?.service?.downloads} times
                  </div>
                  <div className="creators_top_service_inside_dashboard_image_title_desc_views_stats">
                    <TiDocumentText style={{ paddingRight: "6px" }} />
                    {selectedService?.service?.noOfPages} Pages
                  </div>
                </div>
              </div>
            </div>
            <div className="creators_top_service_inside_dashboard_image_title_desc_free_paid">
              <span>
                {selectedService?.service?.isPaid !== undefined
                  ? selectedService.service.isPaid
                    ? "Paid"
                    : "Free"
                  : "Not Available"}
              </span>

              <div
                className="creators_top_service_inside_dashboard_image_title_desc_free_paid_arrow"
                onClick={() => {
                  window.open(`/${selectedService?.service?.slug}`);
                }}
              >
                <BiRightArrowAlt
                  style={{
                    color: "white",
                    fontSize: "24px",
                    paddingTop: "8px",
                    paddingLeft: "7px",
                  }}
                />
              </div>
            </div>
          </section>
        )} */}
      </div>
    </div>
  );
};

function UserDashboard2(props) {
  const location = useLocation();

  // States ------------------------
  const [selectedCreator, setSelectedCreator] = useState();
  const [countServices, setCountServices] = useState();
  const [option, setOption] = useState("all");
  const [servicesArray, setServicesArray] = useState([]);
  const [liveEventsArray, setliveEventsArray] = useState([]);
  const [upcomingEventsArray, setUpcomingEventsArray] = useState([]);
  const [openLoading, setOpenLoading] = useState(false);
  const [allpdf, setAllPdf] = useState([]);
  const [allvideo, setAllVideo] = useState([]);
  const [allexcel, setAllExcel] = useState([]);
  const [openUserLoginModal, setOpenUserLoginModal] = useState(false);
  const [fbModalDetails, setFbModalDetails] = useState({
    open: false,
    service: {},
    stype: "",
  }); // feedback modal details opening and details ----

  // COntexts ----------

  const {
    getallcreatorsofuser,
    userCreators,
    getallordersofuser,
    alluserDocs,
    getalleventsofuser,
    eventsUser,
  } = useContext(UserDashbaord);

  // console.log('event',eventsUser);

  useEffect(() => {
    mixpanel.track("Page Visit");

    if (!localStorage.getItem("isUser") === "true") {
      localStorage.removeItem("url");
    } else {
      localStorage.setItem("url", location.pathname);
    }

    if (!localStorage.getItem("jwtToken")) {
      setOpenUserLoginModal(true);
    } else {
      setOpenLoading(true);
      getallcreatorsofuser().then(() => {
        setOpenLoading(false);
      });
      getalleventsofuser().then((e) => {});
      getallordersofuser().then(() => {
        setOpenLoading(false);
      });
    }
  }, [location]);

  useEffect(() => {
    setOpenLoading(true);
    getallcreatorsofuser().then(() => {
      setOpenLoading(false);
    });
    getalleventsofuser().then((e) => {});
    getallordersofuser().then(() => {
      setOpenLoading(false);
    });
  }, []);

  // get the count for the selected creator
  useEffect(() => {
    setCountServices(
      alluserDocs
        ?.filter((e) => {
          return e?.service?.sname && e?.service?.status !== 0;
        })
        ?.filter((e) => {
          return e?.service?.c_id === selectedCreator?.id;
        }).length +
        eventsUser?.LiveEvents?.filter((e) => {
          return e?.eventID?.c_id === selectedCreator?.id;
        }).length +
        eventsUser?.UpcomingEvents?.filter((e) => {
          return e?.eventID?.c_id === selectedCreator?.id;
        }).length
    );
  }, [selectedCreator]);

  // refresh the services every time the following options are changed
  useEffect(() => {
    getEventsArray();
    getServicesArray();
  }, [alluserDocs, selectedCreator]);

  useEffect(() => {
    // Initialize empty arrays outside the map function
    const allPdfArray = [];
    const allExcelArray = [];
    const allVideoArray = [];
    // Map through the servicesArray
    servicesArray?.forEach((e) => {
      // console.log(e?.service?.simg);

      const serviceData = {
        c_id: e?.service?.c_id,
        key: e?.service?.slug,
        type: e?.service?.stype,
        name: e?.service?.sname,
        slug: e?.service?.slug,
        simg: e?.service?.simg,
        pages: e?.service?.noOfPages,
        date: e?.service?.date,
        surl: e?.service?.surl,
        reviewed: e?.Reviewed,
        _id: e?.service?._id,
        downloads: e?.service?.downloads,
        isPaid: e?.service?.isPaid,
      };

      if (e?.service?.stype === 1) {
        allExcelArray.push(serviceData);
      } else if (e?.service?.stype === 2) {
        allVideoArray.push(serviceData);
      } else {
        allPdfArray.push(serviceData);
      }
    });

    // Update the state arrays outside the map function
    setAllPdf(allPdfArray);
    setAllExcel(allExcelArray);
    setAllVideo(allVideoArray);
  }, [servicesArray]);

  // console.log('ass',allpdf)

  // Functions --------------------------

  // COntrols the service in the user dashboard based on selected creator and the option
  const getServicesArray = () => {
    setOpenLoading(true);

    let finalArr1 = alluserDocs?.filter((e) => {
      return e?.service?.sname && e?.service?.status !== 0;
    });

    if (selectedCreator?.id) {
      setOpenLoading(false);
      setServicesArray(
        finalArr1?.filter((e) => {
          return (
            selectedCreator?.id && e?.service?.c_id === selectedCreator?.id
          );
        })
      );
    } else {
      setOpenLoading(false);
      setServicesArray(finalArr1);
    }
    // console.log(servicesArray);
  };

  const getEventsArray = () => {
    setOpenLoading(true);

    if (selectedCreator?.id) {
      setOpenLoading(false);
      setliveEventsArray(
        eventsUser?.LiveEvents?.filter((e) => {
          return (
            selectedCreator?.id && e?.eventID?.c_id === selectedCreator?.id
          );
        })
      );

      setUpcomingEventsArray(
        eventsUser?.UpcomingEvents?.filter((e) => {
          return (
            selectedCreator?.id && e?.eventID?.c_id === selectedCreator?.id
          );
        })
      );
    } else {
      setOpenLoading(false);
      setliveEventsArray(eventsUser?.LiveEvents);
      setUpcomingEventsArray(eventsUser?.UpcomingEvents);
    }
  };

  let latestEvent = null; // Declare outside the block

  if (upcomingEventsArray && upcomingEventsArray.length > 0) {
    upcomingEventsArray.sort((a, b) => {
      return new Date(b?.startDate) - new Date(a?.startDate);
    });

    latestEvent = upcomingEventsArray[0];
  } else {
  }

  if (servicesArray && servicesArray.length > 0) {
    servicesArray.sort((a, b) => {
      return new Date(b?.newMadeDate) - new Date(a?.newMadeDate);
    });

    // Now, servicesArray is sorted in descending order based on newMadeDate
  } else {
  }
  // console.log('service',servicesArray);
  let latestService = servicesArray && servicesArray[0];
  let secondHighestService =  servicesArray && servicesArray[1];
  const scrollLeft = () => {
    const container = document.getElementById("pdfContainer");
    container.scrollLeft -= 1000;
  };

  const scrollRight = () => {
    const container = document.getElementById("pdfContainer");
    container.scrollLeft += 1000;
  };

  const scrollLeft1 = () => {
    const container = document.getElementById("excelContainer");
    container.scrollLeft -= 1000;
  };

  const scrollRight1 = () => {
    const container = document.getElementById("excelContainer");
    container.scrollLeft += 1000;
  };

  return (
    <>
      <Navbar2
        open={openUserLoginModal}
        backgroundDark={true}
        noCloseLogin={true}
        // close={() => {
        //   setOpenUserLoginModal(false);
        // }}
      />
      <ToastContainer />

      {openLoading && <LoadThree />}

      {/* Feedback Modal -------------------- */}
      <FeedbackModal
        open={fbModalDetails?.open}
        onClose={() => {
          setFbModalDetails({ ...fbModalDetails, open: false });
        }}
        progress={props.progress}
        name={fbModalDetails?.service?.sname}
        slug={fbModalDetails?.service?.slug}
        id={fbModalDetails?.service?._id}
        reload={true}
      />

      <div className="main_wrapper_user_dashboard">
        {/* Creator section user dashboard */}
        <div className="user_dashboard_all_creators_00_combine_outer">
          <div className="user_dashboard_all_creators_00_combine">
            <span className="user_dashboard_all_creators_00_creator">
              Your Creators
            </span>
            <span className="user_dashboard_all_creators_00_desc">
              Creators who's content you've engaged with.
            </span>
          </div>
        </div>
        <div className="user_dashboard_creator_section">
          <section>
            {userCreators?.length > 0 && userCreators
              ?.filter((e) => {
                return e?.creatorID?.status !== 0;
              })
              ?.map((e) => {
                // console.log('e',e?.averageRating)
                return (
                  <CreatorCard
                    tagline={e?.creatorInfo?.tagLine}
                    key={e?.creatorInfo?.creatorID?.slug}
                    name={e?.creatorInfo?.name}
                    selected={
                      e?.creatorInfo?.creatorID?._id === selectedCreator?.id
                    }
                    photo={e?.creatorInfo?.profile}
                    rating={e?.averageRating}
                    setSelectedCreator={() => {
                      setSelectedCreator({
                        id: e?.creatorInfo?.creatorID?._id,
                        name: e?.creatorInfo?.name,
                        photo: e?.creatorInfo?.profile,
                        slug: e?.creatorInfo?.creatorID?.slug,
                        tagline: e?.creatorInfo?.tagLine,
                        rating: e?.averageRating,
                      });
                    }}
                  />
                );
              })}
          </section>
          {userCreators?.length > 13 && <BsChevronDown />}
        </div>

        {/* Selected Creator Card for Mobile */}
        {window.screen.width < 650 && selectedCreator?.id && (
          <SelectedCreatorCard
            serviceCount={countServices}
            name={selectedCreator?.name}
            slug={selectedCreator?.slug}
            photo={selectedCreator?.photo}
          />
        )}

        {/* Selected Creator Card for Desktop */}
        {window.screen.width > 650 && selectedCreator?.id && (
          <SelectedCreatorCard
            serviceCount={countServices}
            name={selectedCreator?.name}
            slug={selectedCreator?.slug}
            photo={selectedCreator?.photo}
          />
        )}

        {/* {option === "event" && <EventsSectionData />} */}
        {/* Service Cards of selected Creator */}

        {(servicesArray?.length !== 0 || liveEventsArray?.length !== 0 || upcomingEventsArray?.length !==0 )  ? (
          <div className="services_section_user_dashboard">
            {/* If the creator is selected or not */}

            {(liveEventsArray?.length !== 0 ||
              upcomingEventsArray?.length !== 0) && (
              <EventsSectionData
                liveData={liveEventsArray}
                upcomingData={upcomingEventsArray}
              />
            )}

            {allpdf?.length !== 0 && (
              <div className="user_dashboard_event_data_section_wrapper">
                <section className="upcoming_events_wrapper_user_dashboard_page_outer_section">
                  <div className="upcoming_events_wrapper_user_dashboard_page_outer_section_upper">
                    <span>
                      <img src={pdfIcon} />
                      PDF
                    </span>
                    <div className="upcoming_events_wrapper_user_dashboard_page_arrow_sign">
                      <SlArrowLeft onClick={scrollLeft} />
                      <SlArrowRight onClick={scrollRight} />
                    </div>
                  </div>

                  <section
                    className="all_pdf_wrapper_user_dashboard_page_arrow_sign"
                    id="pdfContainer"
                  >
                    {allpdf?.map((e) => (
                      <ServiceCard
                        downloads={e?.downloads}
                        isPaid={e?.isPaid}
                        date={e?.date}
                        pages={e?.pages}
                        img={e?.simg}
                        key={e?.slug}
                        type={e?.type}
                        name={e?.name}
                        slug={e?.slug}
                        surl={e?.surl}
                        reviewed={e?.reviewed}
                        openFbModal={() => {
                          setFbModalDetails({
                            ...fbModalDetails,
                            open: true,
                            service: {
                              sname: e?.name,
                              slug: e?.slug,
                              _id: e?._id,
                            },
                          });
                        }}
                      />
                    ))}
                  </section>
                </section>
              </div>
            )}

            {allexcel?.length !== 0 && (
              <div className="user_dashboard_event_data_section_wrapper">
                <section className="upcoming_events_wrapper_user_dashboard_page_outer_section">
                  <div className="upcoming_events_wrapper_user_dashboard_page_outer_section_upper">
                    <span>
                      <img src={excelIcon} />
                      Excel
                    </span>
                    <div className="upcoming_events_wrapper_user_dashboard_page_arrow_sign">
                      <SlArrowLeft onClick={scrollLeft1} />
                      <SlArrowRight onClick={scrollRight1} />
                    </div>
                  </div>

                  <section
                    className="all_pdf_wrapper_user_dashboard_page_arrow_sign"
                    id="excelContainer"
                  >
                    {allexcel?.map((e) => (
                      <ServiceCard
                        date={e?.date}
                        pages={e?.pages}
                        img={e?.simg}
                        key={e?.slug}
                        type={e?.type}
                        name={e?.name?.length > 30
                          ? e?.name?.slice(0, 30) + "..."
                          : e?.name}
                        slug={e?.slug}
                        surl={e?.surl}
                        reviewed={e?.reviewed}
                        openFbModal={() => {
                          setFbModalDetails({
                            ...fbModalDetails,
                            open: true,
                            service: {
                              sname: e?.name,
                              slug: e?.slug,
                              _id: e?._id,
                            },
                          });
                        }}
                      />
                    ))}
                  </section>
                </section>
              </div>
            )}

            {selectedCreator?.id && (latestEvent || secondHighestService) && (
              <MaxService
                selectedCreator={latestService}
                CreatorName={selectedCreator}
                selectedEvent={latestEvent}
                selectedService={secondHighestService}
              />
            )}

            {selectedCreator?.id && (
              <SelectedCreatorCardBelow
                name={selectedCreator?.name}
                slug={selectedCreator?.slug}
                photo={selectedCreator?.photo}
                tagline={selectedCreator?.tagline}
                rating={selectedCreator?.rating}
              />
            )}

            {/* add it later if needed */}
            {/* {allvideo?.length !== 0 && (
              <div className="user_dashboard_event_data_section_wrapper">
                <section className="upcoming_events_wrapper_user_dashboard_page_outer_section">
                  <div className="upcoming_events_wrapper_user_dashboard_page_outer_section_upper">
                    <span>
                      <BsFillCalendar3WeekFill />
                      Video
                    </span>
                    <div className="upcoming_events_wrapper_user_dashboard_page_arrow_sign">
                      <SlArrowLeft onClick={scrollLeft} />
                      <SlArrowRight onClick={scrollRight} />
                    </div>
                  </div>

                  <section className="all_pdf_wrapper_user_dashboard_page_arrow_sign">
                    {allvideo?.map((e) => (
                      <ServiceCard
                        pages={e?.pages}
                        img={e?.simg}
                        key={e?.slug}
                        type={e?.type}
                        name={e?.name}
                        slug={e?.slug}
                        surl={e?.surl}
                        reviewed={e?.reviewed}
                        openFbModal={() => {
                          setFbModalDetails({
                            ...fbModalDetails,
                            open: true,
                            service: {
                              sname: e?.name,
                              slug: e?.slug,
                              _id: e?._id,
                            },
                          });
                        }}
                      />
                    ))}
                  </section>
                </section>
              </div>
            )} */}
          </div>
        ) : (
          <NoServiceHanlder option={option} selectedCreator={selectedCreator} />
        )}
      </div>

      <Footer3 />
    </>
  );
}

export default UserDashboard2;
