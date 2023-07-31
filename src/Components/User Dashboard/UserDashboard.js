import React, { useContext, useEffect, useState } from "react";
import "./UserDashboard.css";
import Navbar from "../Layouts/Navbar User/Navbar";
import { BsChevronDown, BsFillCalendar3WeekFill } from "react-icons/bs";
import {
  AiOutlineCheck,
  AiOutlineCalendar,
  AiOutlineClockCircle,
} from "react-icons/ai";
import Footer2 from "../Footer/Footer2";
import DocIcon from "../../Utils/Icons/iconDocs.svg";
import SheetIcon from "../../Utils/Icons/iconSheet.svg";
import VideoIcon from "../../Utils/Icons/iconVideo.svg";
import EventIcon from "../../Utils/Icons/iconEvent.svg";
import ImageIcon from "../../Utils/Icons/iconImage.svg";
import { UserDashbaord } from "../../Context/userdashbaord";
import { LoadThree } from "../Modals/Loading";
import { useNavigate } from "react-router-dom";
import FeedbackModal from "../Modals/Feedback_Modal";
import { ToastContainer } from "react-toastify";
import mixpanel from "mixpanel-browser";
import Dummyimg from "../../Utils/Images/default_user.png";

const PageOptions = [
  { id: "all", name: "All" },
  { id: "documents", name: "Documents" },
  { id: "excel", name: "Excel Sheets" },
  // { id: "videos", name: "Videos" },
  { id: "event", name: "Events" },
  // { id: "image", name: "Image Assets" },
];

const CreatorCard = ({ name, photo, setSelectedCreator, selected }) => {
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

const SelectedCreatorCard = ({ serviceCount, name, photo, slug }) => {
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
        <p>
          <b>{serviceCount}</b> Unlocked Items from{" "}
        </p>
        <span>{name}</span>
      </section>
    </div>
  );
};

const ServiceCard = ({ name, type, slug, surl, reviewed, openFbModal }) => {
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
        <span className="service_card_tag">
          {type === 1 ? "Excel Sheet" : type === 2 ? "Videos" : "Document"}
        </span>

        <section className="service_card_details">
          <img
            src={type === 1 ? SheetIcon : type === 2 ? VideoIcon : DocIcon}
            alt=""
          />
          <span>{name}</span>
        </section>

        <section className="service_card_buttons">
          {reviewed ? (
            <button
              onClick={(e) => {
                e?.stopPropagation();
              }}
            >
              {" "}
              <AiOutlineCheck color="#369D6E" /> Reviewed{" "}
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
              Write Review{" "}
            </button>
          )}
          <button onClick={handleView}>View Now</button>
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

    return (
      newDate[0] + " | " + newDate[1] + " " + newDate[2] + " " + newDate[3]
    );
  };

  return (
    <div className="user_dashboard_event_data_section_wrapper">
      {liveData?.length !== 0 && (
        <section className="live_events_wrapper_user_dashboard_page">
          {liveData?.map((e, index) => {
            return (
              <div>
                <span>&bull; Live</span>

                <section>
                  <img
                    src={
                      e?.eventID?.simg ??
                      "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d5/No_sign.svg/300px-No_sign.svg.png"
                    }
                    alt=""
                  />
                  <span>{e?.eventID?.sname}</span>
                </section>

                <div>
                  <button
                    onClick={() => {
                      window.open(`/e/${e?.eventID?.slug}`);
                      mixpanel.track(" Live Event Details", {
                        slug: e?.eventID?.slug,
                      });
                    }}
                  >
                    Event Details
                  </button>

                  <button
                    onClick={() => {
                      window.open(e?.eventID?.meetlink);
                      mixpanel.track("Join Now", {
                        slug: e?.eventID?.slug,
                      });
                    }}
                  >
                    Join Now
                  </button>
                </div>
              </div>
            );
          })}
        </section>
      )}

      {upcomingData?.length !== 0 && (
        <section className="upcoming_events_wrapper_user_dashboard_page">
          <div>
            <span>
              <BsFillCalendar3WeekFill />
              Upcoming Events
            </span>
          </div>

          <section>
            {upcomingData?.map((e, index) => {
              return (
                <div
                  className="upcoming_event_cards_user_dashboard_event_page"
                  key={index}
                >
                  <img
                    src={
                      e?.eventID?.simg ??
                      "https://www.pngitem.com/pimgs/m/123-1236078_straight-line-transparent-straight-white-line-no-background.png"
                    }
                    alt=""
                  />
                  <span>{e?.eventID?.sname}</span>

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
      )}
    </div>
  );
};

function UserDashboard(props) {
  // States ------------------------
  const [selectedCreator, setSelectedCreator] = useState();
  const [countServices, setCountServices] = useState();
  const [option, setOption] = useState("all");
  const [servicesArray, setServicesArray] = useState([]);
  const [liveEventsArray, setliveEventsArray] = useState([]);
  const [upcomingEventsArray, setUpcomingEventsArray] = useState([]);
  const [openLoading, setOpenLoading] = useState(false);
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

  useEffect(() => {
    mixpanel.track("Page Visit");
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
    if (option === "event") {
      getEventsArray();
    } else {
      getServicesArray();
    }
  }, [option, alluserDocs, selectedCreator]);

  // Functions --------------------------

  const handleOptionClick = (option) => {
    setOption(option);
  };

  // COntrols the service in the user dashboard based on selected creator and the option
  const getServicesArray = () => {
    setOpenLoading(true);
    let finalArr2 = [];
    let finalArr1 = alluserDocs?.filter((e) => {
      return e?.service?.sname && e?.service?.status !== 0;
    });

    switch (option) {
      case "all":
        finalArr2 = finalArr1;
        break;
      case "documents":
        finalArr2 = finalArr1?.filter((e) => {
          return e?.service?.stype === 0;
        });
        break;
      case "excel":
        finalArr2 = finalArr1?.filter((e) => {
          return e?.service?.stype === 1;
        });
        break;
      case "videos":
        finalArr2 = finalArr1?.filter((e) => {
          return e?.service?.stype === 2;
        });
        break;
      // case "event":
      //   finalArr2 = finalArr1?.filter((e) => {
      //     return e?.service?.stype === 3;
      //   });
      //   break;
      // case "image":
      //   finalArr2 = finalArr1?.filter((e) => {
      //     return e?.service?.stype === 4;
      //   });
      //   break;

      default:
        finalArr2 = finalArr1;
        break;
    }

    if (selectedCreator?.id) {
      setOpenLoading(false);
      setServicesArray(
        finalArr2?.filter((e) => {
          return (
            selectedCreator?.id && e?.service?.c_id === selectedCreator?.id
          );
        })
      );
    } else {
      setOpenLoading(false);
      setServicesArray(finalArr2);
    }
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

  return (
    <>
      <Navbar />
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
        <div className="user_dashboard_creator_section">
          <section>
            {userCreators
              ?.filter((e) => {
                return e?.creatorID?.status !== 0;
              })
              ?.map((e) => {
                return (
                  <CreatorCard
                    key={e?.creatorID?.slug}
                    name={e?.name}
                    selected={e?.creatorID?._id === selectedCreator?.id}
                    photo={e?.profile}
                    setSelectedCreator={() => {
                      setSelectedCreator({
                        id: e?.creatorID?._id,
                        name: e?.name,
                        photo: e?.profile,
                        slug: e?.creatorID?.slug,
                      });
                    }}
                  />
                );
              })}
          </section>
          {userCreators.length > 13 && <BsChevronDown />}
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

        {/* Options in user Dashboard */}
        <div className="options_section_user_dashboard">
          {PageOptions.map((e) => {
            return (
              <span
                className={`${
                  option === e?.id && "active_option_user_dashboard"
                } options_span_user_dashboard`}
                key={e?.id}
                onClick={() => {
                  mixpanel.track(e?.name);
                  handleOptionClick(e?.id);
                }}
              >
                {e?.name}
              </span>
            );
          })}
        </div>

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

        {option === "event" &&
          (liveEventsArray?.length !== 0 ||
          upcomingEventsArray?.length !== 0 ? (
            <EventsSectionData
              liveData={liveEventsArray}
              upcomingData={upcomingEventsArray}
            />
          ) : (
            <NoServiceHanlder
              option={option}
              selectedCreator={selectedCreator}
            />
          ))}

        {option !== "event" &&
          (servicesArray?.length !== 0 ? (
            <div className="services_section_user_dashboard">
              {/* If the creator is selected or not */}
              {servicesArray?.map((e) => {
                return (
                  <ServiceCard
                    key={e?.service?.slug}
                    type={e?.service?.stype}
                    name={e?.service?.sname}
                    slug={e?.service?.slug}
                    surl={e?.service?.surl}
                    reviewed={e?.Reviewed}
                    openFbModal={() => {
                      setFbModalDetails({
                        ...fbModalDetails,
                        open: true,
                        service: {
                          sname: e?.service?.sname,
                          slug: e?.service?.slug,
                          _id: e?.service?._id,
                        },
                      });
                    }}
                  />
                );
              })}
            </div>
          ) : (
            <NoServiceHanlder
              option={option}
              selectedCreator={selectedCreator}
            />
          ))}
      </div>

      <Footer2 />
    </>
  );
}

export default UserDashboard;
