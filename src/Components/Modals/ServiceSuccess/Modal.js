import React from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "./Modal.css";

function Modal(props) {
    const navigate = useNavigate()

  return (
    <div className="serviceSuccess_outside_container">
      <div className="serviceSuccess_container">
        <section>
          <i class="fa-solid fa-xmark fa-lg serviceSuccessModal_cross" onClick={()=>{navigate("/newUi/dashboard")}}></i>
          <h1 className="text_success_01_modal">Congratulations</h1>
          <span className="text_success_02_modal">
            {props.type === "excel" ? "Excel Sheet" : props.type === "video" ? "Video" : "Document"} Uploaded Successfully
          </span>
          <button onClick={()=>{navigate("/newUi/mycontents")}}>Go to My Content</button>
        </section>

        <div>
          <p className="text_success_03_modal">
            Shareable Link for your Audience
          </p>
          <section>
            <p className="text_success_04_modal">
              {`https://www.anchors.in/r/${props.link}`}
            </p>
            <button onClick={()=>{ toast.success("Copied link successfully")
                navigator.clipboard.writeText(`https://www.anchors.in/r/${props.link}`)}}>Copy Link</button>
          </section>
        </div>
      </div>
    </div>
  );
}

export default Modal;
