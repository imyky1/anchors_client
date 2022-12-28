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

  // ongoing event meet link redirect

  const redirect_ongoingevent = () => {
    window.open(workshopInfo?.meetlink);
  };

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
      console.log(hourdiff);
      console.log(hourenddiff);
      // case 1 - s.h - c.h - e.h
      if (hourdiff < 0 && hourenddiff > 0) {
        setTiming("Ongoing");
        return;
      }
      // case 2 - c.h - s.h - e.h
      if (hourdiff < 0 && hourenddiff < 0) {
        setTiming("Finished");
        return;
      }
      // case 3 s.h - e.h - c.r
      if (hourdiff > 0 && hourenddiff > 0) {
        setTiming("Upcoming");
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
                  timing === "Ongoing" ? (
                    <button
                      className="download_service workshop_reserve_button"
                      onClick={redirect_ongoingevent}
                    >
                      Join Event
                    </button>
                  ) : timing === "Finished" ? (
                    <span className="finished_workshop">
                      No more registration allowed for this event
                    </span>
                  ) : (
                    <div className="already_registered-box">
                      <i class="fa-sharp fa-solid fa-circle-check"></i>

                      <h3>Registered</h3>
                    </div>
                  )
                ) : timing === "Finished" ? (
                  <span className="finished_workshop">
                    No more registration allowed for this event
                  </span>
                ) : timing === "Ongoing" && !seatReserved ? (
                  "No more registration allowed for this event"
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

                {seatReserved && timing === "Upcoming" ? (
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
                    "inline":true, "trigger":"click",
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
                        <span className="main_ssp">₹{workshopInfo?.ssp}</span>
                      </div>
                      <div>
                        <span>
                          <span style={{ textDecoration: "line-through" }}>
                            ₹{workshopInfo?.smrp}
                          </span>
                        </span>
                      </div>
                    </div>
                  ) : (
                    <span className="free_label">
                      {seatReserved ? "Free" : "Free"}
                    </span>
                  )}
                  {seatReserved && timing === "Upcoming" ? (
                    <div className="already_registered-box">
                      <i class="fa-sharp fa-solid fa-circle-check"></i>
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
                ) : seatReserved && timing === "Upcoming" ? (
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
                    "inline":true, "trigger":"click",
                    "iCalFileName":"Reminder-Event"
                    {"}"}
                  </div>
                ) : timing === "Ongoing" && seatReserved ? (
                  <button
                    className="download_service bottom_fixed_btn"
                    onClick={redirect_ongoingevent}
                  >
                    Join Event
                  </button>
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
