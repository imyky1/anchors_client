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
  const [openModelDownload, setOpenModelDownload] = useState(false);
  const [paymentProcessing, setPaymentProcessing] = useState(false);
  const {
    serviceInfo,
    getserviceinfo,
    services,
    getallservicesusingid,
    getserviceusingid,
    getOneHourDownloads,
  } = context;
  const { basicCdata, getBasicCreatorInfo, basicCreatorInfo } =
    useContext(creatorContext);
  const { userPlaceOrder, checkSubscriber, getUserDetails } =
    useContext(userContext);
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
      const id = await getserviceinfo(slug);
      await getBasicCreatorInfo(id[0]);
      await getallservicesusingid(id[0]);
    };
    mixpanel.track("Page Visit", {
      user: UserDetails ? UserDetails : "",
      creator: basicCdata?.slug,
    });

    process();
    // eslint-disable-next-line
  }, []);

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
          getserviceusingid(fb.res.serviceID).then((service) => {
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
                  creator: basicCdata?.slug
                });
              }
              else if (ext === "mp4") {
                downloadFile("mp4").then(() => {});
                mixpanel.track("Downloaded paid pdf", {
                  service: slug,
                  user: UserDetails ? UserDetails : "",
                  amount: serviceInfo?.ssp,
                  creator: basicCdata?.slug
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
    if (
      localStorage.getItem("isUser") === "true" &&
      localStorage.getItem("jwtToken")
    ) {
      if (serviceInfo?.isPaid) {
        checkfororder(serviceInfo?._id).then((e) => {
          if (e) {
            if (ext === "pdf") {
              downloadFile("pdf");
              mixpanel.track("Downloaded paid pdf again", {
                service: slug,
                user: UserDetails ? UserDetails : "",
                amount: serviceInfo?.ssp,
                creator: basicCdata?.slug,
              });
            }
            else if (ext === "mp4") {
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
          0
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
          }
          else if (ext === "mp4") {
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
    } else if (
      localStorage.getItem("isUser") === "" &&
      localStorage.getItem("jwtToken")
    ) {
      setPaymentProcessing(true);
      if (ext === "pdf") {
        downloadFile("pdf");
      }else if (ext === "mp4") {
        downloadFile("mp4");
      } else {
        let link = document.createElement("a");
        link.href = serviceInfo.surl;
        link.target = "_blank";
        link.dispatchEvent(new MouseEvent("click"));
      }
      setPaymentProcessing(false);
    } else {
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
            setOpenModelDownload(false);
          }}
          copyURL={serviceInfo?.copyURL}
          slug={serviceInfo?.slug}
          name={serviceInfo?.sname}
          control = {setOpenModelRequest}
          c_id = {basicCdata?._id}
        />
        <User_login
          open={openModel}
          onClose={() => {
            setOpenModel(false);
          }}
        />
        {localStorage.getItem("isUser") !== "" && <SocialProof
          open={OpenModelProof}
          onClose={() => {
            setOpenModelProof(false);
          }}
          sid={serviceInfo?._id}
          cid={serviceInfo?.c_id}
          type={proofType}
          slug={slug}
        />}
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
              <h1>{serviceInfo?.sname}</h1>
              {serviceInfo?.tags?.length !== 0 && serviceInfo.tags && (
                <div className="tags_section">
                  <span>{serviceInfo?.tags[0]}</span>
                  <span>{serviceInfo?.tags[1]}</span>
                  <span>{serviceInfo?.tags[2]}</span>
                </div>
              )}
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
            </div>
            {services.res?.filter((e) => e.status === 1).length - 1 !== 0 &&
            localStorage.getItem("jwtToken") ? (
              <div className="more_services">
                <h2 className="service_h2">
                  <i className="fa-solid fa-circle-info"></i>&nbsp; More Services
                  from the Creator
                </h2>
                <div className="display_services_list service_list_display">
                  {services.res
                    ?.filter((e) => e._id !== serviceInfo?._id)?.sort((a,b)=>{return (b?.smrp - a?.smrp)}).map((e) => {
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
                              {/* <span
                                className={`${
                                  e.isPaid === true ? "paid" : "free"
                                }_tag_dispalyed`}
                              >
                                {e.isPaid === true ? "Paid" : "Free"}
                              </span> */}
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
                onClick={download_service}
                style={
                  paymentProcessing
                    ? { backgroundColor: "grey", border: "2px solid grey" }
                    : {}
                }
              >
                {paymentProcessing ? <>Processing</> : <>Download Here</>}
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

        <div className="footer_service">
          <a
            href="https://www.linkedin.com/company/beanchorite"
            target="_blank"
            rel="noreferrer"
          >
            {/* <span>Follow us on LinkedIn</span> */}
          </a>
          <span>Facing any issue? email us - ravi@anchors.in</span>
        </div>
      </div>
      <ToastContainer />
    </>
  );
}

export default Service;
