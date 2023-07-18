import React, { useEffect, useRef } from "react";
import "./Canvas.css";
import { toJpeg} from "html-to-image";
import DateIcon from "../../calendar.svg";
import TimeIcon from "../../clock.svg";

function Canvas({ setBannerData, dataToUse }) {
  const bannerRef = useRef(null);

  useEffect(() => {
    const generateImage = async () => {
      try {
        const dataUrl = await toJpeg(bannerRef.current);
        setBannerData(dataUrl);
      } catch (error) {
        console.log(error);
      }
    };

    if (dataToUse.userName) {
      generateImage();
    }
  }, [dataToUse, setBannerData]);

  return (
    <>
      <div className="personalized_card_wrapper" ref={bannerRef}>
        <img src={require("../../back.png")} alt="background" />
        <div className="texting_layer_banner">
          <section className="left_side_text">
            <h1>{dataToUse?.eventName}</h1>
            <span>by {dataToUse?.creatorName}</span>
          </section>

          <section className="creator_profile_banner">
            <div className="text_box_creator_name">
              <h4>Speaker</h4>
              <span>{dataToUse?.creatorName}</span>
            </div>
            <div className="creator_image_cover_banner">
              <img src={dataToUse?.creatorProfile} alt="" />
            </div>
          </section>

          <section className="user_profile_banner">
            <div className="text_box_user_name">
              <span>{dataToUse?.userName}</span>
            </div>
            <div className="user_image_cover_banner">
              <img src={dataToUse?.userProfile} alt="" />
            </div>

            <h3>JOIN ALONG WITH ME!</h3>
          </section>

          <section className="date_time_section_banner">
            <div>
              <img src={DateIcon} alt="" />
              <span>{dataToUse?.date}</span>
            </div>
            <div>
              <img src={TimeIcon} alt="" />
              <span>{dataToUse?.time}</span>
            </div>
          </section>
        </div>
      </div>
    </>
  );
}

export default Canvas;
