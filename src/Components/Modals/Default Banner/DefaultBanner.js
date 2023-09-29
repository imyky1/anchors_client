import React, { useEffect, useRef, useState } from "react";
import "./defaultBanner.css";
import "../../Editor/New UI/Create Services/Canvas.css";
import { ToastContainer, toast } from "react-toastify";
import excel from "./TestImage/excel.svg";
import excelL from "./TestImage/excellarge.svg";
import pdf from "./TestImage/pdf.svg";
import pdfL from "./TestImage/pdflarge.svg";
import video from "./TestImage/video.svg";
import videoL from "./TestImage/videofull.svg";
import bannerRed from "./TestImage/Banner_red.png";
import bannerBlack from "./TestImage/Banner_black.png";
import bannerBlue from "./TestImage/Banner_blue.png";
import html2canvas from "html2canvas";
import PNGIMG from "../../../Utils/Images/default_user.png";

function DefaultBanner2({ open, onClose, dataToRender, setFinalData }) {
  const htmlElementRef = useRef(null); // desktop banner
  const htmlElementRef2 = useRef(null); // mobile banner
  const [color, setColor] = useState({ background: "Red" });
  const [dataToUse, setDataToUse] = useState({
    background: "",
    smallSVGSource: "",
    SVGSource: "",
    buttonGradient: {},
    svgStyle: {},
    docText: "",
  });

  const handleColorClick = (e) => {
    setColor({ background: e });
  };

  const saveAsImage = () => {
    const element = htmlElementRef.current;
    const mobileElement = htmlElementRef2.current;

    let formData = new FormData();

    html2canvas(element).then(function (canvas) {
      canvas.toBlob(function (blob) {
        formData.append("file", blob, "image.png");
      });
    });

    html2canvas(mobileElement).then(function (canvas) {
      canvas.toBlob(function (blob) {
        var objectURL = URL.createObjectURL(blob);
        const formData2 = new FormData();
        formData2.append("file", blob, "mobimage.png");
        setFinalData(formData, formData2, objectURL);
      });
    });
  };

  useEffect(() => {
    setDataToUse({
      background:
        color?.background === "Red"
          ? bannerRed
          : color?.background === "Blue"
          ? bannerBlue
          : bannerBlack,
      smallSVGSource:
        dataToRender?.type === "excel"
          ? excel
          : dataToRender?.type === "video"
          ? video
          : pdf,
      SVGSource:
        dataToRender?.type === "excel"
          ? excelL
          : dataToRender?.type === "video"
          ? videoL
          : pdfL,
      buttonGradient:
        color?.background === "Red"
          ? {
              background: "linear-gradient(270deg, #A10303 0%, #121212 100%)",
            }
          : color?.background === "Blue"
          ? {
              background: "linear-gradient(270deg, #5E17FE 0%, #2C0090 100%)",
            }
          : {
              background: "linear-gradient(270deg, #121212 0%, #464646 100%)",
            },
      svgStyle:
        dataToRender?.type === "pdf" ? { opacity: "0.20000000298023224" } : {},
      docText:
        dataToRender?.type === "excel"
          ? "Excel Sheet"
          : dataToRender?.type === "video"
          ? "Video"
          : "PDF",
    });
  }, [dataToRender, color]);

  useEffect(() => {
    if (dataToRender?.sname === "") {
      toast.info("Fill the service title to generate the banner", {
        position: "top-center",
        autoClose: 2000,
      });
      onClose();
    }
  }, [open]);

  if (!open) {
    return null;
  }

  return (
    <>
      <div className="default_previewer_wrapper">
        <div>
          {/* Html banner ------------------------------- */}
          <div className="outer" ref={htmlElementRef}>
            <img src={dataToUse?.background} />
            <div>
              <div className="outer_01">
                <div className="type_01">
                  <img src={dataToUse?.smallSVGSource} alt="Small SVG" />
                  <div className="type_text">{dataToUse?.docText}</div>
                </div>
                <div className="type_title">{dataToRender?.sname}</div>
                <div className="creator_name" style={dataToUse?.buttonGradient}>
                  By {dataToRender?.cname}{" "}
                </div>
              </div>
              <div className="right_image">
                <img
                  src={dataToUse?.SVGSource}
                  style={dataToUse?.svgStyle}
                  alt="SVG"
                />
              </div>
            </div>
          </div>

          <div className="mobile_banner" ref={htmlElementRef2}>
            <img src={dataToUse?.background} />
            <div>
              <div className="mobile_banner_outer_01">
                <div className="mobile_banner_type_01">
                  <img src={dataToUse?.smallSVGSource} alt="Small SVG" />
                  <div className="mobile_banner_type_text">
                    {dataToUse?.docText}
                  </div>
                </div>
                <div className="mobile_banner_type_title">
                  {dataToRender?.sname}
                </div>
                <div
                  className="mobile_banner_creator_name"
                  style={dataToUse?.buttonGradient}
                >
                  By {dataToRender?.cname}{" "}
                </div>
              </div>
              <div className="mobile_banner_right_image">
                <img
                  src={dataToUse?.SVGSource}
                  style={dataToUse?.svgStyle}
                  alt="SVG"
                />
              </div>
            </div>
          </div>

          <section className="default_options_sections">
            <div>
              <span
                className={`normal_color_option_default_banner ${
                  color?.background === "Red" &&
                  "active_color_option_default_banner"
                }`}
                onClick={() => {
                  handleColorClick("Red");
                }}
              >
                <span style={{ backgroundColor: "#E84142" }}></span>
              </span>
              <span
                className={`normal_color_option_default_banner ${
                  color?.background === "Blue" &&
                  "active_color_option_default_banner"
                }`}
                onClick={() => {
                  handleColorClick("Blue");
                }}
              >
                <span style={{ backgroundColor: "#5E17FE" }}></span>
              </span>
              <span
                className={`normal_color_option_default_banner ${
                  color?.background === "Black" &&
                  "active_color_option_default_banner"
                }`}
                onClick={() => {
                  handleColorClick("Black");
                }}
              >
                <span style={{ backgroundColor: "#151515" }}></span>
              </span>
            </div>

            <section>
              <button onClick={onClose}>Close</button>
              <button
                onClick={() => {
                  // handleDownloadClick();
                  saveAsImage();
                  onClose();
                  toast.success("Banner Saved Successfully", {
                    autoClose: 1500,
                  });
                }}
              >
                Save
              </button>
            </section>
          </section>
        </div>
      </div>

      <ToastContainer limit={1} />
    </>
  );
}

export const PersonalizedInviteeCard = ({
  open,
  onClose,
  data,
  speakersArray,
  speakersImagesArray,
}) => {
  // Default banner fucntion -------------

  let colorCodes = [
    "#121212",
    "linear-gradient(142deg, #231919 0.94%, #002A3B 47.59%, #121212 98.41%)",
    "linear-gradient(142deg, #231919 0.94%, #300 47.59%, #121212 98.41%)",
    "linear-gradient(142deg, #231919 0.94%, #091800 47.59%, #121212 98.41%)",
    "linear-gradient(142deg, #231919 0.94%, #002F2C 47.59%, #121212 98.41%",
  ];

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

  if (!open) {
    return null;
  }

  return (
    <>
      <div className="default_previewer_wrapper">
        {/* card ----------- */}

        <div>
          <section
            className="event_invite_card_wrapper"
            style={{
              background:
                colorCodes[Math.floor(Math.random() * colorCodes.length)],
            }}
          >
            <div>
              {/* user section data  */}
              <section id="invite-card-opacity-layer-160"></section>
              <section id="invite-card-opacity-layer-123"></section>
              <section id="invite-card-opacity-layer-87"></section>

              {speakersArray[0]?.name ? (
                <>
                  <div>
                    {/* event title section ----------- */}
                    <section className="event_title_data_event_invite_card_multiple_speakers">
                      <h3>{data?.sname}</h3>

                      <span>Hosted by {data?.cname}</span>
                    </section>

                    {/* user data section ------- */}
                    <section
                      className={`${
                        speakersArray[0]?.name
                          ? "multiple_speakers_event_invite_card_userdata"
                          : ""
                      } user_data_event_invite_card`}
                    >
                      <img
                        src="https://www.shareicon.net/data/512x512/2016/09/15/829459_man_512x512.png"
                        alt=""
                      />

                      <div>
                        <h4>David Rathore</h4>
                        <span>attending this event.</span>
                      </div>
                    </section>
                  </div>

                  {/* event date and time section ----------- */}
                  <div
                    style={{
                      position: "absolute",
                      right: "32px",
                      alignItems: "flex-end",
                    }}
                  >
                    <section className="event_date_data_event_invite_card">
                      <span>
                        <svg
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <g id="vuesax/linear/calendar">
                            <g id="vuesax/linear/calendar_2">
                              <g id="calendar">
                                <path
                                  id="Vector"
                                  d="M8 2V5"
                                  stroke="white"
                                  stroke-width="1.5"
                                  stroke-miterlimit="10"
                                  stroke-linecap="round"
                                  stroke-linejoin="round"
                                />
                                <path
                                  id="Vector_2"
                                  d="M16 2V5"
                                  stroke="white"
                                  stroke-width="1.5"
                                  stroke-miterlimit="10"
                                  stroke-linecap="round"
                                  stroke-linejoin="round"
                                />
                                <path
                                  id="Vector_3"
                                  d="M3.5 9.08997H20.5"
                                  stroke="white"
                                  stroke-width="1.5"
                                  stroke-miterlimit="10"
                                  stroke-linecap="round"
                                  stroke-linejoin="round"
                                />
                                <path
                                  id="Vector_4"
                                  d="M21 8.5V17C21 20 19.5 22 16 22H8C4.5 22 3 20 3 17V8.5C3 5.5 4.5 3.5 8 3.5H16C19.5 3.5 21 5.5 21 8.5Z"
                                  stroke="white"
                                  stroke-width="1.5"
                                  stroke-miterlimit="10"
                                  stroke-linecap="round"
                                  stroke-linejoin="round"
                                />
                                <path
                                  id="Vector_5"
                                  d="M15.6947 13.7H15.7037"
                                  stroke="white"
                                  stroke-width="1.5"
                                  stroke-linecap="round"
                                  stroke-linejoin="round"
                                />
                                <path
                                  id="Vector_6"
                                  d="M15.6947 16.7H15.7037"
                                  stroke="white"
                                  stroke-width="1.5"
                                  stroke-linecap="round"
                                  stroke-linejoin="round"
                                />
                                <path
                                  id="Vector_7"
                                  d="M11.9955 13.7H12.0045"
                                  stroke="white"
                                  stroke-width="1.5"
                                  stroke-linecap="round"
                                  stroke-linejoin="round"
                                />
                                <path
                                  id="Vector_8"
                                  d="M11.9955 16.7H12.0045"
                                  stroke="white"
                                  stroke-width="1.5"
                                  stroke-linecap="round"
                                  stroke-linejoin="round"
                                />
                                <path
                                  id="Vector_9"
                                  d="M8.29431 13.7H8.30329"
                                  stroke="white"
                                  stroke-width="1.5"
                                  stroke-linecap="round"
                                  stroke-linejoin="round"
                                />
                                <path
                                  id="Vector_10"
                                  d="M8.29431 16.7H8.30329"
                                  stroke="white"
                                  stroke-width="1.5"
                                  stroke-linecap="round"
                                  stroke-linejoin="round"
                                />
                              </g>
                            </g>
                          </g>
                        </svg>{" "}
                        {getDate(data?.date)}
                      </span>

                      <span>
                        {" "}
                        <svg
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <g id="ci:clock">
                            <path
                              id="Vector"
                              d="M12 7V12H17M12 21C10.8181 21 9.64778 20.7672 8.55585 20.3149C7.46392 19.8626 6.47177 19.1997 5.63604 18.364C4.80031 17.5282 4.13738 16.5361 3.68508 15.4442C3.23279 14.3522 3 13.1819 3 12C3 10.8181 3.23279 9.64778 3.68508 8.55585C4.13738 7.46392 4.80031 6.47177 5.63604 5.63604C6.47177 4.80031 7.46392 4.13738 8.55585 3.68508C9.64778 3.23279 10.8181 3 12 3C14.3869 3 16.6761 3.94821 18.364 5.63604C20.0518 7.32387 21 9.61305 21 12C21 14.3869 20.0518 16.6761 18.364 18.364C16.6761 20.0518 14.3869 21 12 21Z"
                              stroke="white"
                              stroke-width="1.5"
                              stroke-linecap="round"
                              stroke-linejoin="round"
                            />
                          </g>
                        </svg>
                        {convertTime(data?.startTime) +
                          "-" +
                          convertTime(data?.endTime)}
                      </span>
                    </section>

                    {/* event speaker section ----------- */}
                    <section className="event_invite_multiple_speakers_details_section">
                      <h4 style={{left:speakersArray.length > 0 ? (speakersArray?.length - 1)*5+ "px"  : ""}}>Speakers</h4>
                      <section>
                        {speakersArray?.map((speaker, index) => {
                          return (
                            <div
                              style={{
                                left: `${
                                  (speakersArray.length - (index + 1)) * 10
                                }px`,
                                zIndex: `${
                                  (speakersArray.length - (index + 1)) * 4
                                }`,
                              }}
                            >
                              <div>
                                <img
                                  src={
                                    speakersImagesArray[index]
                                      ? URL.createObjectURL(
                                          speakersImagesArray[index]
                                        )
                                      : speaker?.isCreator
                                      ? data?.cprofile
                                      : PNGIMG
                                  }
                                  alt=""
                                />
                              </div>
                              <span>{speaker?.name}</span>
                            </div>
                          );
                        })}
                      </section>
                    </section>
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <section className="user_data_event_invite_card">
                      <img
                        src="https://www.shareicon.net/data/512x512/2016/09/15/829459_man_512x512.png"
                        alt=""
                      />

                      <div>
                        <h4>David Rathore</h4>
                        <span>attending this event.</span>
                      </div>
                    </section>

                    {/* event title section ----------- */}

                    <section className="event_title_data_event_invite_card">
                      <h3>{data?.sname}</h3>

                      <span>Hosted by {data?.cname}</span>
                    </section>
                  </div>

                  {/* event date and time section ----------- */}
                  <div
                    style={{
                      position: "absolute",
                      right: "32px",
                      alignItems: "flex-end",
                    }}
                  >
                    <section className="event_date_data_event_invite_card">
                      <span>
                        <svg
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <g id="vuesax/linear/calendar">
                            <g id="vuesax/linear/calendar_2">
                              <g id="calendar">
                                <path
                                  id="Vector"
                                  d="M8 2V5"
                                  stroke="white"
                                  stroke-width="1.5"
                                  stroke-miterlimit="10"
                                  stroke-linecap="round"
                                  stroke-linejoin="round"
                                />
                                <path
                                  id="Vector_2"
                                  d="M16 2V5"
                                  stroke="white"
                                  stroke-width="1.5"
                                  stroke-miterlimit="10"
                                  stroke-linecap="round"
                                  stroke-linejoin="round"
                                />
                                <path
                                  id="Vector_3"
                                  d="M3.5 9.08997H20.5"
                                  stroke="white"
                                  stroke-width="1.5"
                                  stroke-miterlimit="10"
                                  stroke-linecap="round"
                                  stroke-linejoin="round"
                                />
                                <path
                                  id="Vector_4"
                                  d="M21 8.5V17C21 20 19.5 22 16 22H8C4.5 22 3 20 3 17V8.5C3 5.5 4.5 3.5 8 3.5H16C19.5 3.5 21 5.5 21 8.5Z"
                                  stroke="white"
                                  stroke-width="1.5"
                                  stroke-miterlimit="10"
                                  stroke-linecap="round"
                                  stroke-linejoin="round"
                                />
                                <path
                                  id="Vector_5"
                                  d="M15.6947 13.7H15.7037"
                                  stroke="white"
                                  stroke-width="1.5"
                                  stroke-linecap="round"
                                  stroke-linejoin="round"
                                />
                                <path
                                  id="Vector_6"
                                  d="M15.6947 16.7H15.7037"
                                  stroke="white"
                                  stroke-width="1.5"
                                  stroke-linecap="round"
                                  stroke-linejoin="round"
                                />
                                <path
                                  id="Vector_7"
                                  d="M11.9955 13.7H12.0045"
                                  stroke="white"
                                  stroke-width="1.5"
                                  stroke-linecap="round"
                                  stroke-linejoin="round"
                                />
                                <path
                                  id="Vector_8"
                                  d="M11.9955 16.7H12.0045"
                                  stroke="white"
                                  stroke-width="1.5"
                                  stroke-linecap="round"
                                  stroke-linejoin="round"
                                />
                                <path
                                  id="Vector_9"
                                  d="M8.29431 13.7H8.30329"
                                  stroke="white"
                                  stroke-width="1.5"
                                  stroke-linecap="round"
                                  stroke-linejoin="round"
                                />
                                <path
                                  id="Vector_10"
                                  d="M8.29431 16.7H8.30329"
                                  stroke="white"
                                  stroke-width="1.5"
                                  stroke-linecap="round"
                                  stroke-linejoin="round"
                                />
                              </g>
                            </g>
                          </g>
                        </svg>{" "}
                        {getDate(data?.date)}
                      </span>

                      <span>
                        {" "}
                        <svg
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <g id="ci:clock">
                            <path
                              id="Vector"
                              d="M12 7V12H17M12 21C10.8181 21 9.64778 20.7672 8.55585 20.3149C7.46392 19.8626 6.47177 19.1997 5.63604 18.364C4.80031 17.5282 4.13738 16.5361 3.68508 15.4442C3.23279 14.3522 3 13.1819 3 12C3 10.8181 3.23279 9.64778 3.68508 8.55585C4.13738 7.46392 4.80031 6.47177 5.63604 5.63604C6.47177 4.80031 7.46392 4.13738 8.55585 3.68508C9.64778 3.23279 10.8181 3 12 3C14.3869 3 16.6761 3.94821 18.364 5.63604C20.0518 7.32387 21 9.61305 21 12C21 14.3869 20.0518 16.6761 18.364 18.364C16.6761 20.0518 14.3869 21 12 21Z"
                              stroke="white"
                              stroke-width="1.5"
                              stroke-linecap="round"
                              stroke-linejoin="round"
                            />
                          </g>
                        </svg>
                        {convertTime(data?.startTime) +
                          "-" +
                          convertTime(data?.endTime)}
                      </span>
                    </section>

                    {/* event speaker section ----------- */}

                    <section className="event_speaker_data_event_invite_card">
                      <span>
                        {data?.cname}, <span>Speaker</span>
                      </span>
                      <div>
                        <img src={data?.cprofile} alt="" />
                      </div>
                    </section>
                  </div>
                </>
              )}
            </div>
          </section>

          <section className="default_options_sections">
            {/* <div>
              <span
                className={`normal_color_option_default_banner ${
                  color?.background === "Red" &&
                  "active_color_option_default_banner"
                }`}
                onClick={() => {
                  handleColorClick("Red");
                }}
              >
                <span style={{ backgroundColor: "#E84142" }}></span>
              </span>
              <span
                className={`normal_color_option_default_banner ${
                  color?.background === "Blue" &&
                  "active_color_option_default_banner"
                }`}
                onClick={() => {
                  handleColorClick("Blue");
                }}
              >
                <span style={{ backgroundColor: "#5E17FE" }}></span>
              </span>
              <span
                className={`normal_color_option_default_banner ${
                  color?.background === "Black" &&
                  "active_color_option_default_banner"
                }`}
                onClick={() => {
                  handleColorClick("Black");
                }}
              >
                <span style={{ backgroundColor: "#151515" }}></span>
              </span>
            </div> */}

            <section>
              <button onClick={onClose}>Close</button>
            </section>
          </section>
        </div>
      </div>

      <ToastContainer limit={1} />
    </>
  );
};

export default DefaultBanner2;


