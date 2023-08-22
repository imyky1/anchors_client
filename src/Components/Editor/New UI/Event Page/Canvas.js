import React, { useEffect, useRef, useState } from "react";
import "./Canvas.css";
import { toBlob, toCanvas, toJpeg, toPng } from "html-to-image";
import DateIcon from "../../calendar.svg";
import TimeIcon from "../../clock.svg";
import PNGIMG from "../../../../Utils/Images/default_user.png";
import html2canvas from "html2canvas";

function Canvas({ setBannerData, dataToUse }) {
  const bannerRef = useRef(null);

  // useEffect(() => {
  //   const generateImage = async () => {
  //     try {
  //       const dataUrl = await toJpeg(bannerRef.current);
  //       setBannerData(dataUrl);
  //     } catch (error) {
  //       console.log(error);
  //     }
  //   };

  //   // const generateImage2 = async () => {
  //   //   const element = bannerRef.current;

  //   //   html2canvas(element).then(function (canvas) {
  //   //     canvas.toBlob(function (blob) {
  //   //       const reader = new FileReader();
  //   //       reader.onloadend = function () {
  //   //         const dataURI = reader.result;
  //   //         console.log(dataURI);
  //   //         setBannerData(dataURI);
  //   //       };
  //   //       reader.readAsDataURL(blob);
  //   //     });
  //   //   });
  //   // };

  //   if (dataToUse?.userName) {
  //     generateImage();
  //   }
  // }, [dataToUse, setBannerData]);

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
              <img
                src={dataToUse?.creatorProfile}
                alt=""
                onError={({ currentTarget }) => {
                  currentTarget.onerror = null; // prevents looping
                  currentTarget.src = PNGIMG;
                }}
              />
            </div>
          </section>

          <section className="user_profile_banner">
            <div className="text_box_user_name">
              <span>{dataToUse?.userName}</span>
            </div>
            <div className="user_image_cover_banner">
              <img
                src={dataToUse?.userProfile}
                alt=""
                onError={({ currentTarget }) => {
                  currentTarget.onerror = null; // prevents looping
                  currentTarget.src = PNGIMG;
                }}
              />
            </div>

            <h3>JOIN ALONG WITH ME!</h3>
          </section>

          <section className="date_time_section_banner_single">
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

function Canvas2({ setBannerData, dataToUse }) {
  const bannerRef2 = useRef(null);

  const [speakerImages, setSpeakerImages] = useState([]);
  const [userImage, setuserImage] = useState();

  async function getImageDataURI(imageUrl) {
    try {
      const response = await fetch(imageUrl);

      if (!response.ok) {
        throw new Error("Failed to fetch image");
      }

      const blob = await response.blob();

      // Convert the blob to a Data URI
      const reader = new FileReader();
      return new Promise((resolve, reject) => {
        reader.onloadend = () => {
          resolve(reader.result);
        };
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });
    } catch (error) {
      console.error(error);
      throw error; // Rethrow the error for the caller to handle
    }
  }

  useEffect(() => {
    // const generateImage = async () => {
    //   try {
    //     const dataUrl = await toJpeg(bannerRef2.current);
    //     setBannerData(dataUrl);
    //   } catch (error) {
    //     console.log(error);
    //   }
    // };

    const generateImage2 = async () => {
      try {
        let blob = await toBlob(bannerRef2.current);
        const file = new File([blob], "banner2.png", { type: blob.type });
        // console.log(file,blob)
        // console.log(file)
        setBannerData(URL.createObjectURL(file));
      } catch (error) {
        console.log("some error");
      }
    };

    if (dataToUse?.userName && dataToUse?.speakers) {
      generateImage2();
    }
  }, [dataToUse]);


  return (
    <>
      <Canvas id="canvas_ref" />

      <div className="personalized_card_wrapper" ref={bannerRef2}>
        <img src={require("../../back2.jpeg")} alt="background" />
        <div className="texting_layer_banner">
          <section className="left_side_text">
            <h1>{dataToUse?.eventName}</h1>
            <span>
              by{" "}
              {dataToUse?.speakers?.map((e, index) => {
                return (
                  <span key={index}>
                    {" "}
                    {`${e?.name.split(" ")[0]}${
                      index !== dataToUse?.speakers?.length - 2 &&
                      index !== dataToUse?.speakers?.length - 1
                        ? ", "
                        : ""
                    } ${index === dataToUse?.speakers?.length - 2 ? "&" : ""}`}
                  </span>
                );
              })}
            </span>
          </section>

          <section className="date_time_section_banner_multiple">
            <div>
              <img src={DateIcon} alt="" />
              <span>{dataToUse?.date}</span>
            </div>
            <div>
              <img src={TimeIcon} alt="" />
              <span>{dataToUse?.time}</span>
            </div>
          </section>

          <div className="all_speaker_details_section">
            {dataToUse?.speakers?.map((e, i) => {
              return (
                <section className="creator_profile_banner_multiple">
                  <div className="text_box_creator_name_multiple">
                    <h4>Speaker</h4>
                    <span>{e?.name}</span>
                  </div>
                  <div className="creator_image_cover_banner_multiple">
                    <img
                      src={
                        e?.profile ??
                        dataToUse?.creatorProfile
                      }
                      // src={"https://upload.wikimedia.org/wikipedia/commons/thumb/2/25/Chris_Evans_SDCC_2014.jpg/800px-Chris_Evans_SDCC_2014.jpg"}

                      alt=""
                      onError={({ currentTarget }) => {
                        currentTarget.onerror = null; // prevents looping
                        currentTarget.src = PNGIMG;
                      }}
                    />
                  </div>
                </section>
              );
            })}
          </div>

          <section className="user_profile_banner_multiple">
            <div className="text_box_user_name_multiple">
              <span>{dataToUse?.userName}</span>
            </div>
            <div className="user_image_cover_banner_multiple ">
              <img
                src={dataToUse?.userProfile}
                alt=""
                onError={({ currentTarget }) => {
                  currentTarget.onerror = null; // prevents looping
                  currentTarget.src = PNGIMG;
                }}
              />
            </div>

            <h3>JOIN ALONG WITH ME!</h3>
          </section>
        </div>
      </div>
    </>
  );
}

export default Canvas;
export const MultipleBanner = Canvas2;
