import React, { useEffect } from "react";
import { IoCopyOutline } from "react-icons/io5";
import { RxCross2 } from "react-icons/rx";
import "./ServiceSuccess/Modal.css";
import { toast } from "react-toastify";

const GptModal = ({ onClose, loading, desc}) => {

  useEffect(() => {
    let doc = document.getElementById("gpt_content_div");

    if (doc && !loading) {
      doc.innerHTML = desc?.replace(/\n/g, "");
    }
  }, [desc]);

  return (
    <div className="model_outside_wrapper_success_modal">
      <div
        className="new_congratualtion_popup_outer"
        style={{ padding: "40px 20px" }}
      >
        <section className="gpt_modal_header_section">
          <div>
            <h1>Generate description with AI</h1>
            <span>
              Write your prompt and generate your text with help of AI
            </span>
          </div>

          <RxCross2
            className="chnageStatusModalCross"
            style={{ position: "unset" }}
            size={25}
            onClick={onClose}
          />
        </section>

        <section className="gpt_modal_content_section">
          {loading && (
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/a/ad/YouTube_loading_symbol_3_%28transparent%29.gif?20140201131911"
              alt="Loading..."
            />
          )}
          <div id="gpt_content_div"></div>
          <IoCopyOutline
            size={24}
            color="#BDBDBD"
            onClick={() => {
              navigator.clipboard.writeText(desc.replace(/\n/g, ""));
              toast.info("Copied Deescription Successfully", {
                autoClose: 1000,
              });
            }}
          />
        </section>
      </div>
    </div>
  );
};

export default GptModal;
