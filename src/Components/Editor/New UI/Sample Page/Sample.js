import React, { useEffect, useState } from "react";
import "./Sample.css";
import "../Event Page/Event";
import { motion } from "framer-motion";

import Banner1 from "./images/Banner (6)-min.webp";
import Banner2 from "./images/Banner (8)-min.webp";
import Banner3 from "./images/Banner (9)-min.webp";
import Banner4 from "./images/Banner (10)-min.webp";
import Banner5 from "./images/Banner (11)-min.webp";
import mixpanel from "mixpanel-browser";
import { MdEventSeat, MdKeyboardArrowDown } from "react-icons/md";
import { TbMapSearch } from "react-icons/tb";
import { MainNewFooter } from "../../../Footer/Footer";
import { EventsNavbar } from "../../../Layouts/Navbar Creator/Navbar";

const PersonalizedSection = () => {
  const containerVariant = (index) => {
    let yoffset;
    let xoffset;
    let time;

    switch (index) {
      case 0:
        yoffset = 0;
        xoffset = window.screen.width > 600 ? 140 : 120;
        time = 0.2;
        break;
      case 1:
        yoffset = -40;
        xoffset = window.screen.width > 600 ? 70 : 44;
        time = 0.4;
        break;
      case 2:
        yoffset = -80;
        xoffset = 0;
        time = 0.6;
        break;
      case 3:
        yoffset = -40;
        xoffset = window.screen.width > 600 ? -70 : -44;
        time = 0.4;
        break;
      case 4:
        yoffset = 0;
        xoffset = window.screen.width > 600 ? -140 : -120;
        time = 0.2;
        break;
    }

    return {
      from: {
        opacity: 0,
        y: "300px",
      },
      to: {
        opacity: 1,
        y: yoffset + "px",
        x: xoffset + "px",
        transition: {
          duration: time * 2,
          ease: "easeInOut",
        },
      },
    };
  };

  const imgSrc = [Banner1, Banner2, Banner3, Banner4, Banner5];

  return (
    <section className="personalized_section_sample_page">
      <div>
        {imgSrc?.map((e, i) => {
          return (
            <motion.img
              variants={containerVariant(i)}
              initial="from" // here default type is tween and not spring because it has duration
              whileInView="to"
              viewport={{ once: true }}
              src={e}
              alt=""
              key={i}
            />
          );
        })}
      </div>
      <h2 className="header_sample_page01">
        Personalized Invitation Cards: Designed to Impress
      </h2>
      <p className="header_sample_page02" style={{ textAlign: "center" }}>
        Give Your Attendees a Personalized Touch - Shareable Invite Cards They
        Can Proudly Share on Social Platforms!
      </p>
      <button
        className="button_sample_page01"
        onClick={() => {
          window.open("/static/success");
          mixpanel.track("Explore a Sample 3");
        }}
      >
        <TbMapSearch size={32} /> Explore a Sample
      </button>
    </section>
  );
};

function Sample() {
  useEffect(() => {
    mixpanel.track("Page Visit");
  }, []);

  const imgVariant = (scale = 1) => {
    return {
      from: {
        opacity: 0,
        scale: 0.8,
      },
      to: {
        opacity: 1,
        scale: scale,
        transition: {
          duration: 2,
        },
      },
    };
  };

  const textVariant01 = (timedelay = 0.85) => {
    return {
      from: {
        opacity: 0,
      },
      to: {
        opacity: 1,
        transition: {
          duration: timedelay,
          // ease: "ease",
        },
      },
    };
  };

  return (
    <div className="sample_page_wrapper">
      {/* Hero Section  */}
      <section
        className="main_header_component_event_page"
        style={{ position: "relative" }}
      >
        <EventsNavbar
          noAccount={true}
          showPricingButton={false}
          backgroundDark={true}
        />

        {/* Main detail of the component */}

        <div className="main_title_event_box">
          <motion.h1
            style={window.screen.width > 600 ? { textTransform: "unset" } : {}}
            initial="from"
            animate="to"
            variants={textVariant01()}
          >
            Supercharge your Event's Success with{" "}
            <span style={{ color: "red" }}>anchors!</span>
          </motion.h1>

          <motion.section
            className="button_event_landing"
            initial="from"
            animate="to"
            variants={textVariant01(1.5)}
          >
            <button
              onClick={() => {
                localStorage.getItem("jwtToken") &&
                localStorage.getItem("isUser") === ""
                  ? window.open("/dashboard", "_self")
                  : window.open("/signup/creators", "_self");

                mixpanel.track("Host Your Event");
              }}
            >
              <MdEventSeat size={32} /> Host Your Event
            </button>

            <span>It takes only 30 sec to create an event</span>
          </motion.section>
        </div>

        <a href="#benefits">
          <MdKeyboardArrowDown className="arrow_button_sample_page" />
        </a>
      </section>

      {/* benefits section ----------- */}

      <section className="benefits_sample_page" id="benefits">
        <h2>
          Your Event, Your Spotlight –{" "}
          <span style={{ color: "red" }}>anchors</span> Takes Care of the Rest!
        </h2>
        <section>
          <div className="left_division_sample_page">
            <h2 className="header_sample_page01">Design Stunning Pages</h2>
            <p className="header_sample_page02">
              Immerse Your Audience in Eye-Catching Event Pages that Make a
              Lasting Impression.
            </p>
            <button
              className="button_sample_page01"
              onClick={() => {
                window.open("https://go.anchors.in/PvlD");
                mixpanel.track("Explore a Sample 1");
              }}
            >
              <TbMapSearch size={32} /> Explore a Sample
            </button>
          </div>
          <div className="right_division_sample_page">
            <motion.img
              src={
                "https://anchors-assets.s3.amazonaws.com/1695190934103-Device_-_Macbook_Air_(3)-min.webp"
              }
              alt=""
              variants={imgVariant(1)}
              initial="from" // here default type is tween and not spring because it has duration
              whileInView="to"
              viewport={{ once: true }}
            />
          </div>
        </section>
      </section>

      <section className="sample_page_divison_section">
        <div className="left_division_sample_page">
          <h2 className="header_sample_page01">
            Boost Your Reach with Our Dynamic Referral Program
          </h2>
          <p className="header_sample_page02">
            Amplify Word-of-Mouth Impact: Reward Top Referrers, Encourage
            Engagement & Friendly Competition!
          </p>
          <button
            className="button_sample_page01"
            onClick={() => {
              window.open("/static/success");
              mixpanel.track("Explore a Sample 2");
            }}
          >
            <TbMapSearch size={32} /> Explore a Sample
          </button>
        </div>
        <div className="right_division_sample_page2">
          <motion.img
            src={
              "https://anchors-assets.s3.amazonaws.com/1695190919240-iPhone_14_Pro_Mockup_2jkgcuakbau-min.webp"
            }
            alt=""
            variants={imgVariant(window.screen.width < 600 ? 1.5 : 1)}
            initial="from" // here default type is tween and not spring because it has duration
            whileInView="to"
            viewport={{ once: true }}
          />
        </div>
      </section>

      {/* Personalized section */}
      <PersonalizedSection />

      <section className="sharing_section_sample_page">
        <div>
          <h2 className="header_sample_page01">Seamless Content Sharing</h2>
          <p className="header_sample_page02">
            Effortless Event Content Sharing: Focus on What Matters, We Handle
            the Rest!
          </p>
          <button
            className="button_sample_page01"
            onClick={() => {
              window.open("/static/success");
              mixpanel.track("Explore a Sample 4");
            }}
          >
            <TbMapSearch size={32} /> Explore a Sample
          </button>
        </div>
        <motion.img
          src={
            "https://anchors-assets.s3.amazonaws.com/1695190945857-iPhone_14_Pro_Mockup_2_guccgadvhakl-min.webp"
          }
          alt=""
          variants={imgVariant(window.screen.width < 600 ? 1.5 : 1)}
          initial="from" // here default type is tween and not spring because it has duration
          whileInView="to"
          viewport={{ once: true }}
        />
      </section>

      <section className="extra_section_sample_page">
        <h3>Ready to Transform Your Event Hosting Experience?</h3>
        <button
          className="button_sample_page01"
          onClick={() => {
            localStorage.getItem("jwtToken") &&
            localStorage.getItem("isUser") === ""
              ? window.open("/dashboard", "_self")
              : window.open("/signup/creators", "_self");
            mixpanel.track("Yes, I'm ready!");
          }}
        >
          Yes, I'm ready!{" "}
        </button>
      </section>

      <MainNewFooter
        onEvents={true}
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
  );
}

export default Sample;
