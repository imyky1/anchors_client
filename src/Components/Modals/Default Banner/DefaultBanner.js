import React, { useEffect, useRef, useState } from "react";
import "./defaultBanner.css";
import Doc from "../../../Utils/Icons/Canvas Banner/DocIcon.svg";
import Excel from "../../../Utils/Icons/Canvas Banner/ExcelIcon.svg";
import Video from "../../../Utils/Icons/Canvas Banner/VideoIcon.svg";
import ExcelWhite from "../../../Utils/Icons/Canvas Banner/ExcelIconWhite.svg";
import VideoWhite from "../../../Utils/Icons/Canvas Banner/VideoIconWhite.svg";

function DefaultBanner({ open, onClose, dataToRender,setFinalData }) {
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
      color.background === "Black"
        ? "#151515"
        : color.background === "Blue"
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
    ctx.fillText(text1, 69 + (textWidth + 24) / 2, 37 + height2 / 2);

    ctx.strokeStyle = "#FFFFFF";
    ctx.fillStyle = "transparent";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.roundRect(69, 37, textWidth + 24, height2, [borderRadius]);
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
    let y = 79;
    for (let i = 0; i < lines.length; i++) {
      ctx.fillText(lines[i], 70, y);
      y += ctx.lineHeight;
    }

    // Creator name text --------------------------------------------
    const text2 = `By ${cname}`;
    var textWidth2 = ctx.measureText(text2).width;

    const width = textWidth2;
    const height = 40;
    const x = 69;
    y = 212;
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
    ctx.fillStyle = color.background === "Black" ? "#E84142" : "#000000";

    // Fill the round rectangle
    ctx.fill();

    ctx.fillStyle = "#FFFFFF";
    ctx.font = "500 21px Inter";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(text2, 69 + textWidth2 / 2, 212 + 40 / 2);

    // Image icon -------------------------------------------------------------------

    // Load image and draw it on canvas
    const image = new Image();
    image.onload = function () {
      //   // Draw image within clipping path
      ctx.drawImage(image, 820, 61);
      ctx.imageSmoothingEnabled = true;
    };

    image.setAttribute("crossorigin", "anonymous");
    image.src =
      color.background === "Black"
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
    handleSave()
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
      setFinalData(data)
    });
  };

  useEffect(() => {
    if (canvasRef.current) {
      drawCanvas(dataToRender?.type, dataToRender?.sname, dataToRender?.cname);
    }
  }, [color, open]);

  if (!open) {
    return null;
  }

  return (
    <>
      <div className="default_previewer_wrapper">
        <div>
          <canvas ref={canvasRef} width={1100} height={290} />
          <section className="default_options_sections">
            <div>
              <span 
                className={`normal_color_option_default_banner ${color?.background === "Red" && "active_color_option_default_banner"}`}
                onClick={() => {
                  handleColorClick("Red");
                }}
              >
                <span style={{ backgroundColor: "#E84142" }}></span>
              </span>
              <span 
                className={`normal_color_option_default_banner ${color?.background === "Blue" && "active_color_option_default_banner"}`}
                onClick={() => {
                  handleColorClick("Blue");
                }}
              >
                <span style={{ backgroundColor: "#5E17FE" }}></span>
              </span>
              <span 
                className={`normal_color_option_default_banner ${color?.background === "Black" && "active_color_option_default_banner"}`}
                onClick={() => {
                  handleColorClick("Black");
                }}
              >
                <span style={{ backgroundColor: "#151515" }}></span>
              </span>
            </div>

            <section>
              <button onClick={()=>{handleSave();onClose()}}>Save</button>
              <button onClick={onClose}>Close</button>
            </section>
          </section>
        </div>
      </div>
    </>
  );
}

export default DefaultBanner;
