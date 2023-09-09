import React, { useEffect, useState } from "react";
import Loader from "./Loader";
import { Document, Page, pdfjs } from "react-pdf";
import "./pdfviewer.css";
import ControlPanel from "./ControlPanel";
// Pdf reader 2 css -------
import { Worker } from "@react-pdf-viewer/core";
import { Viewer } from '@react-pdf-viewer/core';
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';

// Import styles
import '@react-pdf-viewer/default-layout/lib/styles/index.css';

// Import the styles
import '@react-pdf-viewer/core/lib/styles/index.css';

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;


// const PDFReader = () => {
//   const [url, setUrl] = useState(null);
//   const [scale, setScale] = useState(1.0);
//   const [numPages, setNumPages] = useState(null);
//   const [pageNumber, setPageNumber] = useState(1);
//   const [isLoading, setIsLoading] = useState(true);

//   function onDocumentLoadSuccess({ numPages }) {
//     setNumPages(numPages);
//     setIsLoading(false);
//   }
//   useEffect(() => {
//     let current_url = sessionStorage.getItem("link");
//     setUrl(current_url);

//     window.addEventListener(
//       "keydown",
//       function (event) {
//         if (
//           event.keyCode === 80 &&
//           (event.ctrlKey || event.metaKey) &&
//           !event.altKey &&
//           (!event.shiftKey || window.chrome || window.opera)
//         ) {
//           event.preventDefault();
//           if (event.stopImmediatePropagation) {
//             event.stopImmediatePropagation();
//           } else {
//             event.stopPropagation();
//           }
//           return;
//         }
//       },
//       true
//     );
//   }, []);

//   return (
//     <div className="pdfviewer-container">
//       <Loader isLoading={isLoading} />
//       {url ? (
//         <section id="pdf-section" className="controlpanel_wrapper">
//           <ControlPanel
//             scale={scale}
//             setScale={setScale}
//             numPages={numPages}
//             pageNumber={pageNumber}
//             setPageNumber={setPageNumber}
//             file={`${url}`}
//           />
//           <Document file={`${url}`} onLoadSuccess={onDocumentLoadSuccess} className="pdf-container">
//           {Array.from(new Array(numPages), (e, index) => {
//               return <Page key={e} onTouchStart={(e) => {
//                 e.preventDefault();
//                 e.target.style.transform = 'scale(2)';
//               }}
//               onTouchEnd={(e) => {
//                 e.preventDefault();
//                 e.target.style.transform = 'scale(1)';
//               }} pageNumber={index + 1} scale={scale} devicePixelRatio={window.innerWidth < 500 ? 0.87 : 1}/>;
//             })}
//             {/* <Page
//               pageNumber={pageNumber}
//               scale={scale}
//               devicePixelRatio={window.innerWidth < 500 ? 0.87 : 1}
//             /> */}
//           </Document>
//         </section>
//       ) : (
//         ""
//       )}
//     </div>
//   );
// };

const PDFReader2 = () =>{
  const defaultLayoutPluginInstance = defaultLayoutPlugin({
    mobile:true
  });
  return (
    <>
      <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js">
      <Viewer fileUrl={sessionStorage.getItem("link")} plugins={[defaultLayoutPluginInstance]} />
      </Worker>
    </>
  );
}

export default PDFReader2;
