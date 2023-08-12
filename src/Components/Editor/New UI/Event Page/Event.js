import React, { useContext, useEffect, useRef, useState } from "react";
import { Footer3 } from "../../../Footer/Footer2";
import "./Event.css";
import { RiStarSFill } from "react-icons/ri";
import ServiceContext from "../../../../Context/services/serviceContext";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { feedbackcontext } from "../../../../Context/FeedbackState";
import { Navbar2 } from "../../../Layouts/Navbar User/Navbar";
import { userContext } from "../../../../Context/UserState";
import mixpanel from "mixpanel-browser";
import { paymentContext } from "../../../../Context/PaymentState";
import { ToastContainer, toast } from "react-toastify";
import { LoadThree } from "../../../Modals/Loading";
import { LazyLoadImage } from "react-lazy-load-image-component";
import PNGIMG from "../../../../Utils/Images/default_user.png";
import { MdKeyboardArrowDown } from "react-icons/md";
import { RiCheckDoubleLine } from "react-icons/ri";
import { host } from "../../../../config/config";
import { useCookies } from "react-cookie";

const ReviewCard = ({ name, rating, photo, desc }) => {
  return (
    <div className="review_card_event_page">
      <section>
        <LazyLoadImage
          src={photo}
          onError={({ currentTarget }) => {
            currentTarget.onerror = null; // prevents looping
            currentTarget.src = PNGIMG;
          }}
          alt="userimag"
        />

        <div>
          <h1>{name}</h1>
          <p className="review_stars_events">
            {Array(rating)
              .fill("a")
              ?.map((e, i) => {
                return <RiStarSFill size={16} />;
              })}
          </p>
        </div>
      </section>

      <p>{desc}</p>
    </div>
  );
};

const OTPVerificationModel = ({ onClose }) => {
  const [cookies, setCookie] = useCookies();
  const [formData, setFormData] = useState({
    number: "",
    otp: "",
  });

  const [sentOTP, setSentOTP] = useState(false);

  const { updateUserInfo } = useContext(userContext);

  const verfiyOTP = async () => {
    if (formData?.otp?.length !== 6) {
      toast.info("Enter a proper code", {
        position: "top-center",
        autoClose: 2000,
      });
    } else {
      let code = cookies?.ccoondfe;
      if (!code) {
        toast.error("OTP was valid for 2 minute, Please retry again", {
          position: "top-center",
          autoClose: 2000,
        });
      } else {
        if (parseInt(formData?.otp) === parseInt(parseInt(code) / 562002)) {
          // Save the number in user info ----------
          let result = await updateUserInfo({
            phoneNumber: formData?.number,
            verifiedNumber: true,
          });
          if (result) {
            toast.success("Verification was successfull", {
              position: "top-center",
              autoClose: 2000,
            });
            onClose();
          } else {
            toast.error("Some error occured in verification", {
              position: "top-center",
              autoClose: 2000,
            });
          }
        } else {
          toast.error("Invalid OTP!!!. Try again!!!", {
            position: "top-center",
            autoClose: 2000,
          });
        }
      }
    }
  };

  const sendOTP = async () => {
    if (formData?.number?.length === 10) {
      const response = await fetch(
        `${host}/api/email/sendMsg?message=Mobile Number&number=${formData?.number}&subject=Anchors`,
        {
          method: "GET",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            "Access-Control-Allow-Credentials": true,
          },
        }
      );
      const json = await response.json();
      if (json.MessageID) {
        await updateUserInfo({
          phoneNumber: formData?.number,
          verifiedNumber: false,
        });
        toast.success("OTP sent successfully", {
          position: "top-center",
          autoClose: 2000,
        });

        setSentOTP(true);
        let otpcode = parseInt(json.code - 145626) * 562002;
        setCookie("ccoondfe", otpcode, { maxAge: 120 }); // valid for one minute
      }
    } else {
      toast.error("Enter a proper mobile number", {
        position: "top-center",
        autoClose: 2000,
      });
    }
  };

  return (
    <div className="outside_wrapper_earning">
      <div
        className="otp_main_container_earning"
        style={{ background: "#121212" }}
      >
        <h2>Please verify your WhatsApp number to continue</h2>

        <section>
          <input
            type="number"
            name="number"
            placeholder="Enter Mobile Number"
            value={formData?.number}
            onChange={(e) => {
              setSentOTP(false);
              setFormData({ ...formData, [e.target.name]: e.target.value });
            }}
          />
          <input
            type="number"
            name="otp"
            placeholder="OTP"
            value={formData?.otp}
            onChange={(e) => {
              setFormData({ ...formData, [e.target.name]: e.target.value });
            }}
          />
        </section>

        {sentOTP ? (
          <button
            style={{
              minWidth: "unset",
              background: "transparent",
              border: "1px solid #FFF",
            }}
            onClick={verfiyOTP}
          >
            Verify OTP
          </button>
        ) : (
          <button
            style={{
              minWidth: "unset",
              background: "transparent",
              border: "1px solid #FFF",
            }}
            onClick={sendOTP}
          >
            Send OTP
          </button>
        )}
      </div>
    </div>
  );
};

function Event() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const ref1 = useRef();

  // Show creator or not ---------------------------------
  const [showCreator, setShowCreator] = useState(true);

  // Contexts data ===============================
  const { geteventinfo, eventInfo } = useContext(ServiceContext);

  // Handling the display of the speakers -------------------
  // const [isSpeakerVisible, setIsSpeakerVisible] = useState(true);
  // // Intersection Observer callback
  // const handleIntersection = (entries) => {
  //   const [entry] = entries;
  //   setIsSpeakerVisible(entry.isIntersecting);
  // };

  // useEffect(() => {
  //   const options = {
  //     root: null,
  //     rootMargin: "0px",
  //     threshold: 0.6, // Adjust this threshold to control visibility
  //   };

  //   const observer = new IntersectionObserver(handleIntersection, options);

  //   if (ref1.current) {
  //     observer.observe(ref1.current);
  //   }

  //   return () => {
  //     if (ref1.current) {
  //       observer.unobserve(ref1.current);
  //     }
  //   };
  // }, []);

  const { getRatingCreator, getallfeedback, feedbacks } =
    useContext(feedbackcontext);

  const {
    createRazorpayClientSecret,
    razorpay_key,
    checkfororder,
    informLarkBot,
  } = useContext(paymentContext);

  const {
    userPlaceOrderForEvent,
    verifyPaymentsForEventsinBackend,
    getUserDetails,
  } = useContext(userContext);

  // States ---------------
  const [creatorRatingData, setCreatorRatingData] = useState();
  const [openModel, setOpenModel] = useState(false); // User Modal open
  const [UserDetails, setUserDetails] = useState(); // stores the user data
  const [loader, setLoader] = useState(false); // loader states
  const [alreadyOrderPlaced, setAlreadyOrderPlaced] = useState(false); // already user order placed or not
  const [paymentProcessing, setPaymentProcessing] = useState(false); // if payment is processing
  const [eventFinished, setEventFinished] = useState(false); // if event is finished

  const [openOtpModal, setOpenOtpModal] = useState(false); // controll the otp modmal

  // Use effects  ---------------
  useEffect(() => {
    // Loading mixpanel ------
    mixpanel.track("Page Visit");

    setLoader(true);

    // setting the referral code in the localstorage -----------------
    const params = new URLSearchParams(window.location.search);

    if (params.get("referredFrom")?.length > 2) {
      var obj = {
        url: window.location.pathname.split("/")[2],
        code: params.get("referredFrom"),
      };
      var objString = JSON.stringify(obj);
      localStorage.setItem("Cref", objString); // Cref is referall code
    }

    // getiing the event info
    geteventinfo(slug).then((id) => {
      if (!id[0]) {
        // handles any irregular slug
        navigate("/");
        return null;
      }

      setLoader(false);
    });

    // restricts the movement of a user
    if (!localStorage.getItem("isUser") === "true") {
      localStorage.removeItem("url");
    } else {
      localStorage.setItem("url", location.pathname);
    }

    // eslint-disable-next-line
  }, []);

  // Scroll to top ----------
  useEffect(() => {
    // after user login takes the user to the reserve area
    if (localStorage.getItem("session")) {
      localStorage.removeItem("session");
      getUserDetails(localStorage.getItem("isUser") === "").then((e) => {
        if (!e?.user?.verifiedNumber) {
          setOpenOtpModal(true);
        }
      });
      handleNavigation();
    } else {
      window.scrollTo(0, 0);
    }
  }, []);

  // Getting some data from the eventInfo --------
  useEffect(() => {
    setLoader(true);
    if (document.querySelectorAll(".description-event-page")) {
      document.querySelectorAll(".description-event-page")[0].innerHTML =
        eventInfo?.event?.ldesc;
    }

    getRatingCreator(eventInfo?.event?.c_id?._id).then((e) => {
      // getting the creator's rating
      setCreatorRatingData(e);
      setLoader(false);
    });

    getallfeedback(eventInfo?.event?.c_id?._id);

    // cheking if we need to show creator -----------
    if (eventInfo?.event?.speakerDetails?.length !== 0) {
      for (
        let index = 0;
        index < eventInfo?.event?.speakerDetails?.length;
        index++
      ) {
        const element = eventInfo?.event?.speakerDetails[index];
        if (element?.isCreator) {
          setShowCreator(false);
        }
      }
    }

    // If event is finshed ------------------
    let date1 = new Date(); // current date
    let date2 = new Date(eventInfo?.event?.startDate);
    date1.setHours(0);
    date1.setMinutes(0);
    date1.setSeconds(0);
    if (date2 < date1) {
      setEventFinished(true);
    }
    const endTime = eventInfo?.event?.time?.endTime?.split(":");

    date1 = new Date();

    if (date2 === date1) {
      if (
        parseInt(date1.getHours() * 60 + date1.getMinutes()) >
        parseInt(endTime && endTime[0]) * 60 + parseInt(endTime && endTime[1])
      ) {
        setEventFinished(true);
      }
    }
  }, [eventInfo]);

  // getting user data,feedbacks and many function to run on user login ----------------
  useEffect(() => {
    if (localStorage.getItem("jwtToken")) {
      setLoader(true);
      // checks if order is already placed or not
      eventInfo?.event &&
        checkfororder(
          eventInfo?.event?._id,
          localStorage.getItem("isUser") === "true" ? "user" : "creator",
          "event"
        ).then((e) => {
          setAlreadyOrderPlaced(e);
        });

      // get user details for mixpanel
      getUserDetails(localStorage.getItem("isUser") === "").then((e) => {
        if (e.success) {
          setUserDetails(e?.user);
        }
        setLoader(false);
      });
    }

    // eslint-disable-next-line
  }, [localStorage.getItem("jwtToken"), eventInfo?.event, openOtpModal]);

  // Functions used ---------------

  const handleNavigation = () => {
    if (eventFinished || alreadyOrderPlaced) {
      const section = document.getElementById("eventDetails");
      section.scrollIntoView({ behavior: "smooth" });
    } else {
      const section = document.getElementById("reserveSeat");
      section.scrollIntoView({ behavior: "smooth" });
    }
  };

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

  // Order placing in razorpay --------

  const orderPlacingThroughRazorpay = async () => {
    setPaymentProcessing(true);
    setLoader(true);
    const order = await createRazorpayClientSecret(eventInfo?.event?.ssp);
    const key = await razorpay_key();

    var options = {
      key, // Enter the Key ID generated from the Dashboard
      amount: order.amount, // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
      currency: "INR",
      name: "anchors", //your business name
      description: `Payment for Buying - ${eventInfo?.event?.sname}`,
      image: require("../../../../Utils/Images/logo.png"),
      order_id: order?.id, //This is a sample Order ID. Pass the `id` obtained in the response of Step 1
      //callback_url: `${host}/api/payment/paymentVerification`,
      handler: async function (res) {
        var storedObjString = localStorage.getItem("Cref");
        var reffObj = JSON.parse(storedObjString);

        const result = await verifyPaymentsForEventsinBackend(
          res.razorpay_payment_id,
          res.razorpay_order_id,
          res.razorpay_signature,
          order.amount / 100,
          1,
          eventInfo?.event?._id,
          reffObj?.url === slug ? reffObj?.code : null, // referralCode
          eventInfo?.event?.c_id?._id,
          1,
          localStorage.getItem("isUser") === "true" ? "user" : "creator"
        );

        // controlling the edges casses now ----------------
        if (result?.success && result?.orderPlaced && result?.paymentRecieved) {
          mixpanel.track("Paid Order placed Successfully", {
            user: UserDetails?.email,
            slug: eventInfo?.event?.slug,
          });
          // sending user to the success page ------------
          setAlreadyOrderPlaced(true);
          setPaymentProcessing(false);
          setLoader(false);
          navigate(`/success/${slug}?placedOrder=success`);
        } else if (
          result?.success &&
          !result?.orderPlaced &&
          result?.paymentRecieved
        ) {
          // sending the payment fail email at info@anchors.in
          informLarkBot(
            true,
            order.amount / 100,
            eventInfo?.event?.sname,
            res.razorpay_payment_id,
            UserDetails?.email,
            "Payment recieved but error in registering for event response"
          );
          setLoader(false);

          mixpanel.track("Problem!!!, Order not placed but money deducted", {
            user: UserDetails?.email,
            slug: eventInfo?.event?.slug,
          });

          toast.info(
            "Something wrong happened, If money got deducted then please reach us at info@anchors.in",
            {
              position: "top-center",
              autoClose: 5000,
            }
          );
          setPaymentProcessing(false);
        } else {
          mixpanel.track("Paid Order not placed", {
            user: UserDetails?.email,
            slug: eventInfo?.event?.slug,
          });
          setLoader(false);
          setPaymentProcessing(false);
          toast.info(
            "Your order was not placed. Please try again!!. If money got deducted then please reach us at info@anchors.in",
            {
              position: "top-center",
              autoClose: 5000,
            }
          );
        }
      },

      prefill: {
        name: UserDetails?.name, //your customer's name
        email: UserDetails?.email,
      },
      notes: {
        address: "https://www.anchors.in",
      },
      modal: {
        ondismiss: function () {
          setPaymentProcessing(false);
          setLoader(false);
          toast.info(
            "It is a paid event, for using it you have to pay the one time payment",
            {
              position: "top-center",
              autoClose: 5000,
            }
          );
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
    var razor = new window.Razorpay(options);
    razor.on("payment.failed", (e) => {
      mixpanel.track("Problem!!!, Paid Order failed", {
        user: UserDetails?.email,
        slug: eventInfo?.event?.slug,
      });
      setPaymentProcessing(false);
      setLoader(false);

      // Inform lark bot about the default
      informLarkBot(
        true,
        order.amount / 100,
        eventInfo?.event?.sname,
        e?.error?.metadata?.payment_id,
        UserDetails?.email,
        "Payment failed from Razorpay's side"
      );

      toast.info(
        "Payment Failed, if amount got deducted inform us at info@anchors.in",
        {
          autoClose: 5000,
        }
      );
    });
    razor.open();
  };

  const handleEventRegistration = async (e) => {
    setLoader(true);
    e?.preventDefault();
    if (localStorage.getItem("jwtToken")) {
      if (alreadyOrderPlaced) {
        setLoader(false);
        navigate(`/success/${slug}`);
        return true;
      } else {
        if (UserDetails?.verifiedNumber) {
          if (eventInfo?.event?.isPaid) {
            checkfororder(
              eventInfo?.event?._id,
              localStorage.getItem("isUser") === "true" ? "user" : "creator",
              "event"
            ).then((e) => {
              if (e) {
                setAlreadyOrderPlaced(true);
                navigate(`/success/${slug}`);
              } else {
                orderPlacingThroughRazorpay();
              }
              setLoader(false);
            });
          } else {
            setPaymentProcessing(true);
            var storedObjString = localStorage.getItem("Cref");
            var reffObj = JSON.parse(storedObjString);
            // Free Order processing -----------------
            const success = await userPlaceOrderForEvent(
              eventInfo?.event?.ssp,
              1,
              eventInfo?.event?._id,
              eventInfo?.event?.c_id?._id,
              0,
              localStorage.getItem("isUser") === "true" ? "user" : "creator",
              reffObj?.url === slug ? reffObj?.code : null // referralCode
            );

            localStorage.removeItem("Cref");

            if (success) {
              // sending user to the success page ------------
              setAlreadyOrderPlaced(true);
              setPaymentProcessing(false);
              setLoader(false);
              navigate(`/success/${slug}?placedOrder=success`);
            } else {
              // inform lark bot --------
              setPaymentProcessing(false);
              setLoader(false);
              informLarkBot(
                false,
                0,
                eventInfo?.event?.sname,
                null,
                UserDetails?.email,
                "Unpaid Order Not placed"
              );

              toast.error(
                "Order not Placed Due to some error, Please try again!!!",
                {
                  position: "top-center",
                  autoClose: 3000,
                }
              );
            }
          }
        } else {
          // First verify the whatsapp ----------
          setOpenOtpModal(true);
          setPaymentProcessing(false);
          setLoader(false);
        }
      }
    } else {
      setLoader(false);
      localStorage.setItem("session", "reserveSeat");
      return setOpenModel(true);
    }
  };

  // handling the status 0 of services ------------------
  if (
    (eventInfo?.event?.status === 0 || eventInfo?.event?.c_id?.status === 0) &&
    eventInfo?.event?.c_id?.eventStatus === 0
  ) {
    navigate("/");
    return null;
  }

  if (!slug) {
    navigate("/");
    return null;
  }

  return (
    <>
      {openOtpModal && (
        <OTPVerificationModel
          onClose={() => {
            setOpenOtpModal(false);
          }}
        />
      )}

      {loader && <LoadThree open={loader} />}

      <div className="event_page_outside_wrapper">
        <section className="main_header_component_event_page">
          <Navbar2
            // slug={basicCdata?.slug}
            open={openModel}
            close={() => {
              setOpenModel(false);
            }}
          />

          {/* Main detail of the component */}

          <div className="main_title_event_box">
            {eventFinished && (
              <p className="event_complete_tag">
                <RiCheckDoubleLine /> This event was a success!
              </p>
            )}

            <h1>{eventInfo?.event?.sname}</h1>
            {/* {showCreator ? ( */}
            <span>by {eventInfo?.creator?.name}</span>
            {/* // ) : (
            //   <p>
            //     by
            //     {eventInfo?.event?.speakerDetails?.map((e, index) => {
            //       return (
            //         <span key={index}>
            //           {" "}
            //           {`${e?.name}${
            //             index !==
            //               eventInfo?.event?.speakerDetails?.length - 2 &&
            //             index !== eventInfo?.event?.speakerDetails?.length - 1
            //               ? ", "
            //               : ""
            //           } ${
            //             index === eventInfo?.event?.speakerDetails?.length - 2
            //               ? "&"
            //               : ""
            //           }`}
            //         </span>
            //       );
            //     })}
            //   </p>
            // )} */}

            <button onClick={handleNavigation}>
              {eventFinished || alreadyOrderPlaced
                ? "View Event Details"
                : "Register for Event"}
            </button>
          </div>

          <a href="#eventDetails">
            <MdKeyboardArrowDown className="arrow_button_sample_page" />
          </a>
        </section>

        {/* Description section */}
        {window.screen.width > 600 ? (
          <section className="event_desc_screen">
            <div className="left_side_scrollable" id="eventDetails">
              <section
                className={`scrollable_section_event
                }`}
                ref={ref1}
              >
                <h2>Mode</h2>
                <span>
                  {eventInfo?.event?.stype === 0 ? "Offline" : "Online"}
                </span>
              </section>
              <section className={`scrollable_section_event`}>
                <h2>Date</h2>
                <span>{getDate(eventInfo?.event?.startDate)}</span>
              </section>
              <section className={`scrollable_section_event`}>
                <h2>Time</h2>
                <span>
                  {convertTime(eventInfo?.event?.time?.startTime)} To{" "}
                  {convertTime(eventInfo?.event?.time?.endTime)}
                </span>
              </section>
              {!eventFinished && (
                <section className={`scrollable_section_event`}>
                  <h2>
                    {eventInfo?.event?.maxCapacity !== "Unlimited"
                      ? "Spots available"
                      : "Spots are available"}
                  </h2>
                  <span>
                    {eventInfo?.event?.maxCapacity !== "Unlimited"
                      ? parseInt(
                          eventInfo?.event?.maxCapacity -
                            eventInfo?.event?.registrations
                        )
                      : ""}
                  </span>
                </section>
              )}
              <section className={`scrollable_section_event`}>
                <h2>About</h2>
                <p className="description-event-page"></p>
              </section>
              {!eventFinished && (
                <section
                  className={`scrollable_section_event`}
                  id="reserveSeat"
                >
                  <h2>
                    {alreadyOrderPlaced
                      ? "Your spot is reserved"
                      : "Reserve your spot"}
                  </h2>
                  {!alreadyOrderPlaced && (
                    <span>
                      {eventInfo?.event?.isPaid ? (
                        <>
                          ₹{eventInfo?.event?.ssp}{" "}
                          <span>{eventInfo?.event?.smrp}</span>
                        </>
                      ) : (
                        "For Free"
                      )}
                    </span>
                  )}
                  <button onClick={handleEventRegistration}>
                    {alreadyOrderPlaced
                      ? "Explore your benefits"
                      : paymentProcessing
                      ? "Processing..."
                      : "Register for Event"}
                  </button>
                </section>
              )}
            </div>

            <div className="right_stable_side">
              <img
                src={require("../../../../Utils/Images/mobile-screen.png")}
                alt=""
              />
              {eventInfo?.event?.speakerDetails &&
                eventInfo?.event?.speakerDetails?.length !== 0 && (
                  <div className="right_stable_side_top">
                    {eventInfo?.event?.speakerDetails?.map((speaker, index) => (
                      <div className="right_stable_side_image" key={index}>
                        <img
                          src={
                            speaker?.profile ??
                            (speaker?.isCreator
                              ? eventInfo?.creator?.profile
                              : PNGIMG)
                          }
                          alt=""
                          onError={({ currentTarget }) => {
                            currentTarget.onerror = null; // prevents looping
                            currentTarget.src = PNGIMG;
                          }}
                        />
                        <div className="right_stable_side_image_desc">
                          <span>{speaker?.name}</span>
                          <p>{speaker?.designation}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

              {(!eventInfo?.event?.speakerDetails ||
                eventInfo?.event?.speakerDetails?.length === 0) && (
                <section className="right_side_creator_profile_event_page">
                  <img
                    src={eventInfo?.creator?.profile}
                    alt=""
                    onError={({ currentTarget }) => {
                      currentTarget.onerror = null; // prevents looping
                      currentTarget.src = PNGIMG;
                    }}
                  />
                  <span>{eventInfo?.creator?.name}</span>
                  <p>{eventInfo?.creator?.tagLine}</p>
                  <div>
                    <RiStarSFill size={16} /> {creatorRatingData}/5
                  </div>
                </section>
              )}
            </div>
          </section>
        ) : (
          <section className="event_desc_screen">
            <div className="left_side_scrollable">
              <section className="scrollable_section_event" id="eventDetails">
                <div>
                  <section>
                    <h2>Mode</h2>
                    <span>
                      {eventInfo?.event?.stype === 0 ? "Offline" : "Online"}
                    </span>
                  </section>
                  <section>
                    <h2>Date</h2>
                    <span>{getDate(eventInfo?.event?.startDate)}</span>
                  </section>
                  <section>
                    <h2>Time</h2>
                    <span>
                      {convertTime(eventInfo?.event?.time?.startTime)} To{" "}
                      {convertTime(eventInfo?.event?.time?.endTime)}
                    </span>
                  </section>
                  {!eventFinished && (
                    <section>
                      <h2>
                        {eventInfo?.event?.maxCapacity !== "Unlimited"
                          ? "Spots available"
                          : "Spots are available"}
                      </h2>
                      <span>
                        {eventInfo?.event?.maxCapacity !== "Unlimited"
                          ? parseInt(
                              eventInfo?.event?.maxCapacity -
                                eventInfo?.event?.registrations
                            )
                          : ""}
                      </span>
                    </section>
                  )}
                </div>
              </section>
              {eventInfo?.event?.speakerDetails &&
                eventInfo?.event?.speakerDetails?.length !== 0 && (
                  <section className="scrollable_section_event">
                    <section
                      className="right_stable_side_top"
                      style={{ width: "62%", gap: "30px" }}
                    >
                      {eventInfo?.event?.speakerDetails?.map(
                        (speaker, index) => (
                          <div className="right_stable_side_image" key={index}>
                            <img
                              src={
                                speaker?.profile ??
                                (speaker?.isCreator
                                  ? eventInfo?.creator?.profile
                                  : PNGIMG)
                              }
                              alt=""
                              onError={({ currentTarget }) => {
                                currentTarget.onerror = null; // prevents looping
                                currentTarget.src = PNGIMG;
                              }}
                            />
                            <div className="right_stable_side_image_desc">
                              <span>{speaker?.name}</span>
                              <p>{speaker?.designation}</p>
                            </div>
                          </div>
                        )
                      )}
                    </section>
                  </section>
                )}
              {(!eventInfo?.event?.speakerDetails ||
                eventInfo?.event?.speakerDetails?.length === 0) && (
                <section className="scrollable_section_event">
                  <section className="right_side_creator_profile_event_page">
                    <img
                      src={eventInfo?.creator?.profile}
                      alt=""
                      onError={({ currentTarget }) => {
                        currentTarget.onerror = null; // prevents looping
                        currentTarget.src = PNGIMG;
                      }}
                    />
                    <span>{eventInfo?.creator?.name}</span>
                    <p>{eventInfo?.creator?.tagLine}</p>
                    <div>
                      <RiStarSFill size={16} /> {creatorRatingData}/5
                    </div>
                  </section>
                </section>
              )}
              \
              {!eventFinished && (
                <section className="scrollable_section_event" id="reserveSeat">
                  <h2>Reserve your spot</h2>
                  <span>
                    {eventInfo?.event?.isPaid ? (
                      <>
                        ₹{eventInfo?.event?.ssp}{" "}
                        <span>{eventInfo?.event?.smrp}</span>
                      </>
                    ) : (
                      "For Free"
                    )}
                  </span>
                  <button onClick={handleEventRegistration}>
                    {alreadyOrderPlaced
                      ? "Explore your benefits"
                      : paymentProcessing
                      ? "Processing..."
                      : "Register for Event"}
                  </button>
                </section>
              )}
            </div>

            <div className="right_stable_side">
              <img
                src={require("../../../../Utils/Images/mobile-screen.png")}
                alt=""
              />
            </div>
          </section>
        )}

        {/* Description for mobile */}

        {window.screen.width < 600 && (
          <section className="desc_mobile_view_event">
            <h2>About</h2>
            <p className="description-event-page"></p>
          </section>
        )}

        {/* Review Section */}

        <section className="end_frame_event_page">
          {feedbacks?.filter((e, i) => {
            return e?.status === 1;
          })?.length !== 0 && (
            <section className="user_reviews_event">
              <h2>Reviews</h2>

              <div>
                {feedbacks
                  ?.filter((e, i) => {
                    return e?.status === 1;
                  })
                  ?.map((e, i) => {
                    return <ReviewCard {...e} key={i} />;
                  })}
              </div>
            </section>
          )}

          <section className="extra_event_details_cta">
            <h2>
              {!eventFinished
                ? "Don't miss out on this valuable experience, grab your seat now. Hurry, limited seats available!"
                : "Stay tuned for exciting events on your dashboard's Upcoming Events section!"}
            </h2>
            <button
              onClick={() => {
                if (eventFinished) {
                  if (localStorage.getItem("jwtToken")) {
                    navigate(`/`);
                  } else {
                    setOpenModel(true);
                  }
                } else {
                  if (!alreadyOrderPlaced) {
                    handleNavigation();
                    handleEventRegistration();
                  } else {
                    navigate(`/success/${slug}`);
                  }
                }
              }}
            >
              {eventFinished
                ? "Go To Dashboard"
                : alreadyOrderPlaced
                ? "Explore your benefits"
                : "Register for Event"}
            </button>
          </section>
        </section>

        <Footer3 />
      </div>

      <ToastContainer theme="dark" />
    </>
  );
}

export default Event;
