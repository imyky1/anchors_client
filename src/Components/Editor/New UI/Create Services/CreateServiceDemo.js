import { LazyLoadImage } from "react-lazy-load-image-component";
import "../EditProfile/Preview.css";
import { useEffect } from "react";
import { BsWhatsapp } from "react-icons/bs";

import ExcelIcon from "../../../../Utils/Icons/excel-service.svg";
import VideoIcon from "../../../../Utils/Icons/video-service.svg";
import DocIcon from "../../../../Utils/Icons/doc-service.svg";
import TrendIcon from "../../../../Utils/Icons/trend-service.svg";
import { AiOutlineArrowRight } from "react-icons/ai";
import { MdKeyboardArrowDown } from "react-icons/md";
import { RiStarSFill } from "react-icons/ri";
import PNGIMG from "../../../../Utils/Images/default_user.png";

const CreateServiceDemo = ({
  sname,
  sdesc,
  ldesc,
  smrp,
  ssp,
  paid,
  simg,
  stype,
  noOfPage,
}) => {
  useEffect(() => {
    let doc = document.querySelector("#large_desc_service_page");
    if (ldesc) {
      if (doc) {
        doc.innerHTML = "";
        doc.innerHTML = ldesc;
      }
    } else {
      doc.innerHTML =
        "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Hic, facilis!";
    }
  }, [ldesc]);

  useEffect(() => {
    let doc = document.querySelector("#short_desc_service_page");
    if (sdesc) {
      if (doc) {
        doc.innerHTML = "";
        doc.innerHTML = sdesc;
      }
    } else {
      doc.innerHTML =
        "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Hic, facilis!";
    }
  }, [sdesc]);

  return (
    <div className="perview_demo_mobile_view_edit_profile">
      <div>
        {/* Navbar */}
        <section className="live_demo_navbar_section">
          <img
            src={require("../../../../Utils/Images/logo-invite-only.png")}
            alt=""
          />

          <button>Sign Up</button>
        </section>

        <section className="new_service_service_desc_container">
          {/* Service Banner in aspect ratio -------- */}
          <div style={{ paddingBottom: "50%" }}>
            <LazyLoadImage
              src={
                simg ??
                (stype === "pdf"
                  ? "https://anchors-assets.s3.amazonaws.com/1691823422033-Banner_PDF.png"
                  : stype === "excel"
                  ? "https://anchors-assets.s3.amazonaws.com/1691823734015-Banner_Excel.png"
                  : "https://anchors-assets.s3.amazonaws.com/1691823741733-Banner_Video.png")
              }
              alt="servicebanner"
              style={{ borderRadius: "8px" }}
            />
          </div>

          <section>
            <div
              className="left_side_data_new_service_page"
              style={{
                maxWidth: "none",
                minWidth: "auto",
                width: "100%",
              }}
            >
              <h1
                className="text_type_01_new_service_page"
                style={{ fontSize: "20px" }}
              >
                {sname}
              </h1>

              <section className="action_points_new_service_page">
                <section style={{ fontSize: "10px", gap: "8px" }}>
                  {noOfPage !== "0" && (
                    <section>
                      <span style={{ gap: "4px" }}>
                        <img
                          src={DocIcon}
                          alt=""
                          style={{ height: "16px", width: "16px" }}
                        />{" "}
                        {noOfPage} Pages
                      </span>
                    </section>
                  )}
                </section>

                <div>
                  {/* <img src={FlagIcon} alt="" /> */}
                  <button
                    style={{
                      fontSize: "12px",
                      gap: "5px",
                      padding: "8px 10px",
                    }}
                  >
                    <BsWhatsapp /> Share
                  </button>
                </div>
              </section>

              <section
                className="description_section_new_service_page"
                style={{ gap: "20px", minHeight: "auto", padding: "16px 8px" }}
              >
                <div>
                  <h2
                    className="text_type_02_new_service_page"
                    style={{ fontSize: "16px" }}
                  >
                    Resource Description
                  </h2>
                  <p
                    className="text_type_03_new_service_page"
                    id="large_desc_service_page"
                    style={{ fontSize: "12px" }}
                  >
                    Lorem ipsum dolor sit amet consectetur adipisicing elit.
                    Voluptates iure aperiam repellat magni in obcaecati nemo
                    libero quos, eum, tempora provident, veritatis reiciendis
                    rerum inventore nihil laborum at eveniet nobis nesciunt. In
                    velit corporis, molestias, nisi exercitationem molestiae
                    atque odit dolorem eveniet sint maxime praesentium, sed
                    voluptates vero laborum commodi!
                  </p>
                </div>

                <div>
                  <h2
                    className="text_type_02_new_service_page"
                    style={{ fontSize: "16px" }}
                  >
                    Additional Information
                  </h2>
                  <p
                    className="text_type_03_new_service_page"
                    id="short_desc_service_page"
                    style={{ fontSize: "12px" }}
                  >
                    Lorem ipsum, dolor sit amet consectetur adipisicing elit.
                    Obcaecati illo culpa nobis vero fugit eius magnam eaque
                    architecto atque quaerat?
                  </p>
                </div>
              </section>
            </div>
          </section>
        </section>

        <section
          className="mobile_cta_section_new_service_page"
          style={{
            alignItems: "center",
            background: "#212121",
            bottom: "0",
            boxShadow: "0 -4px 8px 0 hsla(0,0%,100%,.1)",
            boxSizing: "border-box",
            display: "flex",
            flexDirection: "column",
            gap: "10px",
            padding: "16px",
            position: "absolute",
            width: "100%",
            zIndex: "999",
          }}
        >
          <div
            style={{
              alignItems: "center",
              display: "flex",
              justifyContent: "space-between",
              width: "100%",
            }}
          >
            {paid === "Paid" && (
              <h3
                className="text_type_04_new_service_page"
                style={{ fontSize: "16px" }}
              >
                ₹ {ssp}
                <span style={{ marginLeft: "8px", fontSize: "16px" }}>
                  ₹
                </span>{" "}
                <span
                  style={{
                    textDecorationLine: "line-through",
                    fontSize: "16px",
                  }}
                >
                  {smrp}
                </span>
              </h3>
            )}
          </div>

          <button
            className="new_service_page_button_one"
            style={{
              alignItems: "center",
              display: "flex",
              fontSize: "16px",
              gap: "8px",
              justifyContent: "center",
            }}
          >
            {paid === "Paid" ? "Get Access" : "Free Access"}
            <AiOutlineArrowRight />
          </button>
        </section>
      </div>
    </div>
  );
};

const spanStyle = {
  color: "#f1f5f9",
  fontFamily: "Gilroy-Regular, sans-serif",
  fontSize: "16px",
  fontStyle: "normal",
  lineHeight: "normal",
  textAlign: "center",
};

export const CreateEventDemo = ({
  sname,
  sdesc,
  ldesc,
  smrp,
  ssp,
  paid,
  simg,
  stype,
  noOfPage,
}) => {
  // useEffect(() => {
  //   let doc = document.querySelector("#large_desc_service_page");
  //   if (ldesc) {
  //     if (doc) {
  //       doc.innerHTML = "";
  //       doc.innerHTML = ldesc;
  //     }
  //   } else {
  //     doc.innerHTML =
  //       "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Hic, facilis!";
  //   }
  // }, [ldesc]);

  // useEffect(() => {
  //   let doc = document.querySelector("#short_desc_service_page");
  //   if (sdesc) {
  //     if (doc) {
  //       doc.innerHTML = "";
  //       doc.innerHTML = sdesc;
  //     }
  //   } else {
  //     doc.innerHTML =
  //       "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Hic, facilis!";
  //   }
  // }, [sdesc]);

  return (
    <div className="perview_demo_mobile_view_edit_profile">
      <div>
        {/* Navbar */}
        <section className="live_demo_navbar_section">
          <img
            src={require("../../../../Utils/Images/logo-invite-only.png")}
            alt=""
          />

          <button>Sign Up</button>
        </section>

        <div
          className="event_page_outside_wrapper"
          style={{ width: "100%", height: "100%" }}
        >
          <section
            className="main_header_component_event_page"
            style={{ justifyContent: "center", height: "100%" }}
          >
            {/* Main detail of the component */}
            <div className="main_title_event_box" style={{ gap: "40px" }}>
              <h1
                style={{ fontSize: "40px", width: "80%", lineHeight: "50px" }}
              >
                lorem asdasd asdasda
              </h1>
              <span style={{ fontSize: "16px" }}>by lorem asdasd</span>

              <button style={{ fontSize: "16px", padding: "16px 20px" }}>
                Register for Event
              </button>
            </div>

            <a href="#eventDetails">
              <MdKeyboardArrowDown className="arrow_button_sample_page" />
            </a>
          </section>

          <section
            className="event_desc_screen"
            style={{
              alignItems: "center",
              flexDirection: "column-reverse",
              padding: "initial",
              width: "100%",
            }}
          >
            <div
              className="left_side_scrollable"
              style={{
                width: "100%",
                zIndex: "99",
              }}
            >
              <section
                className="scrollable_section_event"
                id="eventDetails"
                style={{ alignItems: "center" }}
              >
                <div
                  style={{
                    alignItems: "center",
                    display: "flex",
                    flexDirection: "column",
                    gap: "35px",
                  }}
                >
                  <section
                    style={{
                      alignItems: "center",
                      display: "flex",
                      flexDirection: "column",
                      gap: "16px",
                      justifyContent: "center",
                    }}
                  >
                    <h2
                      style={{
                        fontSize: "24px",
                        textAlign: "center",
                      }}
                    >
                      Mode
                    </h2>
                    <span style={spanStyle}>{true ? "Offline" : "Online"}</span>
                  </section>
                  <section
                    style={{
                      alignItems: "center",
                      display: "flex",
                      flexDirection: "column",
                      gap: "16px",
                      justifyContent: "center",
                    }}
                  >
                    <h2
                      style={{
                        fontSize: "24px",
                        textAlign: "center",
                      }}
                    >
                      Date
                    </h2>
                    <span style={spanStyle}>5th aug</span>
                  </section>
                  <section
                    style={{
                      alignItems: "center",
                      display: "flex",
                      flexDirection: "column",
                      gap: "16px",
                      justifyContent: "center",
                    }}
                  >
                    <h2
                      style={{
                        fontSize: "24px",
                        textAlign: "center",
                      }}
                    >
                      Time
                    </h2>
                    <span style={spanStyle}>12:00 PM To 1:00 AM</span>
                  </section>
                  <section
                    style={{
                      alignItems: "center",
                      display: "flex",
                      flexDirection: "column",
                      gap: "16px",
                      justifyContent: "center",
                    }}
                  >
                    <h2
                      style={{
                        fontSize: "24px",
                        textAlign: "center",
                      }}
                    >
                      {true ? "Spots available" : "Spots are available"}
                    </h2>
                    <span style={spanStyle}>{true ? 100 : ""}</span>
                  </section>
                </div>
              </section>
              {/* {eventInfo?.event?.speakerDetails &&
              eventInfo?.event?.speakerDetails?.length !== 0 && (
                <section className="scrollable_section_event">
                  <section
                    className="right_stable_side_top"
                    style={{ width: "62%", gap: "30px" }}
                  >
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
                  </section>
                </section>
              )} */}

              {/* {(!eventInfo?.event?.speakerDetails ||
              eventInfo?.event?.speakerDetails?.length === 0) && ( */}
              <section
                className="scrollable_section_event"
                style={{ alignItems: "center" }}
              >
                <section className="right_side_creator_profile_event_page">
                  <img
                    src=""
                    alt=""
                    onError={({ currentTarget }) => {
                      currentTarget.onerror = null; // prevents looping
                      currentTarget.src = PNGIMG;
                    }}
                  />
                  <span>lorem asdasdasd</span>
                  <p>lorem asdasdasd</p>
                  <div>
                    <RiStarSFill size={16} /> 4.5/5
                  </div>
                </section>
              </section>
              {/* )} */}

              <section className="scrollable_section_event" id="reserveSeat">
                <h2>Reserve your spot</h2>
                <span>
                  {true ? (
                    <>
                      ₹10 <span>100</span>
                    </>
                  ) : (
                    "For Free"
                  )}
                </span>
                <button>Register for Event</button>
              </section>
            </div>

            {/* <div
              className="right_stable_side"
              style={{
                height: "100%",
                right: "50%",
                top: "8%",
                width: "100%",
              }}
            >
              <img
                src={require("../../../../Utils/Images/mobile-screen.png")}
                alt=""
                style={{
                  height: "80%",
                  width: "78%",
                }}
              />
            </div> */}
          </section>
        </div>
      </div>
    </div>
  );
};

export default CreateServiceDemo;
