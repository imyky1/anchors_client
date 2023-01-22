import React from "react";
import png1 from "./BG3.png";
import { BsLinkedin } from "react-icons/bs";
import "./homestyle.css";

const Homepageui = () => {
  return (
    <div className="creator_section_wrapper">
      <div className="creator_section_content">
        <div className="creator_section_title">
          <h1>People who Trust us </h1>
          <span>
            Building Trust: The Key to Strong and Lasting Relationships
          </span>
        </div>
        <div className="creator_section_cardsection">
          <div className="creator_section_cardsection_card1">
            <img src={png1} alt="creator"></img>
            <div className="creator_section_imagetext">
              <div className="creator_section_imagewrap">
                <div className="creator_section_imagetext_text">
                  <span>Courtney Henry</span>
                  <span>Youtube 100K Followers</span>
                </div>
                <div className="creator_section_icon">
                  <BsLinkedin size={23} />
                </div>
              </div>
            </div>
          </div>
          <div className="creator_section_cardsection_card1">
            {" "}
            <img src={png1} alt="creator"></img>
            <div className="creator_section_imagetext">
              <div className="creator_section_imagewrap">
                <div className="creator_section_imagetext_text">
                  <span>Courtney Henry</span>
                  <span>Youtube 100K Followers</span>
                </div>
                <div className="creator_section_icon">
                  <BsLinkedin size={23} />
                </div>
              </div>
            </div>
          </div>
          <div className="creator_section_cardsection_card1">
            {" "}
            <img src={png1} alt="creator"></img>
            <div className="creator_section_imagetext">
              <div className="creator_section_imagewrap">
                <div className="creator_section_imagetext_text">
                  <span>Courtney Henry</span>
                  <span>Youtube 100K Followers</span>
                </div>
                <div className="creator_section_icon">
                  <BsLinkedin size={23} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Homepageui;
