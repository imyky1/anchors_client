import React, { useContext, useEffect, useState } from "react";
import "./Success.css";

import { BsWhatsapp, BsInstagram } from "react-icons/bs";
import { FaLinkedinIn, FaFacebookF } from "react-icons/fa";
import { IoCopy, IoCopyOutline } from "react-icons/io5";

import { Navbar2 } from "../../../Layouts/Navbar User/Navbar";
import { ToastContainer } from "react-toastify";
import { MainNewFooter } from "../../../Footer/Footer";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { FiDownload } from "react-icons/fi";

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

const EventCountDown = ({ duration }) => {
  const [time, setTime] = useState(duration);

  const [finalData, setFinalData] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  function convertMilliseconds(milliseconds) {
    // Calculate days, hours, minutes, and seconds
    const days = Math.floor(milliseconds / (1000 * 60 * 60 * 24));
    milliseconds %= 1000 * 60 * 60 * 24;

    const hours = Math.floor(milliseconds / (1000 * 60 * 60));
    milliseconds %= 1000 * 60 * 60;

    const minutes = Math.floor(milliseconds / (1000 * 60));
    milliseconds %= 1000 * 60;

    const seconds = Math.floor(milliseconds / 1000);

    return {
      days: days,
      hours: hours,
      minutes: minutes,
      seconds: seconds,
    };
  }

  useEffect(() => {
    setTime(duration);
  }, [duration]);

  useEffect(() => {
    if (time) {
      setTimeout(() => {
        setTime(time - 1000);
      }, 1000);
      let data = convertMilliseconds(time);
      setFinalData({ ...data });
    }
  }, [time]);

  return (
    <div className="event_countdown_event_success_page">
      <h2>Event Starts In</h2>

      <section>
        <div>
          <span>{finalData?.days}</span>
          <p>DAYS</p>
        </div>
        <span>:</span>
        <div>
          <span>{finalData?.hours}</span>
          <p>HOURS</p>
        </div>
        <span>:</span>
        <div>
          <span>{finalData?.minutes}</span>
          <p>MINUTES</p>
        </div>
        <span>:</span>
        <div>
          <span>{finalData?.seconds}</span>
          <p>SECONDS</p>
        </div>
      </section>
    </div>
  );
};

function StaticSuccess() {
  const [leaderBoardData, setLeaderBoardData] = useState([
    {
      name: "Komal",
      points: 25,
      profile:
        "https://img.freepik.com/premium-vector/3d-young-woman-avatar-happy-smiling-face-icon_313242-1241.jpg",
    },
    {
      name: "Anushka",
      points: 20,
      profile:
        "https://static.vecteezy.com/system/resources/previews/002/002/257/original/beautiful-woman-avatar-character-icon-free-vector.jpg",
    },
    {
      name: "Riya",
      points: 15,
      profile:
        "https://static.vecteezy.com/system/resources/thumbnails/004/899/680/small/beautiful-blonde-woman-with-makeup-avatar-for-a-beauty-salon-illustration-in-the-cartoon-style-vector.jpg",
    },
    { name: "Rachit", points: 14 },
    { name: "Ayesha", points: 12 },
    { name: "Mohit", points: 11 },
    { name: "Kundan", points: 8 },
    { name: "Yuvraj", points: 7, user: true },
  ]);

  return (
    <>
      <ToastContainer theme="dark" />

      <div className="success_page_wrapper">
        {/* main hero section details */}
        <section className="main_header_component_success_page">
          <Navbar2 noAccount={true} />

          <div className="main_hero_details_benefits">
            <section className="left_benefit_section_hero_success">
              <div className="banner_success_page">
                <LazyLoadImage
                  src={require("../Sample Page/images/Banner1.webp")}
                  alt="Event Banner"
                />
                <span>
                  <FiDownload
                    size={20}
                    style={{ position: "relative", left: "5px", bottom: "5px" }}
                  />
                </span>
              </div>
            </section>

            {window.screen.width > 600 && (
              <section className="right_benefit_section_hero_success">
                <EventCountDown duration={2002320000} />
              </section>
            )}
          </div>
        </section>

        <section className="referal_benefits_section_event_success_page">
          <h1>Top Referral Benefits</h1>
          <p id="benefits-success">
            <p>
              Exclusive benefits await those individuals who utilize their
              unique referral code to bring in the maximum number of
              attendees!&nbsp;
            </p>
            <p>&nbsp;</p>
            <p>These benefits include:</p>
            <p>&nbsp;</p>
            <ol>
              <li>
                <strong>Rank 01</strong> - 100% refund for the Webinar!
              </li>
              <li>
                <strong>Rank 02</strong> - A 1:1, 15 min session with me!
              </li>
              <li>
                <strong>Rank 03</strong> - Access to my exclusive Interview
                Cheatsheet!
              </li>
            </ol>
          </p>
        </section>

        {/* Leader Board Section */}

        <section className="leaderboard_rest_data_success_page">
          <section>
            <h1>Leader Board</h1>
            <p className="leaderboard_status_text_event_success">
              {leaderBoardData?.text}
            </p>
          </section>

          {/* Table for other ranks ------------- */}

          <div className="leader_board_table_success">
            <section className="table_head_leaderboard_success">
              <span>Rank</span>
              <span>User name</span>
              <span>Referrals</span>
            </section>

            {leaderBoardData?.map((element, i) => {
              return (
                <TableComponent
                  key={element?.id}
                  {...element}
                  index={
                    leaderBoardData?.showUserInExtra?.value ||
                    element?.points === 0
                      ? "--"
                      : i + 1
                  }
                  userComponent={element.isUser}
                />
              );
            })}
          </div>
        </section>

        <div className="floater_success_page_events">
          <section onClick={() => {}}>
            <input
              type="text"
              value=""
              readOnly
              placeholder="Unique Referral link"
            />
            <IoCopyOutline
              size={window.screen.width > 600 ? 30 : 20}
              color="#D0D0D0"
            />
          </section>
          <BsWhatsapp
            size={window.screen.width > 600 ? 40 : 25}
            color="#D0D0D0"
            onClick={() => {}}
          />
        </div>

        <MainNewFooter
          onEvents={true}
          hostEventButton={true}
          footerOptions1={[
            {
              title: "Event Pricing",
              link: "https://www.anchors.in/eventpricing",
            },
            {
              title: "Sample Event Page",
              link: "https://www.anchors.in/e/how-to-become-a-product-manager",
            },
            {
              title: "Sample Referral Page",
              link: "https://www.anchors.in/static/success",
            },
          ]}
          noPrivacyPolicy={false}
          noRefund={false}
          useEventsLogo={true}
        />
      </div>
    </>
  );
}

export default StaticSuccess;
