import React, { useContext, useEffect, useState } from "react";
import "./Predictor.css";
import Navbar from "../Layouts/Navbar Creator/Navbar";
import { AiFillYoutube } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import { EPAcontext } from "../../Context/EPAState";
import mixpanel from "mixpanel-browser";

function Predictor() {
  const [formData, setFormData] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    mixpanel.track("Page Visit");
  }, []);

  const { saveYoutubeData } = useContext(EPAcontext);

  const [videoId, setvideoId] = useState("");

  const getAndSaveData = async (videoId) => {
    // Calling the save function to save the data and the youtube api to get the data :-
    const response = await fetch(
      `https://youtube.googleapis.com/youtube/v3/videos?part=snippet%2CcontentDetails%2Cstatistics&id=${videoId}&key=${process.env.REACT_APP_GOOGLE_LIVE_API}`,
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

    await saveYoutubeData(
      videoDetails?.items[0]?.snippet?.channelTitle,
      videoDetails?.items[0]?.snippet?.channelId,
      channelDetails?.items[0]?.statistics?.subscriberCount,
      activeSubs,
      channelDetails?.items[0]?.statistics?.viewCount,
      channelDetails?.items[0]?.snippet?.publishedAt,
      channelDetails,
      1
    );
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

  const handleChange = async (e) => {
    setFormData(e.target.value);

    // Remove the "ab_channel" parameter from the URL
    // var modifiedUrl = e.target.value.replace(/(\?|&)ab_channel=[^&]+/, "");

    // Regular expression patterns to match valid YouTube video URLs
    var youtubeLongPattern =
      /^(https?:\/\/)?(www\.)?youtube\.com\/watch\?v=([a-zA-Z0-9_-]{11})(&.*)?$/;
    var youtubeShortPattern =
      /^(https?:\/\/)?(www\.)?youtu\.be\/([a-zA-Z0-9_-]{11})$/;

    let videoId;

    // Valid YouTube video URL entered
    if (youtubeLongPattern.test(e?.target?.value)) {
      mixpanel.track("Input URL");
      const url = new URL(e.target.value);
      const params = new URLSearchParams(url.search);
      videoId = params.get("v");
      setvideoId(videoId);
      getAndSaveData(videoId);
    } else if (youtubeShortPattern.test(e.target.value)) {
      mixpanel.track("Input URL");
      const url = new URL(e.target.value);
      videoId = url.pathname.slice(1);
      setvideoId(videoId);
      getAndSaveData(videoId);
    }
  };

  const handleSubmit = () => {
    mixpanel.track("Check Now");

    navigate(`/earning-predictor/${videoId}`);
  };

  return (
    <div className="earning_outside_wrapper">
      <Navbar backgroundDark={true} />

      <div className="main_form_earning">
        <h1>Discover your earning potential</h1>
        <span>
          Turn your YouTube expertise into a lucrative income source though
          resource sharing
        </span>

        <section>
          <div>
            <AiFillYoutube />
            <input
              type="text"
              placeholder="Enter your youtube video url"
              onChange={handleChange}
              value={formData}
              onFocus={() => {
                mixpanel.track("Input Box Focus");
              }}
            />
          </div>
          <button onClick={handleSubmit}>Check Now</button>
        </section>
      </div>
    </div>
  );
}

export default Predictor;
