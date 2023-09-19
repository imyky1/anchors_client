import React, { useEffect, useRef, useState } from "react";
import "./defaultBanner.css";
import Doc from "../../../Utils/Icons/Canvas Banner/DocIcon.svg";
import Excel from "../../../Utils/Icons/Canvas Banner/ExcelIcon.svg";
import Video from "../../../Utils/Icons/Canvas Banner/VideoIcon.svg";
import ExcelWhite from "../../../Utils/Icons/Canvas Banner/ExcelIconWhite.svg";
import VideoWhite from "../../../Utils/Icons/Canvas Banner/VideoIconWhite.svg";
import { ToastContainer, toast } from "react-toastify";
import excel from "./TestImage/excel.svg";
import excelL from "./TestImage/excellarge.svg";
import pdf from "./TestImage/pdf.svg";
import pdfL from "./TestImage/pdflarge.svg";
import video from "./TestImage/video.svg";
import videoL from "./TestImage/videofull.svg";
import bannerRed from "./TestImage/Banner_red.png";
import bannerBlack from "./TestImage/Banner_black.png";
import bannerBlue from "./TestImage/Banner_blue.png";
import html2canvas from "html2canvas";

function DefaultBanner2({ open, onClose, dataToRender, setFinalData }) {
  const htmlElementRef = useRef(null); // desktop banner
  const htmlElementRef2 = useRef(null); // mobile banner
  const [color, setColor] = useState({ background: "Red" });
  const [dataToUse, setDataToUse] = useState({
    background: "",
    smallSVGSource: "",
    SVGSource: "",
    buttonGradient: {},
    svgStyle: {},
    docText: "",
  });

  const handleColorClick = (e) => {
    setColor({ background: e });
  };

  const saveAsImage = () => {
    const element = htmlElementRef.current;
    const mobileElement = htmlElementRef2.current;

    let formData = new FormData()

    html2canvas(element).then(function (canvas) {
      canvas.toBlob(function (blob) {
        formData.append("file", blob, "image.png");
      });
    });

    html2canvas(mobileElement).then(function (canvas) {
      canvas.toBlob(function (blob) {
        var objectURL = URL.createObjectURL(blob);
        const formData2 = new FormData();
        formData2.append("file", blob, "mobimage.png");
        setFinalData(formData, formData2, objectURL);
      });
    });
  };

  useEffect(() => {
    setDataToUse({
      background:
        color?.background === "Red"
          ? bannerRed
          : color?.background === "Blue"
          ? bannerBlue
          : bannerBlack,
      smallSVGSource:
        dataToRender?.type === "excel"
          ? excel
          : dataToRender?.type === "video"
          ? video
          : pdf,
      SVGSource:
        dataToRender?.type === "excel"
          ? excelL
          : dataToRender?.type === "video"
          ? videoL
          : pdfL,
      buttonGradient:
        color?.background === "Red"
          ? {
              background: "linear-gradient(270deg, #A10303 0%, #121212 100%)",
            }
          : color?.background === "Blue"
          ? {
              background: "linear-gradient(270deg, #5E17FE 0%, #2C0090 100%)",
            }
          : {
              background: "linear-gradient(270deg, #121212 0%, #464646 100%)",
            },
      svgStyle:
        dataToRender?.type === "pdf" ? { opacity: "0.20000000298023224" } : {},
      docText:
        dataToRender?.type === "excel"
          ? "Excel Sheet"
          : dataToRender?.type === "video"
          ? "Video"
          : "PDF",
    });
  }, [dataToRender, color]);

  useEffect(() => {
    if (dataToRender?.sname === "") {
      toast.info("Fill the service title to generate the banner", {
        position: "top-center",
        autoClose: 2000,
      });
      onClose();
    }
  }, [open]);

  if (!open) {
    return null;
  }

  return (
    <>
      <div className="default_previewer_wrapper">
        <div>
          {/* Html banner ------------------------------- */}
          <div className="outer" ref={htmlElementRef}>
            <img src={dataToUse?.background} />
            <div>
              <div className="outer_01">
                <div className="type_01">
                  <img src={dataToUse?.smallSVGSource} alt="Small SVG" />
                  <div className="type_text">{dataToUse?.docText}</div>
                </div>
                <div className="type_title">{dataToRender?.sname}</div>
                <div className="creator_name" style={dataToUse?.buttonGradient}>
                  By {dataToRender?.cname}{" "}
                </div>
              </div>
              <div className="right_image">
                <img
                  src={dataToUse?.SVGSource}
                  style={dataToUse?.svgStyle}
                  alt="SVG"
                />
              </div>
            </div>
          </div>

          <div
            className="mobile_banner"
            ref={htmlElementRef2}
          >
            <img src={dataToUse?.background} />
            <div>
              <div className="mobile_banner_outer_01">
                <div className="mobile_banner_type_01">
                  <img src={dataToUse?.smallSVGSource} alt="Small SVG" />
                  <div className="mobile_banner_type_text">
                    {dataToUse?.docText}
                  </div>
                </div>
                <div className="mobile_banner_type_title">
                  {dataToRender?.sname}
                </div>
                <div
                  className="mobile_banner_creator_name"
                  style={dataToUse?.buttonGradient}
                >
                  By {dataToRender?.cname}{" "}
                </div>
              </div>
              <div className="mobile_banner_right_image">
                <img
                  src={dataToUse?.SVGSource}
                  style={dataToUse?.svgStyle}
                  alt="SVG"
                />
              </div>
            </div>
          </div>

          <section className="default_options_sections">
            <div>
              <span
                className={`normal_color_option_default_banner ${
                  color?.background === "Red" &&
                  "active_color_option_default_banner"
                }`}
                onClick={() => {
                  handleColorClick("Red");
                }}
              >
                <span style={{ backgroundColor: "#E84142" }}></span>
              </span>
              <span
                className={`normal_color_option_default_banner ${
                  color?.background === "Blue" &&
                  "active_color_option_default_banner"
                }`}
                onClick={() => {
                  handleColorClick("Blue");
                }}
              >
                <span style={{ backgroundColor: "#5E17FE" }}></span>
              </span>
              <span
                className={`normal_color_option_default_banner ${
                  color?.background === "Black" &&
                  "active_color_option_default_banner"
                }`}
                onClick={() => {
                  handleColorClick("Black");
                }}
              >
                <span style={{ backgroundColor: "#151515" }}></span>
              </span>
            </div>

            <section>
              <button onClick={onClose}>Close</button>
              <button
                onClick={() => {
                  // handleDownloadClick();
                  saveAsImage();
                  onClose();
                  toast.success("Banner Saved Successfully", {
                    autoClose: 1500,
                  });
                }}
              >
                Save
              </button>
            </section>
          </section>
        </div>
      </div>

      <ToastContainer limit={1} />
    </>
  );
}

const DefaultBannerMobile = ({ open, onClose, dataToRender, setFinalData }) => {
  const htmlElementRef = useRef(null);
  const [color, setColor] = useState({ background: "Red" });
  const [dataToUse, setDataToUse] = useState({
    background: "",
    smallSVGSource: "",
    SVGSource: "",
    buttonGradient: {},
    svgStyle: {},
    docText: "",
  });

  const handleColorClick = (e) => {
    setColor({ background: e });
  };

  const saveAsImage = () => {
    const element = htmlElementRef.current;

    html2canvas(element).then(function (canvas) {
      canvas.toBlob(function (blob) {
        var objectURL = URL.createObjectURL(blob);
        const formData = new FormData();
        formData.append("file", blob, "image.png");
        setFinalData(formData, objectURL);
      });
    });
  };

  useEffect(() => {
    setDataToUse({
      background:
        color?.background === "Red"
          ? bannerRed
          : color?.background === "Blue"
          ? bannerBlue
          : bannerBlack,
      smallSVGSource:
        dataToRender?.type === "excel"
          ? excel
          : dataToRender?.type === "video"
          ? video
          : pdf,
      SVGSource:
        dataToRender?.type === "excel"
          ? excelL
          : dataToRender?.type === "video"
          ? videoL
          : pdfL,
      buttonGradient:
        color?.background === "Red"
          ? {
              background: "linear-gradient(270deg, #A10303 0%, #121212 100%)",
            }
          : color?.background === "Blue"
          ? {
              background: "linear-gradient(270deg, #5E17FE 0%, #2C0090 100%)",
            }
          : {
              background: "linear-gradient(270deg, #121212 0%, #464646 100%)",
            },
      svgStyle:
        dataToRender?.type === "pdf" ? { opacity: "0.20000000298023224" } : {},
      docText:
        dataToRender?.type === "excel"
          ? "Excel Sheet"
          : dataToRender?.type === "video"
          ? "Video"
          : "PDF",
    });
  }, [dataToRender, color]);

  useEffect(() => {
    if (dataToRender?.sname === "") {
      toast.info("Fill the service title to generate the banner", {
        position: "top-center",
        autoClose: 2000,
      });
      onClose();
    }
  }, [open]);

  if (!open) {
    return null;
  }

  return (
    <>
      <div className="default_previewer_wrapper">
        <div>
          {/* Html banner ------------------------------- */}
          <div className="outer" ref={htmlElementRef}>
            <img src={dataToUse?.background} />
            <div>
              <div className="outer_01">
                <div className="type_01">
                  <img src={dataToUse?.smallSVGSource} alt="Small SVG" />
                  <div className="type_text">{dataToUse?.docText}</div>
                </div>
                <div className="type_title">{dataToRender?.sname}</div>
                <div className="creator_name" style={dataToUse?.buttonGradient}>
                  By {dataToRender?.cname}{" "}
                </div>
              </div>
              <div className="right_image">
                <img
                  src={dataToUse?.SVGSource}
                  style={dataToUse?.svgStyle}
                  alt="SVG"
                />
              </div>
            </div>
          </div>

          <section className="default_options_sections">
            <div>
              <span
                className={`normal_color_option_default_banner ${
                  color?.background === "Red" &&
                  "active_color_option_default_banner"
                }`}
                onClick={() => {
                  handleColorClick("Red");
                }}
              >
                <span style={{ backgroundColor: "#E84142" }}></span>
              </span>
              <span
                className={`normal_color_option_default_banner ${
                  color?.background === "Blue" &&
                  "active_color_option_default_banner"
                }`}
                onClick={() => {
                  handleColorClick("Blue");
                }}
              >
                <span style={{ backgroundColor: "#5E17FE" }}></span>
              </span>
              <span
                className={`normal_color_option_default_banner ${
                  color?.background === "Black" &&
                  "active_color_option_default_banner"
                }`}
                onClick={() => {
                  handleColorClick("Black");
                }}
              >
                <span style={{ backgroundColor: "#151515" }}></span>
              </span>
            </div>

            <section>
              <button onClick={onClose}>Close</button>
              <button
                onClick={() => {
                  // handleDownloadClick();
                  saveAsImage();
                  onClose();
                  toast.success("Banner Saved Successfully", {
                    autoClose: 1500,
                  });
                }}
              >
                Save
              </button>
            </section>
          </section>
        </div>
      </div>

      <ToastContainer limit={1} />
    </>
  );
};

export default DefaultBanner2;
