import React, { useState } from "react";
import Loader from "./Loader";
import { Document, Page, pdfjs } from "react-pdf";
import "./pdfviewer.css";
import ControlPanel from "./ControlPanel";
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

const PDFReader = () => {
  const [scale, setScale] = useState(1.0);
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
    setIsLoading(false);
  }
  console.log(window.innerWidth);

  return (
    <div className="pdfviewer-container">
      <Loader isLoading={isLoading} />
      <section id="pdf-section" className="controlpanel_wrapper">
        <ControlPanel
          scale={scale}
          setScale={setScale}
          numPages={numPages}
          pageNumber={pageNumber}
          setPageNumber={setPageNumber}
          file="https://www.anchors.in:5000/api/file/1663086460431--1663039536273.pdf"
        />
        <Document
          file="https://www.anchors.in:5000/api/file/1663086460431--1663039536273.pdf"
          onLoadSuccess={onDocumentLoadSuccess}
        >
          <Page
            pageNumber={pageNumber}
            scale={scale}
            devicePixelRatio={window.innerWidth < 500 ? 0.87 : 1}
          />
        </Document>
      </section>
    </div>
  );
};

export default PDFReader;
