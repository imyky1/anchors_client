import React, { useState } from "react";
import Create from "./Create";
import Workshop from "./workshop";
import "./index.css";
import { SuperSEO } from "react-super-seo";

const IndexCreator = (props) => {
  const [toggle, setToggle] = useState(0);
  return (
    <>
    <div>
      <h1 className="header01">Create Service</h1>
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
      {toggle === 0 ? (
        <Create progress={props.progress} />
      ) : (
        <Workshop progress={props.progress} />
      )}
    </div>
    <SuperSEO
        title="Anchors - Create Services"
      />
    </>
    
  );
};

export default IndexCreator;
