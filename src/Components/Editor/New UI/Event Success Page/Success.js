import React, { useContext, useEffect, useState } from "react";
import "./Success.css";

import { BsWhatsapp, BsInstagram } from "react-icons/bs";
import { AiOutlineArrowRight } from "react-icons/ai";
import { FaLinkedinIn, FaFacebookF } from "react-icons/fa";
import { IoCopy } from "react-icons/io5";

import bronze from "../../../../Utils/Icons/bronze-trophy.svg";
import silver from "../../../../Utils/Icons/silver-trophy.svg";
import gold from "../../../../Utils/Icons/gold-trophy.svg";
import { Navbar2 } from "../../../Layouts/Navbar User/Navbar";
import tick from "../../../../Utils/Icons/tick.svg";
import { userContext } from "../../../../Context/UserState";
import { useNavigate, useParams } from "react-router-dom";
import { host } from "../../../../config/config";
import { ToastContainer, toast } from "react-toastify";
import ServiceContext from "../../../../Context/services/serviceContext";
import {
  FacebookShareButton,
  WhatsappShareButton,
  LinkedinShareButton,
} from "react-share";
import { paymentContext } from "../../../../Context/PaymentState";
import Canvas from "../Event Page/Canvas";

function TableComponent({ userComponent, name, points, index }) {
  return (
    <div
      className="table_body_leaderboard_success"
      style={
        userComponent
          ? {
              background:
                "linear-gradient(180deg, #F00 0%, #F14545 49.48%, #F87171 100%)",
            }
          : {}
      }
    >
      <span>{index}</span>
      <span>{name}</span>
      <span>{points}</span>
    </div>
  );
}

const SuccessModal = ({ onClose }) => {
  const handlebutton = () => {
    const url = window.location.href;

    // Remove the query parameters by splitting the URL and taking only the base part
    const baseUrl = url.split("?")[0];

    // Replace the current URL with the base URL (without query parameters)
    window.history.replaceState({}, document.title, baseUrl);

    onClose();
  };

  return (
    <div className="successModal_success_page_wrapper" onClick={onClose}>
      <div className="successPage_main_modal_box">
        <img src={tick} alt="" />
        <span>You have successfully registered for the event!</span>

        <button onClick={handlebutton}>
          Explore your benefits <AiOutlineArrowRight />
        </button>
      </div>
    </div>
  );
};

function Success() {
  const { slug } = useParams();
  const navigate = useNavigate();

  const [openSuccessModal, setOpenSuccessModal] = useState(false); // User Modal open
  const [userDetails, setUserDetails] = useState(); // stores the user data
  const [shareLink, setShareLink] = useState(); // stores the user data
  const [leaderBoardData, setLeaderBoardData] = useState();
  const [eligible, setEligible] = useState(true);
  const [bannerData, setBannerData] = useState(); // event invite card banner data

  // User Contexts --------------------
  const { getUserDetails } = useContext(userContext);
  const { checkfororder } = useContext(paymentContext);
  const { geteventinfo, eventInfo, getLeaderBoardData, Uploadfile } =
    useContext(ServiceContext);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);

    if (params.get("placedOrder") === "success") {
      setOpenSuccessModal(true);
    }

    geteventinfo(slug).then((id) => {
      if (!id[0]) {
        // handles any irregular slug
        navigate("/");
        return null;
      }
      getLeaderBoardData(id[1],localStorage.getItem("isUser") === "").then((e) => {
        if (e?.success) {
          setLeaderBoardData(e);
        }
      });
    });
  }, []);

  useEffect(() => {
    if (document.getElementById("benefits-success")) {
      document.getElementById("benefits-success").innerHTML =
        eventInfo?.event?.benefits;
    }

    checkfororder(
      eventInfo?.event?._id,
      localStorage.getItem("isUser") === "true" ? "user" : "creator",
      "event"
    ).then((e) => {
      // e = true means order is placed
      setEligible(e);
    });
  }, [eventInfo]);

  // Fetches the user details
  useEffect(() => {
    if (localStorage.getItem("jwtToken")) {
      getUserDetails(localStorage.getItem("isUser") === "").then((e) => {
        setUserDetails(e?.user);
        let value =
          window.location.host +
          "/e/" +
          slug +
          `?referredFrom=${e?.user?.referralCode}`;

        setShareLink(value);
      });
    }
  }, [localStorage.getItem("jwtToken")]);

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

  const handleDonwload = async (e) => {
    const link = document.createElement("a");
    link.href = bannerData;
    link.download = `${userDetails?.name}.png`;
    link.click();
  };

  if (!localStorage.getItem("jwtToken") || !eligible) {
    navigate(`/e/${slug}`);
    return null;
  }

  // handling the status 0 of services ------------------
  if (eventInfo?.event?.status === 0 || eventInfo?.event?.c_id?.status === 0) {
    navigate("/");
    return null;
  }



  return (
    <>
      {/* creates custom banner for the user on the basis of the event */}

      {openSuccessModal && (
        <SuccessModal onClose={() => setOpenSuccessModal(false)} />
      )}

      <ToastContainer theme="dark" />

      <div className="success_page_wrapper">
          <div className="banner_canvas_wrapper">
            <Canvas
              setBannerData={setBannerData}
              dataToUse={{
                userName: userDetails?.name,
                userProfile: userDetails?.photo,
                eventName: eventInfo?.event?.sname,
                creatorName: eventInfo?.creator?.name,
                creatorProfile: eventInfo?.creator?.profile,
                date: getDate(eventInfo?.event?.startDate),
                time: `${convertTime(eventInfo?.event?.time?.startTime)} - 
            ${convertTime(eventInfo?.event?.time?.endTime)}`,
              }}
            />
          </div>

        {/* main hero section details */}
        <section className="main_header_component_success_page">
          <Navbar2 />

          <div className="main_hero_details_benefits">
            <section className="left_benefit_section_hero_success">
              <div className="banner_success_page">
                <img
                  src={
                    bannerData ?? "https://wallpaperaccess.com/full/2439064.png"
                  }
                  alt="Event Banner"
                  onClick={(e) => bannerData && handleDonwload(e)}
                />
              </div>
              <h2>
                Share with your friends and invite them using your unique
                referral code.
              </h2>

              <div
                style={{
                  position: "relative",
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                }}
                onClick={() => {
                  navigator.clipboard.writeText(shareLink);
                  toast.success("Copied Link Successfully", {
                    position: "top-center",
                    autoClose: 2000,
                  });
                }}
              >
                <input
                  type="text"
                  placeholder="Unique Referral link"
                  value={shareLink}
                  disabled
                />
                <IoCopy
                  style={{ position: "absolute", right: "10px" }}
                  color="black"
                  size={20}
                />
              </div>

              <section>
                <WhatsappShareButton
                  url={
                    "https://www.youtube.com/watch?v=9WzIACv_mxs&ab_channel=ShravanMeena"
                  }
                >
                  <BsWhatsapp />
                </WhatsappShareButton>

                <LinkedinShareButton
                  url={
                    "https://www.youtube.com/watch?v=9WzIACv_mxs&ab_channel=ShravanMeena"
                  }
                >
                  <FaLinkedinIn />
                </LinkedinShareButton>
                {/* <BsInstagram /> */}
                <FacebookShareButton
                  url={
                    "https://www.youtube.com/watch?v=9WzIACv_mxs&ab_channel=ShravanMeena"
                  }
                  quote={"Hello user"}
                >
                  <FaFacebookF />
                </FacebookShareButton>
              </section>
            </section>

            <section className="right_benefit_section_hero_success">
              <h1>Top Referral Benefits</h1>
              <p id="benefits-success"></p>
            </section>
          </div>
        </section>

        {/* Leader Board Section */}

        <section className="leaderboard_wrapper_success_page">
          <h1>Leader Board</h1>

          {/* main leader Boards toppers ------ */}

          <div className="main_leader_board_toppers">
            {/* silvertrophy */}
            <section id="silver-trophy">
              <div>
                <div
                  className="topper_image_area"
                  style={{ border: "4px solid #ccc" }}
                >
                  <img
                    src={
                      leaderBoardData?.finalData?.length > 1 && leaderBoardData?.finalData[1]?.points !== 0
                        ? leaderBoardData?.finalData[1]?.profile
                        : "https://img.freepik.com/premium-photo/red-question-mark-isolated-white_3482-715.jpg?w=2000"
                    }
                    alt=""
                  />
                </div>
                <span style={{ color: "#737373" }}>2</span>
              </div>

              <img src={silver} alt="silver" />

              <h2>{leaderBoardData?.finalData && leaderBoardData?.finalData[1]?.points !== 0 && leaderBoardData?.finalData[1]?.name}</h2>
              <span>{leaderBoardData?.finalData && leaderBoardData?.finalData[1]?.points !== 0 && leaderBoardData?.finalData[1]?.points}</span>
            </section>

            {/* gold trophy */}
            <section id="gold-trophy">
              <div>
                <div
                  className="gold_image_area topper_image_area"
                  style={{ border: "4px solid #CA9100" }}
                >
                  <img
                    src={
                      leaderBoardData?.finalData?.length > 0 && leaderBoardData?.finalData[0]?.points !== 0
                        ? leaderBoardData?.finalData[0]?.profile
                        : "https://img.freepik.com/premium-photo/red-question-mark-isolated-white_3482-715.jpg?w=2000"
                    }
                    alt=""
                  />
                </div>
                <span style={{ color: "#CA9100" }}>1</span>
              </div>

              <img src={gold} alt="gold" />

              <h2>{leaderBoardData?.finalData  && leaderBoardData?.finalData[0]?.points !== 0 && leaderBoardData?.finalData[0]?.name}</h2>
              <span>{leaderBoardData?.finalData  && leaderBoardData?.finalData[0]?.points !== 0 && leaderBoardData?.finalData[0]?.points}</span>
            </section>

            {/* bronze trophy */}
            <section id="bronze-trophy">
              <div>
                <div
                  className="topper_image_area"
                  style={{ border: "4px solid #EA9542" }}
                >
                  <img
                    src={
                      leaderBoardData?.finalData?.length > 2 && leaderBoardData?.finalData[2]?.points !== 0
                        ? leaderBoardData?.finalData[2]?.profile
                        : "https://img.freepik.com/premium-photo/red-question-mark-isolated-white_3482-715.jpg?w=2000"
                    }
                  />
                </div>
                <span style={{ color: "#EA9542" }}>3</span>
              </div>

              <img src={bronze} alt="bronze" />

              <h2>{leaderBoardData?.finalData && leaderBoardData?.finalData[2]?.points !== 0 &&  leaderBoardData?.finalData[2]?.name}</h2>
              <span>{leaderBoardData?.finalData && leaderBoardData?.finalData[2]?.points !== 0 &&  leaderBoardData?.finalData[2]?.points}</span>
            </section>
          </div>

          {/* Table for other ranks ------------- */}

          {(leaderBoardData?.finalData?.length > 3 || leaderBoardData?.showUserInExtra?.value) && (
          <div className="leader_board_table_success">
            <section className="table_head_leaderboard_success">
              <span>Rank</span>
              <span>User Name</span>
              <span>Referrals</span>
            </section>

            {leaderBoardData?.finalData?.slice(leaderBoardData?.showUserInExtra?.value ? leaderBoardData?.showUserInExtra?.count : 3)?.map((element, i) => {
              return (
                <TableComponent
                  key={element?.id}
                  {...element}
                  index={(leaderBoardData?.showUserInExtra?.value || element?.points === 0 ) ? "?" : i + 4}
                  userComponent={element.user}
                />
              );
            })}
          </div>
        )}
        </section>

        
      </div>
    </>
  );
}

export default Success;
