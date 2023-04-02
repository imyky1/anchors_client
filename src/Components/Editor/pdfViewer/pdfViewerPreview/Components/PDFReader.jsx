import React, { useEffect, useState } from "react";
import Loader from "./Loader";
import { Document, Page, pdfjs } from "react-pdf";
import "./pdfviewer.css";
import ControlPanel from "./ControlPanel";
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

const PDFReaderPreview = () => {
  const [url, setUrl] = useState(null);
  const [scale, setScale] = useState(1.0);
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [previewPages, setPreviewPages] = useState(0);

  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
    setIsLoading(false);
  }
  useEffect(() => {
    let current_url = sessionStorage.getItem("link");
    setUrl(current_url);
    let preview = sessionStorage.getItem("pages");
    if (!preview || !current_url) {
      window.location.replace("/");
    }
    setPreviewPages(preview);

    window.addEventListener(
      "keydown",
      function (event) {
        if (
          event.keyCode === 80 &&
          (event.ctrlKey || event.metaKey) &&
          !event.altKey &&
          (!event.shiftKey || window.chrome || window.opera)
        ) {
          event.preventDefault();
          if (event.stopImmediatePropagation) {
            event.stopImmediatePropagation();
          } else {
            event.stopPropagation();
          }
          return;
        }
      },
      true
    );
  }, []);

  return (
    <div className="pdfviewer-container">
      <Loader isLoading={isLoading} />
      {url ? (
        <section id="pdf-section" className="controlpanel_wrapper">
          <ControlPanel
            scale={scale}
            setScale={setScale}
            numPages={numPages}
            pageNumber={pageNumber}
            setPageNumber={setPageNumber}
            file={`${url}`}
            previewPages={previewPages}
          />
          <Document file={`${url}`} onLoadSuccess={onDocumentLoadSuccess}>
            <Page
              pageNumber={pageNumber}
              scale={scale}
              devicePixelRatio={window.innerWidth < 500 ? 0.87 : 1}
            />
          </Document>
        </section>
      ) : (
        ""
      )}
    </div>
  );
};

export default PDFReaderPreview;
