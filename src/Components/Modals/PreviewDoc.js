import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
// add to calender
import { atcb_action, atcb_init } from "add-to-calendar-button";
import "./Model.css";
import mixpanel from "mixpanel-browser";
import { feedbackcontext } from "../../Context/FeedbackState";
import { toast } from "react-toastify";

// Import the main component
// react pdf to get the number of pages

import { Document, Page, pdfjs } from "react-pdf";

import "react-pdf/dist/esm/Page/TextLayer.css";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import { LoadOne, LoadTwo } from "./Loading";

function PreviewDocument({ open, onClose, url }) {
  // pdf
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);

  function onDocumentLoadSuccess({ numPages }) {
    setOpenLoading(false);
    setNumPages(numPages);
  }

  const changepageinc = () => {
    const pages = numPages;
    const percent = (pages * 20) / 100;
    let ans;
    if (percent < 2) {
      ans = Math.ceil(percent);
    } else {
      ans = Math.floor(percent);
    }
    if (pageNumber >= ans) {
      return;
    }
    setPageNumber((prev) => prev + 1);
  };
  const changepagedec = () => {
    if (pageNumber <= 1) {
      return;
    }
    setPageNumber((prev) => prev - 1);
  };
  useEffect(() => {
    pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;
  });

  if (!open) {
    return null;
  }

  return (
    <>
      <div onClick={onClose} className="document_preivew_model">
        <div
          onClick={(e) => e.stopPropagation()}
          className="document_preivew_create_model"
        >
          {!openLoading ? (
            <>
              <i
                class="fa fa-chevron-circle-left prev"
                aria-hidden="true"
                onClick={() => changepagedec()}
              ></i>
              <i
                class="fa fa-chevron-circle-right next"
                aria-hidden="true"
                onClick={() => changepageinc()}
              ></i>
              <div className="top_document_preivew">
                <i className="fa-solid fa-xmark fa-2x" onClick={onClose}></i>
                <p>
                  Page {pageNumber} of {numPages}
                </p>
              </div>
            </>
          ) : (
            ""
          )}
          <Document
            file={{
              url: "https://icseindia.org/document/sample.pdf",
            }}
            onLoadSuccess={onDocumentLoadSuccess}
            loading={
              <div className="loadbar2_preview_popup">
                <img
                  src={require("../logo.png")}
                  alt="..Loading"
                  className="loader_home_preview"
                />
              </div>
            }
          >
            <Page pageNumber={pageNumber} />
          </Document>
        </div>
      </div>
    </>
  );
}

export default PreviewDocument;
