import React from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "./Modal.css";

// This modal is the successfull signup modal on tell us more page

function SignupModal(props) {
  const navigate = useNavigate();

  return (
    <div className="serviceSuccess_outside_container">
      <div className="serviceSuccess_container">
        <section
        >

          <img
            src="https://i.gifer.com/7efs.gif"
            alt=""
            className="success_tick_gif"
          />

          <h1 className="text_success_01_modal">Woohoo!</h1>
          <br/>
          <span className="text_success_02_modal">
            You've unlocked the gates to greatness! You sure are something.
            <br />
            <br />
            Let's see what awaits you on the other side.
          </span>
          <button
            onClick={() => {
              navigate("/dashboard");
            }}
          >
            Go to Dashboard
          </button>
        </section>
      </div>
    </div>
  );
}

export default SignupModal;
