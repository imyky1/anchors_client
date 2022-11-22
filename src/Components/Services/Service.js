import React, { useContext, useEffect, useState } from "react";
import Document from "./Document";
import Workshop from "./Workshop";

function Service(props) {
  const [toggle, setToggle] = useState(0);
  return (
    <div>
      <div className="toggle_bar">
        <div
          className={`button1_togglebar ${toggle === 0 ? "red_border" : ""}`}
          onClick={() => setToggle(0)}
        >
          Downloadable Content
        </div>
        <div
          className={`button2_togglebar ${toggle === 1 ? "red_border" : ""}`}
          onClick={() => setToggle(1)}
        >
          Workshop/Event
        </div>
      </div>
      {toggle === 0 ? <Document /> : <Workshop />}
    </div>
  );
}

export default Service;
