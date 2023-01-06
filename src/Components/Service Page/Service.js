import React, { useContext, useEffect, useState } from "react";
import "./Service.css";
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
import Footer from "../Footer/Footer.js";
import { SuperSEO } from "react-super-seo";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, Pagination } from "swiper";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { LazyLoadImage } from "react-lazy-load-image-component";

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
  const [UserDetails, setUserDetails] = useState();
  const [FBserviceType, setFBserviceType] = useState(); // type of service in feedback
  const [openModelDownload, setOpenModelDownload] = useState(false);
  const [paymentProcessing, setPaymentProcessing] = useState(false);

  const [alreadyOrderPlaced, setAlreadyOrderPlaced] = useState(false);
  const {
    serviceInfo,
    getserviceinfo,
    services,
    getallservicesusingid,
    getserviceusingid,
    getworkshopusingid,
    getOneHourDownloads,
  } = context;
  const { basicCdata, getBasicCreatorInfo, basicCreatorInfo } =
    useContext(creatorContext);
  const { userPlaceOrder, checkSubscriber, getUserDetails } =
    useContext(userContext);
  const { checkFBlatest, getallfeedback, feedbacks } =
    useContext(feedbackcontext);

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
      const id = await getserviceinfo(slug);
      await getBasicCreatorInfo(id[0]);
      await getallfeedback(id[0]);
      await getallservicesusingid(id[0]);
      localStorage.getItem("isUser") !== "" &&
        checkfororder(
          // checks if order is already placed or not
          serviceInfo?._id
        ).then((e) => {
          setAlreadyOrderPlaced(e);
        });
    };
    mixpanel.track("Page Visit", {
      user: UserDetails ? UserDetails : "",
      creator: basicCdata?.slug,
    });

    // reading the doucment

    process();
    // eslint-disable-next-line
  }, []);

  // responsible for feedback popup
  useEffect(() => {
    if (
      localStorage.getItem("jwtToken") &&
      localStorage.getItem("isUser") === "true"
    ) {
      checkfororder(
        // checks if order is already placed or not
        serviceInfo?._id
      ).then((e) => {
        setAlreadyOrderPlaced(e);
      });
      getUserDetails().then((e) => {
        if (e.success) {
          setUserDetails(e?.user?.email);
        }
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
    }
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

  const dox1 = document.getElementById("unsubscribe");
  const dox2 = document.getElementById("subscribe");

  setTimeout(() => {
    if (
      localStorage.getItem("isUser") === "true" &&
      localStorage.getItem("jwtToken")
    ) {
      checkSubscriber(basicCreatorInfo.creatorID).then((data) => {
        if (data && dox2 && dox1) {
          dox1.style.display = "none";
          dox2.style.display = "inline-block";
        }
      });
    }
  }, 100);

  const orderPlacing = () => {
    const ext = serviceInfo.surl?.split(".").at(-1);
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";

    script.onerror = () => {
      alert("Razorpay SDK Failed to load. Are you Online?");
    };

    script.onclose = script.onload = async () => {
      try {
        setPaymentProcessing(true);
        const order = await createRazorpayClientSecret(serviceInfo?.ssp);
        const key = await razorpay_key();
        const options = {
          key: key,
          amount: order.amount,
          currency: order.currency,
          name: "Anchors.in",
          description: `Payment for Buying - ${serviceInfo?.sname}`,
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
              serviceInfo?._id,
              basicCreatorInfo.creatorID,
              1,
              0,
              localStorage.getItem("isUser") === "true" ? "user" : "creator",
              razorpay_payment_id,
              razorpay_order_id,
              razorpay_signature
            );
            if (success) {
              setOpenModelDownload(true);
              if (ext === "pdf") {
                downloadFile("pdf").then(() => {});
                mixpanel.track("Downloaded paid pdf", {
                  service: slug,
                  user: UserDetails ? UserDetails : "",
                  amount: serviceInfo?.ssp,
                  creator: basicCdata?.slug,
                });
              } else if (ext === "mp4") {
                downloadFile("mp4").then(() => {});
                mixpanel.track("Downloaded paid pdf", {
                  service: slug,
                  user: UserDetails ? UserDetails : "",
                  amount: serviceInfo?.ssp,
                  creator: basicCdata?.slug,
                });
              } else {
                let link = document.createElement("a");
                link.href = serviceInfo.surl;
                link.target = "_blank";
                link.dispatchEvent(new MouseEvent("click"));
              }
              toast.info(
                "Check the Downloads in few seconds, if file not found raise an issue at ravi@anchors.in",
                {
                  position: "top-center",
                }
              );
              mixpanel.track("Downloaded Paid Service", {
                service: slug,
                user: UserDetails ? UserDetails : "",
                amount: serviceInfo?.ssp,
                creator: basicCdata?.slug,
              });
              setPaymentProcessing(false);
            } else {
              toast.error(
                "Order not Placed Due to some error, If your payment has been deducted then it would be refunded in 3-4 working days",
                {
                  position: "top-center",
                  autoClose: 3000,
                }
              );
              setPaymentProcessing(false);
            }
          },
          modal: {
            ondismiss: function () {
              toast.info(
                "It is a paid service, For downloading it you have to pay the one time payment",
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

  const downloadFile = (type) => {
    let oReq = new XMLHttpRequest();
    let URLToPDF = serviceInfo?.surl;
    oReq.open("GET", URLToPDF, true);
    oReq.setRequestHeader(
      "Access-Control-Allow-Origin",
      "http://www.anchors.in"
    );
    oReq.setRequestHeader("Access-Control-Allow-Methods", "GET");

    oReq.responseType = "blob";

    oReq.onload = function () {
      let file = new Blob([oReq.response], {
        type: `application/${type}`,
      });

      saveAs(file, `${serviceInfo?.sname}.${type}`);
    };
    oReq.send();
  };

  const download_service = async () => {
    const ext = serviceInfo.surl?.split(".").at(-1);
    if (localStorage.getItem("jwtToken")) {
      if (serviceInfo?.isPaid) {
        checkfororder(
          serviceInfo?._id,
          localStorage.getItem("isUser") === "true" ? "user" : "creator"
        ).then((e) => {
          if (e) {
            if (ext === "pdf") {
              downloadFile("pdf");
              mixpanel.track("Downloaded paid pdf again", {
                service: slug,
                user: UserDetails ? UserDetails : "",
                amount: serviceInfo?.ssp,
                creator: basicCdata?.slug,
              });
            } else if (ext === "mp4") {
              downloadFile("mp4");
              mixpanel.track("Downloaded paid pdf again", {
                service: slug,
                user: UserDetails ? UserDetails : "",
                amount: serviceInfo?.ssp,
                creator: basicCdata?.slug,
              });
            } else {
              let link = document.createElement("a");
              link.href = serviceInfo.surl;
              link.target = "_blank";
              link.dispatchEvent(new MouseEvent("click"));
            }
            setOpenModelDownload(true);
            toast.info(
              "Check the Downloads in few seconds, if file not found raise an issue at ravi@anchors.in",
              {
                position: "top-center",
              }
            );
            mixpanel.track("Downloaded Paid Service for more than once", {
              service: slug,
              user: UserDetails ? UserDetails : "",
              amount: serviceInfo?.ssp,
              creator: basicCdata?.slug,
            });
          } else {
            orderPlacing().then(() => {});
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
          setOpenModelDownload(true);
          if (ext === "pdf") {
            downloadFile("pdf");
            mixpanel.track("Downloaded pdf", {
              service: slug,
              user: UserDetails ? UserDetails : "",
              creator: basicCdata?.slug,
            });
          } else if (ext === "mp4") {
            downloadFile("mp4");
            mixpanel.track("Downloaded pdf", {
              service: slug,
              user: UserDetails ? UserDetails : "",
              creator: basicCdata?.slug,
            });
          } else {
            let link = document.createElement("a");
            link.href = serviceInfo.surl;
            link.target = "_blank";
            link.dispatchEvent(new MouseEvent("click"));
          }
          toast.info(
            "Check the Downloads in few seconds, if file not found raise an issue at ravi@anchors.in",
            {
              position: "top-center",
            }
          );
          mixpanel.track("Downloaded Service", {
            service: slug,
            user: UserDetails ? UserDetails : "",
            creator: basicCdata?.slug,
          });
        } else {
          toast.error("Order not Placed Due to some error", {
            position: "top-center",
            autoClose: 2000,
          });
        }
        setPaymentProcessing(false);
      }
    }
    //else if (
    //  localStorage.getItem("isUser") === "" &&
    //  localStorage.getItem("jwtToken")
    //) {
    //  setPaymentProcessing(true);
    //  if (ext === "pdf") {
    //    downloadFile("pdf");
    //  } else if (ext === "mp4") {
    //    downloadFile("mp4");
    //  } else {
    //    let link = document.createElement("a");
    //    link.href = serviceInfo.surl;
    //    link.target = "_blank";
    //    link.dispatchEvent(new MouseEvent("click"));
    //  }
    //  setPaymentProcessing(false);
    //}
    else {
      mixpanel.track("Clicked Download Service Without Login", {
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

  if (serviceInfo?.status === 0 || basicCdata?.status === 0)
    return alert("The service doesn't exist");

  if (!slug) return alert("The service doesn't exist");

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
          slug={serviceInfo?.slug}
          progress={props.progress}
          id={basicCdata?._id}
          cname={basicCreatorInfo?.name}
          UserDetails={UserDetails ? UserDetails : ""}
        />
        <Thanks
          open={openModelDownload}
          onClose={() => {
            setPaymentProcessing(false);
            setOpenModelDownload(false);
          }}
          copyURL={serviceInfo?.copyURL}
          slug={serviceInfo?.slug}
          name={serviceInfo?.sname}
          stype={0}
          control={setOpenModelRequest}
          c_id={basicCdata?._id}
        />
        <User_login
          open={openModel}
          onClose={() => {
            setOpenModel(false);
          }}
        />
        {localStorage.getItem("isUser") !== "" && (
          <SocialProof
            open={OpenModelProof}
            onClose={() => {
              setOpenModelProof(false);
            }}
            sid={serviceInfo?._id}
            cid={serviceInfo?.c_id}
            type={proofType}
            slug={slug}
          />
        )}
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

        <div className="main_service_page_box">
          <div className="service_section_content">
            <img
              src={serviceInfo?.simg}
              alt="service_image"
              className="service_section_image"
            />
            <div className="service_section_details">
              <div className="servicepage_tags">
                {serviceInfo?.isPaid ? (
                  <span style={{ background: "rgb(224 255 219)" }}>
                    <i
                      className="fa-solid fa-gear"
                      style={{ color: "#5fc585" }}
                    ></i>{" "}
                    &nbsp;Exclusive
                  </span>
                ) : (
                  <span style={{ background: "#FFD3C5" }}>
                    <i
                      className="fa-solid fa-fire"
                      style={{ color: "#DA8181" }}
                    ></i>{" "}
                    &nbsp;Trending
                  </span>
                )}
                <span>Downloadable</span>
              </div>
              <h1>{serviceInfo?.sname}</h1>
              <p className="service_sdesc">{serviceInfo?.sdesc}</p>
              <h2 className="service_h2">
                <i className="fa-regular fa-file-lines"></i>&nbsp; Resource
                Description
              </h2>
              <div className="service_sdesc">
                {document.querySelectorAll(".service_sdesc")[1]
                  ? (document.querySelectorAll(".service_sdesc")[1].innerHTML =
                      serviceInfo?.ldesc)
                  : ""}
              </div>
              {serviceInfo?.tags?.length !== 0 && serviceInfo.tags && (
                <div className="tags_section">
                  <span>{serviceInfo?.tags[0]}</span>
                  <span>{serviceInfo?.tags[1]}</span>
                  <span>{serviceInfo?.tags[2]}</span>
                </div>
              )}
            </div>
            {feedbacks?.filter((e) => e.status === 1).length === 0 ? (
              ""
            ) : (
              <div
                className="user_comments_lists service_comment_list"
                id="reviews"
              >
                <div className="review_header service_review_header">
                  <h2 className="service_h2">
                    <i class="fa-solid fa-magnifying-glass"></i>&nbsp;
                    Publisher's Review
                  </h2>
                  <p className="slide_button">
                    <span>
                      <i
                        className="fa-solid fa-angle-left fa-xl"
                        id="prev_slide_button"
                      ></i>
                    </span>
                    <span>
                      <i
                        className="fa-solid fa-angle-right fa-xl"
                        id="next_slide_button"
                      ></i>
                    </span>
                  </p>
                </div>
                <Swiper
                  slidesPerView={
                    window.matchMedia("(max-width: 500px)").matches ? 1 : 3
                  }
                  spaceBetween={
                    window.matchMedia("(max-width: 500px)").matches ? 5 : 20
                  }
                  //autoplay={{
                  //  delay: 3000,
                  //  disableOnInteraction: false,
                  //}}
                  loop={
                    feedbacks?.filter((e) => e.status === 1).length > 3
                      ? true
                      : false
                  }
                  pagination={{
                    dynamicBullets: true,
                  }}
                  navigation={{
                    nextEl: "#next_slide_button",
                    prevEl: "#prev_slide_button",
                  }}
                  modules={[Pagination, Navigation]}
                  className="mySwiper"
                >
                  {feedbacks?.filter((e) => e.status === 1).length !== 0 ? (
                    feedbacks
                      ?.filter((e) => e.status === 1)
                      .map((e2, index) => {
                        return (
                          <SwiperSlide key={index}>
                            <div className="comment_box">
                              <section>
                                <LazyLoadImage
                                  src={e2?.photo}
                                  alt=""
                                  placeholderSrc={require("../default_user.png")}
                                  className="user_profile_pic"
                                />
                                <span className="review_name_stars">
                                  <span className="user_name">
                                    {e2?.name
                                      ? e2?.name.length > 15
                                        ? e2?.name.slice(0, 15) + ".."
                                        : e2?.name
                                      : "--"}
                                  </span>
                                  <span className="review_stars">
                                    {Array(e2?.rating)
                                      .fill("a")
                                      ?.map((e, i) => {
                                        return (
                                          <i className="fa-solid fa-star"></i>
                                        );
                                      })}
                                  </span>
                                </span>
                              </section>
                              <p className="fb_desc">
                                {e2?.desc.length < 130
                                  ? e2?.desc
                                  : e2?.desc.slice(0, 130) + "....."}
                              </p>
                            </div>
                          </SwiperSlide>
                        );
                      })
                  ) : (
                    <h1 className="no_services">No reviews to display</h1>
                  )}
                </Swiper>
              </div>
            )}

            {services.res?.filter((e) => e.status === 1).length - 1 !== 0 &&
            localStorage.getItem("jwtToken") ? (
              <div className="more_services">
                <h2 className="service_h2">
                  <i className="fa-solid fa-circle-info"></i>&nbsp; More From
                  Same Creator
                </h2>
                <div className="more_services_section_service_page">
                  {services.res
                    ?.filter((e) => e._id !== serviceInfo?._id)
                    .reverse()
                    ?.sort((a, b) => {
                      return b?.downloads - a?.downloads;
                    })
                    ?.sort((a, b) => {
                      return b?.smrp - a?.smrp;
                    })
                    .slice(0, 4)
                    .map((e) => {
                      if (e.status === 1) {
                        return (
                          <a
                            href={`/s/${e.slug}`}
                            key={e._id}
                            style={{ textDecoration: "none" }}
                          >
                            <div
                              className="other_service_items"
                              onClick={() => handleServiceClick(e.slug)}
                            >
                              <section className="other_service_part_one">
                                <img src={e?.simg} alt="" />
                                <div>
                                  <h3>{e?.sname}</h3>
                                  <section className="other_service_tags">
                                    <span>Document</span>
                                    {e?.isPaid ? (
                                      <span style={{ background: "#FFEED4" }}>
                                        Paid
                                      </span>
                                    ) : (
                                      <span>Free</span>
                                    )}
                                  </section>
                                </div>
                              </section>
                              <section className="other_service_part_two">
                                {e?.downloads > 50 && (
                                  <span>
                                    <i
                                      className="fa-solid fa-fire fa-lg"
                                      style={{ color: "#DA8181" }}
                                    ></i>{" "}
                                    &nbsp;{e?.downloads} users downloaded
                                  </span>
                                )}
                                <button
                                  onClick={() => {
                                    navigate(`/s/${e?.slug}`);
                                  }}
                                >
                                  Explore&nbsp;&nbsp;
                                  <i class="fa-solid fa-arrow-right"></i>
                                </button>
                              </section>
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
            )}

            <div className="bottom_service_section">
              {serviceInfo?.isPaid ? (
                <div className="mobile_price_desc">
                  <div>
                    <h3>Price:&nbsp;</h3>
                    <span>
                      {" "}
                      ₹
                      <span style={{ textDecoration: "line-through" }}>
                        {serviceInfo?.smrp}{" "}
                      </span>
                    </span>
                  </div>
                  <div>
                    <span className="main_ssp">₹{serviceInfo?.ssp} </span>
                    <span>
                      (-
                      {((serviceInfo?.smrp - serviceInfo?.ssp) /
                        serviceInfo?.smrp) *
                        100}
                      %)
                    </span>
                  </div>
                </div>
              ) : (
                <span className="free_label">Free</span>
              )}

              <button
                className="download_service"
                onClick={() => {
                  !alreadyOrderPlaced
                    ? download_service()
                    : navigate(`/?utm_source=service_page`);
                }}
                style={
                  paymentProcessing
                    ? { backgroundColor: "grey", border: "2px solid grey" }
                    : {}
                }
              >
                {!alreadyOrderPlaced ? (
                  paymentProcessing ? (
                    <>Processing</>
                  ) : (
                    <>Download Here</>
                  )
                ) : (
                  <>Go to Dashboard</>
                )}
              </button>
            </div>
          </div>

          <div className="service_page_creator">
            <img
              src={basicCdata?.photo}
              alt="creator"
              className="service_page_profile_pic"
              onClick={(e) => {
                e.preventDefault();
                mixpanel.track("Clicked Creators profile pic on service page", {
                  service: slug,
                  user: UserDetails ? UserDetails : "",
                  creator: basicCdata?.slug,
                });
              }}
            />

            <div className="serv_profile_data">
              <span className="c_name">{basicCdata?.name}</span>
              <span className="c_tagline">{basicCreatorInfo?.tagLine}</span>
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
                  className="service_page_creator_button"
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

        <Footer />
      </div>
      <ToastContainer />
      <SuperSEO
        title={`Anchors - ${serviceInfo?.sname} `}
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
    </>
  );
}

export default Service;
