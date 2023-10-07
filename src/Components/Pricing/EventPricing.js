import React, { useEffect } from "react";
import { LoadThree } from "../Modals/Loading";



function EventPricing() {

  useEffect(() => {
    window.open("https://events.anchors.in/pricing","_self")
  }, [])

  return (
    <>
      <LoadThree/>
    </>
  );
}

export default EventPricing;
