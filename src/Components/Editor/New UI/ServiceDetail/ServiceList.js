import React, { useContext, useEffect, useState } from "react";
import "./ServiceList.css";
import ServiceContext from "../../../../Context/services/serviceContext";
import { SuperSEO } from "react-super-seo";
import { toast, ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { LoadTwo } from "../../../Modals/Loading";
import { Email_Model2 } from "../../../Modals/Email_Modal";
import { ChangeStatus } from "../../../Modals/ServiceSuccess/Modal2";
import { Button1, Button2, Button4 } from "../Create Services/InputComponents/buttons";
import {
  AiOutlineCalendar,
  AiOutlineClockCircle,
  AiOutlinePlus,
} from "react-icons/ai";
import { BiDotsVerticalRounded, BiShow, BiStats } from "react-icons/bi";
import mixpanel from "mixpanel-browser";
import {
  BsArrowLeftShort,
  BsFillBrushFill,
  BsFillCalendar3WeekFill,
  BsLinkedin,
  BsPersonFill,
  BsTelegram,
  BsWhatsapp,
} from "react-icons/bs";
import { RiEdit2Fill } from "react-icons/ri";
import { IoCopy, IoCopyOutline } from "react-icons/io5";
import { TbSend } from "react-icons/tb";
import { LinkedinShareButton, TelegramShareButton } from "react-share";
import { DeleteModal } from "../../../Modals/Logout_Model";
import { Certificate } from "../../../EventCertifcates/SelectCertificate";

const CertitficatePreview = ({certificateData,eventData,onClose}) =>{
  return (
    <div className="logout_model_logout">
      <section className="certificate_preview_system">
      <h1 className="text_type01_payment_info">Your Certificate</h1>

      <Certificate 
      scale={0.8}
      origin="center"
      data={{name:certificateData?.name,para:certificateData?.para}}
      background={certificateData?.certificate}
      signURL={certificateData?.sign}
      signStyle={certificateData?.signStyle}
      eventData={eventData}
      />


      <Button4 text="Close" onClick={onClose}/>
      </section>
    </div>
  )
}

const ContentCard = ({
  i,
  _id,
  simg,
  mobileSimg,
  sname,
  downloads,
  date,
  createdOn,
  slug,
  isPaid,
  ssp,
  startDate,
  time,
  selected,
  registrations,
  eventCode,
  copyURL,
  dummyData,
  setShareModalData,
  stype,
  status,
  setOpenOption,
  setCurrSelected,
  setChangeStatus,
  deleteService,
  setOpenModel,
  OpenOption,
  revArray,
  earning,
  setOpenDeleteModal,
  certificateData,
  setCertificatePreviewData
}) => {
  const navigate = useNavigate();

  const [statusForCurrent, setStatusForCurrent] = useState(status);

  const openOptionsPopup = (i) => {
    document.getElementById(`servicelist_options${i}`).style.display = "flex";
    setOpenOption(i);
  };

  const removeOptionPopup = () => {
    if (OpenOption !== 0) {
      revArray.map((elem, i) => {
        return (document.getElementById(
          `servicelist_options${i + 1}`
        ).style.display = "none");
      });
      document.getElementById(
        `servicelist_options${OpenOption}`
      ).style.display = "none";
      setOpenOption(0);
    }
  };

  const handleCheckClick = async () => {
    removeOptionPopup(); // removes popup ------------------------------
    if (statusForCurrent === 1) {
      // means now it is checked ------------
      setChangeStatus(0);
      const success = await deleteService(
        _id,
        0,
        selected === "events" ? "event" : "document"
      ); // changing status of the service / eevent
      if (success) {
        setOpenModel(true);
        setStatusForCurrent(0); // manually changing its value--------------
      } else {
        toast.error("Some error occured", {
          position: "top-center",
          autoClose: 2000,
        });
      }
    } else {
      // means now it is unchecked-----------------
      setChangeStatus(1);
      const success = await deleteService(
        _id,
        1,
        selected === "events" ? "event" : "document"
      );
      if (success) {
        setOpenModel(true);
        setStatusForCurrent(1); // manually changing its value--------------
      } else {
        toast.error("Some error occured", {
          position: "top-center",
          autoClose: 2000,
        });
      }
    }
  };

  const getDateTime = () => {
    let dateStr = new Date(selected === "events" ? createdOn : date);
    return dateStr.toLocaleString();
  };

  return (
    <div className="mycontent_card_for_service">
      <img
        src={mobileSimg ?? simg ?? "https://startup.mp.gov.in/assets/img/img-not-found.png"}
        alt=""
        onClick={() => {
          status ===1 ? selected === "events"
            ? window.open(`/e/${slug}`)
            : window.open(`/s/${slug}`) : console.log("no")
        }}
      />
      <section>
        <div
          style={{
            display: "flex",
            gap: window.screen.width > 600 ? "16px" : "8px",
            flexDirection: "column",
            width: "100%",
            justifyContent: "space-between",
            height: "100%"
          }}
        >
          <h2
            onClick={() => {
              selected === "events"
                ? window.open(`/e/${slug}`)
                : window.open(`/s/${slug}`);
            }}
          >
            {sname}
          </h2>

          <div className="props_mycontent_card_service">
           {status !== 3 ? <section>
              <p
                style={{ cursor: "pointer" }}
                onClick={() => {
                  mixpanel.track("Downloads");
                  selected === "events"
                    ? !dummyData.EventDummy &&
                      registrations !== 0 &&
                      window.open(
                        `/dashboard/viewUserDetails/${slug}?type=event`,
                        "_blank"
                      )
                    : !dummyData.ServiceDummy &&
                      downloads !== 0 &&
                      window.open(
                        `/dashboard/viewUserDetails/${slug}`,
                        "_blank"
                      );
                }}
              >
                Sales :
                <span>{selected === "events" ? registrations : downloads}</span>
              </p>
              <p>
                Earnings : <span>{earning}</span>
              </p>
              <p>
                Created On :<span>{getDateTime()}</span>
              </p>

              {selected === "events" && 
              (certificateData ? 
              <button
              onClick={() => {
                mixpanel.track("Certificate Preview");
                setCertificatePreviewData({open:true,certificateData,eventData:{
                  sname: sname,
                  date: startDate,
                }})
              }}
            >
             <BiShow/> Certificate Preview
            </button>
            :
              
              <button
                onClick={() => {
                  mixpanel.track("Customise Certificate");
                  navigate(`/dashboard/eventCertificates/${slug}`)
                }}
              >
               <BsFillBrushFill/> Customise Certificate 
              </button>)}

            </section>
            :
            <section>
              <p>
                Drafted On :<span>{getDateTime()}</span>
              </p>
            </section>
          
          }

            {status !==3 ? <div className="buttons_div_section_mycontent_card">
              <button
                onClick={() => {
                  mixpanel.track("Tracking Link");
                  toast.info("Copied Link Successfully");
                  navigator.clipboard.writeText(copyURL);
                }}
              >
                Tracking Link <IoCopyOutline />
              </button>

              <button
                onClick={() => {
                  const pattern = /go\.anchors\.in/;
                  selected === "events"
                    ? // ? setShareModalData({
                      //     open: true,
                      //     sname: sname,
                      //     slug: slug,
                      //     simg: simg,
                      //     isEvent: selected === "events",
                      //     eventCode: eventCode,
                      //     link: copyURL
                      //       ? pattern.test(copyURL)
                      //         ? copyURL
                      //         : selected === "events"
                      //         ? `https://www.anchors.in/e/${slug}`
                      //         : `https://www.anchors.in/s/${slug}`
                      //       : selected === "events"
                      //       ? `https://www.anchors.in/e/${slug}`
                      //       : `https://www.anchors.in/s/${slug}`,
                      //   })
                      window.open(`/dashboard/shareTemplate/${slug}?type=event`)
                    : window.open(`/dashboard/shareTemplate/${slug}`);
                }}
              >
                Sharing Template <TbSend />
              </button>

              <button
                onClick={() => {
                  mixpanel.track("Analysis");
                  selected === "events"
                    ? !dummyData.EventDummy &&
                      window.open(
                        `/dashboard/serviceStats/${slug}?type=event`,
                        "_blank"
                      )
                    : !dummyData.ServiceDummy &&
                      window.open(`/dashboard/serviceStats/${slug}`, "_blank");
                }}
              >
                {window.screen.width > 600 ? (
                  <>
                    {" "}
                    <BiStats /> Detailed Service Analysis{" "}
                  </>
                ) : (
                  <>
                    Detailed Service Analysis <BiStats />{" "}
                  </>
                )}
              </button>
            </div>
            :
            <div className="buttons_div_section_mycontent_card">
              <button onClick={() => {
                  mixpanel.track("Continue Editing the draft");
                  selected === "events"
                    ? 
                      window.open(
                        `/dashboard/createevent?draft=${_id}`,"_self"
                      )
                    : window.open(`/dashboard/createservice?draft=${_id}`,"_self");
                }}>
              <RiEdit2Fill /> Continue Editing
              </button>
              </div>
          }
          </div>
        </div>

        {window.screen.width > 600 && (
          <BiDotsVerticalRounded
            onClick={() =>
              {setCurrSelected({ copyURL, status, _id , selected });
              selected === "events"
                ? !dummyData.EventDummy && openOptionsPopup(i + 1)
                : !dummyData.ServiceDummy && openOptionsPopup(i + 1)
            }
            }
          />
        )}

        {/* content card_popup */}
        <div
          className="servicelist_optionspopup"
          id={`servicelist_options${i + 1}`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="servicelist_wrap">
            <div className="servicelist_popuptop">
              {(selected !== "events" || new Date(startDate) > new Date()) && status !== 3 &&  (
                <div
                  className="modaloptions_servicelist"
                  onClick={() => {
                    selected === "events"
                      ? navigate(`/dashboard/editevent/${slug}`)
                      : navigate(
                          `/dashboard/editservice/${slug}/${
                            stype === 2
                              ? "video"
                              : stype === 1
                              ? "excel"
                              : "pdf"
                          }`
                        );
                  }}
                >
                  Edit {selected === "events" ? "Event" : "Service"}
                </div>
              )}

              {selected !== "events" && (
                <div
                  className="modaloptions_servicelist"
                  onClick={() => {
                    navigate(
                      `/dashboard/createservice?type=${
                        stype === 2 ? "video" : stype === 1 ? "excel" : "pdf"
                      }&duplicate=${slug}`
                    );
                    mixpanel.track("Duplicate Service", {
                      service: slug,
                    });
                  }}
                >
                  Duplicate Service
                </div>
              )}

              <div
                className="modaloptions_servicelist"
                onClick={() => {
                  setOpenDeleteModal(true)
                  removeOptionPopup();
                }}
              >
                Delete {selected === "events" ? "Event" : "Service"}
              </div>

              {selected !== "events" && (
                <div
                  className="modaloptions_servicelist"
                  onClick={() => {
                    selected === "events"
                      ? navigate(`/dashboard/servicereviews/${slug}?type=event`)
                      : navigate(`/dashboard/servicereviews/${slug}`);
                  }}
                >
                  User Reviews
                </div>
              )}

              {status !== 3 && <div className="modaloptions_servicelist_status">
                Active Status
                <span onClick={() => handleCheckClick()}>
                  <label className="switch_type_01">
                    <input
                      id={`checkbox_${i + 1}`}
                      type="checkbox"
                      checked={statusForCurrent}
                    />
                    <span className="slider_type_01 round_type_01"></span>
                  </label>
                </span>
              </div>}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

const PopupModal = ({
  slug,
  onClose,
  simg,
  sname,
  link,
  isEvent,
  eventCode,
}) => {
  let message = isEvent
    ? `Greetings! Delighted to announce my event on ${sname}. Join for an unforgettable experience you won't want to miss!`
    : `Greetings! Here's my document on the topic ${sname}, I believe you'll find it highly informative and beneficial.`;

  const handleCopyToClipboard = () => {
    const copyURL = isEvent
      ? eventCode
        ? `https://open.anchors.in/${eventCode}`
        : link
      : link;

    navigator.clipboard
      .writeText(copyURL)
      .then(() => {
        toast.info("Copied link to clipboard", {
          position: "top-center",
          autoClose: 2000,
        });
      })
      .catch((error) => {
        console.error("Failed to copy link to clipboard:", error);
      });
  };

  return (
    <div className="service_share_link_user_wrapper" onClick={onClose}>
      <div
        className="service_share_link_user_popup"
        onClick={(e) => {
          e?.stopPropagation();
        }}
      >
        <div className="service_share_link_user">
          <div className="service_share_link_user_first_frame">
            <img src={simg} alt="Image" />
            {isEvent ? (
              <div className="service_share_link_user_first_frame_text">
                Greetings! Delighted to announce my event on <b>{sname}</b>.
                Join for an unforgettable experience you won't want to miss!
              </div>
            ) : (
              <div className="service_share_link_user_first_frame_text">
                Greetings! Here's my document on the topic <b>{sname}</b>, I
                believe you'll find it highly informative and beneficial.
              </div>
            )}
            <div className="service_share_link_user_first_frame_close">
              <i className="fa-solid fa-xmark fa-lg" onClick={onClose}></i>
            </div>
          </div>
          <div className="service_share_link_user_second_frame">
            <div
              className="service_share_link_user_second_frame_link"
              onClick={handleCopyToClipboard}
            >
              {isEvent
                ? eventCode
                  ? `https://open.anchors.in/${eventCode}`
                  : link
                : link}
              <IoCopy color="white" />
            </div>
            <div className="service_share_link_user_second_frame_allshare">
              <LinkedinShareButton
                url={
                  isEvent
                    ? eventCode
                      ? `https://open.anchors.in/${eventCode}`
                      : link
                    : link
                }
                title={message}
                onClick={() => {
                  mixpanel.track("Event Shared On Linkedin", {
                    service: slug,
                  });
                }}
              >
                <div className="service_share_link_user_second_frame_allshare_container">
                  {" "}
                  <BsLinkedin color="white" size={20} />
                </div>
              </LinkedinShareButton>
              {/* <WhatsappShareButton
                url={isEvent ? (eventCode ? `https://open.anchors.in/${eventCode}` : link) : link}
                title={message}
                onClick={() => {
                  mixpanel.track("Event Shared On Whatsapp", {
                    event: slug,
                  });
                }}
              > */}
              <div
                className="service_share_link_user_second_frame_allshare_container"
                onClick={() => {
                  mixpanel.track("Event Shared On Whatsapp", { event: slug });
                  window.open(
                    `https://api.whatsapp.com/send?text=${message} at ${
                      isEvent
                        ? eventCode
                          ? `https://open.anchors.in/${eventCode}`
                          : link
                        : link
                    }`
                  );
                }}
              >
                {" "}
                <BsWhatsapp color="white" size={20} />
              </div>
              {/* </WhatsappShareButton> */}
              <TelegramShareButton
                url={
                  isEvent
                    ? eventCode
                      ? `https://open.anchors.in/${eventCode}`
                      : link
                    : link
                }
                title={message}
                onClick={() => {
                  mixpanel.track("Event Shared On Telegram", {
                    event: slug,
                  });
                }}
              >
                <div className="service_share_link_user_second_frame_allshare_container">
                  {" "}
                  <BsTelegram color="white" size={20} />
                </div>
              </TelegramShareButton>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer limit={1} />
    </div>
  );
};

const EventsSectionData = ({ liveData = [{}], upcomingData = [{}] }) => {
  const navigate = useNavigate();

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
    <>
      {(liveData?.length !== 0 || upcomingData?.length !== 0) && (
        <div
          className="user_dashboard_event_data_section_wrapper"
          style={{ marginTop: "20px", background: "unset", padding: "unset" }}
        >
          {liveData?.length !== 0 && (
            <section className="live_events_wrapper_user_dashboard_page">
              {liveData?.map((e, index) => {
                return (
                  <div>
                    <span>&bull; Live</span>

                    <section>
                      <img
                        src={
                          e?.simg ??
                          "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d5/No_sign.svg/300px-No_sign.svg.png"
                        }
                        alt=""
                      />

                      <div>
                        <span
                          onClick={() => {
                            window.open(`https://www.anchors.in/e/${e?.slug}`);
                          }}
                        >
                          {e?.sname}
                        </span>
                        <button
                          onClick={() => {
                            window.open(e?.meetlink);
                            mixpanel.track("Event Join Now", {
                              slug: e?.slug,
                            });
                          }}
                        >
                          Join Now
                        </button>
                      </div>
                    </section>

                    <div></div>
                  </div>
                );
              })}
            </section>
          )}

          {upcomingData?.length !== 0 && (
            <section
              className="upcoming_events_wrapper_user_dashboard_page"
              style={{ width: "100%" }}
            >
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
                          e?.simg ??
                          "https://www.pngitem.com/pimgs/m/123-1236078_straight-line-transparent-straight-white-line-no-background.png"
                        }
                        alt=""
                      />
                      <span>{e?.sname}</span>

                      <div>
                        <span>
                          <BsPersonFill />
                          {`${e?.registrations} Registrations`}
                        </span>
                        <span>
                          <AiOutlineCalendar />
                          {getDate(e?.startDate)}
                        </span>
                        <span>
                          <AiOutlineClockCircle />
                          {`${convertTime(e?.time?.startTime)} - ${convertTime(
                            e?.time?.endTime
                          )}`}
                        </span>
                      </div>

                      <button
                        onClick={() => {
                          window.open(`https://www.anchors.in/e/${e?.slug}`);
                          mixpanel.track("Upcoming View Event", {
                            slug: e?.slug,
                          });
                        }}
                      >
                        View Event
                      </button>
                    </div>
                  );
                })}
              </section>
            </section>
          )}
        </div>
      )}
    </>
  );
};

function ServiceDetailPage(props) {
  const [openLoading, setOpenLoading] = useState(false);
  const [shareModalData, setShareModalData] = useState({
    open: false,
    sname: "",
    slug: "",
    link: "",
    simg: "",
    eventCode: null,
  });
  const {
    services,
    getallservices,
    deleteService,
    getalleventsLiveandUpcoming,
    latestEvents,
  } = useContext(ServiceContext);
  const [revArray, setrevArray] = useState([]);
  const [selected, setSelected] = useState("all");
  const [ServicesEarningData, setServicesEarningData] = useState({});
  const [openDeleteModal, setOpenDeleteModal] = useState(false)
  const [dummyData, setdummyData] = useState({
    ServiceDummy: false,
    EventDummy: false,
  });
  const navigate = useNavigate();
  const [openModel, setOpenModel] = useState(false); // change status modal -----------
  const [openModel2, setOpenModel2] = useState(false); // email modal -----------------------
  const [changeStatus, setChangeStatus] = useState(1); // current status of changed element --------------
  const [isHoveredTooltip, setIsHoveredTooltip] = useState(false);
  const [NotifyEmailSent, setNotifyEmailSent] = useState(false);
  const [currselected, setCurrSelected] = useState(null); // selected options of a which service / event --------------
  const [certificatePreviewData, setCertificatePreviewData] = useState({open:false})

  useEffect(() => {
    setOpenLoading(true);

    getalleventsLiveandUpcoming().then(() => {});

    getallservices().then(() => {
      setOpenLoading(false);
    });
    // eslint-disable-next-line
  }, [openDeleteModal === false]);

  // no need of reversing the array of serices it is inverted from backend
  useEffect(() => {
    setdummyData({
      ServiceDummy: services?.Servicedummy,
      EventDummy: services?.Eventdummy,
    });

    setServicesEarningData({ ...services?.ServicesEarning });
    let list = services?.res;
    if (selected === "pdf") {
      setrevArray(
        list?.filter((e) => {
          return e?.stype === 0;
        })
      );
    } else if (selected === "excel") {
      setrevArray(
        list?.filter((e) => {
          return e?.stype === 1;
        })
      );
    } else if (selected === "video") {
      setrevArray(
        list?.filter((e) => {
          return e?.stype === 2;
        })
      );
    } else if (selected === "events") {
      setrevArray(services?.events);
    } else {
      setrevArray(list);
    }
  }, [services, selected, currselected]);

  const [OpenOption, setOpenOption] = useState(0);

  const removeOptionPopup = () => {
    if (OpenOption !== 0) {
      revArray.map((elem, i) => {
        return (document.getElementById(
          `servicelist_options${i + 1}`
        ).style.display = "none");
      });
      document.getElementById(
        `servicelist_options${OpenOption}`
      ).style.display = "none";
      setOpenOption(0);
    }
  };

  return (
    <>
      {openDeleteModal && <DeleteModal onClose={()=>{setOpenDeleteModal(false)}} data={currselected}/>}

      {openLoading && <LoadTwo open={openLoading} />}

      {certificatePreviewData?.open && <CertitficatePreview {...certificatePreviewData} onClose={()=>{setCertificatePreviewData({...certificatePreviewData,open:false})}}/>}

      {/* Change Status Modal ----------------------------------------- */}

      {shareModalData?.open && (
        <PopupModal
          {...shareModalData}
          onClose={() => {
            setShareModalData({ ...shareModalData, open: false });
          }}
        />
      )}

      {openModel && (
        <ChangeStatus
          toClose={() => {
            setOpenModel(false);
          }}
          url={currselected?.copyURL}
          ChangeStatusTo={changeStatus}
        />
      )}

      {/* Send Email Modal ----------------------------------------------- */}
      <Email_Model2
        open={openModel2}
        progress={props.progress}
        onClose={() => {
          setOpenModel2(false);
        }}
        creatorID={currselected?.c_id}
        serviceID={currselected?._id}
        serviceName={currselected?.sname}
        serviceSlug={currselected?.slug}
        serviceCopyURL={currselected?.copyURL}
        serviceBanner={currselected?.simg}
      />

      <div className="servicelist-wrapper" onClick={() => removeOptionPopup()}>
        {/* MObile ui navbar ---------------- */}
        {window.screen.width < 600 && (
          <section className="navbar_ui_covering_section_mobile_active">
            <BsArrowLeftShort
              size={22}
              onClick={() => {
                navigate(-1);
              }}
            />
            My Content
          </section>
        )}

        {window.screen.width > 600 && (
          <>
            <section className="headers_section_paymentInfo ">
              <div>
                <h1 className="text_type01_payment_info">My Content</h1>
                <span className="servicelist_wrap_span">
                  Access and Manage your Content & Services
                </span>
              </div>
              <Button1
                text="Create New Service"
                rightIcon={<AiOutlinePlus size={24} />}
                onClick={() => {
                  navigate("/dashboard");
                  mixpanel.track("Create new Service my content");
                }}
              />
            </section>

            <div className="servicelist-categories">
              <div
                className={`servicelist-catItem ${
                  selected === "all" && "selectedlist"
                }`}
                onClick={() => setSelected("all")}
              >
                All (
                {services?.typeDetails?.Document +
                  services?.typeDetails?.Excel +
                  services?.typeDetails?.Video}
                )
              </div>
              <div
                className={`servicelist-catItem ${
                  selected === "pdf" && "selectedlist"
                }`}
                onClick={() => setSelected("pdf")}
              >
                PDF ({services?.typeDetails?.Document})
              </div>
              <div
                className={`servicelist-catItem ${
                  selected === "excel" && "selectedlist"
                }`}
                onClick={() => setSelected("excel")}
              >
                Excel Sheets ({services?.typeDetails?.Excel})
              </div>
              {/* <div
            className={`servicelist-catItem ${
              selected === "video" && "selectedlist"
            }`}
            onClick={() => setSelected("video")}
          >
            Videos ({services?.typeDetails?.Video})
          </div> */}
              <div
                className={`servicelist-catItem ${
                  selected === "events" && "selectedlist"
                }`}
                onClick={() => setSelected("events")}
              >
                Events ({services?.typeDetails?.Events})
              </div>
            </div>
            <div className="servicelist-linebreak"></div>

            {selected === "events" && (
              <EventsSectionData
                liveData={latestEvents?.LiveEvents}
                upcomingData={latestEvents?.UpcomingEvents}
              />
            )}
          </>
        )}

        <section
          className="content_cards_main_wrapper_servicelist"
          onMouseEnter={() => {
            (selected === "events"
              ? dummyData?.EventDummy
              : dummyData?.ServiceDummy) && setIsHoveredTooltip(true);
          }}
          onMouseLeave={() => {
            (selected === "events"
              ? dummyData?.EventDummy
              : dummyData?.ServiceDummy) && setIsHoveredTooltip(false);
          }}
        >
          {revArray?.map((elem, i) => {
            return (
              <ContentCard
                {...elem}
                i={i}
                dummyData={dummyData}
                // setShareModalData={setShareModalData}
                selected={selected}
                setOpenOption={setOpenOption}
                setCurrSelected={setCurrSelected}
                setChangeStatus={setChangeStatus}
                deleteService={deleteService}
                setOpenModel={setOpenModel}
                OpenOption={OpenOption}
                revArray={revArray}
                earning={ServicesEarningData[elem?._id] ?? 0}
                setOpenDeleteModal={setOpenDeleteModal}
                setCertificatePreviewData={setCertificatePreviewData}
              />
            );
          })}

          {(selected === "events"
            ? dummyData?.EventDummy
            : dummyData?.ServiceDummy) &&
            isHoveredTooltip && (
              <div className="opacity-layer-over-table">
                The current table contains sample data, and this is the way in
                which your data will be presented.
              </div>
            )}
        </section>

        <div className="servicelist-table">
          {(selected === "events"
            ? dummyData?.EventDummy
            : dummyData?.ServiceDummy) && (
            <div className="cta_dummy_data">
              {/* <span>
                The current table contains sample data, and this is the way in
                which your data will be presented.
              </span> */}
              <Button2
                text={
                  selected === "events"
                    ? "Create your First Event"
                    : "Create your First Service"
                }
                icon={<AiOutlinePlus size={18} width={30} />}
                onClick={() => {
                  selected === "events"
                    ? navigate("/dashboard/createevent")
                    : navigate("/dashboard");
                }}
              />
            </div>
          )}
        </div>
      </div>
      <ToastContainer />

      <SuperSEO title="Anchors - Services" />
    </>
  );
}

export default ServiceDetailPage;
