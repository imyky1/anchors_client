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
import { toBlob, toJpeg, toPng } from "html-to-image";
import html2canvas from "html2canvas";

function DefaultBanner({ open, onClose, dataToRender, setFinalData }) {
  const canvasRef = useRef();
  const [color, setColor] = useState({ background: "Red" });

  const drawCanvas = (type, sname, cname) => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d", {
      alpha: false,
      desynchronized: true,
      depth: true,
      antialias: true,
    });
    const radius = 220;

    // Start new path
    ctx.beginPath();

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.clearRect(30, canvas.height - 80, canvas.width - 60, 50);
    ctx.clearRect(
      canvas.width - 160 - radius,
      canvas.height / 2 + 80 - radius,
      2 * radius,
      2 * radius
    );

    // Creating the outer rectangle-----------
    ctx.fillStyle =
      color.color?.background === "Black"
        ? "#151515"
        : color.color?.background === "Blue"
        ? "#5E17FE"
        : "#E84142";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // FIle type extenxion  -------------------------------------------
    // Draw a rounded rectangle with a white border
    const height2 = 23;
    const borderRadius = 35;

    // Draw the "Excel file" text in the center of the rectangle
    const text1 =
      type === "excel"
        ? "Excel Sheet"
        : type === "video"
        ? "Video"
        : "Document";
    ctx.fillStyle = "#FFFFFF";
    ctx.font = "500 14px Inter";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    var textWidth = ctx.measureText(text1).width;
    ctx.fillText(text1, 60 + (textWidth + 24) / 2, 80 + height2 / 2);

    ctx.strokeStyle = "#FFFFFF";
    ctx.fillStyle = "transparent";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.roundRect(60, 80, textWidth + 24, height2, [borderRadius]);
    ctx.stroke();

    // Set the font and text properties --------------------------------
    ctx.font = "700 24px Inter";
    ctx.fillStyle = "#FFFFFF";
    ctx.textAlign = "left";
    ctx.textBaseline = "top";
    ctx.lineHeight = 36;

    // Define the text to be drawn
    const text = sname;

    // Wrap the text to fit in the canvas
    const words = text.split(" ");
    let line = "";
    const lines = [];
    for (let i = 0; i < words.length; i++) {
      const testLine = line + words[i] + " ";
      const metrics = ctx.measureText(testLine);
      const testWidth = metrics.width;
      if (testWidth > 490) {
        lines.push(line);
        line = words[i] + " ";
      } else {
        line = testLine;
      }
    }
    lines.push(line);

    // Draw the wrapped text onto the canvas
    let y = 122;
    for (let i = 0; i < lines.length; i++) {
      ctx.fillText(lines[i], 60, y);
      y += ctx.lineHeight;
    }

    // Creator name text --------------------------------------------
    const text2 = `By ${cname}`;
    var textWidth2 = ctx.measureText(text2).width;

    const width = textWidth2;
    const height = 40;
    const x = 69;
    y = 280;
    const cornerRadius = 4;

    // Draw the round rectangle
    ctx.beginPath();
    ctx.moveTo(x + cornerRadius, y);
    ctx.lineTo(x + width - cornerRadius, y);
    ctx.arcTo(x + width, y, x + width, y + cornerRadius, cornerRadius);
    ctx.lineTo(x + width, y + height - cornerRadius);
    ctx.arcTo(
      x + width,
      y + height,
      x + width - cornerRadius,
      y + height,
      cornerRadius
    );
    ctx.lineTo(x + cornerRadius, y + height);
    ctx.arcTo(x, y + height, x, y + height - cornerRadius, cornerRadius);
    ctx.lineTo(x, y + cornerRadius);
    ctx.arcTo(x, y, x + cornerRadius, y, cornerRadius);
    ctx.closePath();

    // Set the fill color
    ctx.fillStyle = color.color?.background === "Black" ? "#E84142" : "#000000";

    // Fill the round rectangle
    ctx.fill();

    ctx.fillStyle = "#FFFFFF";
    ctx.font = "500 21px Inter";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(text2, 69 + textWidth2 / 2, 280 + 40 / 2);

    // Image icon -------------------------------------------------------------------

    // Load image and draw it on canvas
    const image = new Image();
    image.onload = function () {
      //   // Draw image within clipping path
      ctx.drawImage(image, 700, 130);
      ctx.imageSmoothingEnabled = true;
    };

    image.setAttribute("crossorigin", "anonymous");
    image.src =
      color.color?.background === "Black"
        ? type === "excel"
          ? ExcelWhite
          : type === "video"
          ? VideoWhite
          : ExcelWhite
        : type === "excel"
        ? Excel
        : type === "video"
        ? Video
        : Doc;
  };

  const handleColorClick = (e) => {
    setColor({ background: e });
  };

  const handleSave = () => {
    let canvas = canvasRef.current;

    // Call toBlob() method to generate a blob object from the canvas
    canvas.toBlob((blob) => {
      // Create a new File object from the blob
      const file = new File([blob], `${Date.now()}.png`, { type: "image/png" });

      const data = new FormData();
      data.append("file", file);

      // returning the form data to upload it on the server
      setFinalData(data);
    });
  };

  useEffect(() => {
    setFinalData({});
    if (canvasRef.current) {
      if (dataToRender?.sname !== "") {
        drawCanvas(
          dataToRender?.type,
          dataToRender?.sname,
          dataToRender?.cname
        );
      } else {
        toast.info("Fill the service title to generate the banner", {
          position: "top-center",
          autoClose: 2000,
        });
        onClose();
      }
    }
    // eslint-disable-next-line
  }, [color, open]);

  if (!open) {
    return null;
  }

  return (
    <>
      <div className="default_previewer_wrapper">
        <div>
          <canvas ref={canvasRef} width={900} height={450} />
          <section className="default_options_sections">
            <div>
              <span
                className={`normal_color_option_default_banner ${
                  color?.color?.background === "Red" &&
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
                  color?.color?.background === "Blue" &&
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
                  color?.color?.background === "Black" &&
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
                  handleSave();
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
      <ToastContainer />
    </>
  );
}

function DefaultBanner2({ open, onClose, dataToRender, setFinalData }) {
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
        const formData = new FormData();
        formData.append("file", blob, "image.png");
        setFinalData(formData);
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
  }, [dataToRender,color]);

  useEffect(() => {
    if (dataToRender?.sname === "") {
      toast.info("Fill the service title to generate the banner", {
        position: "top-center",
        autoClose: 2000,
      });
      onClose();
    }
  }, [open])



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

      <ToastContainer limit={1}/>
    </>
  );
}

export default DefaultBanner2;
