import React, { useEffect, useState } from "react";
import "./Model.css";
import { toast } from "react-toastify";
import { SiOpenai } from "react-icons/si";


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
function LoadingTwo({ open = true }) {
  // useEffect(() => {
  //   // Set a 5-second timeout
  //   const timeoutId = setTimeout(() => {
  //     toast.info("Loading took too long. Please refresh the page.", {
  //       position: "top-center",
  //     });
  //   },4000);

  //   // Clean up the timeout when 'open' prop changes or the component unmounts
  //   return () => {
  //     clearTimeout(timeoutId);
  //   };
  // }, [open]);

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

// loader with text ....
function LoadingThree({ open = true }) {
  const [dots, setDots] = useState('');

  useEffect(() => {
    const intervalId = setInterval(() => {
      setDots((prevDots) => (prevDots.length < 3 ? prevDots + '.' : ''));
    }, 500); // Adjust the interval as needed

    return () => clearInterval(intervalId);
  }, []);


  return (
    <div className="loadbar3" style={{background:"rgba(18, 18, 18, 0.60)"}}>
      <section className="loading_strip_container">
      <SiOpenai color="#FAFAFA" className="loader_home load2" size={32} style={{margin:"unset",width:"5rem"}}/>
      <span>Generating Description{dots}</span>
      </section>
    </div>
  );
}

export const LoadOne = Loading;
export const LoadTwo = LoadingOne;
export const LoadThree = LoadingTwo;
export const LoadFour = LoadingThree;
