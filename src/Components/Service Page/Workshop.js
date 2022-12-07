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
import mixpanel from "mixpanel-browser";
import Feedback_Modal from "../Modals/Feedback_Modal";
import { linkedinContext } from "../../Context/LinkedinState";
import { paymentContext } from "../../Context/PaymentState";
import Thanks from "../Modals/Thanks";
import { feedbackcontext } from "../../Context/FeedbackState";
import SocialProof from "../Modals/SocialProof";
import Request_Modal from "../Modals/Request_Modal";
import CalendarIcon from "react-calendar-icon";
import Footer from "../Footer/Footer"

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

  const [seatReserved, setSeatReserved] = useState(false);

  const {
    workshopInfo,
    getworkshopinfo,
    workshops,
    getallworkshopsusingid,
    getworkshopusingid,
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
    const process = async () => {
      const id = await getworkshopinfo(slug);
      await getBasicCreatorInfo(id[0]);
      await getallworkshopsusingid(id[0]);
    };
    mixpanel.track("Page Visit", {
      user: UserDetails ? UserDetails : "",
      creator: basicCdata?.slug,
    });

    process();
    // eslint-disable-next-line
  }, []);

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
        setTiming("Past");
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
          setTiming("Past");
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
          setTiming("Past");
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
      setTiming("Past");
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

    checkUserOrderPlaced(workshopInfo?._id).then((e) => {
      setSeatReserved(e);
    });
  }, [workshopInfo]);

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
      checkFBlatest().then((fb) => {
        if (fb.success) {
          getworkshopusingid(fb.res.serviceID).then((service) => {
            setFBService(service);
            setOpenModelFB(true);
            //alert(`Send Feedback for "${service.sname}"`)
          });
        }
      });
    }
  }, [localStorage.getItem("jwtToken")]);

  // Social proof popup ---------------------------------------

  useEffect(() => {
    setInterval(() => {
      setproofType((Math.floor(Math.random() * 3) + 0).toString());
      setOpenModelProof(true);
    }, 8500);
  }, []);

  //const dox1 = document.getElementById("unsubscribe");
  //const dox2 = document.getElementById("subscribe");

  //setTimeout(() => {
  //  if (
  //    localStorage.getItem("isUser") === "true" &&
  //    localStorage.getItem("jwtToken")
  //  ) {
  //    checkSubscriber(basicCreatorInfo.creatorID).then((data) => {
  //      if (data && dox2 && dox1) {
  //        dox1.style.display = "none";
  //        dox2.style.display = "inline-block";
  //      }
  //    });
  //  }
  //}, 100);

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
    if (
      localStorage.getItem("isUser") === "true" &&
      localStorage.getItem("jwtToken")
    ) {
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
          1
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
    } else if (
      localStorage.getItem("isUser") === "" &&
      localStorage.getItem("jwtToken")
    ) {
      toast.info(
        "You cannot reserve seat as a creator, Please login as an user",
        {
          position: "top-center",
          autoClose: 3000,
        }
      );
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
    mixpanel.track("Extra Services Clicked after login", {
      creator: basicCdata?.slug,
      user: UserDetails ? UserDetails : "",
      serviceClicked: slug,
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
        <Thanks
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
        <div className="profile_header ">
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
                  <span className="dark_user_login_name user_login_name ">
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
                <div className="workshopdate_categ">Workshop</div>
              </div>
              <div className="workshopdate_calender">
                <CalendarIcon date={new Date(workshopInfo?.startDate)} />
              </div>
            </div>
            <div className="workshop_desc_content_wrapper">
              <div className="service_section_details">
                <h1 style={{ marginBottom: "15px" }}>{workshopInfo?.sname}</h1>

                {/* Mobile workshop timing display for screen width < 500------------------ */}

                {/* {window.screen.width < 550 && (
                  <div className="mobile_workshop_time">
                    <span>
                      {WorkshopDate} at {workshopInfo?.time?.startTime} -{" "}
                      {workshopInfo?.time?.endTime}
                    </span>
                    <span>
                      {" "}
                      <i
                        class="fa-solid fa-location-dot fa-xl"
                        style={{ color: "red" }}
                      ></i>{" "}
                      Online
                    </span>
                  </div>
                )} */}

                {/* Bottom reserve seat button ---------------------------------------- */}
                <div className="bottom_workshop_section">
                  <>
                    <span>
                      {WorkshopDate} at {workshopInfo?.time?.startTime} -{" "}
                      {workshopInfo?.time?.endTime}
                    </span>
                    <span>
                      {" "}
                      <i
                        class="fa-solid fa-location-dot fa-xl"
                        style={{ color: "red" }}
                      ></i>{" "}
                      &nbsp; Online{" "}
                    </span>
                  </>
                </div>
                {workshopInfo?.tags?.length !== 0 && workshopInfo.tags && (
                  <div className="workshop_tags_section">
                    {workshopInfo?.tags?.slice(0, 3)?.map((e, i) => {
                      return <span key={i}>{e}</span>;
                    })}
                  </div>
                )}
                <p className="workshop_sdesc">{workshopInfo?.sdesc}</p>
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
              <div className="book_workshop_box">
                {" "}
                <span>
                  <>
                    {workshopInfo?.isPaid ? (
                      <div className="book_workshop_box_content">
                        <h3>Special Offer&nbsp;</h3>
                        <span className="book_workshop_box_price">
                          ₹{workshopInfo?.ssp}{" "}
                        </span>
                        <span>
                          (-
                          {(
                            (workshopInfo?.smrp - workshopInfo?.ssp) /
                            workshopInfo?.smrp
                          ).toFixed(2) * 100}
                          %)
                        </span>

                        <div>
                          <span className="book_workshop_box_maxprice">
                            {" "}
                            ₹
                            <span style={{ textDecoration: "line-through" }}>
                              {workshopInfo?.smrp}{" "}
                            </span>
                          </span>
                        </div>
                      </div>
                    ) : (
                      <span className="free_label_workshop">Free</span>
                    )}
                  </>
                </span>
                {/* Checks iff the seat is already reserved for the person */}
                <button
                  className="download_workshop"
                  disabled={seatReserved}
                  onClick={download_service}
                  style={
                    paymentProcessing || seatReserved
                      ? { backgroundColor: "black", border: "2px solid black" }
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
              </div>
            </div>
            {workshops.res?.filter((e) => e.status === 1).length - 1 !== 0 &&
            localStorage.getItem("jwtToken") ? (
              <div className="more_services">
                <h2 className="service_h2">
                  <i className="fa-solid fa-circle-info"></i>&nbsp; More
                  Services from the Creator
                </h2>
                <div className="display_services_list service_list_display">
                  {workshops.res
                    ?.filter((e) => e._id !== workshopInfo?._id)
                    ?.sort((a, b) => {
                      return b?.smrp - a?.smrp;
                    })
                    .map((e) => {
                      if (e.status === 1) {
                        return (
                          <a
                            href={`/s/${e.slug}`}
                            key={e._id}
                            style={{ textDecoration: "none" }}
                          >
                            <div
                              className="item_displayed service_list_display_item"
                              onClick={() => handleServiceClick(e.slug)}
                            >
                              <img src={e.simg} alt="..." />
                              <h2>{e.sname}</h2>
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
      <Footer/>
      <ToastContainer />
    </>
  );
}

export default Service;
