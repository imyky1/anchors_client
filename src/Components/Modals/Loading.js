import React, { useEffect, useState } from "react";
import "./Model.css";
import { toast } from "react-toastify";

function Loading() {
  return (
    <div className="loading_bar">
      <img
        src={require("../../Utils/Images/logo.png")}
        alt="Loading"
        className="loader_home"
      />
    </div>
  );
}

function LoadingOne({ open }) {
  if (!open) {
    return null;
  }

  return (
    <div className="loadbar2">
      <img
        src={require("../../Utils/Images/logo.png")}
        alt="..Loading"
        className="loader_home load2"
      />
    </div>
  );
}

// For user side pages
function LoadingTwo({ open }) {

  useEffect(() => {
    // Set a 5-second timeout
    const timeoutId = setTimeout(() => {
      toast.info("Loading took too long. Please refresh the page.", {
        position: "top-center",
      });
    },4000);

    // Clean up the timeout when 'open' prop changes or the component unmounts
    return () => {
      clearTimeout(timeoutId);
    };
  }, [open]);

  return (
    <div className="loadbar3">
      <img
        src={require("../../Utils/Images/logo.png")}
        alt="..Loading"
        className="loader_home load2"
      />
    </div>
  );
}

export const LoadOne = Loading;
export const LoadTwo = LoadingOne;
export const LoadThree = LoadingTwo;
