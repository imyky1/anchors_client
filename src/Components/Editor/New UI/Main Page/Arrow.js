import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import "./Arrow.css";
import arrow from "./home_images/arrow.svg";

const containerVariant = (index) => {
  let time;

  switch (index) {
    case 0:
      time = 0.3;
      break;
    case 1:
      time = 0.6;
      break;
    case 2:
      time = 0.9;
      break;
  }

  return {
    from: {
      opacity: 0,
      x: "500px",
    },
    to: {
      opacity: 1,
      x: 0,
      transition: {
        duration: time * 2,
        ease: "easeInOut",
      },
    },
  };
};

const Arrow = () => {
  const data = [
    {text:"Apply to join", bold:"anchors"},
    {text:"Our team reviews your profile"},
    {text:"Receive approval to join our community!"},
  ];

  return (
    <div className="arrow_outer_body_section">
      <div className="arrow_inner_body_section_home">
        {data?.map((e, i) => {
          return (
            <motion.div
              className="image-container_arrow"
              key={i}
              variants={containerVariant(i)}
              initial="from" // here default type is tween and not spring because it has duration
              whileInView="to"
            >
              <img
                className="image1_inside_arrow_images"
                src={arrow}
                alt="Arrow"
              />

              <div className="inside_arrow_images-text">{e?.text} <b>{e?.bold}</b></div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default Arrow;
