import React, {
  Suspense,
  lazy,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import "./ServicePage.css";
import { RiStarSFill } from "react-icons/ri";
import { BsWhatsapp } from "react-icons/bs";
import { AiOutlineArrowRight } from "react-icons/ai";
import PNGIMG from "../../../../Utils/Images/default_user.png";

// svgs import  ----------------

import ExcelIcon from "../../../../Utils/Icons/excel-service.svg";
import VideoIcon from "../../../../Utils/Icons/video-service.svg";
import DocIcon from "../../../../Utils/Icons/doc-service.svg";
import TrendIcon from "../../../../Utils/Icons/trend-service.svg";
import FlagIcon from "../../../../Utils/Icons/flag-service.svg";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import ServiceContext from "../../../../Context/services/serviceContext";
import { feedbackcontext } from "../../../../Context/FeedbackState";
import { LazyLoadImage } from "react-lazy-load-image-component";
import mixpanel from "mixpanel-browser";
import { paymentContext } from "../../../../Context/PaymentState";
import { userContext } from "../../../../Context/UserState";
import { ToastContainer, toast } from "react-toastify";
import { LoadThree } from "../../../Modals/Loading";
import Seo from "../../../../Utils/Seo";
import FeedbackModal from "../../../Modals/Feedback_Modal";
import { Navbar2 } from "../../../Layouts/Navbar User/Navbar";
import Thanks from "../../../Modals/Thanks";
import { Footer3 } from "../../../Footer/Footer2";

// Code Splitiing the imports ----------------
const MoreServices = lazy(() => import("./Components/MoreServices"));
const ReviewsSection = lazy(() => import("./Components/ReviewsSection"));

// Main Service Page---------------------
function ServicePage(props) {
  const location = useLocation();
  const navigate = useNavigate();
  const { slug } = useParams();
  const creatorSectionDesktop = useRef(null);

  // States
  const [loader, setLoader] = useState(false); // loader states
  const [openModel, setOpenModel] = useState(false);
  const [creatorRatingData, setCreatorRatingData] = useState(0); // creator rating data
  const [alreadyOrderPlaced, setAlreadyOrderPlaced] = useState(false); // already user order placed or not
  const [UserDetails, setUserDetails] = useState(); // stores the user data
  const [paymentProcessing, setPaymentProcessing] = useState(false); // if payment is processig
  const [openModelDownload, setOpenModelDownload] = useState(false); // for the thanks model after download
  const [fbModalDetails, setFbModalDetails] = useState({
    open: false,
    service: {},
    stype: "",
  }); // feedback modal details opening and details ----

  // contexts --------------------------
  const {
    serviceInfo,
    getserviceinfo,
    services,
    getallservicesusingid,
    getserviceusingid,
  } = useContext(ServiceContext);

  const { checkFBlatest, getallfeedback, feedbacks, getRatingCreator } =
    useContext(feedbackcontext);

  const {
    checkfororder,
    informLarkBot,
    createUserOrderEaseBuzz,
    easeBuzzApiKey,
  } = useContext(paymentContext);

  const { userPlaceOrder, getUserDetails } =
    useContext(userContext);

  //Scroll to top automatically ---------------------------------------------
  useEffect(() => {
    window.scrollTo(0, 0);

    mixpanel.track("Page Visit", {
      user: UserDetails ? UserDetails : "",
      creator: serviceInfo?.creator?.slug,
    });
  }, [location]);

  // getting the service data ----------
  useEffect(() => {
    setLoader(true);
    getserviceinfo(slug).then((id) => {
      if (!id[0]) {
        // handles any irregular slug
        navigate("/");
        return null;
      }

      getallfeedback(id[0]?._id); // getting the user reviews
      getRatingCreator(id[0]?._id).then((e) => {
        // getting the creator's rating
        setCreatorRatingData(e);
      });
      getallservicesusingid(id[0]?._id); // getting the more resources
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

  // getting user data,feedbacks and many function to run on user login ----------------
  useEffect(() => {
    if (localStorage.getItem("jwtToken")) {
      setLoader(true);
      // checks if order is already placed or not
      serviceInfo &&
        checkfororder(
          serviceInfo?.service?._id,
          localStorage.getItem("isUser") === "true" ? "user" : "creator",
          "download"
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

      // get the feedback latest -----------
      checkFBlatest().then((fb) => {
        if (fb.success) {
          // for serviec feedbacks ----------------
          if (fb.res.serviceID) {
            getserviceusingid(fb.res.serviceID).then((service) => {
              setFbModalDetails({
                open: true,
                service: service,
                stype: "download",
              });
              //alert(`Send Feedback for "${service.sname}"`)
            });
          }

          // for workshop feedback -------------------
          // } else {
          //   getworkshopusingid(fb.res.workshopID).then((service) => {
          //     setFbModalDetails({open:true,service:service,stype:"download"})
          //     setFBService(service);
          //     setFBserviceType("workshop");
          //     setOpenModelFB(true);
          //     //alert(`Send Feedback for "${service.sname}"`)
          //   });
          // }
        }
      });
    }
    // eslint-disable-next-line
  }, [localStorage.getItem("jwtToken"), serviceInfo]);

  // filling some data in the page------------------
  useEffect(() => {
    if (document.querySelectorAll("#large_desc_service_page")[0]) {
      document.querySelectorAll("#large_desc_service_page")[0].innerHTML =
        serviceInfo?.service?.ldesc;
    }

    if (document.querySelectorAll("#short_desc_service_page")[0]) {
      document.querySelectorAll("#short_desc_service_page")[0].innerHTML =
        serviceInfo?.service?.sdesc;
    }

    // eslint-disable-next-line
  }, [serviceInfo]);

  // Functions ----------------------

  // const orderPlacingThroughRazorpay = async () => {
  //   setPaymentProcessing(true);
  //   setLoader(true);
  //   const order = await createRazorpayClientSecret(serviceInfo?.service?.ssp);
  //   const key = await razorpay_key();

  //   var options = {
  //     key, // Enter the Key ID generated from the Dashboard
  //     amount: order.amount, // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
  //     currency: "INR",
  //     name: "anchors", //your business name
  //     description: `Payment for Buying - ${serviceInfo?.service?.sname}`,
  //     image: require("../../../../Utils/Images/logo.png"),
  //     order_id: order?.id, //This is a sample Order ID. Pass the `id` obtained in the response of Step 1
  //     //callback_url: `${host}/api/payment/paymentVerification`,
  //     handler: async function (res) {
  //       const result = await verifyPaymentsinBackend(
  //         res.razorpay_payment_id,
  //         res.razorpay_order_id,
  //         res.razorpay_signature,
  //         order.amount / 100,
  //         1,
  //         serviceInfo?.service?._id,
  //         serviceInfo?.service?.c_id?._id,
  //         1,
  //         0,
  //         localStorage.getItem("isUser") === "true" ? "user" : "creator"
  //       );

  //       // controlling the edges casses now ----------------
  //       if (result?.success && result?.orderPlaced && result?.paymentRecieved) {
  //         // handling donwload edge cases ---------------------------
  //         if (serviceInfo?.service?.allowDownload) {
  //           let link = document.createElement("a");
  //           link.href = serviceInfo?.service?.surl;
  //           link.download = serviceInfo?.service?.sname;
  //           link.dispatchEvent(new MouseEvent("click"));
  //         } else {
  //           if (serviceInfo?.service?.stype === 0) {
  //             // viewing pdf files --------------
  //             sessionStorage.setItem("link", serviceInfo?.service?.surl);
  //             window.open("/viewPdf");
  //           } else if (serviceInfo?.service?.stype === 1) {
  //             // viewing excel files ------------
  //             sessionStorage.setItem("link", serviceInfo?.service?.surl);
  //             window.open("/viewExcel");
  //           }
  //         }
  //         setAlreadyOrderPlaced(true);
  //         mixpanel.track("Paid Order placed Successfully", {
  //           user: UserDetails?.email,
  //           slug: serviceInfo?.service?.slug,
  //         });
  //         toast.success("Thanks for placing the order", {
  //           position: "top-center",
  //           autoClose: 3000,
  //         });
  //         setOpenModelDownload(true);
  //         setPaymentProcessing(false);
  //         setLoader(false);
  //       } else if (
  //         result?.success &&
  //         !result?.orderPlaced &&
  //         result?.paymentRecieved
  //       ) {
  //         // sending the payment fail email at info@anchors.in
  //         informLarkBot(
  //           true,
  //           order.amount / 100,
  //           serviceInfo?.service?.sname,
  //           res.razorpay_payment_id,
  //           UserDetails?.email,
  //           "Payment recieved but error in order placing response"
  //         );
  //         setPaymentProcessing(false);
  //         setLoader(false);

  //         // sendEmailForOrderPayments(
  //         //   serviceInfo?.sname,
  //         //   UserDetails?.email,
  //         //   order.amount / 100,
  //         //   res.razorpay_payment_id
  //         // );

  //         mixpanel.track("Problem!!!, Order not placed but money deducted", {
  //           user: UserDetails?.email,
  //           slug: serviceInfo?.service?.slug,
  //         });

  //         toast.info(
  //           "Something wrong happened, If money got deducted then please reach us at info@anchors.in",
  //           {
  //             position: "top-center",
  //             autoClose: 5000,
  //           }
  //         );
  //       } else {
  //         mixpanel.track("Paid Order not placed", {
  //           user: UserDetails?.email,
  //           slug: serviceInfo?.service?.slug,
  //         });
  //         toast.info(
  //           "Your order was not placed. Please try again!!. If money got deducted then please reach us at info@anchors.in",
  //           {
  //             position: "top-center",
  //             autoClose: 5000,
  //           }
  //         );
  //         setPaymentProcessing(false);
  //         setLoader(false);
  //       }
  //     },

  //     prefill: {
  //       name: UserDetails?.name, //your customer's name
  //       email: UserDetails?.email,
  //     },
  //     notes: {
  //       address: "https://www.anchors.in",
  //     },
  //     modal: {
  //       ondismiss: function () {
  //         setPaymentProcessing(false);
  //         setLoader(false);
  //         toast.info(
  //           "It is a paid service, for using it you have to pay the one time payment",
  //           {
  //             position: "top-center",
  //             autoClose: 5000,
  //           }
  //         );
  //       },
  //     },
  //     notify: {
  //       sms: true,
  //       email: true,
  //     },
  //     theme: {
  //       color: "#040102",
  //     },
  //   };
  //   var razor = new window.Razorpay(options);
  //   razor.on("payment.failed", (e) => {
  //     setPaymentProcessing(false);
  //     setLoader(false);
  //     mixpanel.track("Problem!!!, Paid Order failed", {
  //       user: UserDetails?.email,
  //       slug: serviceInfo?.service?.slug,
  //     });

  //     // Inform lark bot about the default
  //     informLarkBot(
  //       true,
  //       order.amount / 100,
  //       serviceInfo?.service?.sname,
  //       e?.error?.metadata?.payment_id,
  //       UserDetails?.email,
  //       "Payment failed from Razorpay's side"
  //     );

  //     // sending the payment fail email at info@anchors.in
  //     // sendEmailForOrderPayments(
  //     //   serviceInfo?.sname,
  //     //   UserDetails?.email,
  //     //   order.amount / 100,
  //     //   e?.error?.metadata?.payment_id
  //     // );

  //     toast.info(
  //       "Payment Failed, if amount got deducted inform us at info@anchors.in",
  //       {
  //         autoClose: 5000,
  //       }
  //     );
  //   });
  //   razor.open();
  // };

  // Handling the payment responses
  const handlePaymentResponse = async (response, orderId) => {
    setPaymentProcessing(true);
    setLoader(false);

    switch (response.status) {
      // 1. user cancelled the payment mode
      case "userCancelled":
        setPaymentProcessing(false);
        setLoader(false);
        toast.info(
          "It is a paid service, for using it you have to pay the one time payment",
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
          "It is a paid service, for using it you have to pay the one time payment",
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
          slug: serviceInfo?.service?.slug,
        });

        setPaymentProcessing(false);
        setLoader(false);

        // Inform lark bot about the failure
        informLarkBot(
          true,
          response.amount,
          serviceInfo?.service?.sname,
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
          serviceInfo?.service?.sname,
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
        const success = await userPlaceOrder(
          serviceInfo?.service?.ssp,
          1,
          serviceInfo?.service?._id,
          serviceInfo?.service?.c_id?._id,
          0,
          0,
          localStorage.getItem("isUser") === "true" ? "user" : "creator",
          response,
          orderId
        );

        if (success) {
          setAlreadyOrderPlaced(true);

          // handling donwload edge cases ---------------------------
          if (serviceInfo?.service?.allowDownload) {
            let link = document.createElement("a");
            link.href = serviceInfo?.service?.surl;
            link.download = serviceInfo?.service?.sname;
            link.dispatchEvent(new MouseEvent("click"));
          } else {
            if (serviceInfo?.service?.stype === 0) {
              // viewing pdf files --------------
              sessionStorage.setItem("link", serviceInfo?.service?.surl);
              window.open("/viewPdf");
            } else if (serviceInfo?.service?.stype === 1) {
              // viewing excel files ------------
              sessionStorage.setItem("link", serviceInfo?.service?.surl);
              window.open("/viewExcel");
            }
          }

          setOpenModelDownload(true);
          mixpanel.track("Paid Order placed Successfully", {
            user: UserDetails?.email,
            slug: serviceInfo?.service?.slug,
          });
        } else {
          // inform lark bot --------
          informLarkBot(
            true,
            response.amount,
            serviceInfo?.service?.sname,
            response?.easepayid,
            UserDetails?.email,
            "Payment recieved but error in registering for event response"
          );

          mixpanel.track("Problem!!!, Order not placed but money deducted", {
            user: UserDetails?.email,
            slug: serviceInfo?.service?.slug,
          });

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

        toast.info(
          "The order is not placed. Try again!!! ,in case of issues inform us at info@anchors.in ",
          {
            position: "top-center",
            autoClose: 5000,
          }
        );
        break;
    }
  };

  const orderPlacingThroughEaseBuzz = async () => {
    setPaymentProcessing(true);
    setLoader(true);

    const order = await createUserOrderEaseBuzz(
      localStorage.getItem("isUser") === "true" ? "user" : "creator",
      "service",
      serviceInfo?.service?.ssp,
      serviceInfo?.service?.sname,
      "", // referralCode,
      serviceInfo?.service?._id
    );

    const key = await easeBuzzApiKey();
    let orderData = {}; // Access key received via Initiate Payment

    if (order?.success && order?.already) {
      setPaymentProcessing(false);
      setLoader(false);
      toast.info("You have already paid for the service");
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
        handlePaymentResponse(response, orderData?.orderId);
      },
      theme: "#000000", // color hex
    };

    easebuzzCheckout.initiatePayment(options);
  };

  const downloadService = async (e) => {
    mixpanel.track("Get Access");
    e?.preventDefault();
    setPaymentProcessing(true);
    setLoader(true);
    if (localStorage.getItem("jwtToken")) {
      if (serviceInfo?.service?.isPaid) {
        checkfororder(
          serviceInfo?.service?._id,
          localStorage.getItem("isUser") === "true" ? "user" : "creator"
        ).then((e) => {
          if (e?.success) {
            // handling donwload edge cases ---------------------------
            if (serviceInfo?.service?.allowDownload) {
              let link = document.createElement("a");
              link.href = serviceInfo?.service?.surl;
              link.download = serviceInfo?.service?.sname;
              link.dispatchEvent(new MouseEvent("click"));
            } else {
              if (serviceInfo?.service?.stype === 0) {
                // viewing pdf files --------------
                sessionStorage.setItem("link", serviceInfo?.service?.surl);
                window.open("/viewPdf");
              } else if (serviceInfo?.service?.stype === 1) {
                // viewing excel files ------------
                sessionStorage.setItem("link", serviceInfo?.service?.surl);
                window.open("/viewExcel");
              }
            }
            setOpenModelDownload(true);

            mixpanel.track("Downloaded Paid Service for more than once", {
              service: slug,
              //user: UserDetails ? UserDetails : "",
              amount: serviceInfo?.service?.ssp,
              creator: serviceInfo?.service?.c_id?.slug,
            });
            setPaymentProcessing(false);
            setLoader(false);
          } else {
            orderPlacingThroughEaseBuzz();
          }
        });
      } else {
        setPaymentProcessing(true);
        const success = await userPlaceOrder(
          serviceInfo?.service?.ssp,
          1,
          serviceInfo?.service?._id,
          serviceInfo?.service?.c_id?._id,
          0,
          0,
          localStorage.getItem("isUser") === "true" ? "user" : "creator"
        );
        if (success) {
          setAlreadyOrderPlaced(true);

          // handling donwload edge cases ---------------------------
          if (serviceInfo?.service?.allowDownload) {
            let link = document.createElement("a");
            link.href = serviceInfo?.service?.surl;
            link.download = serviceInfo?.service?.sname;
            link.dispatchEvent(new MouseEvent("click"));
          } else {
            if (serviceInfo?.service?.stype === 0) {
              // viewing pdf files --------------
              sessionStorage.setItem("link", serviceInfo?.service?.surl);
              window.open("/viewPdf");
            } else if (serviceInfo?.service?.stype === 1) {
              // viewing excel files ------------
              sessionStorage.setItem("link", serviceInfo?.service?.surl);
              window.open("/viewExcel");
            }
          }

          setOpenModelDownload(true);
          mixpanel.track("Downloaded Service", {
            service: slug,
            //user: UserDetails ? UserDetails : "",
            creator: serviceInfo?.service?.c_id?.slug,
          });
        } else {
          // inform lark bot --------
          informLarkBot(
            false,
            0,
            serviceInfo?.service?.sname,
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
        setPaymentProcessing(false);
        setLoader(false);
      }
    } else {
      mixpanel.track("Clicked Download Service Without Login", {
        service: slug,
        //user: UserDetails ? UserDetails : "",
        creator: serviceInfo?.service?.c_id?.slug,
      });
      return setOpenModel(true);
    }
  };

  const goToDashboardClick = () => {
    navigate("/user/dashboard");
    mixpanel.track("Go to dashboard");
  };

  // handling the status 0 of services ------------------
  if (
    serviceInfo?.service?.status === 0 ||
    serviceInfo?.service?.c_id?.status === 0
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
      {loader && <LoadThree open={loader} />}

      {/* Feedback Modal -------------------- */}
      {/* <FeedbackModal
        open={fbModalDetails?.open}
        onClose={() => {
          setFbModalDetails({ ...fbModalDetails, open: false });
        }}
        name={fbModalDetails?.service?.sname}
        slug={fbModalDetails?.service?.slug}
        progress={props.progress}
        serviceType
        id={fbModalDetails?.service?._id}
        UserDetails={UserDetails ? UserDetails : ""}
      /> */}

      <div className="new_service_page_outer_wrapper">
        <Navbar2
          slug={serviceInfo?.service?.c_id?.slug}
          open={openModel}
          close={() => {
            setOpenModel(false);
          }}
        />

        {/* Thanks Modal popup ------------------------- */}
        <Thanks
          open={openModelDownload}
          onClose={() => {
            setPaymentProcessing(false);
            setOpenModelDownload(false);
          }}
          copyURL={serviceInfo?.service?.copyURL}
          slug={serviceInfo?.service?.slug}
          name={serviceInfo?.service?.sname}
          stype={serviceInfo?.service?.stype}
          cname={serviceInfo?.service?.c_id?.name}
        />

        <div className="oneframe_new_service_page">
          {/* Data Section Service Page */}

          <section className="new_service_service_desc_container">
            {/* Service Banner in aspect ratio -------- */}
            <div>
              <LazyLoadImage
                src={window.screen.width < 600 ? (serviceInfo?.service?.mobileSimg ?? serviceInfo?.service?.simg) : serviceInfo?.service?.simg}
                alt="servicebanner"
              />
            </div>

            <section>
              <div className="left_side_data_new_service_page">
                <h1 className="text_type_01_new_service_page">
                  {serviceInfo?.service?.sname}
                </h1>

                <section className="action_points_new_service_page">
                  <section>
                    <section>
                      {serviceInfo?.service?.downloads > 10 ? (
                        <span>
                          {" "}
                          <img src={TrendIcon} alt="" /> Accessed by{" "}
                          {serviceInfo?.service?.downloads} people
                        </span>
                      ) : (
                        ""
                      )}
                    </section>
                    <section>
                      {serviceInfo?.service?.noOfPages ? (
                        <span>
                          {" "}
                          <img
                            src={
                              serviceInfo?.service?.stype === 1
                                ? ExcelIcon
                                : serviceInfo?.service?.stype === 2
                                ? VideoIcon
                                : DocIcon
                            }
                            alt=""
                          />{" "}
                          {serviceInfo?.service?.noOfPages} Pages
                        </span>
                      ) : (
                        ""
                      )}
                    </section>
                  </section>

                  <div>
                    {/* <img src={FlagIcon} alt="" /> */}
                    <button
                      onClick={() => {
                        mixpanel.track("Shared On Whatsapp", {
                          service: slug,
                        });
                        window.open(
                          `https://api.whatsapp.com/send?text=Hey check this ${
                            serviceInfo?.service?.stype === 1
                              ? "sheet"
                              : serviceInfo?.service?.stype === 2
                              ? "video"
                              : "document"
                          } about *${serviceInfo?.service?.sname}*  by *${
                            serviceInfo?.creator?.name
                          }* out. I found it really helpful!. Check it out at https://www.anchors.in/s/${slug}?utm_medium=whatsapp&utm_source=wahtsapp&utm_campaign=company-question`
                        );
                      }}
                    >
                      <BsWhatsapp /> Share
                    </button>
                  </div>
                </section>

                <section
                  className="description_section_new_service_page"
                  style={
                    window.screen.width > 600
                      ? {
                          minHeight: `${
                            creatorSectionDesktop?.current?.clientHeight - 104
                          }px`,
                        }
                      : {}
                  }
                >
                  <div>
                    <h2 className="text_type_02_new_service_page">
                      Resource Description
                    </h2>
                    <p
                      className="text_type_03_new_service_page"
                      id="large_desc_service_page"
                    ></p>
                  </div>

                  {serviceInfo?.service?.sdesc && (
                    <div>
                      <h2 className="text_type_02_new_service_page">
                        Additional Information
                      </h2>
                      <p
                        className="text_type_03_new_service_page"
                        id="short_desc_service_page"
                      ></p>
                    </div>
                  )}
                </section>
              </div>

              {window.screen.width > 600 && (
                <div
                  className="right_side_data_new_service_page"
                  ref={creatorSectionDesktop}
                >
                  <section className="pricing_section_new_service_page_card">
                    {serviceInfo?.service?.isPaid && (
                      <h3 className="text_type_04_new_service_page">
                        ₹ {serviceInfo?.service?.ssp}
                        <span style={{ marginLeft: "20px" }}>₹</span>{" "}
                        <span style={{ textDecorationLine: "line-through" }}>
                          {serviceInfo?.service?.smrp}
                        </span>
                      </h3>
                    )}

                    {/* <span className="text_type_05_new_service_page">
                      {serviceInfo?.service?.download !== 0
                        ? "30 people accessed this in last 7 days."
                        : `Uploaded on : ${serviceInfo?.service?.date} `}
                    </span> */}

                    <button
                      className="new_service_page_button_one"
                      onClick={() => {
                        alreadyOrderPlaced
                          ? goToDashboardClick()
                          : downloadService();
                      }}
                      disabled={paymentProcessing}
                    >
                      {alreadyOrderPlaced
                        ? "Go to Dashboard"
                        : paymentProcessing
                        ? "Processing..."
                        : "Get Access"}
                    </button>
                  </section>

                  <section
                    className="creator_details_new_service_page"
                    onClick={() => {
                      mixpanel.track(
                        "Clicked Creators profile on service page",
                        {
                          service: slug,
                          user: UserDetails ? UserDetails : "",
                          creator: serviceInfo?.service?.c_id?.slug,
                        }
                      );
                      navigate(`/${serviceInfo?.service?.c_id?.slug}`);
                    }}
                  >
                    <LazyLoadImage
                      src={serviceInfo?.creator?.profile}
                      alt={serviceInfo?.creator?.name}
                      onError={({ currentTarget }) => {
                        currentTarget.onerror = null; // prevents looping
                        currentTarget.src = PNGIMG;
                      }}
                    />
                    <div>
                      <h3>{serviceInfo?.creator?.name}</h3>
                      {creatorRatingData && (
                        <span>
                          {" "}
                          <RiStarSFill
                            size={16}
                            color="rgba(255, 214, 0, 1)"
                          />{" "}
                          {creatorRatingData}/5
                        </span>
                      )}

                      <p>{serviceInfo?.creator?.tagLine}</p>
                    </div>
                  </section>
                </div>
              )}
            </section>
          </section>

          <Suspense>
            {/* User Review Section for mobile ------------------------- */}
            {window.screen.width < 600 &&
              feedbacks?.filter((e) => e?.status === 1)?.length !== 0 && (
                <ReviewsSection
                  data={feedbacks?.filter((e) => e?.status === 1)}
                />
              )}
          </Suspense>

          {/* Creator profile section mobile section ----------------- */}

          {window.screen.width < 600 && (
            <section
              className="creator_details_new_service_page"
              onClick={() => {
                mixpanel.track("Clicked Creators profile on service page", {
                  service: slug,
                  user: UserDetails ? UserDetails : "",
                  creator: serviceInfo?.service?.c_id?.slug,
                });
                navigate(`/${serviceInfo?.service?.c_id?.slug}`);
              }}
            >
              <LazyLoadImage
                src={serviceInfo?.creator?.profile}
                alt={serviceInfo?.creator?.name}
                onError={({ currentTarget }) => {
                  currentTarget.onerror = null; // prevents looping
                  currentTarget.src = PNGIMG;
                }}
              />
              <div>
                <h3>{serviceInfo?.creator?.name}</h3>
                <p>{serviceInfo?.creator?.tagLine}</p>
              </div>

              {creatorRatingData && (
                <span>
                  {" "}
                  <RiStarSFill size={16} color="rgba(255, 214, 0, 1)" />{" "}
                  {creatorRatingData}/5
                </span>
              )}
            </section>
          )}

          {/* More services section ----------------- */}

          <Suspense>
            {services?.res?.filter((e) => {
              return e?.status === 1 && e?.slug !== slug;
            })?.length !== 0 &&
              localStorage.getItem("jwtToken") && (
                <MoreServices
                  data={services?.res
                    ?.filter((e1) => {
                      return e1?.status === 1 && e1.slug !== slug;
                    })
                    .sort((a, b) => {
                      return b?.downloads - a?.downloads;
                    })
                    ?.sort((a, b) => {
                      return b?.smrp - a?.smrp;
                    })}
                />
              )}
          </Suspense>

          {/* User Review Section for desktop ---------------- */}
          <Suspense>
            {window.screen.width > 600 &&
              feedbacks?.filter((e) => e?.status === 1)?.length !== 0 && (
                <ReviewsSection
                  data={feedbacks?.filter((e) => e?.status === 1)}
                />
              )}
          </Suspense>
        </div>

        {/* Cta for mobile screen ------------------ */}

        {window.screen.width < 600 && (
          <section className="mobile_cta_section_new_service_page">
            <div>
              {/* <span className="text_type_05_new_service_page">
                30 people accessed this in last 7 days.
              </span> */}

              {serviceInfo?.service?.isPaid && (
                <h3 className="text_type_04_new_service_page">
                  ₹ {serviceInfo?.service?.ssp}
                  <span style={{ marginLeft: "8px" }}>₹</span>{" "}
                  <span style={{ textDecorationLine: "line-through" }}>
                    {serviceInfo?.service?.smrp}
                  </span>
                </h3>
              )}
            </div>

            <button
              className="new_service_page_button_one"
              onClick={() => {
                alreadyOrderPlaced ? goToDashboardClick() : downloadService();
              }}
              disabled={paymentProcessing}
            >
              {alreadyOrderPlaced
                ? "Go to Dashboard"
                : paymentProcessing
                ? "Processing..."
                : serviceInfo?.service?.isPaid
                ? "Get Access"
                : "Free Access"}
              <AiOutlineArrowRight />
            </button>
          </section>
        )}

        <Footer3 />
      </div>

      {/* SEO friendly changes ----------------- */}
      <Seo
        title={`${serviceInfo?.service?.sname} by ${serviceInfo?.creator?.name}`}
        description={serviceInfo?.service?.ldesc}
        imgUrl={serviceInfo?.service?.simg}
      />

      <ToastContainer theme="dark" />
    </>
  );
}

export default ServicePage;
