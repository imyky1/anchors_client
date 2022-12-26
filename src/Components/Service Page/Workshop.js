import React, { useContext, useEffect, useState } from "react";
import "./Workshop.css";
import { creatorContext } from "../../Context/CreatorState";
import { userContext } from "../../Context/UserState";
import ServiceContext from "../../Context/services/serviceContext";
import { useParams, useLocation, useNavigate, Link } from "react-router-dom";
import User_login from "../Login/Users/User_login";
import { ToastContainer, toast } from "react-toastify";
import { saveAs } from "file-saver";
import { Cross as Hamburger } from "hamburger-react";
// add to calender
import { atcb_action, atcb_init } from "add-to-calendar-button";
import "add-to-calendar-button/assets/css/atcb.css";

import mixpanel from "mixpanel-browser";
import Feedback_Modal from "../Modals/Feedback_Modal";
import { linkedinContext } from "../../Context/LinkedinState";
import { paymentContext } from "../../Context/PaymentState";
import Thanks from "../Modals/Thanks";
import { feedbackcontext } from "../../Context/FeedbackState";
import SocialProof from "../Modals/SocialProof";
import Request_Modal from "../Modals/Request_Modal";
import CalendarIcon from "react-calendar-icon";
import Footer from "../Footer/Footer";
import WorkshopThanks from "../Modals/WorkshopThanks";

function Service(props) {
  const { slug } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const context = useContext(ServiceContext);
  const [openModel, setOpenModel] = useState(false);
  const [openModelFB, setOpenModelFB] = useState(false);
  const [openModelRequest, setOpenModelRequest] = useState(false);
  const [OpenModelProof, setOpenModelProof] = useState(false);
  const [FBService, setFBService] = useState();
  const [proofType, setproofType] = useState();
  const [WorkshopDate, setWorkshopDate] = useState();
  const [UserDetails, setUserDetails] = useState();
  const [openModelDownload, setOpenModelDownload] = useState(false);
  const [paymentProcessing, setPaymentProcessing] = useState(false);
  const [FBserviceType, setFBserviceType] = useState(); // type of service in feedback

  const [seatReserved, setSeatReserved] = useState(false);

  const {
    workshopInfo,
    getworkshopinfo,
    workshops,
    getallworkshopsusingid,
    getworkshopusingid,
    getserviceusingid,
    getOneHourDownloads,
  } = context;
  const { basicCdata, getBasicCreatorInfo, basicCreatorInfo } =
    useContext(creatorContext);
  const {
    userPlaceOrder,
    checkSubscriber,
    getUserDetails,
    checkUserOrderPlaced,
  } = useContext(userContext);
  const { checkFBlatest } = useContext(feedbackcontext);

  const { createRazorpayClientSecret, razorpay_key, checkfororder } =
    useContext(paymentContext);

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
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const process = async () => {
      const id = await getworkshopinfo(slug);
      await getBasicCreatorInfo(id[0]);
      await getallworkshopsusingid(id[0]);
      atcb_init();
    };
    mixpanel.track("Page Visit", {
      user: UserDetails ? UserDetails : "",
      creator: basicCdata?.slug,
    });

    process();
    // eslint-disable-next-line
  }, []);

  // share button handlers
  const handlewhatsappshare = async () => {
    window.open(
      `https://api.whatsapp.com/send?text=Checkout this Important Workshop -- ${workshopInfo?.sname} at https://www.anchors.in/w/${workshopInfo?.slug}`,
      "MsgWindow",
      "width=100",
      "height=50"
    );

    mixpanel.track("Clicked Share on whatsapp workshop", {
      service: slug,
      user: UserDetails ? UserDetails : "",
      creator: basicCdata?.slug,
    });
  };
  const elem = document.getElementsByClassName("atcb-button");

  const handlelinkedInshare = async () => {
    window.open(
      `http://www.linkedin.com/shareArticle?mini=true&url=https://anchors.in/w/${workshopInfo?.slug}&title=${workshopInfo?.sname}&summary=${workshopInfo?.sdesc}&source=https://www.anchors.in/`,
      "MsgWindow",
      "width=100",
      "height=50"
    );
    mixpanel.track("Clicked Share on LinkedIn workshop", {
      service: slug,
      user: UserDetails ? UserDetails : "",
      creator: basicCdata?.slug,
    });
  };

  const [timing, setTiming] = useState("");

  useEffect(() => {
    const todayDate = new Date();
    const finalDate = new Date(workshopInfo.startDate);
    var startHour = workshopInfo?.time?.startTime;
    var endHour = workshopInfo?.time?.endTime;
    if (startHour !== undefined) {
      let temp = startHour.split("");
      startHour = temp[0] + temp[1];
      var startMinute = temp[3] + temp[4];
    }
    if (endHour !== undefined) {
      let temp = endHour.split("");
      endHour = temp[0] + temp[1];
      var endMinute = temp[3] + temp[4];
    }
    if (
      todayDate.getDate() - finalDate.getDate() === 0 &&
      todayDate.getMonth() - finalDate.getMonth() === 0
    ) {
      // same day
      var hourdiff = startHour - todayDate.getHours();
      var hourenddiff = endHour - todayDate.getHours();

      // case 1 - s.h - c.h - e.h
      if (hourdiff < 0 && hourenddiff > 0) {
        setTiming("Ongoing");
        return;
      }
      // case 2 - c.h - s.h - e.h
      if (hourdiff < 0 && hourenddiff < 0) {
        setTiming("Upcoming");
        return;
      }
      // case 3 s.h - e.h - c.r
      if (hourdiff > 0 && hourenddiff > 0) {
        setTiming("Finished");
        return;
      }
      // case 4 - s.h == c.h - e.h (check start minute)
      if (hourdiff === 0 && hourenddiff > 0) {
        let mindiff = startMinute - todayDate.getMinutes();
        if (mindiff > 0) {
          setTiming("Upcoming");
        } else {
          setTiming("OnGoing");
        }
      }
      // case 5 - s.h  - e.h == c.h
      if (hourdiff < 0 && hourenddiff === 0) {
        let mindiff = endMinute - todayDate.getMinutes();
        if (mindiff > 0) {
          setTiming("OnGoing");
        } else {
          setTiming("Finished");
        }
      }
      // case 6 - s.h==c.h==e.h
      if (hourdiff === 0 && hourenddiff === 0) {
        let Startmindiff = startMinute - todayDate.getMinutes();
        let Endmindiff = endMinute - todayDate.getMinutes();
        // case 1 ongoing
        if (Startmindiff < 0 && Endmindiff > 0) {
          setTiming("Ongoing");
          return;
        }
        // case 2 Past
        if (Startmindiff < 0 && Endmindiff < 0) {
          setTiming("Finished");
        }
        // case 3 upcoming
        if (Startmindiff > 0 && Endmindiff > 0) {
          setTiming("Upcoming");
        }
      }
    } else if (finalDate - todayDate > 0) {
      // not the same day
      setTiming("Upcoming");
    } else {
      setTiming("Finished");
    }
  }, [workshopInfo]);

  // generates the workshop date accordingly
  useEffect(() => {
    const options = {
      year: "numeric",
      month: "short",
      day: "numeric",
      timeZone: "Asia/Kolkata",
    };

    var s = new Date(workshopInfo?.startDate).toLocaleString("en-US", options);
    setWorkshopDate(s);

    checkUserOrderPlaced(
      workshopInfo?._id,
      localStorage.getItem("isUser") === "true" ? "user" : "creator"
    ).then((e) => {
      setSeatReserved(e);
    });
  }, [workshopInfo]);

  useEffect(() => {
    atcb_init();
  }, [paymentProcessing, seatReserved]);
  // responsible for feedback popup
  useEffect(() => {
    if (
      localStorage.getItem("jwtToken") &&
      localStorage.getItem("isUser") === "true"
    ) {
      getUserDetails().then((e) => {
        if (e.success) {
          setUserDetails(e?.user?.email);
        }
      });
      checkUserOrderPlaced(workshopInfo?._id).then((e) => {
        setSeatReserved(e);
      });

      checkFBlatest().then((fb) => {
        if (fb.success) {
          if (fb.res.serviceID) {
            getserviceusingid(fb.res.serviceID).then((service) => {
              setFBService(service);
              setFBserviceType("download");
              setOpenModelFB(true);
              //alert(`Send Feedback for "${service.sname}"`)
            });
          } else {
            getworkshopusingid(fb.res.workshopID).then((service) => {
              setFBService(service);
              setFBserviceType("workshop");
              setOpenModelFB(true);
              //alert(`Send Feedback for "${service.sname}"`)
            });
          }
        }
      });
    } // check for seat reservability on user login
    checkUserOrderPlaced(
      workshopInfo?._id,
      localStorage.getItem("isUser") === "true" ? "user" : "creator"
    ).then((e) => {
      setSeatReserved(e);
    });
    // add to calender on login of user
    atcb_init();
  }, [localStorage.getItem("jwtToken")]);

  //Scroll to top automatically
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Social proof popup ---------------------------------------

  useEffect(() => {
    setInterval(() => {
      setproofType((Math.floor(Math.random() * 3) + 0).toString());
      setOpenModelProof(true);
    }, 8500);
  }, []);

  const orderPlacing = () => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";

    script.onerror = () => {
      alert("Razorpay SDK Failed to load. Are you Online?");
    };

    script.onclose = script.onload = async () => {
      try {
        setPaymentProcessing(true);
        const order = await createRazorpayClientSecret(workshopInfo?.ssp);
        const key = await razorpay_key();
        const options = {
          key: key,
          amount: order.amount,
          currency: order.currency,
          name: "Anchors.in",
          description: `Payment for Attending - ${workshopInfo?.sname}`,
          order_id: order.id,
          handler: async function (response) {
            const {
              razorpay_payment_id,
              razorpay_order_id,
              razorpay_signature,
            } = await response;
            const success = await userPlaceOrder(
              order.amount / 100,
              1,
              workshopInfo?._id,
              basicCreatorInfo.creatorID,
              1,
              1,
              localStorage.getItem("isUser") === "true" ? "user" : "creator",
              razorpay_payment_id,
              razorpay_order_id,
              razorpay_signature
            );
            if (success) {
              setOpenModelDownload(true);
              toast.success("Successfully registered for the workshop", {
                position: "top-center",
                autoClose: 2500,
              });
              mixpanel.track("Reserved Seat for Paid Workshop", {
                service: slug,
                user: UserDetails ? UserDetails : "",
                amount: workshopInfo?.ssp,
                creator: basicCdata?.slug,
              });
              setSeatReserved(true);
              setPaymentProcessing(false);
            } else {
              toast.error(
                "Seat not Reserved Due to some error, If your payment has been deducted then it would be refunded in 3-4 working days",
                {
                  position: "top-center",
                  autoClose: 4000,
                }
              );
              setPaymentProcessing(false);
            }
          },
          modal: {
            ondismiss: function () {
              toast.info(
                "It is a paid workshop, for reserving a seat, you would have to pay the one time payment",
                {
                  position: "top-center",
                  autoClose: 5000,
                }
              );
              setTimeout(() => {
                window.location.reload();
              }, 5000);
            },
          },
          notify: {
            sms: true,
            email: true,
          },
          theme: {
            color: "#040102",
          },
        };

        const paymentObject = new window.Razorpay(options);
        paymentObject.open();
      } catch (err) {
        toast.error("Some error occured try again in some time", {
          position: "top-center",
          autoClose: 3000,
        });
      }
    };

    document.body.appendChild(script);
  };

  const download_service = async () => {
    if (localStorage.getItem("jwtToken")) {
      if (workshopInfo?.isPaid) {
        orderPlacing().then(() => {});
      } else {
        setPaymentProcessing(true);
        const success = await userPlaceOrder(
          workshopInfo.ssp,
          1,
          workshopInfo._id,
          basicCreatorInfo.creatorID,
          0,
          1,
          localStorage.getItem("isUser") === "true" ? "user" : "creator"
        );
        if (success) {
          setOpenModelDownload(true);
          toast.success(
            "Successfully registered for the workshop, you'll soon be notified on your email about its details",
            {
              position: "top-center",
              autoClose: 3500,
            }
          );
          mixpanel.track("Reserved seat for free workshop", {
            service: slug,
            user: UserDetails ? UserDetails : "",
            creator: basicCdata?.slug,
          });
          setSeatReserved(true);
        } else {
          toast.error(
            "Seat not reserved Due to some error, please try again some time",
            {
              position: "top-center",
              autoClose: 2500,
            }
          );
        }
        setPaymentProcessing(false);
      }
    } else {
      mixpanel.track("Clicked Reserve seat in workshop Without Login", {
        service: slug,
        user: UserDetails ? UserDetails : "",
        creator: basicCdata?.slug,
      });
      return setOpenModel(true);
    }
  };

  const userlogout = () => {
    window.location.pathname = "/logout";
  };

  const handleLogoClick = () => {
    mixpanel.track("Creator Page from LOGO", {
      creator: basicCdata?.slug,
      user: UserDetails ? UserDetails : "",
    });
    navigate(`/c/${basicCdata?.slug}`);
  };

  const handleServiceClick = (slug) => {
    mixpanel.track("Extra workshops Clicked after login", {
      creator: basicCdata?.slug,
      user: UserDetails ? UserDetails : "",
      workshopClicked: slug,
    });
  };

  if (workshopInfo?.status === 0 || basicCdata?.status === 0)
    return alert("The resource doesn't exist");

  if (!slug) return alert("The resource doesn't exist");

  return (
    <>
      <div className="service_section">
        <Feedback_Modal
          open={openModelFB}
          onClose={() => {
            setOpenModelFB(false);
          }}
          name={FBService?.sname}
          slug={FBService?.slug}
          progress={props.progress}
          serviceType
          id={FBService?._id}
          UserDetails={UserDetails ? UserDetails : ""}
        />
        <Request_Modal
          open={openModelRequest}
          onClose={() => {
            setOpenModelRequest(false);
          }}
          slug={workshopInfo?.slug}
          progress={props.progress}
          id={basicCdata?._id}
          cname={basicCreatorInfo?.name}
          UserDetails={UserDetails ? UserDetails : ""}
        />
        <WorkshopThanks
          open={openModelDownload}
          onClose={() => {
            setOpenModelDownload(false);
          }}
          copyURL={workshopInfo?.copyURL}
          slug={workshopInfo?.slug}
          name={workshopInfo?.sname}
          stype={1}
          control={setOpenModelRequest}
          c_id={basicCdata?._id}
        />
        <User_login
          open={openModel}
          onClose={() => {
            setOpenModel(false);
          }}
        />
        {/* {localStorage.getItem("isUser") !== "" && (
          <SocialProof
            open={OpenModelProof}
            onClose={() => {
              setOpenModelProof(false);
            }}
            sid={workshopInfo?._id}
            cid={workshopInfo?.c_id}
            type={proofType}
            slug={slug}
          />
        )} */}
        <div className="profile_header service_header">
          <div className="logo" onClick={handleLogoClick}>
            <img src={require("../logo.png")} alt="Logo" />
            <span>anchors</span>
          </div>
          {localStorage.getItem("isUser") === "" ? (
            ""
          ) : (
            <div className="user_login">
              <span>
                {!localStorage.getItem("jwtToken") ? (
                  <span
                    onClick={() => {
                      mixpanel.track("Clicked Login button on service page", {
                        service: slug,
                        creator: basicCdata?.slug,
                      });
                      setOpenModel(true);
                    }}
                    className="login_button_user"
                  >
                    Login
                  </span>
                ) : (
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
                )}
              </span>
            </div>
          )}
        </div>

        <div className="main_workshop_page_box">
          <div className="service_section_content">
            <img
              src={workshopInfo?.simg}
              alt="service_image"
              className="workshop_section_image"
            />
            <div className="workshop_infobar_wrapper">
              <div className="workshopdate_infobar">
                <div className="workshopdate_timing">{timing}</div>
                <div className="workshopdate_categ">workshop</div>
              </div>
              <div className="workshopdate_calender">
                <CalendarIcon date={new Date(workshopInfo?.startDate)} />
              </div>
            </div>
            <div className="workshop_desc_content_wrapper">
              <div className="service_section_details">
                <h1 style={{ marginBottom: "15px" }}>{workshopInfo?.sname}</h1>
                {/* Bottom reserve seat button ---------------------------------------- */}
                <div className="bottom_workshop_section">
                  <div className="bottom_workshop_section_firstspan">
                    <span>
                      {WorkshopDate} at {workshopInfo?.time?.startTime} -{" "}
                      {workshopInfo?.time?.endTime}
                    </span>
                    <span>
                      <i
                        class="fa-solid fa-location-dot fa-xl"
                        style={{ color: "red" }}
                      ></i>
                      &nbsp; Online{" "}
                    </span>
                  </div>
                </div>
                {seatReserved ? (
                  <div className="share_btns_wrapper">
                    <h3>Share with your Friends</h3>
                    <div class="btn__container">
                      <a onClick={handlewhatsappshare} class="btn_share">
                        <i class="fab fa-whatsapp"></i>
                        <span>WhatsApp</span>
                      </a>
                      <a onClick={handlelinkedInshare} class="btn-f">
                        <i class="fab fa-linkedin"></i>
                        <span>LinkedIn</span>
                      </a>
                    </div>
                  </div>
                ) : (
                  ""
                )}
                <p className="workshop_sdesc">{workshopInfo?.sdesc}</p>
                {workshopInfo?.tags?.length !== 0 && workshopInfo.tags && (
                  <div className="tags_section">
                    {workshopInfo?.tags?.slice(0, 3)?.map((e, i) => {
                      return <span key={i}>{e}</span>;
                    })}
                  </div>
                )}
                <h2 className="service_h2">
                  <i className="fa-regular fa-file-lines"></i>&nbsp; Event
                  Information
                </h2>
                <div className="workshop_sdesc">
                  {document.querySelectorAll(".workshop_sdesc")[1]
                    ? (document.querySelectorAll(
                        ".workshop_sdesc"
                      )[1].innerHTML = workshopInfo?.ldesc)
                    : ""}
                </div>
              </div>
              <div className="workshop-box-register">
                <h3>Special Offer</h3>
                {workshopInfo?.isPaid ? (
                  <>
                    <p>
                      ₹{workshopInfo?.ssp} {"    "}&nbsp;
                    </p>
                    <p
                      style={{
                        display: "inline-block",
                        textDecoration: "line-through",
                        fontWeight: "300",
                      }}
                    >
                      ₹{workshopInfo?.smrp}
                    </p>
                  </>
                ) : (
                  <span className="free_workshop_book">Free</span>
                )}
                {seatReserved ? (
                  <div className="already_registered-box">
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 18 18"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      xmlnsXlink="http://www.w3.org/1999/xlink"
                    >
                      <rect width="18" height="18" fill="url(#pattern0)" />
                      <defs>
                        <pattern
                          id="pattern0"
                          patternContentUnits="objectBoundingBox"
                          width="1"
                          height="1"
                        >
                          <use
                            xlinkHref="#image0_1382_279"
                            transform="scale(0.00195312)"
                          />
                        </pattern>
                        <image
                          id="image0_1382_279"
                          width="512"
                          height="512"
                          xlinkHref="data:image/png;base64,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"
                        />
                      </defs>
                    </svg>
                    <h3>Registered</h3>
                  </div>
                ) : timing === "Finished" ? (
                  <span className="finished_workshop">
                    No more registration allowed for this event
                  </span>
                ) : (
                  <button
                    className="download_service workshop_reserve_button"
                    onClick={download_service}
                    style={
                      paymentProcessing
                        ? {
                            backgroundColor: "grey",
                            border: "2px solid grey",
                          }
                        : null
                    }
                  >
                    {paymentProcessing ? <>Processing</> : "Reserve your Seat"}
                  </button>
                )}

                {seatReserved ? (
                  <div className="atcb">
                    {"{"}
                    "name":"{`${workshopInfo?.sname}`}", "description":"
                    {`${workshopInfo?.sdesc}`}", "startDate":"
                    {`${workshopInfo?.startDate?.slice(0, 10)}`}", "endDate":"
                    {`${workshopInfo?.startDate?.slice(0, 10)}`}", "startTime":"
                    {`${workshopInfo?.time?.startTime}`}", "endTime":"
                    {`${workshopInfo?.time?.endTime}`}", "location":"
                    {`${workshopInfo?.meetlink}`}
                    ", "options":["Google","Apple"], "timeZone":"Asia/Kolkata",
                    "iCalFileName":"Reminder-Event"
                    {"}"}
                  </div>
                ) : (
                  ""
                )}
              </div>

              {/* Checks iff the seat is already reserved for the person */}
              {/* <button
                  className="download_workshop"
                  disabled={seatReserved}
                  onClick={download_service}
                  style={
                    paymentProcessing || seatReserved
                      ? {
                          backgroundColor: "black",
                          border: "2px solid black",
                        }
                      : {}
                  }
                >
                  {paymentProcessing ? (
                    <>Processing...</>
                  ) : seatReserved ? (
                    <>Seat Reserved</>
                  ) : (
                    <>Reserve Your Seat</>
                  )}
                </button>
              </div> */}
            </div>
            {workshops.res?.filter((e) => e.status === 1).length - 1 !== 0 &&
            localStorage.getItem("jwtToken") ? (
              <div className="more_services">
                <h2 className="service_h2">
                  <i className="fa-solid fa-circle-info"></i>&nbsp; More
                  Workshops from the Creator
                </h2>
                <div className="display_services_list workshop_list_display">
                  {workshops.res
                    ?.filter((e) => e._id !== workshopInfo?._id)
                    ?.sort((a, b) => {
                      return b?.smrp - a?.smrp;
                    })
                    .map((e) => {
                      if (e.status === 1) {
                        return (
                          <a
                            href={`/w/${e.slug}`}
                            key={e._id}
                            style={{ textDecoration: "none" }}
                          >
                            <div
                              className="item_displayed service_list_display_item"
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
                            </div>
                          </a>
                        );
                      } else {
                        return "";
                      }
                    })}
                </div>
              </div>
            ) : (
              ""
            )}{" "}
          </div>

          <div className="workshop_creators">
            <h2 className="service_h2">About Speaker</h2>
            <div>
              <img
                src={basicCdata?.photo}
                alt="creator"
                className="workshop_page_profile_pic"
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

              <div className="bottom_workshop_section_bar service_bar_bottom">
                <div className="mobile-workshop-wrapper">
                  {workshopInfo?.isPaid ? (
                    <div className="mobile_price_desc-workshop">
                      <div>
                        <span className="main_ssp">
                          {seatReserved ? "" : `₹${workshopInfo?.ssp}`}{" "}
                        </span>
                      </div>
                      <div>
                        <span>
                          {" "}
                          {seatReserved ? "" : "₹"}
                          <span style={{ textDecoration: "line-through" }}>
                            {seatReserved ? "" : `${workshopInfo?.smrp}`}
                          </span>
                        </span>
                      </div>
                    </div>
                  ) : (
                    <span className="free_label">
                      {seatReserved ? "" : "Free"}
                    </span>
                  )}
                  {seatReserved ? (
                    <div className="already_registered-box">
                      <svg
                        width="18"
                        height="18"
                        viewBox="0 0 18 18"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        xmlnsXlink="http://www.w3.org/1999/xlink"
                      >
                        <rect width="18" height="18" fill="url(#pattern0)" />
                        <defs>
                          <pattern
                            id="pattern0"
                            patternContentUnits="objectBoundingBox"
                            width="1"
                            height="1"
                          >
                            <use
                              xlinkHref="#image0_1382_279"
                              transform="scale(0.00195312)"
                            />
                          </pattern>
                          <image
                            id="image0_1382_279"
                            width="512"
                            height="512"
                            xlinkHref="data:image/png;base64,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"
                          />
                        </defs>
                      </svg>
                      <h3>Registered</h3>
                    </div>
                  ) : (
                    ""
                  )}
                </div>

                {timing === "Finished" && !seatReserved ? (
                  <span className="finished_workshop_mobile">
                    No more registration allowed for this event
                  </span>
                ) : seatReserved ? (
                  <div className="atcb">
                    {"{"}
                    "name":"{`${workshopInfo?.sname}`}", "description":"
                    {`${workshopInfo?.sdesc}`}", "startDate":"
                    {`${workshopInfo?.startDate?.slice(0, 10)}`}", "endDate":"
                    {`${workshopInfo?.startDate?.slice(0, 10)}`}", "startTime":"
                    {`${workshopInfo?.time?.startTime}`}", "endTime":"
                    {`${workshopInfo?.time?.endTime}`}", "location":"
                    {`${workshopInfo?.meetlink}`}
                    ", "options":["Google","Apple"], "timeZone":"Asia/Kolkata",
                    "iCalFileName":"Reminder-Event"
                    {"}"}
                  </div>
                ) : (
                  <button
                    className="download_service bottom_fixed_btn"
                    onClick={download_service}
                    disabled={seatReserved}
                    style={
                      paymentProcessing
                        ? {
                            backgroundColor: "grey",
                            border: "2px solid grey",
                          }
                        : seatReserved
                        ? {
                            backgroundColor: "black",
                            border: "2px solid black",
                          }
                        : {}
                    }
                  >
                    {paymentProcessing ? (
                      <>Processing</>
                    ) : (
                      <>Reserve Your Seat</>
                    )}
                  </button>
                )}
              </div>

              <div className="workshop_profile_data">
                <span className="c_workshop_name">{basicCdata?.name}</span>
                <span className="c_workshop_tagline">
                  {basicCreatorInfo?.tagLine}
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
                <Link
                  to={`/c/${basicCdata?.slug}`}
                  style={{ textDecoration: "none" }}
                >
                  <button
                    className="workshop_page_creator_button"
                    onClick={() => {
                      mixpanel.track("Creator Page from Card", {
                        email: "",
                        user: UserDetails ? UserDetails : "",
                        creatorID: basicCdata?.slug,
                      });
                    }}
                  >
                    View all Offering
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
      <ToastContainer />
    </>
  );
}

export default Service;
