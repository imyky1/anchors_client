import React, { useContext, useEffect, useRef, useState } from "react";
import "./Event2.css";
import "../../../Earning Potential/Models.css";
import { RiStarSFill, RiTelegramLine } from "react-icons/ri";
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
import { MdKeyboardArrowDown, MdLocalPhone } from "react-icons/md";
import { host } from "../../../../config/config";
import { useCookies } from "react-cookie";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";
import { BsArrowDown, BsQuote } from "react-icons/bs";
import { FaXTwitter } from "react-icons/fa6";
import {
  IoImageOutline,
  IoLocationOutline,
  IoLogoInstagram,
} from "react-icons/io5";
import { MdEventSeat } from "react-icons/md";
import { CiCalendarDate, CiFacebook, CiLinkedin, CiMail } from "react-icons/ci";
import { GoClock } from "react-icons/go";
import { IoLanguageOutline } from "react-icons/io5";
import {
  IoIosArrowDown,
  IoIosArrowRoundForward,
  IoIosLink,
  IoMdStar,
} from "react-icons/io";
import { Footer3 } from "../../../Footer/Footer2";
import { Swiper, SwiperSlide } from "swiper/react";
// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
// import required modules
import { Navigation, Pagination } from "swiper/modules";

const SpeakerCard = ({
  name,
  profile,
  optionalProfile,
  designation,
  sno,
  rating,
  isCreator,
  linkedinLink,
  otherLink,
}) => {
  let snoObj = { 1: "1st", 2: "2nd", 3: "#rd" };

  return (
    <div className="speaker_card_event_page_wrapper">
      <h3>{snoObj[sno]} Speaker</h3>

      <section>
        <img
          src={isCreator ? optionalProfile : profile ?? optionalProfile}
          alt=""
          onError={({ currentTarget }) => {
            currentTarget.onerror = null; // prevents looping
            currentTarget.src = PNGIMG;
          }}
        />

        <span>{name}</span>
      </section>

      <p>{designation}</p>

      {rating && (
        <span>
          <IoMdStar size={16} color="#FFD600" /> {rating}/5
        </span>
      )}

      <div>
        {linkedinLink && linkedinLink.length !== 0 && (
          <CiLinkedin
            onClick={() => {
              window.open(linkedinLink);
              mixpanel.track("Clicked speaker linkedin link", {
                speakername: name,
              });
            }}
          />
        )}
        {otherLink && otherLink.length !== 0 && (
          <IoIosLink
            onClick={() => {
              window.open(otherLink);
              mixpanel.track("Clicked speaker other link", {
                speakername: name,
              });
            }}
          />
        )}
      </div>
    </div>
  );
};

const ReviewCard2 = ({ name, rating, photo, desc }) => {
  return (
    <div className="review_card_event_page">
      <div>{desc}</div>

      <section>
        <img src={photo} alt="" />

        <div>
          <span>{rating}/5</span>
          <p>{name}</p>
        </div>
      </section>
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
    if (formData?.number?.length > 4) {
      const response = await fetch(
        `${host}/api/email/sendMsg?message=Mobile Number&number=${formData?.number}&subject=Anchors&countryCode=true`,
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
          <PhoneInput
            defaultCountry="IN"
            value={formData?.number}
            placeholder="Enter Mobile Number"
            onChange={(e) => {
              setSentOTP(false);
              setFormData({ ...formData, number: e });
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

function Event2() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const params = new URLSearchParams(location.search);

  // states --------
  const [openModel, setOpenModel] = useState(false); // User Modal open
  const [creatorRatingData, setCreatorRatingData] = useState();
  const [loader, setLoader] = useState(false); // loader states
  const [isVisibleFloater, setIsVisibleFloater] = useState(false); // for floater visibility
  const [UserDetails, setUserDetails] = useState(); // stores the user data
  const [openOtpModal, setOpenOtpModal] = useState(false); // controll the otp modmal
  const [alreadyOrderPlaced, setAlreadyOrderPlaced] = useState(false); // already user order placed or not
  const [paymentProcessing, setPaymentProcessing] = useState(false); // if payment is processing
  const [eventFinished, setEventFinished] = useState(false); // if event is finished

  const targetRef = useRef(null);
  const aboutEventPage = useRef();
  const benefitRef = useRef();

  // Contexts --------------------
  const { geteventinfo, eventInfo } = useContext(ServiceContext);

  const { getRatingCreator, getallfeedback, feedbacks } =
    useContext(feedbackcontext);

  const {
    checkfororder,
    informLarkBot,
    createUserOrderEaseBuzz,
    createUserOrderStripe,
    checkPaymentOrderStripe,
    easeBuzzApiKey,
  } = useContext(paymentContext);

  const {
    userPlaceOrderForEvent,
    verifyPaymentsForEventsinBackend,
    getUserDetails,
  } = useContext(userContext);

  // effects
  useEffect(() => {
    // Loading mixpanel ------
    mixpanel.track("Page Visit");
    setLoader(true);

    // setting the referral code in the localstorage -----------------
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
  }, [location]);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;

      // Adjust this value based on the client height where you want to show the component
      const triggerHeight = targetRef?.current?.clientHeight + 200;

      // Check if the scroll position has crossed the trigger height
      setIsVisibleFloater(scrollY > triggerHeight);
    };

    // Attach the event listener when the component mounts
    window.addEventListener("scroll", handleScroll);

    // Detach the event listener when the component unmounts
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []); // Run the effect only once when the component mounts

  // Scroll to top ----------
  useEffect(() => {
    // after user login takes the user to the reserve area
    if (localStorage.getItem("session") && localStorage.getItem("jwtToken")) {
      localStorage.removeItem("session");
      getUserDetails(localStorage.getItem("isUser") === "").then((e) => {
        // if (!e?.user?.verifiedNumber) {
        //   setOpenOtpModal(true);
        // }
      });
      handleNavigation();
    } else {
      window.scrollTo(0, 0);
    }
  }, []);

  // handle stripe payment redirection ---------------------
  useEffect(() => {
    if (params.get("txnId") && eventInfo?.event?.sname) {
      setLoader(true);
      checkPaymentOrderStripe(
        localStorage.getItem("isUser") === "true" ? "user" : "creator",
        params.get("txnId")
      ).then((e) => {
        if (e?.success) {
          handlePaymentResponse(e?.paymentData, e?.orderId, "stripe");
        } else {
          setPaymentProcessing(false);
          setLoader(false);
          toast.info(
            "Payment Failed, if amount got deducted inform us at info@anchors.in",
            {
              autoClose: 5000,
            }
          );
        }
      });
    }
  }, [eventInfo]);

  // Getting some data from the eventInfo --------
  useEffect(() => {
    setLoader(true);
    if (aboutEventPage.current) {
      aboutEventPage.current.innerHTML = eventInfo?.event?.ldesc;
    }

    if (benefitRef.current) {
      benefitRef.current.innerHTML = eventInfo?.event?.benefits;
    }

    if (eventInfo?.event?.c_id?._id) {
      getRatingCreator(eventInfo?.event?.c_id?._id).then((e) => {
        // getting the creator's rating
        setCreatorRatingData(e);
        setLoader(false);
      });

      getallfeedback(eventInfo?.event?.c_id?._id);
    }

    // If event is finshed ------------------
    let date1 = new Date(); // current date
    let date2 = new Date(eventInfo?.event?.startDate);
    date1.setHours(0);
    date1.setMinutes(0);
    date1.setSeconds(0);
    date1.setMilliseconds(0);

    if (date2.getTime() < date1.getTime()) {
      setEventFinished(true);
    }

    if (date2.getTime() === date1.getTime()) {
      const endTime = eventInfo?.event?.time?.startTime?.split(":");
      date1 = new Date();

      if (
        parseInt(date1.getHours() * 60 + date1.getMinutes()) >
        parseInt(endTime && endTime[0]) * 60 +
          parseInt(endTime && endTime[1]) -
          5 // 5 mins before event registration closes
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
          setAlreadyOrderPlaced(e?.success);
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

  // Functions used --------------- --------------------------------------

  const handleNavigation = (showEventDetails = false) => {
    if (eventFinished || alreadyOrderPlaced || showEventDetails) {
      const section = document.getElementById("eventDetails");
      section.scrollIntoView({ behavior: "smooth" });
    } else {
      const section = document.getElementById("eventDetails");
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

    return newDate[1] + " " + newDate[2] + " " + newDate[3];
  };

  // function to save the banner in the backend -------------------
  let generateNewUserEventBanner = async () => {
    mixpanel.track(`Genrating event Banner`);

    let dataToUse = {
      userName: UserDetails?.name,
      userProfile: UserDetails?.photo,
      eventName: eventInfo?.event?.sname,
      creatorName: eventInfo?.creator?.name,
      creatorProfile: eventInfo?.creator?.profile,
      speakers: eventInfo?.event?.speakerDetails,
      date: getDate(eventInfo?.event?.startDate),
      time: `${convertTime(eventInfo?.event?.time?.startTime)} - 
    ${convertTime(eventInfo?.event?.time?.endTime)}`,
    };

    const response = await fetch(host + "/api/seo/createEventbanner", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "Access-Control-Allow-Credentials": true,
      },
      body: JSON.stringify({
        data: dataToUse,
        multipleSpeakers:
          eventInfo?.event?.speakerDetails &&
          eventInfo?.event?.speakerDetails?.length !== 0,
      }),
    });

    const json = await response.json();

    // Create a Uint8Array from the buffer data
    const uint8Array = new Uint8Array(json?.buffer?.data);

    // Create a Blob from the Uint8Array
    const blob = new Blob([uint8Array]);

    // Create a File from the Blob
    const file = new File([blob], "image.jpg", { type: "image/jpeg" }); // Replace 'image.jpg' and 'image/jpeg' with your desired filename and content type

    let formData = new FormData();
    formData.append("file", file);

    const response2 = await fetch(
      host + "/api/file/upload/s3/event/userBanner",
      {
        method: "POST",
        body: formData,
      }
    );
    const json2 = await response2.json();
    return json2;
  };

  // Handling the payment responses
  const handlePaymentResponse = async (
    response,
    orderId,
    from = "easebuzz"
  ) => {
    setPaymentProcessing(true);
    setLoader(false);

    mixpanel.track(`Payment response - ${response.status}`, {
      user: UserDetails?.email,
      slug: eventInfo?.event?.slug,
    });

    try {
      // for easebuzz ------------
      if (from === "easebuzz") {
        switch (response.status) {
          // 1. user cancelled the payment mode
          case "userCancelled" || "dropped":
            setPaymentProcessing(false);
            setLoader(false);
            toast.info(
              "It is a paid event, for using it you have to pay the one time payment",
              {
                position: "top-center",
                autoClose: 5000,
              }
            );
            break;

          //2. payment dropping by user --- dropped the payment by the user
          case "dropped":
            setPaymentProcessing(false);
            setLoader(false);
            toast.info(
              "It is a paid event, for using it you have to pay the one time payment",
              {
                position: "top-center",
                autoClose: 5000,
              }
            );
            break;

          //  2. payment failed due to any reasone
          case "failure":
            mixpanel.track("Problem!!!, Paid Order failed", {
              user: UserDetails?.email,
              slug: eventInfo?.event?.slug,
            });

            setPaymentProcessing(false);
            setLoader(false);

            // Inform lark bot about the failure
            informLarkBot(
              true,
              response.amount,
              eventInfo?.event?.sname,
              response?.easepayid,
              UserDetails?.email,
              `Status - ${response.status} Payment failed from EaseBuzz's side`
            );

            toast.info(
              "Payment Failed, if amount got deducted inform us at info@anchors.in",
              {
                autoClose: 5000,
              }
            );

            break;

          //  3. Payment pending due to any reason
          case "pending":
            // Inform lark bot about the failure
            setPaymentProcessing(false);
            setLoader(false);

            informLarkBot(
              true,
              response.amount,
              eventInfo?.event?.sname,
              response?.easepayid,
              UserDetails?.email,
              `Status - ${response.status} Payment pending from user's side`
            );

            toast.info(
              "Payment is still pending, complete the payment to proceed,for issues inform us at info@anchors.in",
              {
                autoClose: 5000,
              }
            );
            break;

          // 4. success payment
          case "success":
            let generateBanner = await generateNewUserEventBanner();

            const success = await userPlaceOrderForEvent(
              eventInfo?.event?.ssp,
              1,
              eventInfo?.event?._id,
              eventInfo?.event?.c_id?._id,
              1,
              localStorage.getItem("isUser") === "true" ? "user" : "creator",
              "",
              response,
              orderId,
              generateBanner?.result?.Location
            );

            localStorage.removeItem("Cref");

            if (success) {
              mixpanel.track("Paid Order placed Successfully", {
                user: UserDetails?.email,
                slug: eventInfo?.event?.slug,
              });
              setAlreadyOrderPlaced(true);
              navigate(`/success/${slug}?placedOrder=success`);
            } else {
              // sending the payment fail email at info@anchors.in
              informLarkBot(
                true,
                response.amount,
                eventInfo?.event?.sname,
                response?.easepayid,
                UserDetails?.email,
                "Payment recieved but error in registering for event response"
              );
              mixpanel.track(
                "Problem!!!, Order not placed but money deducted",
                {
                  user: UserDetails?.email,
                  slug: eventInfo?.event?.slug,
                }
              );
              toast.info(
                "Something wrong happened, If money got deducted then please reach us at info@anchors.in",
                {
                  position: "top-center",
                  autoClose: 5000,
                }
              );
            }

            setPaymentProcessing(false);
            setLoader(false);
            break;

          // Else all cases  -----------------
          default:
            setPaymentProcessing(false);
            setLoader(false);

            mixpanel.track("No response matched", {
              status: response?.status,
            });

            toast.info(
              "The order is not placed. Try again!!! ,in case of issues inform us at info@anchors.in ",
              {
                position: "top-center",
                autoClose: 5000,
              }
            );
            break;
        }
      }

      // stripe ------------
      else {
        switch (response.status) {
          // 1. user cancelled the payment mode
          case "open":
            setPaymentProcessing(true);
            setLoader(true);
            toast.info(
              "Payment not yet completed, Complete the payment first",
              {
                position: "top-center",
                autoClose: 3500,
              }
            );
            setTimeout(() => {
              window.open(response?.url, "_self");
            }, 3500);
            break;

          //2. payment dropping by user --- dropped the payment by the user
          case "expired":
            setPaymentProcessing(false);
            setLoader(false);
            toast.info(
              "Oops the payment link expired. Complete the payment again !!!",
              {
                position: "top-center",
                autoClose: 3500,
              }
            );
            setTimeout(() => {
              window.open(`/e/${slug}`, "_self");
            }, 3500);
            break;

          //  2. payment  status Complete
          case "complete":
            switch (response?.payment_status) {
              case "unpaid":
                // Inform lark bot about the failure
                setPaymentProcessing(false);
                setLoader(false);

                informLarkBot(
                  true,
                  response.amount,
                  eventInfo?.event?.sname,
                  response?.easepayid,
                  UserDetails?.email,
                  `Status - ${response.status} Payment pending from user's side`
                );

                toast.info(
                  "Payment is still pending, complete the payment to proceed,for issues inform us at info@anchors.in",
                  {
                    autoClose: 5000,
                  }
                );

                break;

              // success payment
              case "paid":
                let generateBanner = await generateNewUserEventBanner();
                const success = await userPlaceOrderForEvent(
                  eventInfo?.event?.ssp,
                  1,
                  eventInfo?.event?._id,
                  eventInfo?.event?.c_id?._id,
                  1,
                  localStorage.getItem("isUser") === "true"
                    ? "user"
                    : "creator",
                  "",
                  response,
                  orderId,
                  generateBanner?.result?.Location
                );
                localStorage.removeItem("Cref");
                if (success) {
                  mixpanel.track("Paid Order placed Successfully", {
                    user: UserDetails?.email,
                    slug: eventInfo?.event?.slug,
                  });
                  setAlreadyOrderPlaced(true);
                  navigate(`/success/${slug}?placedOrder=success`);
                } else {
                  // sending the payment fail email at info@anchors.in
                  informLarkBot(
                    true,
                    response.amount,
                    eventInfo?.event?.sname,
                    response?.id,
                    UserDetails?.email,
                    "Payment recieved but error in registering for event response for stripe payment"
                  );
                  mixpanel.track(
                    "Problem!!!, Order not placed but money deducted from Stripe",
                    {
                      user: UserDetails?.email,
                      slug: eventInfo?.event?.slug,
                    }
                  );
                  toast.info(
                    "Something wrong happened, If money got deducted then please reach us at info@anchors.in",
                    {
                      position: "top-center",
                      autoClose: 5000,
                    }
                  );
                }
                setPaymentProcessing(false);
                setLoader(false);
                break;

              default:
                mixpanel.track("Problem!!!, Paid Order failed on Stripe", {
                  user: UserDetails?.email,
                  slug: eventInfo?.event?.slug,
                });

                setPaymentProcessing(false);
                setLoader(false);

                // Inform lark bot about the failure
                informLarkBot(
                  true,
                  response.amount,
                  eventInfo?.event?.sname,
                  response?.id,
                  UserDetails?.email,
                  `Status - ${response.status} Payment failed from Stripe's side`
                );

                toast.info(
                  "Payment Failed, if amount got deducted inform us at info@anchors.in",
                  {
                    autoClose: 5000,
                  }
                );

                break;
            }
            break;

          // Else all cases  -----------------
          default:
            setPaymentProcessing(false);
            setLoader(false);

            toast.info(
              "The order is not placed. Try again!!! ,in case of issues inform us at info@anchors.in ",
              {
                position: "top-center",
                autoClose: 5000,
              }
            );
            break;
        }
      }
    } catch (error) {
      mixpanel.track(
        `Error occured in handlinf payment response- ${response.status}`,
        {
          error: error,
        }
      );
    }
  };

  const orderPlacingThroughEaseBuzz = async () => {
    mixpanel.track("Easebuzz opened");
    setPaymentProcessing(true);
    setLoader(true);

    // referral code of the reserrer for events only
    var storedObjString = localStorage.getItem("Cref");
    var reffObj = JSON.parse(storedObjString);

    const order = await createUserOrderEaseBuzz(
      localStorage.getItem("isUser") === "true" ? "user" : "creator",
      "event",
      eventInfo?.event?.ssp,
      eventInfo?.event?.sname,
      reffObj?.url === slug ? reffObj?.code : null, // referralCode,
      eventInfo?.event?._id
    );

    const key = await easeBuzzApiKey();
    let orderData = {}; // Access key received via Initiate Payment

    if (order?.success && order?.already) {
      setPaymentProcessing(false);
      setLoader(false);
      toast.info("You have already paid for the event");
      return true;
    } else if (order?.success) {
      orderData = order;
    } else {
      setPaymentProcessing(false);
      setLoader(false);
      toast.info(
        "Problems in creating order, Please refresh the page and try again!!"
      );
      return true;
    }

    var easebuzzCheckout = new window.EasebuzzCheckout(key, "prod");

    var options = {
      access_key: orderData?.data,
      onResponse: (response) => {
        // handling the edge cases of the response
        handlePaymentResponse(response, orderData?.orderId, "easebuzz");
      },
      theme: "#000000", // color hex
    };

    easebuzzCheckout.initiatePayment(options);
  };

  const orderPlacingThroughStripe = async () => {
    mixpanel.track("Easebuzz stripe");
    setPaymentProcessing(true);
    setLoader(true);

    // referral code of the reserrer for events only
    var storedObjString = localStorage.getItem("Cref");
    var reffObj = JSON.parse(storedObjString);

    const order = await createUserOrderStripe(
      localStorage.getItem("isUser") === "true" ? "user" : "creator",
      "event",
      eventInfo?.event?.ssp,
      eventInfo?.event?.sname,
      slug,
      reffObj?.url === slug ? reffObj?.code : null, // referralCode,
      eventInfo?.event?._id
    );

    if (order?.success && order?.already) {
      setPaymentProcessing(false);
      setLoader(false);
      toast.info("You have already paid for the event");
      return true;
    } else if (order?.success) {
      //  setting the data in the store -----------
      let data = JSON.stringify(order?.checkData);
      localStorage.setItem("stripeData", data);

      // checking out on the stripe store -----------
      window.open(order?.checkoutUrl, "_self");
    } else {
      setPaymentProcessing(false);
      setLoader(false);
      toast.info(
        "Problems in creating order, Please refresh the page and try again!!"
      );
      return true;
    }
  };

  const handleEventRegistration = async (e) => {
    setLoader(true);
    e?.preventDefault();

    if (localStorage.getItem("jwtToken")) {
      if (eventFinished) {
        navigate("/user/dashboard");
      } else if (alreadyOrderPlaced) {
        setLoader(false);
        navigate(`/success/${slug}`);
        return true;
      } else {
        // if (UserDetails?.phoneNumber) {
        if (eventInfo?.event?.isPaid) {
          checkfororder(
            eventInfo?.event?._id,
            localStorage.getItem("isUser") === "true" ? "user" : "creator",
            "event"
          ).then((e) => {
            if (e?.success) {
              setAlreadyOrderPlaced(true);
              navigate(`/success/${slug}`);
            } else {
              if (UserDetails?.location?.country !== "India") {
                orderPlacingThroughStripe();
              } else {
                orderPlacingThroughEaseBuzz();
              }
            }
            setLoader(false);
          });
        } else {
          setPaymentProcessing(true);
          var storedObjString = localStorage.getItem("Cref");
          var reffObj = JSON.parse(storedObjString);
          // Free Order processing -----------------

          // genrate event banner for users ------
          let generateBanner = await generateNewUserEventBanner();

          const success = await userPlaceOrderForEvent(
            eventInfo?.event?.ssp,
            1,
            eventInfo?.event?._id,
            eventInfo?.event?.c_id?._id,
            0,
            localStorage.getItem("isUser") === "true" ? "user" : "creator",
            reffObj?.url === slug ? reffObj?.code : null, // referralCode
            null,
            null,
            generateBanner?.result?.Location
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
        // } else {
        // First verify the whatsapp ----------
        // setOpenOtpModal(true);
        setPaymentProcessing(false);
        setLoader(false);
        // }
      }
    } else {
      setLoader(false);
      localStorage.setItem("session", "reserveSeat");
      return setOpenModel(true);
    }
  };

  function getYouTubeVideoId(url) {
    // Regular expression to match YouTube video URL patterns
    const regex = /[?&]v=([^?&]+)/;

    // Extract video ID from the URL using the regular expression
    const match = url.match(regex);

    // Check if a match is found
    if (match && match[1]) {
      return match[1];
    } else {
      // Return null if no match is found
      return null;
    }
  }

  // handling the status 0 of services ------------------------------------------
  if (
    eventInfo?.event?.status === 0 &&
    eventInfo?.event?.c_id?.status === 0 &&
    eventInfo?.event?.c_id?.eventStatus === 0
  ) {
    navigate("/");
    return null;
  }

  return (
    <>
      {/* {openOtpModal && (
        <OTPVerificationModel
          onClose={() => {
            setOpenOtpModal(false);
          }}
        />
      )} */}

      {loader && <LoadThree open={loader} />}

      <div className="event_page_outside_wrapper">
        <Navbar2
          // slug={basicCdata?.slug}
          open={openModel}
          close={() => {
            setOpenModel(false);
          }}
        />

        {/*  hoc in event page ------------ */}
        <div className="hoc1_wrraper_event_page">
          <section className="main_header_component_event_page">
            <section>
              <h1 className="text_type01_event_page">
                {eventInfo?.event?.sname}
              </h1>

              <span className="text_type02_event_page">
                by {eventInfo?.creator?.name}
              </span>

              <button
                className="button_01_event_page"
                onClick={() => {
                  handleNavigation(true);
                  mixpanel.track(
                    eventFinished || alreadyOrderPlaced
                      ? "View Events Details first CTA"
                      : "Register for Event first CTA"
                  );
                }}
              >
                {eventFinished || alreadyOrderPlaced
                  ? "View Event Details"
                  : "Register for Event"}
              </button>
            </section>

            <div>
              <span></span>
              <img src={eventInfo?.event?.simg} alt="" />
              <span></span>
            </div>

            <BsArrowDown
              color="#94A3B8"
              size={40}
              className="arrow_button_sample_page"
            />
          </section>
        </div>

        {/*  hoc2 in event page ------------ */}
        <div
          className="hoc2_wrraper_event_page"
          ref={targetRef}
          id="eventDetails"
        >
          <section className="event_details_section_event_page">
            <div className="highlights_section_event_page">
              <h3
                className="text_type07_event_page"
                style={{ gridArea: "head" }}
              >
                Event Highlights
              </h3>
              <div
                className="highlight_card_design_event"
                style={{ gridArea: "box1" }}
              >
                <IoImageOutline />

                <section>
                  <span className="text_type03_event_page">Mode</span>
                  <span className="text_type04_event_page">
                    {eventInfo?.event?.stype === 0 ? "Offline" : "Online"}
                  </span>
                </section>
              </div>
              <div
                className="highlight_card_design_event"
                style={{ gridArea: "box2" }}
              >
                <MdEventSeat />

                <section>
                  <span className="text_type03_event_page">Seat available</span>
                  <span className="text_type04_event_page">
                    {eventInfo?.event?.maxCapacity !== "Unlimited"
                      ? parseInt(
                          eventInfo?.event?.maxCapacity -
                            eventInfo?.event?.registrations
                        )
                      : ""}
                  </span>
                </section>
              </div>
              <div
                className="highlight_card_design_event"
                style={{ gridArea: "box3" }}
              >
                <CiCalendarDate />

                <section>
                  <span className="text_type03_event_page">Date</span>
                  <span className="text_type04_event_page">
                    {getDate(eventInfo?.event?.startDate)}
                  </span>
                </section>
              </div>
              <div
                className="highlight_card_design_event"
                style={{ gridArea: "box4" }}
              >
                <GoClock />

                <section>
                  <span className="text_type03_event_page">Time</span>
                  <span className="text_type04_event_page">
                    {" "}
                    {eventInfo?.event?.time?.startTime} To{" "}
                    {eventInfo?.event?.time?.endTime} (IST)
                  </span>
                </section>
              </div>
              <div
                className="highlight_card_design_event"
                style={{ gridArea: "box5" }}
              >
                <IoLanguageOutline />

                <section>
                  <span className="text_type03_event_page">Language</span>
                  <span className="text_type04_event_page">English, Hindi</span>
                </section>
              </div>

              {eventInfo?.event?.stype === 0 && (
                <div
                  className="highlight_card_design_event"
                  style={{ gridArea: "box6" }}
                >
                  <IoLocationOutline />

                  <section>
                    <span className="text_type03_event_page">Location</span>
                    <span className="text_type04_event_page">
                      {eventInfo?.event?.meetlink}
                    </span>
                  </section>
                </div>
              )}
            </div>

            <div className="reserve_event_page_section">
              <h3 className="text_type05_event_page">Reserve your spot</h3>
              <span className="text_type06_event_page">
                {eventInfo?.event?.isPaid ? (
                  <>
                    {" "}
                    ₹ {eventInfo?.event?.ssp}{" "}
                    <span>{eventInfo?.event?.smrp}</span>
                  </>
                ) : (
                  "For Free"
                )}
              </span>
              <button
                className="button_02_event_page"
                onClick={() => {
                  handleEventRegistration();
                  mixpanel.track(
                    alreadyOrderPlaced
                      ? "Explore your benefits at Your Spot is Reserved"
                      : "Register for Event at Reserve your Spot"
                  );
                }}
              >
                {eventFinished
                  ? "Go To Dashboard"
                  : alreadyOrderPlaced
                  ? "Explore your benefits"
                  : paymentProcessing
                  ? "Processing..."
                  : "Register for Event"}
              </button>
            </div>
          </section>
        </div>

        {/*  hoc in event page ------------ */}
        <div className="hoc1_wrraper_event_page">
          <section className="description_event_page_wrapper">
            <h3 className="text_type07_event_page">Description</h3>

            <div
              className="description_event_page_content"
              ref={aboutEventPage}
            ></div>
          </section>

          {/* video display section ---------------------------- */}
          {eventInfo?.event?.videosSectionData && (
            <section className="video_section_event_page_wrapper">
              <h3 className="text_type07_event_page">
                {eventInfo?.event?.videosSectionData?.title}
              </h3>

              <div>
                <Swiper
                  slidesPerView={"auto"}
                  centeredSlides={true}
                  spaceBetween={30}
                  pagination={{
                    clickable: true,
                  }}
                  modules={[Pagination]}
                  className="mySwiper"
                >
                  {eventInfo?.event?.videosSectionData?.videos?.map(
                    (video, index) => {
                      return (
                        <SwiperSlide key={`videoectra${index}`}>
                          <div className="video_box_event_page">
                            {video?.includes("youtube") ? (
                              <iframe
                                width={
                                  window.screen.width > 600
                                    ? "714"
                                    : `${window.screen.width * 0.91}`
                                }
                                height={
                                  window.screen.width > 600
                                    ? "401"
                                    : `${window.screen.width * 0.51}`
                                }
                                src={`https://www.youtube.com/embed/${getYouTubeVideoId(
                                  video
                                )}`}
                                title="YouTube video player"
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                              ></iframe>
                            ) : video?.includes("vimeo") ? (
                              <iframe
                                title="vimeo-player"
                                src="https://player.vimeo.com/video/10679287?h=7d9c8318c0"
                                width="714"
                                height="401"
                                frameborder="0"
                                allowfullscreen
                              ></iframe>
                            ) : null}
                          </div>
                        </SwiperSlide>
                      );
                    }
                  )}
                </Swiper>
              </div>
            </section>
          )}
        </div>

        {/*  hoc1 in event page ------------ */}
        {(eventInfo?.event?.imagesSectionData ||
          eventInfo?.event?.testimonialData) && (
          <div className="hoc2_wrraper_event_page">
            {eventInfo?.event?.imagesSectionData && (
              <section className="images_section_event_page_wrapper">
                <h3 className="text_type07_event_page">
                  {eventInfo?.event?.imagesSectionData?.title}
                </h3>

                <div>
                  <Swiper
                    slidesPerView={window.screen.width > 600 ? 3 : 1}
                    spaceBetween={30}
                    pagination={{
                      clickable: true,
                    }}
                    modules={[Pagination]}
                    className="mySwiper"
                  >
                    {eventInfo?.event?.imagesSectionData?.images?.map(
                      (image, index) => {
                        return (
                          <SwiperSlide key={`imageectra${index}`}>
                            <img src={image} alt="" />
                          </SwiperSlide>
                        );
                      }
                    )}
                  </Swiper>
                </div>
              </section>
            )}

            {eventInfo?.event?.testimonialData &&
              eventInfo?.event?.testimonialData?.length !== 0 && (
                <section className="testimonial_section_event_page_wrapper">
                  <h3 className="text_type07_event_page">
                    {eventInfo?.event?.testimonialData?.title ?? "Testimonials"}
                  </h3>

                  <div>
                    <Swiper
                       slidesPerView={window.screen.width > 600 ? 3 : 1}
                      spaceBetween={30}
                      pagination={{
                        clickable: true,
                      }}
                      modules={[Pagination]}
                      className="mySwiper"
                    >
                      {eventInfo?.event?.testimonialData?.data
                        ?.filter((e) => e)
                        ?.map((data, i) => {
                          return (
                            <SwiperSlide>
                              {data?.type === "Image" ? (
                                <img
                                  src={data?.image}
                                  alt=""
                                />
                              ) : data?.type === "Text" ? (
                                <div className="testimonial_card_wrapper_event_page">
                                  <BsQuote />
                                  <p>{data?.title}</p>
                                  <p id={`testimonialText${i}`}>{
                                    document.getElementById(`testimonialText${i}`) ? document.getElementById(`testimonialText${i}`).innerHTML = data?.review : null
                                  }</p>

                                  <span>{data?.username}</span>

                                </div>
                              ) : data?.type === "Video" ? 
                                data?.videoLink?.includes("youtube") &&
                                  <iframe
                                    width={
                                      window.screen.width > 600
                                        ? `${window.screen.width * 0.25}`
                                        : `${window.screen.width * 0.91}`
                                    }
                                    height={
                                      window.screen.width > 600
                                        ? "195"
                                        : `${window.screen.width * 0.51}`
                                    }
                                    src={`https://www.youtube.com/embed/${getYouTubeVideoId(
                                      data?.videoLink
                                    )}`}
                                    title="YouTube video player"
                                    frameBorder="0"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                  ></iframe>
                               : null}
                            </SwiperSlide>
                          );
                        })}
                      )
                    </Swiper>
                  </div>
                </section>
              )}
          </div>
        )}

        {/*  hoc in event page ------------ */}
        <div className="hoc1_wrraper_event_page">
          <section className="speakers_event_page_wrapper">
            <h3 className="text_type07_event_page">Event Speakers</h3>

            <div>
              {eventInfo?.event?.speakerDetails ? (
                eventInfo?.event?.speakerDetails?.map((speaker, index) => {
                  return (
                    <SpeakerCard
                      {...speaker}
                      optionalProfile={eventInfo?.creator?.profile}
                      key={index}
                      sno={index + 1}
                    />
                  );
                })
              ) : (
                <SpeakerCard
                  name={eventInfo?.creator?.name}
                  profile={eventInfo?.creator?.profile}
                  designation={eventInfo?.creator?.tagLine}
                  rating={creatorRatingData}
                  linkedinLink={eventInfo?.creator?.linkedInLink}
                />
              )}
            </div>
          </section>
        </div>

        {/*  hoc2 in event page ------------ */}
        <div className="hoc2_wrraper_event_page">
          {!alreadyOrderPlaced && !eventFinished && (
            <section className="benefits_event_page_wrapper">
              <h3 className="text_type07_event_page">
                Unlock Exciting Benefits!
              </h3>
              <span className="text_type08_event_page">
                Register & unlock your Unique Referral Code to avail AMAZING
                perks.
              </span>

              <p className="text_type09_event_page">Check out the perks:</p>

              <div className="benefits_div_event_page" ref={benefitRef}></div>

              <button
                className="button_02_event_page"
                onClick={() => {
                  handleEventRegistration();
                  mixpanel.track(
                    alreadyOrderPlaced
                      ? "Explore your benefits at Your Spot is Reserved"
                      : "Register to Participate in event page"
                  );
                }}
              >
                Register to Participate
              </button>
            </section>
          )}

          <section className="reviews_wrapper_event_page">
            {feedbacks?.filter((e, i) => {
              return e?.status === 1;
            })?.length !== 0 && (
              <>
                <div>
                  <h3 className="text_type07_event_page">Review</h3>
                  <span>
                    <IoMdStar size={12} color="#FFD600" /> {creatorRatingData}/5{" "}
                    <span>
                      (
                      {
                        feedbacks?.filter((e, i) => {
                          return e?.status === 1;
                        })?.length
                      }
                      )
                    </span>
                  </span>
                </div>

                <section className="review_card_wrapper_event_page">
                  {feedbacks
                    ?.filter((e, i) => {
                      return e?.status === 1;
                    })
                    ?.map((e, i) => {
                      return <ReviewCard2 {...e} key={i} />;
                    })}
                </section>

                {feedbacks?.filter((e, i) => {
                  return e?.status === 1;
                })?.length > 3 && (
                  <span className="text_type10_event_page">
                    Read All <IoIosArrowDown />
                  </span>
                )}
              </>
            )}

            <div className="hoster_details_event_page">
              <p>Hosted by : {eventInfo?.creator?.name}</p>

              {eventInfo?.event?.contactDetails && (
                <section>
                  {eventInfo?.event?.contactDetails?.email && (
                    <div>
                      <CiMail />
                      {eventInfo?.event?.contactDetails?.email}
                    </div>
                  )}
                  {eventInfo?.event?.contactDetails?.phone && (
                    <div>
                      <MdLocalPhone />
                      {eventInfo?.event?.contactDetails?.phone}
                    </div>
                  )}
                </section>
              )}

              <div>
                {eventInfo?.creator?.linkedInLink && (
                  <CiLinkedin
                    onClick={() => {
                      window.open(eventInfo?.creator?.linkedInLink);
                      mixpanel.track("Host linkedin link clicked");
                    }}
                  />
                )}
                {eventInfo?.creator?.instaLink && (
                  <IoLogoInstagram
                    onClick={() => {
                      window.open(eventInfo?.creator?.instaLink);
                      mixpanel.track("Host insta link clicked");
                    }}
                  />
                )}
                {eventInfo?.creator?.twitterLink && (
                  <FaXTwitter
                    onClick={() => {
                      window.open(eventInfo?.creator?.twitterLink);
                      mixpanel.track("Host twitter link clicked");
                    }}
                  />
                )}
                {eventInfo?.creator?.teleLink && (
                  <RiTelegramLine
                    onClick={() => {
                      window.open(eventInfo?.creator?.teleLink);
                      mixpanel.track("Host telegram link clicked");
                    }}
                  />
                )}
                {eventInfo?.creator?.fbLink && (
                  <CiFacebook
                    onClick={() => {
                      window.open(eventInfo?.creator?.fbLink);
                      mixpanel.track("Host facebook link clicked");
                    }}
                  />
                )}
              </div>
            </div>
          </section>
        </div>

        {/* desktop Floater ------------------ */}

        {isVisibleFloater && !eventFinished && (
          <section
            className="desktop_floater_event_page"
            onClick={() => {
              handleEventRegistration();
              mixpanel.track(
                alreadyOrderPlaced
                  ? "Get Your Attendee Card from floatter"
                  : "Register for Event at Floater"
              );
            }}
          >
            <span>
              {alreadyOrderPlaced
                ? "Get Your Attendee Card"
                : paymentProcessing
                ? "Processing..."
                : "Register for Event"}
            </span>
            <div>
              {!alreadyOrderPlaced &&
                (eventInfo?.event?.isPaid ? (
                  <>
                    ₹{eventInfo?.event?.ssp}{" "}
                    <span>{eventInfo?.event?.smrp}</span>
                  </>
                ) : (
                  "For Free"
                ))}
              <IoIosArrowRoundForward size={24} />
            </div>
          </section>
        )}

        <Footer3 hostEventButton={true} />
      </div>
    </>
  );
}

export default Event2;
