import React, {
  Suspense,
  lazy,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { Navbar2 } from "../../Components/Layouts/Navbar User/Navbar";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import ServiceContext from "../../Context/services/serviceContext";
import { feedbackcontext } from "../../Context/FeedbackState";
import "./Service.css";
import { Footer3 } from "../../Components/Footer/Footer2";
import PNGIMG from "../../Utils/Images/default_user.png";

// icons ---------
import { IoIosArrowRoundForward, IoMdStar } from "react-icons/io";
import { CiLinkedin } from "react-icons/ci";
import {
  FaInstagram,
  FaRegFileExcel,
  FaRegFilePdf,
  FaTelegram,
} from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { IoBookOutline, IoTrendingUpOutline } from "react-icons/io5";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { RxDownload } from "react-icons/rx";
import mixpanel from "mixpanel-browser";
import { userContext } from "../../Context/UserState";
import { paymentContext } from "../../Context/PaymentState";
import { ToastContainer, toast } from "react-toastify";
import Seo from "../../Utils/Seo";
import { LoadThree } from "../../Components/Modals/Loading";
import Thanks2 from "../../Components/Modals/Thanks";
import { RiShareForwardFill } from "react-icons/ri";

// Code Splitiing the imports ----------------
const MoreServices = lazy(() =>
  import("../../Components/Editor/New UI/Service Page/Components/MoreServices")
);
const ReviewsSection = lazy(() =>
  import(
    "../../Components/Editor/New UI/Service Page/Components/ReviewsSection"
  )
);

const CreatorCard = ({
  name,
  profile,
  tagLine,
  creatorRatingData,
  slug,
  cslug,
  linkedInLink,
  twitterLink,
  fbLink,
  teleLink,
  instaLink,
  ytLink,
}) => {
  const navigate = useNavigate();

  return (
    <div className="creator_card_service_page_wrapper">
      <section>
        <LazyLoadImage
          src={profile}
          alt={name}
          onError={({ currentTarget }) => {
            currentTarget.onerror = null; // prevents looping
            currentTarget.src = PNGIMG;
          }}
        />

        <section>
          <span>{name}</span>
          {window.screen.width < 600 && <p>{tagLine}</p>}
        </section>

        <div>
          <IoMdStar />
          {creatorRatingData}/5
        </div>
      </section>

      {window.screen.width > 600 && <p>{tagLine}</p>}

      <div>
        {linkedInLink && (
          <CiLinkedin
            onClick={() => {
              window.open(linkedInLink);
              mixpanel.track("Clicked linkedInLink on service page", {
                creator: cslug,
              });
            }}
          />
        )}
        {instaLink && (
          <FaInstagram
            onClick={() => {
              window.open(instaLink);
              mixpanel.track("Clicked instaLink on service page", {
                creator: cslug,
              });
            }}
          />
        )}
        {twitterLink && (
          <FaXTwitter
            onClick={() => {
              window.open(twitterLink);
              mixpanel.track("Clicked twitterLink on service page", {
                creator: cslug,
              });
            }}
          />
        )}
        {teleLink && (
          <FaTelegram
            onClick={() => {
              window.open(teleLink);
              mixpanel.track("Clicked teleLink on service page", {
                creator: cslug,
              });
            }}
          />
        )}
      </div>

      <button
        onClick={() => {
          mixpanel.track("Clicked Creators profile on service page", {
            service: slug,
            creator: cslug,
          });
          navigate(`/${cslug}`);
        }}
      >
        Explore more about Creator <IoIosArrowRoundForward size={24} />
      </button>
    </div>
  );
};

const Service = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { slug } = useParams();

  // refs

  const ldescServicePage = useRef(null);

  // states ------------------------------
  const [openModel, setOpenModel] = useState(false);
  const [loader, setLoader] = useState(false); // loader states
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

  const { userPlaceOrder, getUserDetails } = useContext(userContext);

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
    if (ldescServicePage.current) {
      ldescServicePage.current.innerHTML = serviceInfo?.service?.ldesc;
    }

    // eslint-disable-next-line
  }, [serviceInfo]);

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

      {/* Thanks Modal popup ------------------------- */}
      <Thanks2
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

      <div className="new_service_page_outside_wrapper">
        <Navbar2
          slug={serviceInfo?.service?.c_id?.slug}
          open={openModel}
          backgroundDark={true}
          close={() => {
            setOpenModel(false);
          }}
        />

        <section>
          {/* floater -------------------------- */}

          {window.screen.width < 600 && (
            <section
              className="floater_service_page_wrapper"
              onClick={() => {
                alreadyOrderPlaced ? goToDashboardClick() : downloadService();
              }}
              disabled={paymentProcessing}
            >
              <section>
                {serviceInfo?.service?.downloads > 10 && (
                  <p>
                    <IoTrendingUpOutline /> Purchased by{" "}
                    {serviceInfo?.service?.downloads} people
                  </p>
                )}

                <span>
                  {alreadyOrderPlaced
                    ? "Go to Dashboard"
                    : paymentProcessing
                    ? "Processing..."
                    : "Get Access"}
                </span>
              </section>

              <div>
                {serviceInfo?.service?.isPaid ? (
                  <>
                    {" "}
                    ₹ {serviceInfo?.service?.ssp}
                    <span style={{ textDecoration: "line-through" }}>
                      {serviceInfo?.service?.smrp}
                    </span>
                  </>
                ) : (
                  "Free"
                )}
                <IoIosArrowRoundForward />
              </div>
            </section>
          )}

          {/* left side section ------------------------- */}
          <div className="left_side_service_page_hoc">
            {window.screen.width < 600 && (
              <h2 className="text03_new_service_page">About Creator</h2>
            )}
            <CreatorCard
              {...serviceInfo?.creator}
              creatorRatingData={creatorRatingData}
              slug={slug}
              cslug={serviceInfo?.service?.c_id?.slug}
            />
          </div>

          {/* right side section ------------------------- */}
          <div className="right_side_service_page_hoc">
            <section className="service_page_banner_wrapper">
              <LazyLoadImage
                src={
                  window.screen.width < 600
                    ? serviceInfo?.service?.mobileSimg ??
                      serviceInfo?.service?.simg
                    : serviceInfo?.service?.simg
                }
                alt="servicebanner"
              />

              <span>
                {serviceInfo?.service?.stype === 1 ? (
                  <FaRegFileExcel />
                ) : (
                  <FaRegFilePdf />
                )}
              </span>

              <div
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
                <RiShareForwardFill />
              </div>
            </section>

            <div>
              {serviceInfo?.service?.downloads > 10 && (
                <p className="text02_new_service_page">
                  <IoTrendingUpOutline /> Purchased by{" "}
                  {serviceInfo?.service?.downloads} people
                </p>
              )}

              <h1 className="text01_new_service_page">
                {serviceInfo?.service?.sname}
              </h1>

              <div className="tags_new_service_page_wrapper">
                <div>
                  <IoBookOutline />

                  <section>
                    <span>Content Type</span>
                    <p>
                      {serviceInfo?.service?.stype === 1
                        ? "Excel"
                        : serviceInfo?.service?.stype === 2
                        ? "Video"
                        : "Document"}
                    </p>
                  </section>
                </div>
                <div>
                  <RxDownload />

                  <section>
                    <span>Download</span>
                    <p>
                      {serviceInfo?.service?.allowDownload
                        ? "Allowed"
                        : "Not Allowed"}
                    </p>
                  </section>
                </div>
                {serviceInfo?.service?.noOfPages ? (
                  <div>
                    <IoBookOutline />

                    <section>
                      <span>Number of pages</span>
                      <p>{serviceInfo?.service?.noOfPages}</p>
                    </section>
                  </div>
                ) : (
                  ""
                )}
              </div>

              <div className="desc_section_wrapper_service_page">
                <h2 className="text03_new_service_page">
                  Resource Description
                </h2>

                <p
                  className="text04_new_service_page"
                  ref={ldescServicePage}
                ></p>
              </div>
            </div>

            <section className="extra_sections_wrapper_service_page">
              {/* More services section ----------------- */}

              <Suspense>
                {services?.res?.filter((e) => {
                  return e?.status === 1 && e?.slug !== slug;
                })?.length !== 0 &&
                  localStorage.getItem("jwtToken") && (
                    <MoreServices
                      background="#14181f"
                      cardBackground="#171e25"
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
                      background="#14181f"
                      cardBackground="#171e25"
                      data={feedbacks?.filter((e) => e?.status === 1)}
                    />
                  )}
              </Suspense>
            </section>

            {/* floater -------------------------- */}

            {window.screen.width > 600 && (
              <section
                className="floater_service_page_wrapper"
                onClick={() => {
                  alreadyOrderPlaced ? goToDashboardClick() : downloadService();
                }}
                disabled={paymentProcessing}
              >
                <section>
                  {serviceInfo?.service?.downloads > 10 && (
                    <p>
                      <IoTrendingUpOutline /> Purchased by{" "}
                      {serviceInfo?.service?.downloads} people
                    </p>
                  )}

                  <span>
                    {alreadyOrderPlaced
                      ? "Go to Dashboard"
                      : paymentProcessing
                      ? "Processing..."
                      : "Get Access"}
                  </span>
                </section>

                <div>
                  {serviceInfo?.service?.isPaid ? (
                    <>
                      {" "}
                      ₹ {serviceInfo?.service?.ssp}
                      <span style={{ textDecoration: "line-through" }}>
                        {serviceInfo?.service?.smrp}
                      </span>
                    </>
                  ) : (
                    "Free"
                  )}
                  <IoIosArrowRoundForward />
                </div>
              </section>
            )}
          </div>
        </section>

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
};

export default Service;
