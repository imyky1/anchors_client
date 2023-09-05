import React, { useContext, useEffect, useState } from "react";
import "./Success.css";

import { BsWhatsapp, BsInstagram } from "react-icons/bs";
import { FaLinkedinIn, FaFacebookF } from "react-icons/fa";
import { IoCopy } from "react-icons/io5";

import bronze from "../../../../Utils/Icons/bronze-trophy.svg";
import silver from "../../../../Utils/Icons/silver-trophy.svg";
import gold from "../../../../Utils/Icons/gold-trophy.svg";
import { Navbar2 } from "../../../Layouts/Navbar User/Navbar";
import { ToastContainer } from "react-toastify";


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
          <Navbar2  noAccount={true}/>

          <div className="main_hero_details_benefits">
            <section className="left_benefit_section_hero_success">
              <div className="banner_success_page">
                <img
                  src="https://anchors-assets.s3.ap-south-1.amazonaws.com/websiteImages/Banner (8).png"
                  alt="Event Banner"
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
              >
                <input
                  type="text"
                  placeholder="Unique Referral link"
                  disabled
                />
                <IoCopy
                  style={{ position: "absolute", right: "10px" }}
                  color="black"
                  size={20}
                />
              </div>

              <section>
                <BsWhatsapp />
                <FaLinkedinIn />
                <BsInstagram />
                <FaFacebookF />
              </section>
            </section>

            <section className="right_benefit_section_hero_success">
              <h1>Benefits</h1>
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
                  <img src={leaderBoardData[1]?.profile} alt="" />
                </div>
                <span style={{ color: "#737373" }}>2</span>
              </div>

              <img src={silver} alt="silver" />

              <h2>{leaderBoardData && leaderBoardData[1]?.name}</h2>
              <span>{leaderBoardData && leaderBoardData[1]?.points}</span>
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
                      leaderBoardData?.length > 0
                        ? leaderBoardData[0]?.profile
                        : "https://img.freepik.com/premium-photo/red-question-mark-isolated-white_3482-715.jpg?w=2000"
                    }
                    alt=""
                  />
                </div>
                <span style={{ color: "#CA9100" }}>1</span>
              </div>

              <img src={gold} alt="gold" />

              <h2>{leaderBoardData && leaderBoardData[0]?.name}</h2>
              <span>{leaderBoardData && leaderBoardData[0]?.points}</span>
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
                      leaderBoardData?.length > 2
                        ? leaderBoardData[2]?.profile
                        : "https://img.freepik.com/premium-photo/red-question-mark-isolated-white_3482-715.jpg?w=2000"
                    }
                  />
                </div>
                <span style={{ color: "#EA9542" }}>3</span>
              </div>

              <img src={bronze} alt="bronze" />

              <h2>{leaderBoardData && leaderBoardData[2]?.name}</h2>
              <span>{leaderBoardData && leaderBoardData[2]?.points}</span>
            </section>
          </div>

          {/* Table for other ranks ------------- */}
        </section>
        {leaderBoardData?.length > 2 && (
          <div className="leader_board_table_success">
            <section className="table_head_leaderboard_success">
              <span>Rank</span>
              <span>User Name</span>
              <span>Referrals</span>
            </section>

            {leaderBoardData?.slice(3)?.map((element, i) => {
              return (
                <TableComponent
                  key={element?.id}
                  {...element}
                  index={i + 4}
                  userComponent={element.user}
                />
              );
            })}
          </div>
        )}
      </div>
    </>
  );
}

export default StaticSuccess;
