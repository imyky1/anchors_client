import React, { useContext, useEffect, useState } from "react";
import mixpanel from "mixpanel-browser";
import Hamburger from "hamburger-react";
import "./userdashbaord.css";
import "react-toastify/dist/ReactToastify.css";
import User_login from "../Login/Users/User_login";
import { UserDashbaord } from "../../Context/userdashbaord";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { saveAs } from "file-saver";
import Footer from "../Footer/Footer";

const Dashboarduser = () => {
  const navigate = useNavigate();

  const [openModel, setOpenModel] = useState(false);
  const [showevents, setShowevents] = useState(false);
  const [actualldocuments, setActuallDocs] = useState([]);
  const [actuallworkshops, setActuallWorkshop] = useState([]);
  const [showingspecific, setShowingSpecific] = useState(null);

  const context = useContext(UserDashbaord);
  const {
    getallcreatorsofuser,
    userCreators,
    getallordersofuser,
    alluserDocs,
    alluserWorkshops,
    totaluserorders,
  } = context;

  const downloadFile = (type, surl, sname) => {
    let oReq = new XMLHttpRequest();
    let URLToPDF = surl;
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

      saveAs(file, `${sname}.${type}`);
    };
    oReq.send();
  };

  const handledocumentdownload = (surl, slug, sname) => {
    const ext = surl?.split(".").at(-1);
    if (ext === "pdf") {
      downloadFile("pdf", surl, sname);
      /*
      mixpanel.track("Downloaded pdf", {
        service: slug,
        user: UserDetails ? UserDetails : "",
        creator: basicCdata?.slug,
      });
      */
    } else if (ext === "mp4") {
      downloadFile("mp4", surl, sname);
      /*
      mixpanel.track("Downloaded pdf", {
        service: slug,
        user: UserDetails ? UserDetails : "",
        creator: basicCdata?.slug,
      });
      */
    } else {
      let link = document.createElement("a");
      link.href = surl;
      link.target = "_blank";
      link.dispatchEvent(new MouseEvent("click"));
    }
    console.log("wow");
    toast.info(
      "Check the Downloads in few seconds, if file not found raise an issue at ravi@anchors.in",
      {
        position: "top-center",
      }
    );
    /*
    mixpanel.track("Downloaded Service", {
      service: slug,
      user: UserDetails ? UserDetails : "",
      creator: basicCdata?.slug,
    });
    */
  };

  const handletiming = (startDate, time) => {
    const todayDate = new Date();
    const finalDate = new Date(startDate);
    var startHour = time?.startTime;
    var endHour = time?.endTime;
    if (startHour !== undefined) {
      let temp = startHour.split("");
      startHour = temp[0] + temp[1];
      var startMinute = temp[3] + temp[4];
    }
    if (endHour !== undefined) {
      let temp = endHour.split("");
      endHour = temp[0] + temp[1];
      var endMinute = temp[3] + temp[4];
    }
    if (
      todayDate.getDate() - finalDate.getDate() === 0 &&
      todayDate.getMonth() - finalDate.getMonth() === 0
    ) {
      // same day
      var hourdiff = startHour - todayDate.getHours();
      var hourenddiff = endHour - todayDate.getHours();

      // case 1 - s.h - c.h - e.h
      if (hourdiff < 0 && hourenddiff > 0) {
        return "Ongoing";
      }
      // case 2 - c.h - s.h - e.h
      if (hourdiff < 0 && hourenddiff < 0) {
        return "Upcoming";
      }
      // case 3 s.h - e.h - c.r
      if (hourdiff > 0 && hourenddiff > 0) {
        return "Completed";
      }
      // case 4 - s.h == c.h - e.h (check start minute)
      if (hourdiff === 0 && hourenddiff > 0) {
        let mindiff = startMinute - todayDate.getMinutes();
        if (mindiff > 0) {
          return "Upcoming";
        } else {
          return "OnGoing";
        }
      }
      // case 5 - s.h  - e.h == c.h
      if (hourdiff < 0 && hourenddiff === 0) {
        let mindiff = endMinute - todayDate.getMinutes();
        if (mindiff > 0) {
          return "OnGoing";
        } else {
          return "Completed";
        }
      }
      // case 6 - s.h==c.h==e.h
      if (hourdiff === 0 && hourenddiff === 0) {
        let Startmindiff = startMinute - todayDate.getMinutes();
        let Endmindiff = endMinute - todayDate.getMinutes();
        // case 1 ongoing
        if (Startmindiff < 0 && Endmindiff > 0) {
          return "Ongoing";
        }
        // case 2 Past
        if (Startmindiff < 0 && Endmindiff < 0) {
          return "Completed";
        }
        // case 3 upcoming
        if (Startmindiff > 0 && Endmindiff > 0) {
          return "Upcoming";
        }
      }
    } else if (finalDate - todayDate > 0) {
      // not the same day
      return "Upcoming";
    } else {
      return "Completed";
    }
  };

  const handlecreatorpicclick = (el) => {
    if (el._id === showingspecific) {
      setActuallDocs(alluserDocs);
      setActuallWorkshop(alluserWorkshops);
      setShowingSpecific(null);
    } else {
      setActuallDocs(alluserDocs.filter((docs) => docs.c_id === el._id));
      setActuallWorkshop(
        alluserWorkshops.filter((docs) => docs.c_id === el._id)
      );
      setShowingSpecific(el._id);
    }
  };
  useEffect(() => {
    getallcreatorsofuser();
    getallordersofuser();
  }, []);
  useEffect(() => {
    setActuallDocs(alluserDocs);
    setActuallWorkshop(alluserWorkshops);
  }, [alluserDocs, alluserWorkshops]);
  const userlogout = () => {
    window.location.pathname = "/logout/user";
  };
  const handledropdown = () => {
    document.querySelector(".user_logout").style.display !== "none"
      ? (document.querySelector(".user_logout").style.display = "none")
      : (document.querySelector(".user_logout").style.display = "inline-block");
  };

  return (
    <>
      <User_login
        open={openModel}
        onClose={() => {
          setOpenModel(false);
        }}
      />
      <ToastContainer />

      <div className="profile_header">
        <div className="logo">
          <img src={require("../logo.png")} alt="Logo" />
          <span>anchors</span>
        </div>
        {localStorage.getItem("isUser") === "" ? (
          ""
        ) : (
          <div className="user_login">
            <span>
              {!localStorage.getItem("jwtToken") ? (
                ""
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
      <div className="userdash-overall-wrapper">
        <div className="all_sub_creators">
          {userCreators?.map((elem, i) => (
            <div
              key={i}
              className={`userdash-creator-img  ${
                elem._id === showingspecific ? "desktop-view-userdash" : ""
              }`}
              onClick={() => {
                handlecreatorpicclick(elem);
              }}
            >
              <img
                className={`creator-image-userdash ${
                  elem._id === showingspecific ? "addshadow-userdash" : ""
                }`}
                src={elem.photo}
                alt="creator"
              ></img>
              <h5>{elem.name}</h5>
            </div>
          ))}

          <svg
            width="50"
            height="50"
            viewBox="0 0 60 60"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            onClick={() => {
              window.open("/");
            }}
          >
            <rect width="60" height="60" rx="30" fill="#EEEEEE" />
            <rect
              width="0.37037"
              height="20"
              transform="translate(29.8148 20)"
              fill="#898383"
            />
            <rect
              x="20"
              y="30.1852"
              width="0.37037"
              height="20"
              transform="rotate(-90 20 30.1852)"
              fill="#898383"
            />
          </svg>
        </div>
        <div className="right-userdash-wrapper">
          <div className="unlocked_wrapper-userdash">
            <h4>Unlocked Items ( {totaluserorders} )</h4>
            <div className="toggle_document-userdash">
              <button
                onClick={() => setShowevents(false)}
                className={`userdashboard-buttons ${
                  !showevents ? "selectedbutton-userdashboard" : ""
                }`}
              >
                Document
              </button>
              <button
                onClick={() => setShowevents(true)}
                className={`userdashboard-buttons ${
                  showevents ? "selectedbutton-userdashboard" : ""
                }`}
              >
                Events
              </button>
            </div>
          </div>
          {showevents ? (
            <div className="document-bar-userdash">
              {actuallworkshops?.length === 0 ? (
                <h2>NO CONTENT TO DISPLAY !</h2>
              ) : (
                <>
                  {actuallworkshops?.map((elem, i) => (
                    <div key={i} className="documents-userdash">
                      <div className="workshop-userdash-timing">
                        {handletiming(elem?.startDate, elem?.time) ===
                        "Completed" ? (
                          <svg
                            width="13"
                            height="13"
                            viewBox="0 0 15 15"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                            xmlnsXlink="http://www.w3.org/1999/xlink"
                          >
                            <rect
                              width="15"
                              height="15"
                              fill="url(#pattern0)"
                            />
                            <defs>
                              <pattern
                                id="pattern0"
                                patternContentUnits="objectBoundingBox"
                                width="1"
                                height="1"
                              >
                                <use
                                  xlinkHref="#image0_22_278"
                                  transform="scale(0.00195312)"
                                />
                              </pattern>
                              <image
                                id="image0_22_278"
                                width="512"
                                height="512"
                                xlinkHref="data:image/png;base64,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"
                              />
                            </defs>
                          </svg>
                        ) : (
                          <svg
                            width="10"
                            height="10"
                            viewBox="0 0 10 10"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M5 0C2.2379 0 0 2.2379 0 5C0 7.7621 2.2379 10 5 10C7.7621 10 10 7.7621 10 5C10 2.2379 7.7621 0 5 0ZM6.15121 7.05847L4.37298 5.76613C4.31048 5.71976 4.27419 5.64718 4.27419 5.57056V2.17742C4.27419 2.04435 4.38306 1.93548 4.51613 1.93548H5.48387C5.61694 1.93548 5.72581 2.04435 5.72581 2.17742V4.95363L7.00605 5.88508C7.11492 5.96371 7.1371 6.11492 7.05847 6.22379L6.48992 7.00605C6.41129 7.1129 6.26008 7.1371 6.15121 7.05847Z"
                              fill="#6A6161"
                            />
                          </svg>
                        )}

                        {handletiming(elem.startDate, elem.time)}
                      </div>
                      <div
                        className={`documents-userdash-upper ${
                          elem.isPaid ? "yellowpaid-userdash" : ""
                        }`}
                      >
                        <img src={elem.simg} alt="SERVICE"></img>
                        <div className="userdash-title-tags">
                          <h3>{elem.sname}</h3>
                          <div className="workshop-userdash-tags">
                            <h4>Event</h4>
                            <h4>{elem.isPaid ? "Paid" : "Free"}</h4>
                          </div>
                        </div>
                      </div>
                      <div className="workshop-userdash-download">
                        <div className="documents-userdash-timewrap">
                          <div
                            className={`workshop-userdash-date ${
                              handletiming(elem.startDate, elem.time) ===
                              "Completed"
                                ? "completed-workshop-userdash"
                                : ""
                            }`}
                          >
                            <svg
                              width="16"
                              height="18"
                              viewBox="0 0 18 20"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M0 18.125C0 19.1602 0.839844 20 1.875 20H15.625C16.6602 20 17.5 19.1602 17.5 18.125V7.5H0V18.125ZM12.5 10.4688C12.5 10.2109 12.7109 10 12.9688 10H14.5312C14.7891 10 15 10.2109 15 10.4688V12.0312C15 12.2891 14.7891 12.5 14.5312 12.5H12.9688C12.7109 12.5 12.5 12.2891 12.5 12.0312V10.4688ZM12.5 15.4688C12.5 15.2109 12.7109 15 12.9688 15H14.5312C14.7891 15 15 15.2109 15 15.4688V17.0312C15 17.2891 14.7891 17.5 14.5312 17.5H12.9688C12.7109 17.5 12.5 17.2891 12.5 17.0312V15.4688ZM7.5 10.4688C7.5 10.2109 7.71094 10 7.96875 10H9.53125C9.78906 10 10 10.2109 10 10.4688V12.0312C10 12.2891 9.78906 12.5 9.53125 12.5H7.96875C7.71094 12.5 7.5 12.2891 7.5 12.0312V10.4688ZM7.5 15.4688C7.5 15.2109 7.71094 15 7.96875 15H9.53125C9.78906 15 10 15.2109 10 15.4688V17.0312C10 17.2891 9.78906 17.5 9.53125 17.5H7.96875C7.71094 17.5 7.5 17.2891 7.5 17.0312V15.4688ZM2.5 10.4688C2.5 10.2109 2.71094 10 2.96875 10H4.53125C4.78906 10 5 10.2109 5 10.4688V12.0312C5 12.2891 4.78906 12.5 4.53125 12.5H2.96875C2.71094 12.5 2.5 12.2891 2.5 12.0312V10.4688ZM2.5 15.4688C2.5 15.2109 2.71094 15 2.96875 15H4.53125C4.78906 15 5 15.2109 5 15.4688V17.0312C5 17.2891 4.78906 17.5 4.53125 17.5H2.96875C2.71094 17.5 2.5 17.2891 2.5 17.0312V15.4688ZM15.625 2.5H13.75V0.625C13.75 0.28125 13.4688 0 13.125 0H11.875C11.5312 0 11.25 0.28125 11.25 0.625V2.5H6.25V0.625C6.25 0.28125 5.96875 0 5.625 0H4.375C4.03125 0 3.75 0.28125 3.75 0.625V2.5H1.875C0.839844 2.5 0 3.33984 0 4.375V6.25H17.5V4.375C17.5 3.33984 16.6602 2.5 15.625 2.5Z"
                                fill={
                                  handletiming(elem.startDate, elem.time) ===
                                  "Completed"
                                    ? "#6A6161"
                                    : "#FF574C"
                                }
                              />
                            </svg>
                            {new Date(elem.startDate).getDate()}{" "}
                            {new Date(elem.startDate).toLocaleString(
                              "default",
                              {
                                month: "short",
                                year: "2-digit",
                              }
                            )}
                          </div>
                          <div
                            className={`workshop-userdash-date ${
                              handletiming(elem.startDate, elem.time) ===
                              "Completed"
                                ? "completed-workshop-userdash"
                                : ""
                            }`}
                          >
                            <svg
                              width="16"
                              height="18"
                              viewBox="0 0 20 20"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M10 0C4.47581 0 0 4.47581 0 10C0 15.5242 4.47581 20 10 20C15.5242 20 20 15.5242 20 10C20 4.47581 15.5242 0 10 0ZM12.3024 14.1169L8.74597 11.5323C8.62097 11.4395 8.54839 11.2944 8.54839 11.1411V4.35484C8.54839 4.08871 8.76613 3.87097 9.03226 3.87097H10.9677C11.2339 3.87097 11.4516 4.08871 11.4516 4.35484V9.90726L14.0121 11.7702C14.2298 11.9274 14.2742 12.2298 14.1169 12.4476L12.9798 14.0121C12.8226 14.2258 12.5202 14.2742 12.3024 14.1169Z"
                                fill={
                                  handletiming(elem.startDate, elem.time) ===
                                  "Completed"
                                    ? "#6A6161"
                                    : "#FF574C"
                                }
                              />
                            </svg>
                            {`${elem.time.startTime} - ${elem.time.endTime}`}
                          </div>
                        </div>

                        {handletiming(elem.startDate, elem.time) ===
                        "Completed" ? (
                          <div
                            className="workshop-userdash-review"
                            onClick={() => {
                              window.open(
                                `/feedback?service=workshop&slug=${elem.slug}`
                              );
                            }}
                          >
                            <svg
                              width="12"
                              height="11"
                              viewBox="0 0 12 11"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M8.03784 1.65908L9.83867 3.45991C9.91454 3.53577 9.91454 3.65955 9.83867 3.73542L5.47835 8.09574L3.62561 8.30138C3.37805 8.32933 3.16842 8.1197 3.19637 7.87214L3.40201 6.0194L7.76233 1.65908C7.83819 1.58321 7.96198 1.58321 8.03784 1.65908ZM11.2721 1.20188L10.2979 0.227599C9.9944 -0.0758664 9.50127 -0.0758664 9.1958 0.227599L8.48905 0.934354C8.41318 1.01022 8.41318 1.134 8.48905 1.20987L10.2899 3.0107C10.3657 3.08656 10.4895 3.08656 10.5654 3.0107L11.2721 2.30394C11.5756 1.99848 11.5756 1.50535 11.2721 1.20188ZM7.6665 6.90983V8.94225H1.27775V2.5535H5.86567C5.92956 2.5535 5.98945 2.52755 6.03537 2.48363L6.83396 1.68503C6.9857 1.5333 6.87789 1.27575 6.66426 1.27575H0.958312C0.429244 1.27575 0 1.705 0 2.23407V9.26169C0 9.79076 0.429244 10.22 0.958312 10.22H7.98593C8.515 10.22 8.94425 9.79076 8.94425 9.26169V6.11124C8.94425 5.89761 8.6867 5.7918 8.53497 5.94154L7.73637 6.74013C7.69245 6.78605 7.6665 6.84594 7.6665 6.90983Z"
                                fill="black"
                              />
                            </svg>

                            <h5>Write Review</h5>
                          </div>
                        ) : (
                          <div
                            className="workshop-userdash-download-button"
                            onClick={() => {
                              window.open(`${elem.meetlink}`);
                            }}
                          >
                            <svg
                              width="14"
                              height="13"
                              viewBox="0 0 15 10"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M8.75521 0H1.24479C0.557292 0 0 0.557292 0 1.24479V8.75521C0 9.44271 0.557292 10 1.24479 10H8.75521C9.44271 10 10 9.44271 10 8.75521V1.24479C10 0.557292 9.44271 0 8.75521 0ZM13.6875 0.981771L10.8333 2.95052V7.04948L13.6875 9.01562C14.2396 9.39583 15 9.00781 15 8.34375V1.65365C15 0.992188 14.2422 0.601562 13.6875 0.981771Z"
                                fill="white"
                              />
                            </svg>

                            <h5>Join Event</h5>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </>
              )}
            </div>
          ) : (
            <div className="events-bar-userdash">
              {actualldocuments?.length === 0 ? (
                <h2>NO CONTENT TO DISPLAY !</h2>
              ) : (
                <>
                  {actualldocuments?.map((elem, i) => (
                    <div key={i} className="documents-userdash">
                      <div
                        className="documents-userdash-upper"
                        onClick={() => {
                          window.open(`/s/${elem.slug}`);
                        }}
                      >
                        <img src={elem.simg} alt="SERVICE"></img>
                        <div className="userdash-title-tags">
                          <h3>{elem.sname}</h3>
                          <h4>Document</h4>
                        </div>
                      </div>
                      <div className="documents-userdash-download">
                        <div
                          className="documents-userdash-review"
                          onClick={() => {
                            window.open(
                              `/feedback?service=download&slug=${elem?.slug}`
                            );
                          }}
                        >
                          <svg
                            width="16"
                            height="13"
                            viewBox="0 0 16 13"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M10.9128 1.98375L13.2579 4.13699C13.3567 4.2277 13.3567 4.37571 13.2579 4.46642L7.57968 9.68004L5.16697 9.92591C4.84458 9.95934 4.57159 9.70868 4.60799 9.41267L4.87578 7.19736L10.554 1.98375C10.6528 1.89304 10.814 1.89304 10.9128 1.98375ZM15.1246 1.43709L13.8558 0.272139C13.4607 -0.090713 12.8185 -0.090713 12.4207 0.272139L11.5003 1.1172C11.4015 1.20792 11.4015 1.35592 11.5003 1.44663L13.8454 3.59987C13.9442 3.69059 14.1054 3.69059 14.2042 3.59987L15.1246 2.75481C15.5198 2.38957 15.5198 1.79994 15.1246 1.43709ZM10.4292 8.26205V10.6922H2.10948V3.05321H8.08406C8.16726 3.05321 8.24525 3.02218 8.30505 2.96966L9.34501 2.01478C9.54261 1.83336 9.40221 1.52541 9.12402 1.52541H1.6935C1.00452 1.52541 0.445541 2.03866 0.445541 2.67126V11.0742C0.445541 11.7068 1.00452 12.22 1.6935 12.22H10.8452C11.5341 12.22 12.0931 11.7068 12.0931 11.0742V7.30717C12.0931 7.05174 11.7577 6.92522 11.5601 7.10426L10.5202 8.05914C10.463 8.11404 10.4292 8.18566 10.4292 8.26205Z"
                              fill="#FF574C"
                            />
                          </svg>
                          <h5>Write Review</h5>
                        </div>
                        <div
                          onClick={() =>
                            handledocumentdownload(
                              elem.surl,
                              elem.slug,
                              elem.sname
                            )
                          }
                          className="documents-userdash-download-button"
                        >
                          <svg
                            width="14"
                            height="13"
                            viewBox="0 0 14 13"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M12.5497 5.23471L13.2223 5.84474C13.5071 6.10305 13.5071 6.52072 13.2223 6.77628L7.33558 12.1182C7.05078 12.3765 6.59027 12.3765 6.3085 12.1182L0.418734 6.77628C0.133941 6.51798 0.133941 6.1003 0.418734 5.84474L1.09133 5.23471C1.37915 4.97367 1.84876 4.97916 2.13052 5.24571L5.60864 8.5569V0.659492C5.60864 0.294023 5.93282 0 6.33577 0H7.30528C7.70823 0 8.03241 0.294023 8.03241 0.659492V8.5569L11.5105 5.24571C11.7923 4.97641 12.2619 4.97092 12.5497 5.23471Z"
                              fill="white"
                            />
                          </svg>
                          <h5>Redownload</h5>
                        </div>
                      </div>
                    </div>
                  ))}
                </>
              )}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Dashboarduser;
