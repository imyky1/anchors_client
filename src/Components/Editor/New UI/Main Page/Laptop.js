import React, { useState, useEffect } from "react";
import "./Laptop.css";
import pdf from "./home_images/pdf.webp";
import video from "./home_images/video.webp";
import excel from "./home_images/excel.webp";
import { motion } from "framer-motion";
import { useLocation } from "react-router-dom";

const containerVariant = (index) => {
  let time;

  switch (index) {
    case 0:
      time = 0.9;
      break;
    case 1:
      time = 0.4;
      break;
    case 2:
      time = 0.9;
      break;
  }

  return {
    from: {
      opacity: 0,
    },
    to: {
      opacity: 1,
      transition: {
        duration: time * 3,
        ease: "easeInOut",
      },
    },
  };
};

const Laptop = () => {
  const sliderItems = [
    {
      image: pdf,
      heading: "PDF",
      desc: "Interview Questions, Top 10 Lists, Question Banks, etc.",
    },
    {
      image: video,
      heading: "Events & Webinars",
      desc: "Host Webinars, workshops, Q&A!",
    },
    {
      image: excel,
      heading: "Excel Sheet",
      desc: "Study schedules, Mind maps, Resource Lists, etc.",
    },
  ];
  const [currentIndex, setCurrentIndex] = useState(0);
  const [initialDelayPassed, setInitialDelayPassed] = useState(false);
  const [isHovered, setIsHovered] = useState(false)

  const location = useLocation()
  
  useEffect(()=>{
    setInitialDelayPassed(false)
  },[location])

  const autoSlide = () => {
    setCurrentIndex((currentIndex + 1) % sliderItems.length);
  };

  useEffect(() => {
    const initialDelay = 1000; // 5 seconds in milliseconds

    if(isHovered){
      // do nothing remain as it is
    }
    else if (!initialDelayPassed) {
      const delayTimeout = setTimeout(() => {
        setInitialDelayPassed(true);
      }, initialDelay);

      return () => {
        clearTimeout(delayTimeout);
      };
    } else {
      const intervalId = setInterval(autoSlide, 2000);

      return () => {
        clearInterval(intervalId);
      };
    }
  }, [currentIndex, initialDelayPassed , isHovered]);

  return (
    <div className="container__slider_laptop_home">
      <div className="container_inside_slider_laptop">
        {sliderItems.map((slider, index) => (
          <input
            type="checkbox"
            name="slider"
            id={`item-${index + 1}`}
            key={index}
            checked={currentIndex === index}
          />
        ))}
        <div className="cards_laptop_homepage">
          {sliderItems.map((slider, index) => (
            <label
              className={`card_inside_selection ${
                currentIndex === index ? "selected" : ""
              }`}
              htmlFor={`item-${index + 1}`}
              id={`selector-${index + 1}`}
              key={index}
            >
              <motion.div
                className="all_image_laptop"
                variants={containerVariant(index)}
                initial="from" // here default type is tween and not spring because it has duration
                whileInView="to"
                viewport={{ once: true }}
              >
                <img src={slider.image} alt={`Image ${index + 1}`} onMouseOver={()=>{setIsHovered(true)}} onMouseLeave={()=>{setIsHovered(false)}}/>
                {currentIndex === index && (
                  <>
                    <div className="laptop_images_heading">
                      {slider.heading}
                    </div>
                    <div className="laptop_images_desc">{slider.desc}</div>
                  </>
                )}
              </motion.div>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Laptop;
