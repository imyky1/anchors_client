import React, { useContext, useEffect, useState } from "react";
import "./ServicePage.css";
import { Navbar2 } from "../../../Layouts/Navbar User/Navbar";
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
import { Footer3 } from "../../../Footer/Footer2";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import ServiceContext from "../../../../Context/services/serviceContext";
import { feedbackcontext } from "../../../../Context/FeedbackState";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { paymentContext } from "../../../../Context/PaymentState";
import { userContext } from "../../../../Context/UserState";
import { ToastContainer, toast } from "react-toastify";
import { LoadThree } from "../../../Modals/Loading";
import Seo from "../../../../Utils/Seo";
import Thanks from "../../../Modals/Thanks";

// More services Section ----------------
const MoreServices = (data) => {
  return (
    <section className="new_service_page_other_services_section">
      <h2 className="text_type_06_new_service_page">More Services</h2>

      <div>
        {data?.data?.map((e, i) => {
          return <ServiceCards {...e} key={i} />;
        })}
      </div>
    </section>
  );
};

// Each Service Card ---------------------
export const ServiceCards = ({ sname, simg, slug, stype }) => {
  const navigate = useNavigate();

  return (
    <div className="new_service_page_service_card">
      <img src={simg} alt="" />
      <h3>
        {sname.length > (window.screen.width > 600 ? 45 : 30)
          ? sname.slice(0, window.screen.width > 600 ? 45 : 30) + "..."
          : sname}
      </h3>

      <span>
        <img
          src={stype === 1 ? ExcelIcon : stype === 2 ? VideoIcon : DocIcon}
          alt=""
        />{" "}
        Document
      </span>

      <button
        onClick={() => {
          navigate(`/s/${slug}`);
        }}
      >
        Explore
      </button>
    </div>
  );
};

// Review Section -----------------
const ReviewsSection = (data) => {
  return (
    <section className="new_service_page_other_services_section">
      <h2 className="text_type_06_new_service_page">User Reviews</h2>

      <div>
        {data?.data?.map((e, i) => {
          return <ReviewCards {...e} key={i} />;
        })}
      </div>
    </section>
  );
};

// Each Review Card ---------------------
export const ReviewCards = ({ name, desc, rating, photo }) => {
  return (
    <div className="new_service_page_review_card">
      <section>
        <LazyLoadImage
          src={photo}
          alt=""
          onError={({ currentTarget }) => {
            currentTarget.onerror = null; // prevents looping
            currentTarget.src = PNGIMG;
          }}
          className="user_profile_pic"
        />

        <div>
          <span>
            {name ? (name.length > 10 ? name.slice(0, 10) + ".." : name) : "--"}
          </span>
          <p>
            {Array(rating)
              .fill("a")
              ?.map((e, i) => {
                return (
                  <RiStarSFill
                    size={window.screen.width > 600 ? 16 : 12}
                    color="rgba(255, 214, 0, 1)"
                  />
                );
              })}
          </p>
        </div>
      </section>

      <p>{desc}</p>
    </div>
  );
};

// Report Modal section -----------

// Main Service Page---------------------
function PreviewPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { slug } = useParams();

  // States
  const [loader, setLoader] = useState(false); // loader states
  const [openModel, setOpenModel] = useState(false);
  const [creatorRatingData, setCreatorRatingData] = useState(0); // creator rating data
  const [alreadyOrderPlaced, setAlreadyOrderPlaced] = useState(false); // already user order placed or not
  const [UserDetails, setUserDetails] = useState(); // stores the user data
  const [paymentProcessing, setPaymentProcessing] = useState(false); // if payment is processig
  const [openModelDownload, setOpenModelDownload] = useState(false); // for the thanks model after download

  // contexts --------------------------
  const {
    serviceInfo,
    getserviceinfo,
    services,
    getallservicesusingid,
  } = useContext(ServiceContext);

  const { getallfeedback, feedbacks, getRatingCreator } =
    useContext(feedbackcontext);


  const { getUserDetails } =
    useContext(userContext);

  //Scroll to top automatically ---------------------------------------------
  useEffect(() => {
    window.scrollTo(0, 0);
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

      // get user details for mixpanel
      getUserDetails(localStorage.getItem("isUser") === "").then((e) => {
        if (e.success) {
          setUserDetails(e?.user);
        }
        setLoader(false);
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

  const downloadService = () => {
    return true;
  };

  const goToDashboardClick = () => {
    return true;
  };

  return (
    <>
      {loader && <LoadThree open={loader} />}

      <div className="new_service_page_outer_wrapper">
        {/* Navbar */}

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
          stype={0}
          control
          c_id={serviceInfo?.service?.c_id?._id}
        />

        <div className="oneframe_new_service_page">
          {/* Data Section Service Page */}

          <section className="new_service_service_desc_container">
            {/* Service Banner in aspect ratio -------- */}
            <div>
              <img src={serviceInfo?.service?.simg} alt="servicebanner" />
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
                          <img src={TrendIcon} alt="" />{" "}
                          {serviceInfo?.service?.downloads} times
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
                        window.open(
                          `https://api.whatsapp.com/send?text=Checkout this Important resource -- *${serviceInfo?.service?.sname}* at https://www.anchors.in/s/${slug}?utm_medium=whatsapp&utm_source=wahtsapp&utm_campaign=company-question`
                        );
                      }}
                    >
                      <BsWhatsapp /> Share
                    </button>
                  </div>
                </section>

                <section className="description_section_new_service_page">
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
                <div className="right_side_data_new_service_page">
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

                    <span className="text_type_05_new_service_page">
                      30 people purchased this in last 7 days.
                    </span>

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
                        ? "Processing"
                        : "Get Access"}
                    </button>
                  </section>

                  <section
                    className="creator_details_new_service_page"
                    onClick={() => {
                      navigate(`/${serviceInfo?.service?.c_id?.slug}`);
                    }}
                  >
                    <img
                      src={serviceInfo?.creator?.profile}
                      alt={serviceInfo?.creator?.name}
                    />
                    <div>
                      <h3>{serviceInfo?.creator?.name}</h3>
                      <span>
                        {" "}
                        <RiStarSFill
                          size={16}
                          color="rgba(255, 214, 0, 1)"
                        />{" "}
                        {creatorRatingData}/5
                      </span>

                      <p>{serviceInfo?.creator?.tagLine}</p>
                    </div>
                  </section>
                </div>
              )}
            </section>
          </section>

          {/* User Review Section for mobile ------------------------- */}
          {window.screen.width < 600 &&
            feedbacks?.filter((e) => e?.status === 1)?.length !== 0 && (
              <ReviewsSection
                data={feedbacks?.filter((e) => e?.status === 1)}
              />
            )}

          {/* Creator profile section mobile section ----------------- */}

          {window.screen.width < 600 && (
            <section
              className="creator_details_new_service_page"
              onClick={() => {
                navigate(`/${serviceInfo?.service?.c_id?.slug}`);
              }}
            >
              <img
                src={serviceInfo?.creator?.profile}
                alt={serviceInfo?.creator?.name}
              />
              <div>
                <h3>{serviceInfo?.creator?.name}</h3>
                <p>{serviceInfo?.creator?.tagLine}</p>
              </div>

              <span>
                {" "}
                <RiStarSFill size={16} color="rgba(255, 214, 0, 1)" />{" "}
                {creatorRatingData}/5
              </span>
            </section>
          )}

          {/* More services section ----------------- */}
          {services?.res?.filter((e) => {
            return e?.status === 1 && e?.slug !== slug;
          })?.length !== 0 && (
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

          {/* User Review Section for desktop ---------------- */}
          {window.screen.width > 600 &&
            feedbacks?.filter((e) => e?.status === 1)?.length !== 0 && (
              <ReviewsSection
                data={feedbacks?.filter((e) => e?.status === 1)}
              />
            )}
        </div>

        {/* Cta for mobile screen ------------------ */}

        {window.screen.width < 600 && (
          <section className="mobile_cta_section_new_service_page">
            <div>
              <span className="text_type_05_new_service_page">
                30 people purchased this in last 7 days.
              </span>

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
                ? "Processing"
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

export default PreviewPage;
