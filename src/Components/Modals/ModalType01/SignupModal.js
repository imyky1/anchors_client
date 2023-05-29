import React from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "./Modal.css";
import { FaUnlockAlt } from "react-icons/fa";

// This modal is the successfull signup modal on tell us more page

function SignupModal(props) {
  const navigate = useNavigate();

  return (
    <div className="serviceSuccess_outside_container">
      <div className="signupsuccessModal_wrapper">
        <FaUnlockAlt />

        <h1>Welcome to Anchors</h1>
        <p>
          Congratulations on successfully submitting your form! We are thrilled
          to inform you that you are now eligible to enter the dashboard.
        </p>
        <button
          onClick={() => {
            window.open("/dashboard","_self");
          }}
        >
          Go to Dashboard
        </button>
      </div>
    </div>
  );
}

export default SignupModal;
