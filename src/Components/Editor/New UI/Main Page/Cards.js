import React, { useState, useEffect } from "react";
import "./Cards.css";
import { MdGroups } from "react-icons/md";
import stock_graph from "./home_images/stock_graph_card.svg";
import audience from "./home_images/Audience.svg";
import percentage from "./home_images/percentage.svg";
import { motion } from "framer-motion";
import { useLocation } from "react-router-dom";

const containerVariant = (index) => {
  let yoffset = 0;
  let xoffset;
  let time;

  switch (index) {
    case 0:
      // yoffset = 0;
      xoffset = 0;
      time = 0.2;
      break;
    case 1:
      // yoffset = -40;
      xoffset = -28;
      time = 0.3;
      break;
    case 2:
      // yoffset = -80;
      xoffset = -56;
      time = 0.4;
      break;
    case 3:
      // yoffset = -40;
      xoffset = -84;
      time = 0.5;
      break;
  }

  return {
    from: {
      opacity: 0,
      y: "300px",
      x: xoffset + "%",
    },
    to: {
      opacity: 1,
      y: yoffset + "px",
      x: 0,
      transition: {
        duration: time * 2,
        ease: "easeInOut",
      },
    },
  };
};

function SliderCarousel() {
  const [activeSlide, setActiveSlide] = useState(0);
  const [initialDelayPassed, setInitialDelayPassed] = useState(false);
  const location = useLocation();
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    setInitialDelayPassed(false);
  }, [location]);

  useEffect(() => {
    const initialDelay = 2500; // 5 seconds in milliseconds

    if (isHovered) {
      // do nothing remain as it is
    } else if (!initialDelayPassed) {
      const delayTimeout = setTimeout(() => {
        setInitialDelayPassed(true);
      }, initialDelay);

      return () => {
        clearTimeout(delayTimeout);
      };
    } else {
      const interval = setInterval(() => {
        const nextSlide = (activeSlide + 1) % 4;
        setActiveSlide(nextSlide);
      }, 1500);

      return () => {
        clearInterval(interval);
      };
    }
  }, [activeSlide, initialDelayPassed, isHovered]);

  const slideLabels = ["s1", "s2", "s3", "s4"];

  const slideContents = [
    {
      img: <MdGroups style={{ color: "white", fontSize: "80px" }} />,
      title: "Exclusive Creator Community",
      description:
        "Join a quality-driven community of creators to connect, collaborate, and grow together.",
    },
    {
      img: stock_graph,
      title: "Detailed Analysis",
      description:
        "Obtain comprehensive audience analytics to gain insights and make well-informed decisions.",
    },
    {
      img: percentage,
      title: "Offer Free/Paid Content",
      description:
        "Enjoy full control, offering both free and paid content options on our platform",
    },
    {
      img: audience,
      title: "Audience Insight",
      description:
        "Strengthen your bond with the audience by taking their requests and learning about their preferences.",
    },
  ];

  return (
    <div className="container_card" style={{ width: "983px" }}>
      {slideLabels.map((slideLabel, index) => (
        <input
          key={slideLabel}
          type="radio"
          name="slider"
          // className="d-none"
          id={slideLabel}
          checked={index === activeSlide}
        />
      ))}

      <div className="cards_all_inside_homepage">
        {slideLabels.map((slideLabel, index) => (
          <label key={slideLabel} htmlFor={slideLabel} id={`slide${index + 1}`}>
            <motion.div
              className="outer_home_card_body_01"
              variants={containerVariant(index)}
              initial="from" // here default type is tween and not spring because it has duration
              whileInView="to"
              viewport={{ once: true }}
              onMouseOver={() => {
                setIsHovered(true);
              }}
              onMouseLeave={() => {
                setIsHovered(false);
              }}
            >
              {typeof slideContents[index].img === "string" ? (
                <img
                  src={slideContents[index].img}
                  alt={`Slide ${index + 1}`}
                />
              ) : (
                slideContents[index].img
              )}
              <div className="outer_home_card_body_02">
                {slideContents[index].title}
              </div>
              <div className="outer_home_card_body_03">
                {slideContents[index].description}
              </div>
            </motion.div>
          </label>
        ))}
      </div>
    </div>
  );
}

export default SliderCarousel;
