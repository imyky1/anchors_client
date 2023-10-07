import React, { useEffect } from "react";
import { LoadThree } from "../../../Modals/Loading";

function Sample() {

  useEffect(() => {
    window.open("https://events.anchors.in","_self")
  }, [])
  

  return (
    <>
      <LoadThree/>
    </>
  );
}

export default Sample;
