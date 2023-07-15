import React, { useContext, useEffect, useRef, useState } from "react";
import { linkedinContext } from "../../Context/LinkedinState";
import { atcb_action, atcb_init } from "add-to-calendar-button";
// import { InlineShareButtons } from "sharethis-reactjs";
import { host } from "../../config/config";
import { Page, Document, pdfjs } from "react-pdf";

import { useLinkedIn } from "react-linkedin-login-oauth2";
// You can use provided image shipped by this package or using your own
import linkedin from "react-linkedin-login-oauth2/assets/linkedin.png";
import "./teststyle.css";

import "add-to-calendar-button/assets/css/atcb.css";
import { FormHelperText, Modal } from "@mui/material";
import PreviewDocument from "../Modals/PreviewDoc";
import Canvas from "./New UI/Create Services/Canvas";
import PSPDFKit from "pspdfkit";
import pdfjsLib from "pdfjs-dist";
import { Worker } from "@react-pdf-viewer/core";
import { Viewer } from "@react-pdf-viewer/core";
import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout";

import Doc from "../../Utils/Icons/Canvas Banner/DocIcon.svg";
import Excel from "../../Utils/Icons/Canvas Banner/ExcelIcon.svg";
import Video from "../../Utils/Icons/Canvas Banner/VideoIcon.svg";
import ExcelWhite from "../../Utils/Icons/Canvas Banner/ExcelIconWhite.svg";
import VideoWhite from "../../Utils/Icons/Canvas Banner/VideoIconWhite.svg";

import back from "./back.png";
import DateIcon from "./calendar.svg";
import TimeIcon from "./clock.svg";
import Yuv from "./yuvraj.jpg";

// Import styles
import "@react-pdf-viewer/default-layout/lib/styles/index.css";

// Import the styles
import "@react-pdf-viewer/core/lib/styles/index.css";

import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

function Test() {
  const { truecallerlogin, truecallervalue } = useContext(linkedinContext);
  const [url, setUrl] = useState("");
  const [title, setTitle] = useState("");
  const [imageLoading, setImageLoading] = useState(0);
  const handleClick = async () => {
    await truecallerlogin();
  };

  const handlewhatsappshare = async () => {
    window.open(
      `https://api.whatsapp.com/send?text=Checkout this Important resource -- ** at https://www.anchors.in/w/workshopname`,
      "MsgWindow",
      "width=100",
      "height=50"
    );
  };

  const [userData, setUserData] = useState(null);

  useEffect(() => {
    // Extract the authorization code from the URL parameter
    const urlParams = new URLSearchParams(window.location.search);
    const authorizationCode = urlParams.get("code");

    // Fetch access token from LinkedIn using the authorization code
    const fetchAccessToken = async () => {
      try {
        const response = await fetch(
          `${host}/login/api/linkedin/access-token`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ code: authorizationCode }),
          }
        );
        const data = await response.json();
        console.log(data);
        const accessToken = data.access_token;
        console.log(data.userData);
        setUserData(data.userData);
      } catch (error) {
        console.error("Error fetching LinkedIn data:", error);
      }
    };

    // Call the fetchAccessToken function if authorization code is available
    if (authorizationCode) {
      fetchAccessToken();
    }
  }, []);
  const generateImage = async () => {
    if (title.length < 5) {
      alert("title small than 5 bruh");
    } else {
      setImageLoading(1);
      const response = await fetch(`${host}/ai/generateImage`, {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "Access-Control-Allow-Credentials": true,
          title: title,
        },
      });
      const json = await response.json();
      console.log(json);
      setUrl(json.img);
      setImageLoading(0);
    }
  };
  const [signedurl, setSignedUrl] = useState(null);
  const handlelinkedInshare = async () => {
    window.open(
      `http://www.linkedin.com/shareArticle?mini=true&url=https://anchors.in/w/how-to-make-custom-linkedin-share-button&title=How%20to%20make%20custom%20linkedin%20share%20button&summary=some%20summary%20if%20you%20want&source=stackoverflow.com`
    );
  };

  // popup preview
  const previewopen = (e) => {
    setShopPopup(true);
  };

  const { linkedInLogin } = useLinkedIn({
    clientId: "77dzwxk6dvh9ts",
    redirectUri: `http://localhost:3000/developer/test`,
    onSuccess: (code) => {
      console.log(code);
    },
    onError: (error) => {
      console.log(error);
    },
  });

  const [showpopup, setShopPopup] = useState(false);
  console.log(signedurl);
  return (
    <>
      <div className="test">
        <div>
          <img
            onClick={linkedInLogin}
            src={linkedin}
            alt="Sign in with Linked In"
            style={{ maxWidth: "180px", cursor: "pointer" }}
          />
        </div>
        <div>
          {userData ? (
            <div>
              <h1>LinkedIn Data</h1>
              <p>
                Name: {userData.firstName} {userData.lastName}
              </p>
              <p>Email: {userData.emailAddress}</p>
              {/* Render other retrieved data from LinkedIn */}
            </div>
          ) : (
            <p>Loading LinkedIn data...</p>
          )}
        </div>
        {/* <PreviewDocument
          open={showpopup}
          onClose={() => {
            setShopPopup(false);
          }}
        />
        <button onClick={handleClick}>Login through Truecaller</button>
        <div className="response">
          <h1>{truecallervalue ? "something" : "nothing yet..."}</h1>
          <div>{truecallervalue?.success}</div>
          <h2>PHONE NO .. - {truecallervalue.userdata?.phoneNumbers}</h2>
          <p>
            NAME -{" "}
            {truecallervalue.userdata?.name?.first +
              " " +
              truecallervalue.userdata?.name?.last}
          </p>
          <p>EMAIL - {truecallervalue.userdata?.onlineIdentities?.email}</p>
        </div>
        <div></div>
        <div class="btn_wrap_share">
          <span>Share</span>
          <div class="container_buttons_share">
            <i onClick={handlelinkedInshare} class="fab fa-linkedin"></i>
            <i onClick={handlewhatsappshare} class="fab fa-whatsapp"></i>
          </div>
        </div>
        <div class="TN bzz aHS-YH">
          <div class="qj qr"></div>
          <div class="aio UKr6le">
            <span class="nU false">
              <a
                href="https://meet.google.com/new?hs=180&amp;authuser=0"
                target="_top"
                class="J-Ke n0"
                title="Start a meeting"
                aria-label="Start a meeting"
                draggable="false"
              >
                Start a meeting
              </a>
            </span>
          </div>
          <div className="nL aif"></div>
        </div>

        <div>
          <button onClick={() => previewopen()}>Preview Document</button>
        </div> */}

        {/* <div className="aiImage">
        <div>
          <input type="text" onChange={(e) => setTitle(e.target.value)}></input>
        </div>
        <button onClick={() => generateImage()}>Generate Image</button>
        <h1>{imageLoading === 1 ? "LOADING ......" : ""}</h1>
        {/** {imageLoading === 1
          ? ""
          : url.map((e, i) => {
              return <img src={e.url} alt="will come !!!" id={i} />;
            })}} 
        <img src={url} alt="will come !!!" />;
      </div> */}
        {/* <Canvas
          textToShow="List of Top 10 YouTube Channel for Coding"
          width="1200"
          height="450"
          imgBackground="https://www.anchors.in:5000/api/file/1670005634078--himanshu.bf15583cd698b88970c3.jpg"
          imgBack="../backgroundimg.png"
          creator_name="HIMANSHU SHEKHAR"
        />

        <a
          href="https://anchors-files.s3.ap-south-1.amazonaws.com/docs/1673505520670-Result_41621037.pdf"
          download="GFG"
        >
          Click Me
        </a> */}
      </div>
    </>
  );
}

function Test2() {
  // Create styles
  // const pdfUrl = "http://localhost:5000/api/file/sample.pdf";
  const pdfUrl =
    "https://anchors-files.s3.ap-south-1.amazonaws.com/docs/1681018360053-Social_Media_Marketing_Internship_-_Assignment_%281%29.pdf";

  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);

  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
    setPageNumber(1);
  }

  // pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

  return (
    <>
      <img
        src="https://check-555.s3.ap-south-1.amazonaws.com/images.jpg"
        alt=""
      />
      <center>
        <div className="preview_div_section">
          <Document file={pdfUrl} onLoadSuccess={onDocumentLoadSuccess}>
            {Array.from(new Array(2), (e, index) => {
              return <Page key={e} pageNumber={index + 1} />;
            })}
          </Document>

          <section className="lock_section_preview">
            <img
              src="https://static.vecteezy.com/system/resources/previews/000/581/808/original/lock-icon-vector-illustration.jpg"
              alt=""
            />

            <h1>Content is locked</h1>
          </section>
        </div>
      </center>

      {/* <PreviewDocument/> */}
    </>
  );
}

// function Test3() {
//   const canvasRef = useRef(null);
//   const [color, setColor] = useState({ background: "#8fd8ea" });
//   const [type, setType] = useState("Excel");
//   const [data, setData] = useState({ sname: "Hello", cname: "yuvraj" });

//   const drawCanvas = (type, sname, cname) => {
//     const canvas = canvasRef.current;
//     const ctx = canvas.getContext("2d", {
//       alpha: false,
//       desynchronized: true,
//       depth: true,
//       antialias: true,
//     });
//     const radius = 220;

//     // Start new path
//     ctx.beginPath();

//     ctx.clearRect(0, 0, canvas.width, canvas.height);
//     ctx.clearRect(30, canvas.height - 80, canvas.width - 60, 50);
//     ctx.clearRect(
//       canvas.width - 160 - radius,
//       canvas.height / 2 + 80 - radius,
//       2 * radius,
//       2 * radius
//     );

//     // Creating the outer rectangle-----------
//     ctx.fillStyle =
//       color.background === "Black"
//         ? "#151515"
//         : color.background === "Blue"
//         ? "#5E17FE"
//         : "#E84142";
//     ctx.fillRect(0, 0, canvas.width, canvas.height);

//     // Excel file etx -------------------
//     // Draw a rounded rectangle with a white border
//     const width2 = 103;
//     const height2 = 23;
//     const borderRadius = 35;

//     // Draw the "Excel file" text in the center of the rectangle
//     const text1 = type;
//     ctx.fillStyle = "#FFFFFF";
//     ctx.font = "500 14px Inter";
//     ctx.textAlign = "center";
//     ctx.textBaseline = "middle";
//     var textWidth = ctx.measureText(text1).width;
//     ctx.fillText(text1, 69 + (textWidth + 24) / 2, 37 + height2 / 2);

//     ctx.strokeStyle = "#FFFFFF";
//     ctx.fillStyle = "transparent";
//     ctx.lineWidth = 1;
//     ctx.beginPath();
//     ctx.roundRect(69, 37, textWidth + 24, height2, [borderRadius]);
//     ctx.stroke();

//     // Set the font and text properties
//     ctx.font = "700 24px Inter";
//     ctx.fillStyle = "#FFFFFF";
//     ctx.textAlign = "left";
//     ctx.textBaseline = "top";
//     ctx.lineHeight = 36;

//     // Define the text to be drawn
//     const text = sname;

//     // Wrap the text to fit in the canvas
//     const words = text.split(" ");
//     let line = "";
//     const lines = [];
//     for (let i = 0; i < words.length; i++) {
//       const testLine = line + words[i] + " ";
//       const metrics = ctx.measureText(testLine);
//       const testWidth = metrics.width;
//       if (testWidth > 490) {
//         lines.push(line);
//         line = words[i] + " ";
//       } else {
//         line = testLine;
//       }
//     }
//     lines.push(line);

//     // Draw the wrapped text onto the canvas
//     let y = 79;
//     for (let i = 0; i < lines.length; i++) {
//       ctx.fillText(lines[i], 70, y);
//       y += ctx.lineHeight;
//     }

//     // Draw the "Excel file" text in the center of the rectangle
//     const text2 = `By ${cname}`;
//     var textWidth2 = ctx.measureText(text2).width;

//     const width = textWidth2;
//     const height = 40;
//     const x = 69;
//     y = 212;
//     const cornerRadius = 4;

//     // Draw the round rectangle
//     ctx.beginPath();
//     ctx.moveTo(x + cornerRadius, y);
//     ctx.lineTo(x + width - cornerRadius, y);
//     ctx.arcTo(x + width, y, x + width, y + cornerRadius, cornerRadius);
//     ctx.lineTo(x + width, y + height - cornerRadius);
//     ctx.arcTo(
//       x + width,
//       y + height,
//       x + width - cornerRadius,
//       y + height,
//       cornerRadius
//     );
//     ctx.lineTo(x + cornerRadius, y + height);
//     ctx.arcTo(x, y + height, x, y + height - cornerRadius, cornerRadius);
//     ctx.lineTo(x, y + cornerRadius);
//     ctx.arcTo(x, y, x + cornerRadius, y, cornerRadius);
//     ctx.closePath();

//     // Set the fill color
//     ctx.fillStyle = color.background === "Black" ? "#E84142" : "#000000";

//     // Fill the round rectangle
//     ctx.fill();

//     ctx.fillStyle = "#FFFFFF";
//     ctx.font = "500 21px Inter";
//     ctx.textAlign = "center";
//     ctx.textBaseline = "middle";
//     ctx.fillText(text2, 69 + textWidth2 / 2, 212 + 40 / 2);

//     // Load image and draw it on canvas
//     const image = new Image();
//     image.onload = function () {
//       //   // Draw image within clipping path
//       ctx.drawImage(image, 820, 61);
//       ctx.imageSmoothingEnabled = true;
//     };

//     image.setAttribute("crossorigin", "anonymous");
//     image.src =
//       color.background === "Black"
//         ? type === "Excel"
//           ? ExcelWhite
//           : type === "Video"
//           ? VideoWhite
//           : ExcelWhite
//         : type === "Excel"
//         ? Excel
//         : type === "Video"
//         ? Video
//         : Doc;
//   };

//   const retryHandle = () => {
//     console.log("Clicked", color, data, type);
//     drawCanvas(type, data?.sname, data?.cname);
//   };

//   const handleSaveCanvas = () => {
//     const canvas = canvasRef.current;
//     const image = canvas.toDataURL("image/png");
//     console.log(image);
//     const link = document.createElement("a");
//     link.download = "canvas-image.png";
//     link.href = image;
//     link.click();
//   };

//   const handleChange = (e) => {
//     setData({ ...data, [e.target.id]: e.target.value });
//   };

//   return (
//     <>
//       <div id="canvas_con">
//         <canvas ref={canvasRef} width={1100} height={290} />
//       </div>
//       <div style={{ display: "flex" }}>
//         {/* <span>Select background1</span>
//         <SketchPicker
//           color={color.background}
//           onChangeComplete={(e) => { setColor({ ...color, background: e.hex }) }}
//         /> */}
//       </div>

//       <div>
//         <input
//           type="text"
//           id="sname"
//           value={data?.sname}
//           placeholder="Service name"
//           onChange={handleChange}
//         />
//         <input
//           type="text"
//           id="cname"
//           value={data?.cname}
//           placeholder="Creator name"
//           onChange={handleChange}
//         />
//         <select
//           onChange={(e) => {
//             setType(e?.target.value);
//           }}
//         >
//           <option>Excel</option>
//           <option>Document</option>
//           <option>Video</option>
//         </select>

//         <select
//           onChange={(e) => {
//             setColor({ ...color, background: e.target.value });
//           }}
//         >
//           <option>Red</option>
//           <option>Blue</option>
//           <option>Black</option>
//         </select>
//       </div>
//       <button onClick={retryHandle}>Generate</button>
//       <button onClick={handleSaveCanvas}>Save Canvas</button>
//     </>
//   );
// }

function PDF() {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    let PSPDFKit;

    (async function () {
      PSPDFKit = await import("pspdfkit");
      PSPDFKit.unload(container);

      PSPDFKit.load({
        // Container where PSPDFKit should be mounted.
        container,
        // The document to open.
        document: sessionStorage.getItem("link"),
        // Use the public directory URL as a base URL. PSPDFKit will download its library assets from here.
        baseUrl: `${window.location.protocol}//${window.location.host}/${process.env.PUBLIC_URL}`,
      });
    })();

    return () => PSPDFKit && PSPDFKit.unload(container);
  }, []);

  return <div ref={containerRef} style={{ width: "100%", height: "100vh" }} />;
}

// function PDF2() {
//   const canvasRef = useRef(null);

//   useEffect(() => {
//     const renderPage = async (pageNum, pdf) => {
//       const page = await pdf.getPage(pageNum);
//       const viewport = page.getViewport({ scale: 1 });

//       // Create a new canvas element for each page.
//       const canvas = document.createElement("canvas");
//       const canvasContext = canvas.getContext("2d");
//       canvas.height = viewport.height;
//       canvas.width = viewport.width;

//       // Render PDF page into canvas ctx.
//       const renderContext = { canvasContext, viewport };
//       await page.render(renderContext);

//       // Return the canvas element.
//       return canvas;
//     };

//     (async function () {
//       const pdfJS = await import("pdfjs-dist/build/pdf");
//       pdfJS.GlobalWorkerOptions.workerSrc =
//         window.location.origin + "/pdf.worker.min.js";
//       const pdf = await pdfJS.getDocument(sessionStorage.getItem("link"))
//         .promise;
//       const numPages = pdf.numPages;
//       console.log(numPages);
//       for (let pageNum = 1; pageNum <= numPages; pageNum++) {
//         const canvas = await renderPage(pageNum, pdf);
//         document.body.appendChild(canvas);
//       }
//     })();
//   }, []);

//   return (
//     // <canvas ref={canvasRef} style={{ height: "100vh" }} />;
//     <></>
//   );
// }

function PDF3() {
  const defaultLayoutPluginInstance = defaultLayoutPlugin();
  return (
    <>
      <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js">
        <Viewer
          fileUrl={sessionStorage.getItem("link")}
          plugins={[defaultLayoutPluginInstance]}
        />
      </Worker>
    </>
  );
}

function VideoCheck() {
  return (
    <video controls>
      <source
        src="https://check-555.s3.ap-south-1.amazonaws.com/2023-01-18+22-53-31.mp4"
        type="video/mp4"
      />
    </video>
  );
}

const DynamicBanner = ({ backgroundImage, userImage, userName, dateTime }) => {
  const bannerRef = useRef(null);

  const handleDownload = () => {
    const bannerElement = bannerRef.current;
  };

  return (
    <>
      <div
        ref={bannerRef}
        className="banner"
        style={{ backgroundImage: `url(${back})` }}
      >
        <img className="user-image" src={Yuv} alt="User Image" />
        <div className="user-name">{`Hello, Yuvraj`}</div>
        <div className="date-time">5th July</div>
      </div>
      <button onClick={handleDownload}>Download Banner</button>
    </>
  );
};

const EditorCheck = () => {
  const [value, setValue] = useState("");

  return (

    <div style={{width:"50vw",height:"400px"}}>
      <ReactQuill theme="snow" value={value} onChange={setValue} style={{height:"100%"}}/>;
    </div>
  )
  
};

export default EditorCheck;
