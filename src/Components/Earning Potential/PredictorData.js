import React, { useContext, useEffect, useState } from "react";
import Navbar from "../Layouts/Navbar Creator/Navbar";

import { FaCommentAlt } from "react-icons/fa";
import { AiFillEye, AiFillLock } from "react-icons/ai";
import { BsHandThumbsUpFill } from "react-icons/bs";
import { SlBadge } from "react-icons/sl";
import { HiInformationCircle } from "react-icons/hi";
import { FinalScheduleModal, OtpModal, RequestModal } from "./RequestModel";
import { useNavigate, useParams } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { EPAcontext } from "../../Context/EPAState";
import { Footer3 } from "../Footer/Footer2";

import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import mixpanel from "mixpanel-browser";

const Loader = ({ percentage }) => {
  const [activeText, setActiveText] = useState(
    "Analyzing your Youtube Channel"
  );

  const [blinkingDots, setBlinkingDots] = useState("");

  useEffect(() => {
    setTimeout(() => {
      setBlinkingDots(blinkingDots + ".");
      if (blinkingDots.length > 3) {
        setBlinkingDots("");
      }
    }, 1000);
  }, [blinkingDots]);

  useEffect(() => {
    if (percentage > 40) {
      setActiveText("Calculating Earning Potential");
    } else {
      setActiveText("Analyzing your Youtube Channel");
    }
  }, [percentage]);

  useEffect(() => {
    mixpanel.track("Loading Page");
  }, []);

  return (
    <div className="loader_external_wrapper">
      <div>
        <CircularProgressbar
          value={percentage}
          text={`${percentage}%`}
          styles={buildStyles({
            textColor: "#FFFFFF",
            pathColor: "#FFFFFF",
            trailColor: "#404040",
          })}
        />
      </div>
      <span>
        {activeText} <span id="blinking_dots">{blinkingDots}</span>
      </span>
    </div>
  );
};


const TooltipBox = ({ text }) => (
  <div className="tooltip-box">
    {text}
  </div>
);

const VideoDataContainer = ({ index, avgPotential, videoData }) => {
  const navigate = useNavigate();
  const d = new Date(videoData?.snippet?.publishedAt);
  let dateArray = d?.toDateString()?.split(" ");

  if (window.screen.width > 650) {
    // table for the desktop view

    return (
      <div className="table_body_data_earning">
        <span>{index}</span>
        <span>
          {videoData?.snippet?.localized?.title.length > 50
            ? videoData?.snippet?.localized?.title + "..."
            : videoData?.snippet?.localized?.title}
        </span>
        <img src={videoData?.snippet?.thumbnails?.default?.url} alt="" />
        <span>{videoData?.statistics?.viewCount}</span>
        <span>{videoData?.statistics?.likeCount}</span>
        <span>{videoData?.statistics?.commentCount}</span>
        <span>{`${dateArray[1]} ${dateArray[2]} , ${dateArray[3]}`}</span>
        <span>
          <span
            style={
              !(
                localStorage.getItem("jwtToken") &&
                localStorage.getItem("isUser") === ""
              )
                ? { filter: "blur(4px)" }
                : {}
            }
          >
            {localStorage.getItem("jwtToken") &&
            localStorage.getItem("isUser") === ""
              ? avgPotential?.toFixed(0)
              : "000000"}{" "}
          </span>
          {!(
            localStorage.getItem("jwtToken") &&
            localStorage.getItem("isUser") === ""
          ) && (
            <AiFillLock
              onClick={() => {
                mixpanel.track("Unlock Estimated Earning Icon");
                navigate("/login/creators");
              }}
            />
          )}
        </span>
      </div>
    );
  } else {
    //  card for the mobile
    return (
      <div className="mobile_video_details_card">
        <section>
          <img src={videoData?.snippet?.thumbnails?.default?.url} alt="" />
          <div>
            <h1>
              {videoData?.snippet?.localized?.title.length > 50
                ? videoData?.snippet?.localized?.title + "..."
                : videoData?.snippet?.localized?.title}
            </h1>
            <div>
              <span>
                <AiFillEye /> {videoData?.statistics?.viewCount}
              </span>
              <span>
                <BsHandThumbsUpFill /> {videoData?.statistics?.likeCount}
              </span>
              <span>
                <FaCommentAlt />
                {videoData?.statistics?.commentCount}
              </span>
            </div>
          </div>
        </section>

        <div>
          <p>Estimated Earning</p>
          <span>
            <span
              style={
                !(
                  localStorage.getItem("jwtToken") &&
                  localStorage.getItem("isUser") === ""
                )
                  ? { filter: "blur(4px)" }
                  : {}
              }
            >
              {localStorage.getItem("jwtToken") &&
              localStorage.getItem("isUser") === ""
                ? `₹ ${avgPotential?.toFixed(0)}`
                : "₹ 000000"}{" "}
            </span>
            {!(
              localStorage.getItem("jwtToken") &&
              localStorage.getItem("isUser") === ""
            ) && (
              <AiFillLock
                onClick={() => {
                  navigate("/login/creators");
                }}
              />
            )}
          </span>
        </div>
      </div>
    );
  }
};

function PredictorData() {
  const { saveYoutubeData } = useContext(EPAcontext);
  const { url } = useParams();
  const navigate = useNavigate();

  // Request form data
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    number: "",
    otp: "",
    verified: false,
  });

  const [finalData, setFinalData] = useState();
  const [isHovered, setIsHovered] = useState({tip1:false,tip2:false});
  const [Potential, setPotential] = useState();
  const [allContentData, setAllContentData] = useState([]);
  const [loading, setLoading] = useState({ open: true, percentage: 0 });

  // Model Openeing ---------
  const [openRequestModal, setOpenRequestModal] = useState(false);
  const [openOTPModal, setOpenOTPModal] = useState(false);
  const [openFinalModal, setOpenFinalModal] = useState(false);

  // for the loader
  function generateRandomNumber() {
    return Math.floor(Math.random() * 10) + 1;
  }

  // Function for the earning ---------------

  const handleSubmit = async (e) => {
    setPotential();
    setFinalData();
    e?.preventDefault();

    const response = await fetch(
      `https://youtube.googleapis.com/youtube/v3/videos?part=snippet%2CcontentDetails%2Cstatistics&id=${url}&key=${process.env.REACT_APP_GOOGLE_LIVE_API}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const videoDetails = await response.json();

    const response2 = await fetch(
      `https://www.googleapis.com/youtube/v3/channels?part=statistics%2Csnippet&id=${videoDetails?.items[0]?.snippet?.channelId}&key=${process.env.REACT_APP_GOOGLE_LIVE_API}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const channelDetails = await response2.json();

    // get total duration of the channel
    let totalYears = getDateDiff(
      channelDetails?.items[0]?.snippet?.publishedAt
    );

    // Active subs = Total Subs * (1 - 0.1)^(total time to the channel)
    const activeSubs = parseInt(
      channelDetails?.items[0]?.statistics?.subscriberCount *
        Math.pow(0.9, totalYears)
    );

    let data = {
      // title: videoDetails?.items[0]?.snippet?.localized?.title,
      // views: videoDetails?.items[0]?.statistics?.viewCount,
      // likes: videoDetails?.items[0]?.statistics?.likeCount,
      comments: videoDetails?.items[0]?.statistics?.commentCount,
      channelId: videoDetails?.items[0]?.snippet?.channelId,
      channelTitle: videoDetails?.items[0]?.snippet?.channelTitle,
      subsCount: channelDetails?.items[0]?.statistics?.subscriberCount,
      activeSubs,
      totalChannelViews: channelDetails?.items[0]?.statistics?.viewCount,
      // videoFreq: channelDetails?.items[0]?.statistics?.videoCount,
      channelpublishDate: channelDetails?.items[0]?.snippet?.publishedAt,
      channelDataFromYoutube: channelDetails,
    };

    setFinalData(data);

    return data;
  };

  const GetAllContentFromYoutube = async (
    channelId,
    pageToken = false,
    nextPageToken = ""
  ) => {
    const response = await fetch(
      `https://youtube.googleapis.com/youtube/v3/activities?part=contentDetails&channelId=${channelId}&maxResults=${window.screen.width > 650 ? 50 : 20}&key=${
        process.env.REACT_APP_GOOGLE_LIVE_API
      }${pageToken ? `&pageToken=${nextPageToken}` : ""}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    let allRecentVideoDetails = await response.json();

    setAllContentData(allContentData.push(...allRecentVideoDetails?.items));

    if (allRecentVideoDetails?.nextPageToken) {
      return GetAllContentFromYoutube(
        channelId,
        true,
        allRecentVideoDetails?.nextPageToken
      );
    }

    setLoading({ open: true, percentage: 28 + generateRandomNumber() });

    setTimeout(() => {
      setLoading({ open: true, percentage: 38 + generateRandomNumber() });
    }, 2000);

    return true;
  };

  // finds the earning of each content found for a channel
  const traceEachVideo = async (channelId, activeSubs) => {
    const dataObj = [];

    for (let i = 0; i < allContentData.length; i++) {
      const element = allContentData[i];
      const videoId =
        element?.contentDetails?.upload?.videoId ||
        element?.contentDetails?.playlistItem?.resourceId?.videoId;

      const response = await fetch(
        `https://youtube.googleapis.com/youtube/v3/videos?part=snippet%2CcontentDetails%2Cstatistics&id=${videoId}&key=${process.env.REACT_APP_GOOGLE_LIVE_API}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const DataVideo = await response.json();

      const matches =
        DataVideo?.items[0]?.contentDetails?.duration?.match(/PT(\d+)M(\d+)S/);

      const minutes = matches ? parseInt(matches[1]) : 0;
      const seconds = matches ? parseInt(matches[2]) : 0;

      // Convert minutes and seconds to seconds
      // const totalSeconds = minutes * 60 + seconds;

      if (
        minutes * 60 + seconds > 70 &&
        DataVideo?.items[0]?.snippet?.channelId === channelId
      ) {
        dataObj.push({
          videoId,
          avgPotential: algorithmEarningPotential(
            DataVideo?.items[0]?.statistics?.viewCount,
            DataVideo?.items[0]?.statistics?.likeCount,
            DataVideo?.items[0]?.statistics?.commentCount,
            activeSubs
          ),
          videoData: DataVideo?.items[0],
        });
      }
    }

    setLoading({ open: true, percentage: 60 - generateRandomNumber() });

    return dataObj;
  };

  // Find the maximum value in a objects -------
  function sortAndRemoveDuplicates(array) {
    // Remove duplicates using Set
    const uniqueArray = Array.from(new Set(array.map(JSON.stringify))).map(
      JSON.parse
    );

    // Sort array in descending order based on avgPotential
    uniqueArray.sort((a, b) => b.avgPotential - a.avgPotential);

    setLoading({ open: true, percentage: 77 + generateRandomNumber() });

    return uniqueArray;
  }

  // FInds the main potential
  const handlePotential = async (channelId, activeSubs) => {
    setAllContentData([]);

    // fetches all the video content of the user
    const data = await GetAllContentFromYoutube(channelId);

    let videoData = await traceEachVideo(channelId, activeSubs);

    const sortedAndUniqueData = sortAndRemoveDuplicates(videoData);
    setPotential(sortedAndUniqueData);

    return sortedAndUniqueData;
  };

  // Get Date Diff ------
  function getDateDiff(date) {
    const currentDate = new Date();
    const specifiedDate = new Date(date);

    // Calculate the difference in milliseconds
    const diffInMs = currentDate - specifiedDate;

    // Convert milliseconds to days
    const diffInYears = diffInMs / (1000 * 60 * 60 * 24 * 365.25); // Account for leap years

    return Math.floor(diffInYears);
  }

  // Algorith of the earning potential
  const algorithmEarningPotential = (views, likes, comments, activeSubs) => {
    const totalVisitors = Math.min(views, activeSubs);
    let netVisitors =
      parseInt(comments) +
      parseInt(likes) * 0.5 +
      parseInt(totalVisitors) * 0.1;

    const earning = netVisitors * 0.15 * 9;

    return earning;
  };

  // Decode duration format from youtube video
  const decodeISO8601Duration = (duration) => {
    const regex =
      /^P(?:(\d+)Y)?(?:(\d+)M)?(?:(\d+)W)?(?:(\d+)D)?(?:T(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?)?$/;
    const matches = duration.match(regex);

    const years = matches[1] ? parseInt(matches[1]) : 0;
    const months = matches[2] ? parseInt(matches[2]) : 0;
    const weeks = matches[3] ? parseInt(matches[3]) : 0;
    const days = matches[4] ? parseInt(matches[4]) : 0;
    const hours = matches[5] ? parseInt(matches[5]) : 0;
    const minutes = matches[6] ? parseInt(matches[6]) : 0;
    const seconds = matches[7] ? parseInt(matches[7]) : 0;

    let result = "";

    if (years > 0) result += years + "Y";
    if (months > 0) result += months + "M";
    if (weeks > 0) result += weeks + "W";
    if (days > 0) result += days + "D";

    if (hours > 0 || minutes > 0 || seconds > 0) {
      //result += "T";
      if (hours > 0) result += hours + ":";
      if (minutes > 0) result += minutes + ":";
      if (seconds > 0) result += seconds;
    }

    return result;
  };

  const getDate = (date) => {
    const d = new Date(date);
    let dateArray = d?.toDateString()?.split(" ");

    return `${dateArray[1]} ${dateArray[2]} , ${dateArray[3]}`;
  };

  useEffect(() => {
    handleSubmit().then((data) => {
      setLoading({ open: true, percentage: 25 - generateRandomNumber() });
      handlePotential(data?.channelId, data?.activeSubs).then((data2) => {
        // Saves data in background -------
        setTimeout(() => {
          setLoading({ open: false, percentage: 100 });
          saveYoutubeData(
            data?.channelTitle,
            data?.channelId,
            data?.subsCount,
            data?.activeSubs,
            data?.totalChannelViews,
            data?.channelpublishDate,
            data?.channelDataFromYoutube,
            1,
            allContentData,
            data2
          );
        }, 1000);
      });
    });
  }, [url]);

  if (loading?.open) {
    mixpanel.track("Page Visit");

    return <Loader percentage={loading?.percentage} />;
  } else {
    return (
      <>
        <div className="earning-data-wrapper">
          <Navbar
            requestCallBack={true}
            backgroundDark={true}
            setOpenCallbackModel={setOpenRequestModal}
            noAccount={window.screen.width < 650 ? true : false}
          />

          <div className="data_section-earning">
            <section className="top_earner-section-earning">
              <div className="top-earner-image-section">
                <div>
                  <p className="tag_earning_tag">
                    {" "}
                    <SlBadge /> Top earner video
                  </p>
                  <div style={{position:"relative"}}>
                  <HiInformationCircle
                    size={20}
                    color="white"
                    style={{ cursor: "pointer" }}
                    onMouseEnter={()=>{setIsHovered({...isHovered,"tip1":true});mixpanel.track("Top earner info icon")}}
                    onMouseLeave={()=>{setIsHovered({...isHovered,"tip1":false})}}
                    />
                  {isHovered?.tip1 && <TooltipBox text="Picked out of the latest 25 videos on your channel" />}
                    </div>
                </div>
                <img
                  src={
                    Potential &&
                    (Potential[0]?.videoData?.snippet?.thumbnails?.high?.url ??
                      Potential[0]?.videoData?.snippet?.thumbnails?.default
                        ?.url)
                  }
                  alt="thumbnail"
                />
                <span>
                  Uploaded on -{" "}
                  {getDate(
                    Potential && Potential[0]?.videoData?.snippet?.publishedAt
                  )}
                </span>
              </div>

              <div className="top-earner-detail-section">
                <h1>
                  {Potential &&
                    (window.screen.width > 650
                      ? Potential[0]?.videoData?.snippet?.localized?.title
                          .length > 105
                        ? Potential[0]?.videoData?.snippet?.localized?.title?.slice(
                            0,
                            105
                          ) + "..."
                        : Potential[0]?.videoData?.snippet?.localized?.title
                      : Potential[0]?.videoData?.snippet?.localized?.title
                          ?.length > 35
                      ? Potential[0]?.videoData?.snippet?.localized?.title?.slice(
                          0,
                          35
                        ) + "..."
                      : Potential[0]?.videoData?.snippet?.localized?.title)}
                </h1>

                <div>
                  <span>
                    <AiFillEye />
                    {Potential &&
                      Potential[0]?.videoData?.statistics?.viewCount}
                  </span>
                  <span>
                    <BsHandThumbsUpFill />
                    {Potential &&
                      Potential[0]?.videoData?.statistics?.likeCount}
                  </span>
                  <span>
                    <FaCommentAlt />
                    {Potential &&
                      Potential[0]?.videoData?.statistics?.commentCount}
                  </span>
                </div>
              </div>

              <section className="pricing_card_earning_data">
                {window.screen.width < 650 && <h2>Potential Earning</h2>}
                <div>
                  ₹ {Potential && Potential[0]?.avgPotential?.toFixed(0)}{" "}
                  {/* <AiFillLock /> */}
                </div>

                <button
                  onClick={() => {
                    mixpanel.track("Check How Clicked");
                    setOpenRequestModal(true);
                  }}
                >
                  Check How?
                </button>
              </section>
            </section>

            <section className="other_videos_data_earning">
              <h2>Potential Earnings of other videos </h2>

              <div className="table_head_data_earning">
                <span>Rank</span>
                <span>Title</span>
                <span>Thumbnail</span>
                <span>Views</span>
                <span>Likes</span>
                <span>Comment</span>
                <span>Uploaded on</span>
                <span>
                  *Estimated Earning{" "}
                  <HiInformationCircle
                    size={17}
                    color="white"
                    style={{ cursor: "pointer" }}
                    onMouseEnter={()=>{setIsHovered({...isHovered,"tip2":true});mixpanel.track("Estimated Earning info icon")}}
                    onMouseLeave={()=>{setIsHovered({...isHovered,"tip2":false})}}
                  />
                  {isHovered?.tip2 && <TooltipBox text=" Showcasing the latest videos. Earnings vary based on content quality and audience engagement" />}
                </span>
              </div>

              {Potential?.filter((e, i) => {
                return i !== 0;
              })?.map((element, i) => {
                return (
                  <VideoDataContainer
                    key={element?.videoId}
                    {...element}
                    index={i + 1}
                  />
                );
              })}
            </section>
          </div>
        </div>

        {openRequestModal && (
          <RequestModal
            onClose={() => {
              setOpenRequestModal(false);
            }}
            setOpenOTPModal={setOpenOTPModal}
            setFormData={setFormData}
            formData={formData}
          />
        )}

        {openOTPModal && (
          <OtpModal
            onClose={() => {
              setOpenOTPModal(false);
            }}
            setOpenFinalModal={setOpenFinalModal}
            setFormData={setFormData}
            formData={formData}
          />
        )}

        {openFinalModal && (
          <FinalScheduleModal
            onClose={() => {
              setOpenFinalModal(false);
            }}
          />
        )}

        <ToastContainer />

        {/* Footer */}
        <Footer3 />
      </>
    );
  }
}

export default PredictorData;
