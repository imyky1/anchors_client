import Hamburger from "hamburger-react";
import mixpanel from "mixpanel-browser";
import React, { useContext, useEffect, useState } from "react";
import "./Service.css";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import UserLogin from "../../../Login/Users/User_login";
import Footer2 from "../../../Footer/Footer2";
import { AiFillStar } from "react-icons/ai";
import ServiceContext from "../../../../Context/services/serviceContext";
import fire from "./icons/fire.svg";
import doc from "./icons/doc.svg";
import StarIcon from "./icons/star.svg";
import DocsIcon from "./icons/Icondocs.svg";
import SheetIcon from "./icons/Iconsheet.svg";
import VideoIcon from "./icons/Iconvideo.svg";
import GiftIcon from "./icons/Icongift.svg";
import FlashIcon from "./icons/Iconflash.svg";
import GotoArrow from "./icons/goto.svg";
import { creatorContext } from "../../../../Context/CreatorState";
import { SuperSEO } from "react-super-seo";
import { feedbackcontext } from "../../../../Context/FeedbackState";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { ToastContainer, toast } from "react-toastify";
import { paymentContext } from "../../../../Context/PaymentState";
import { userContext } from "../../../../Context/UserState";

function Service() {
  const location = useLocation();
  const navigate = useNavigate();
  const { slug } = useParams();

  // States used --------------------
  const [openModel, setOpenModel] = useState(false); // controlls user login modal
  const [openUserMenu, setOpenUserMenu] = useState(false); // ham and down arrow menu in navbar
  const [openCTANav, setOpenCTANav] = useState(false); // desktop bottom bar controller
  const [UserDetails, setUserDetails] = useState();       // stores the user data
  const [paymentProcessing, setPaymentProcessing] = useState(false); // if payment is processig
  const [openModelDownload, setOpenModelDownload] = useState(false); // for the thanks model after download
  const [alreadyOrderPlaced, setAlreadyOrderPlaced] = useState(false); // already user order placed or not

  // states -----------------------------------------
  const [showMore, setShowMore] = useState({
    resources: false,
    reviews: false,
  });

  // contexts --------------------------
  const { serviceInfo, getserviceinfo, services, getallservicesusingid } =
    useContext(ServiceContext);
  const { basicCdata, getBasicCreatorInfo, basicCreatorInfo } =
    useContext(creatorContext);
  const { checkFBlatest, getallfeedback, feedbacks } =
    useContext(feedbackcontext);
  const { createRazorpayClientSecret, razorpay_key, checkfororder } =
    useContext(paymentContext);
  const { userPlaceOrder, checkSubscriber, getUserDetails } =
    useContext(userContext);

  //Scroll to top automatically ---------------------------------------------
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

  // to open the CTA in desktop page while scrolling
  const handleScroll = () => {
    let doc = document.querySelector(".download_button_service_page");
    if (window.scrollY > doc?.clientHeight) {
      setOpenCTANav(true);
    } else {
      setOpenCTANav(false);
    }
  };

  document.addEventListener("scroll", handleScroll);

  // getting the service data
  useEffect(() => {
    getserviceinfo(slug).then((id) => {
      // getting service data
      getBasicCreatorInfo(id[0]); // getting the creator's data
      getallfeedback(id[0]); // getting the user reviews
      getallservicesusingid(id[0]); // getting the more resources
    });
  }, []);

  // filling some data in the page------------------
  useEffect(() => {
    if (document.querySelectorAll("#large_desc_service_page")[0]) {
      document.querySelectorAll("#large_desc_service_page")[0].innerHTML =
        serviceInfo?.ldesc;
    }

    if (document.querySelectorAll("#short_desc_service_page")[0]) {
      document.querySelectorAll("#short_desc_service_page")[0].innerHTML =
        serviceInfo?.sdesc;
    }
  }, [serviceInfo]);

  // getting user data,feedbacks and many function to run on user login ----------------
  useEffect(() => {
    if (
      localStorage.getItem("jwtToken") &&
      localStorage.getItem("isUser") === "true"
    ) {
      // checks if order is already placed or not
      serviceInfo &&
        checkfororder(
          serviceInfo?._id,
          localStorage.getItem("isUser") === "true" ? "user" : "creator"
        ).then((e) => {
          setAlreadyOrderPlaced(e);
        });

      // get user details for mixpanel
      getUserDetails().then((e) => {
        if (e.success) {
          setUserDetails(e?.user);
        }
      });
    }
  }, [localStorage.getItem("jwtToken"), serviceInfo]);


  // Used functions----------------------------------------------------------------

  const userlogout = () => {
    navigate("/logout");
  };

  const orderPlacingThroughRazorpay = async () => {
    const order = await createRazorpayClientSecret(serviceInfo?.ssp);
    const key = await razorpay_key();

    var options = {
      key, // Enter the Key ID generated from the Dashboard
      amount: order.amount, // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
      currency: "INR",
      name: "anchors", //your business name
      description: `Payment for Buying - ${serviceInfo?.sname}`,
      image: require("./logo.png"),
      order_id: order?.id, //This is a sample Order ID. Pass the `id` obtained in the response of Step 1
      callback_url: "https://eneqd3r9zrjok.x.pipedream.net/",
      prefill: {
        name: UserDetails?.name, //your customer's name
        email: UserDetails?.email
      },
      notes: {
        address: "https://www.anchors.in",
      },
      modal: {
        ondismiss: function () {
          toast.info(
            "It is a paid service, for using it you have to pay the one time payment",
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
    razor.open();
  };

  const downloadService = async (e) => {
    e?.preventDefault();
    const ext = serviceInfo.surl?.split(".").at(-1);
    if (localStorage.getItem("jwtToken")) {
      if (serviceInfo?.isPaid) {
        checkfororder(
          serviceInfo?._id,
          localStorage.getItem("isUser") === "true" ? "user" : "creator"
        ).then((e) => {
          if (e) {
            // user already paid for the order
            // previewing the pdf as popup ----------------------------
            if (ext === "pdf") {
              sessionStorage.setItem("link", serviceInfo.surl);
              window.open("/viewPdf");
              setPaymentProcessing(false);
            } else {
              // downloading the rest files extensions------------------------------
              let link = document.createElement("a");
              link.href = serviceInfo.surl;
              //link.target = "_blank";
              link.download = serviceInfo?.sname;
              link.dispatchEvent(new MouseEvent("click"));
            }
            setOpenModelDownload(true);

            mixpanel.track("Downloaded Paid Service for more than once", {
              service: slug,
              //user: UserDetails ? UserDetails : "",
              amount: serviceInfo?.ssp,
              creator: basicCdata?.slug,
            });
          } else {
            console.log("Calling razorpay");
            //orderPlacingThroughRazorpay();
          }
        });
      } else {
        setPaymentProcessing(true);
        const success = await userPlaceOrder(
          serviceInfo.ssp,
          1,
          serviceInfo._id,
          basicCreatorInfo.creatorID,
          0,
          0,
          localStorage.getItem("isUser") === "true" ? "user" : "creator"
        );
        if (success) {
          // previewing the pdf as popup ----------------------------
          if (ext === "pdf") {
            sessionStorage.setItem("link", serviceInfo.surl);
            window.open("/viewPdf");
            setPaymentProcessing(false);
          } else {
            // downloading the rest files------------------------------
            let link = document.createElement("a");
            link.href = serviceInfo.surl;
            link.download = serviceInfo?.sname;
            //link.target = "_blank";
            link.dispatchEvent(new MouseEvent("click"));
          }

          setOpenModelDownload(true);
          mixpanel.track("Downloaded Service", {
            service: slug,
            //user: UserDetails ? UserDetails : "",
            creator: basicCdata?.slug,
          });
        } else {
          toast.error(
            "Order not Placed Due to some error, Please try again!!!",
            {
              position: "top-center",
              autoClose: 3000,
            }
          );
        }
        setPaymentProcessing(false);
      }
    } else {
      mixpanel.track("Clicked Download Service Without Login", {
        service: slug,
        //user: UserDetails ? UserDetails : "",
        creator: basicCdata?.slug,
      });
      return setOpenModel(true);
    }
  };

  return (
    <>
      <UserLogin
        open={openModel}
        onClose={() => {
          setOpenModel(false);
        }}
      />

      <div className="service_page_main_wrapper">
        {/* Header of creator profile as well as service page-------------------------------------------------------------------------------------------- */}
        <section className="top_header_creator_profile">
          {window.screen.width > 550 ? (
            <img
              className="logo_main_page"
              src={require("../../../Main Page/Images/logo-beta.png")}
              alt=""
            />
          ) : (
            <img
              className="logo_main_page"
              src={require("./anchors_logo.jpg")}
              alt=""
            />
          )}
          {localStorage.getItem("isUser") !== "" &&
            (!localStorage.getItem("jwtToken") ? (
              <button
                onClick={() => {
                  mixpanel.track("Clicked Login button on service page", {
                    service: slug,
                  });
                  setOpenModel(true);
                }}
              >
                Signup
              </button>
            ) : (
              <span>
                {localStorage.getItem("user")?.slice(0, 12) ===
                localStorage.getItem("user")
                  ? localStorage.getItem("user")
                  : localStorage.getItem("user")?.slice(0, 12) + ".."}
                &nbsp;
                {window.screen.width > 700 ? (
                  <i
                    className="fa-solid fa-caret-down"
                    style={{ cursor: "pointer" }}
                    onClick={() => {
                      setOpenUserMenu(!openUserMenu);
                    }}
                  ></i>
                ) : (
                  <Hamburger
                    className="hamburger-react"
                    size={20}
                    onToggle={(toggled) => {
                      if (toggled) {
                        setOpenUserMenu(true);
                      } else {
                        setOpenUserMenu(false);
                        // close a menu
                      }
                    }}
                  />
                )}
                {window.screen.width > 700
                  ? openUserMenu && (
                      <button
                        className="logout_button_header"
                        onClick={userlogout}
                      >
                        Logout
                      </button>
                    )
                  : openUserMenu && (
                      <ul className="hamburger_menu_profile">
                        <li className="hamburger_item" onClick={userlogout}>
                          Logout
                        </li>
                      </ul>
                    )}
              </span>
            ))}
        </section>

        {/* Remaining service Page details */}
        <section className="service_page_alldata">
          {/* Main service image */}
          <img src={serviceInfo?.simg} alt="" />

          <div className="service_page_seperation">
            {/* text serviced details  */}
            <section className="left_side_service_details">
              <div>
                <h1 className="service_details_text_type01">
                  {serviceInfo?.sname}
                </h1>
                <div className="tags_service_details">
                  <span>
                    <img src={doc} alt="" /> Document
                  </span>
                  <span>
                    <img src={fire} alt="" /> Premium
                  </span>
                </div>
              </div>

              {/* creator profile for mobile ---------------------------- */}
              {window.screen.width < 600 && (
                <div>
                  <h2 className="service_details_text_type02">Service By</h2>
                  <section className="creator_profile_in_mobile">
                    <div
                      className="creator_profile_service_page"
                      onClick={() => {
                        navigate(`/c/${basicCdata?.slug}`);
                      }}
                    >
                      <img src={basicCreatorInfo?.profile} alt="" />
                      <div>
                        <span className="service_details_text_type11">
                          {basicCreatorInfo?.name}
                        </span>
                        <p className="service_details_text_type12">
                          {basicCreatorInfo?.tagLine?.length > 70
                            ? basicCreatorInfo?.tagLine?.slice(0, 70) + "..."
                            : basicCreatorInfo?.tagLine}
                        </p>
                      </div>
                    </div>
                    <span
                      className="service_details_text_type12"
                      style={{ backgroundColor: "white", padding: "3px 5px" }}
                    >
                      <AiFillStar
                        color="#FFC300"
                        size={15}
                        style={{ marginRight: "4px" }}
                      />{" "}
                      4.5 (122)
                    </span>
                  </section>
                </div>
              )}

              <div>
                <h2 className="service_details_text_type02">
                  Resource Description
                </h2>
                <span
                  className="service_details_text_type03"
                  id="large_desc_service_page"
                >
                  {/* filling data from api */}
                </span>
                {/* <span className="service_page_read_info">Read More</span> */}
              </div>

              {serviceInfo?.sdesc && (
                <div>
                  <h2 className="service_details_text_type02">
                    Additional Information
                  </h2>
                  <span
                    className="service_details_text_type03"
                    id="short_desc_service_page"
                  >
                    {/* Filling data through api */}
                  </span>
                  {/* <span className="service_page_read_info">Read More</span> */}
                </div>
              )}

              <br />
              {window.screen.width > 600 && <br />}
              <div className="tags_service_page02">
                {serviceInfo?.tags?.map((e, i) => {
                  if (i > 4) {
                    return;
                  }
                  return (
                    <span className="service_details_text_type04" key={i}>
                      {e}
                    </span>
                  );
                })}
              </div>
            </section>

            {window.screen.width > 650 && (
              <section className="right_side_service_details">
                <div className="price_section_right_side">
                  <span
                    className="service_details_text_type07"
                    style={{ textDecoration: "none", cursor: "unset" }}
                  >
                    Price
                  </span>
                  {serviceInfo?.isPaid ? (
                    <span className="price_description_Service_page">
                      <div>
                        <span className="service_details_text_type08">
                          ₹ {serviceInfo?.ssp}
                        </span>
                        {parseInt(serviceInfo?.ssp) !==
                          parseInt(serviceInfo?.smrp) && (
                          <span className="service_details_text_type09">
                            ₹ {serviceInfo?.smrp}
                          </span>
                        )}
                      </div>
                      {parseInt(serviceInfo?.ssp) !==
                        parseInt(serviceInfo?.smrp) && (
                        <span className="service_details_text_type10">
                          Discounted Price
                        </span>
                      )}
                    </span>
                  ) : (
                    <span className="free_price_secription_service_page">
                      FREE
                    </span>
                  )}
                </div>

                <div>
                  <button
                    className="download_button_service_page"
                    onClick={() => {
                      alreadyOrderPlaced ? navigate("/") : downloadService();
                    }}
                    disabled={paymentProcessing}
                  >
                    {alreadyOrderPlaced
                      ? "Go to Dashboard"
                      : paymentProcessing
                      ? "Processing"
                      : "Get Access"}
                  </button>
                </div>

                <div
                  style={{
                    borderBottom: "0.3px dashed #000000",
                    paddingBottom: "20px",
                  }}
                >
                  <span className="service_details_text_type05">
                    Get this Service{" "}
                  </span>
                  <p className="service_details_text_type06">
                    Download or live preview this document and get the access to
                    explore more{" "}
                  </p>
                  <span className="service_details_text_type07">
                    Preview Now
                  </span>
                </div>

                <div
                  className="creator_profile_service_page"
                  onClick={() => {
                    navigate(`/c/${basicCdata?.slug}`);
                  }}
                >
                  <img src={basicCreatorInfo?.profile} alt="" />
                  <div>
                    <span className="service_details_text_type11">
                      {basicCreatorInfo?.name}
                    </span>
                    <p className="service_details_text_type12">
                      {basicCreatorInfo?.tagLine?.length > 70
                        ? basicCreatorInfo?.tagLine?.slice(0, 70) + "..."
                        : basicCreatorInfo?.tagLine}
                    </p>
                    <span className="service_details_text_type12">
                      <AiFillStar
                        color="#FFC300"
                        size={15}
                        style={{ marginRight: "4px" }}
                      />{" "}
                      4.5 (122)
                    </span>
                  </div>
                </div>
              </section>
            )}
          </div>

          {/* reviews of creator --------------------- */}
          {feedbacks?.filter((e) => e.status === 1)?.length !== 0 && (
            <div className="user_reviews_service_page">
              <h2 className="service_details_text_type02">User Reviews</h2>
              <div>
                {(showMore?.reviews
                  ? feedbacks?.filter((e) => e.status === 1)
                  : feedbacks?.filter((e) => e.status === 1).slice(0, 4)
                )?.map((e2, index) => {
                  return (
                    <div
                      className="user_review_boxes_creator_profile"
                      key={index}
                      style={
                        window.screen.width > 600
                          ? {
                              backgroundColor: "white",
                              boxShadow: "0px 6px 16px rgba(0, 0, 0, 0.1)",
                            }
                          : { backgroundColor: "white" }
                      }
                    >
                      <div className="user_profile_review_box">
                        <LazyLoadImage
                          src={e2?.photo}
                          alt=""
                          onError={({ currentTarget }) => {
                            currentTarget.onerror = null; // prevents looping
                            currentTarget.src =
                              "data:image/png;base64,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";
                          }}
                          className="user_profile_pic"
                        />
                        <section>
                          <span className="text_type_09_creator_profile">
                            {e2?.name
                              ? e2?.name.length > 10
                                ? e2?.name.slice(0, 10) + ".."
                                : e2?.name
                              : "--"}
                          </span>
                          <div className="review_stars_on_profile">
                            {Array(e2?.rating)
                              .fill("a")
                              ?.map((e, i) => {
                                return <img src={StarIcon} alt="" key={i} />;
                              })}
                          </div>
                        </section>
                      </div>

                      <p className="text_type_10_creator_profile">
                        {e2?.desc.length > 100
                          ? e2?.desc?.slice(0, 100) + "..."
                          : e2?.desc}
                      </p>
                    </div>
                  );
                })}
              </div>

              {feedbacks?.filter((e) => e.status === 1)?.length > 4 && (
                <section className="More_or_less_section">
                  <span
                    onClick={() => {
                      setShowMore({ ...showMore, reviews: !showMore.reviews });
                    }}
                  >
                    {showMore?.reviews ? "Less" : "More"}
                  </span>
                </section>
              )}
            </div>
          )}

          {/* creator resources ------------------ */}
          {services?.res?.filter((e) => {
            return e?.status === 1 && e?.slug !== slug;
          })?.length !== 0 && (
            <div className="creator_resources_service_page">
              <section>
                <span className="service_details_text_type02">
                  More Services
                </span>
                <img
                  src={GotoArrow}
                  alt=""
                  onClick={() => {
                    navigate(`/c/${basicCdata?.slug}#resources`);
                  }}
                />
              </section>
              <div>
                {services.res
                  ?.filter((e1) => {
                    return e1.status === 1 && e1.slug !== slug;
                  })
                  ?.slice(0, 3)
                  ?.map((e) => {
                    return (
                      <div
                        className={`resources_boxes_creator_profile`}
                        key={e._id}
                        style={
                          window?.screen.width > 600
                            ? {
                                background: "#FFFFFF",
                                border: "2px solid #000000",
                                boxShadow: "6px 6px 0px #000000",
                                borderRadius: "16px",
                              }
                            : { background: "#FFFFFF" }
                        }
                        onClick={() => {
                          window.open(`/newservice/${e?.slug}`, "_self");
                        }}
                      >
                        <div style={{ display: "flex" }}>
                          <img
                            src={
                              e?.stype === 1
                                ? SheetIcon
                                : e?.stype === 2
                                ? VideoIcon
                                : DocsIcon
                            }
                            alt=""
                            className="icon_resources_creator_profile"
                          />{" "}
                          {window.screen.width < 550 && (
                            <span className="text_type_07_creator_profile">
                              {e?.stype === 1
                                ? "Excel Sheet"
                                : e?.stype === 2
                                ? "Video"
                                : "Document"}
                            </span>
                          )}{" "}
                        </div>
                        <p className="text_type_06_creator_profile">
                          {e?.sname}
                        </p>
                        {window.screen.width > 550 && (
                          <span className="text_type_07_creator_profile">
                            {e?.stype === 1
                              ? "Excel Sheet"
                              : e?.stype === 2
                              ? "Video"
                              : "Document"}
                          </span>
                        )}
                        <section>
                          <div className="extra_resource_info">
                            <span className="text_type_08_creator_profile">
                              <img src={FlashIcon} alt="" />{" "}
                              {e?.downloads ? e?.downloads : 40} Downloads
                            </span>
                            <span className="text_type_08_creator_profile">
                              <img src={GiftIcon} alt="" />{" "}
                              {e?.isPaid ? "Paid" : "Free"}
                            </span>
                          </div>
                          <button>
                            Explore{" "}
                            {window.screen.width < 550 && (
                              <i class="fa-solid fa-arrow-right"></i>
                            )}
                          </button>
                        </section>
                      </div>
                    );
                  })}
              </div>
            </div>
          )}
        </section>

        {/* Floating or fixed CTA button + details */}
        {window.screen.width < 600 ? (
          <section className="cta_service_details_mobile">
            <span className="service_details_text_type13">Live Preview</span>

            <div>
              <p>
                {serviceInfo?.isPaid && <span>{serviceInfo?.smrp}</span>}
                {serviceInfo?.isPaid ? "₹" + serviceInfo?.ssp : "Free"}
              </p>
              <span
                onClick={() => {
                  alreadyOrderPlaced ? navigate("/") : downloadService();
                }}
                disabled={paymentProcessing}
              >
                {alreadyOrderPlaced
                  ? "Go to Dashboard"
                  : paymentProcessing
                  ? "Processing"
                  : "Get Access"}
              </span>
            </div>
          </section>
        ) : (
          openCTANav && (
            <section className="cta_service_details_desktop">
              <div>
                <span className="service_details_text_type14">
                  {serviceInfo?.sname}
                </span>
                <p className="service_details_text_type15">
                  Document | By&nbsp;
                  <span
                    style={{ textTransform: "upperCase", letterSpacing: "3px" }}
                  >
                    {basicCreatorInfo?.name}
                  </span>{" "}
                  &nbsp;&nbsp; <b>4.2</b> &nbsp;
                  <AiFillStar />
                </p>
              </div>

              <div>
                {serviceInfo?.isPaid ? (
                  <span className="price_description_Service_page">
                    <div>
                      <span className="service_details_text_type08">
                        ₹ {serviceInfo?.ssp}
                      </span>
                      {parseInt(serviceInfo?.ssp) !==
                        parseInt(serviceInfo?.smrp) && (
                        <span className="service_details_text_type09">
                          ₹ {serviceInfo?.smrp}
                        </span>
                      )}
                    </div>
                    {parseInt(serviceInfo?.ssp) !==
                      parseInt(serviceInfo?.smrp) && (
                      <span className="service_details_text_type10">
                        Discounted Price
                      </span>
                    )}
                  </span>
                ) : (
                  <span className="free_price_secription_service_page">
                    FREE
                  </span>
                )}
                <button
                  onClick={() => {
                    alreadyOrderPlaced ? navigate("/") : downloadService();
                  }}
                  disabled={paymentProcessing}
                >
                  {alreadyOrderPlaced
                    ? "Go to Dashboard"
                    : paymentProcessing
                    ? "Processing"
                    : "Get Access"}
                </button>
              </div>
            </section>
          )
        )}
      </div>

      <Footer2 />

      <div className="extra_space_in_last"></div>

      <SuperSEO
        title={`anchors - ${serviceInfo && serviceInfo?.sname} `}
        description={serviceInfo?.ldesc}
        lang="en"
        openGraph={{
          ogImage: {
            ogImage: serviceInfo?.simg,
            ogImageAlt: serviceInfo?.sname,
            ogImageWidth: 1200,
            ogImageHeight: 630,
            ogImageType: "image/jpeg",
          },
        }}
        twitter={{
          twitterSummaryCard: {
            summaryCardImage: serviceInfo?.simg,
            summaryCardImageAlt: serviceInfo?.sname,
            summaryCardSiteUsername: basicCdata?.name,
          },
        }}
      />
      <ToastContainer/>
    </>
  );
}

export default Service;
