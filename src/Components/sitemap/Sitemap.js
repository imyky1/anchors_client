import React from "react";
import { useEffect } from "react";
import { host } from "../../config/config";
import { useState } from "react";

const Sitemap = () => {
  const [xmldata, xmldataview] = useState(``);
  useEffect(() => {
    //window.location.href = "https://www.anchors.in:5000/sitemap";

    const setCreatorInfo = async (info) => {
      const response = await fetch(`${host}/sitemap`, {
        "Content-Type": "application/xml; charset=utf-8",
      });
      const responsee = await response.text();
      const eee = new DOMParser().parseFromString(responsee, "text/xml");
      xmldataview(responsee);
      //document.getElementById("renderdiv").innerHTML = responsee;
    };

    setCreatorInfo();
  }, []);
  return <>{xmldata}</>;
};

export default Sitemap;
