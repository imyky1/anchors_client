import React, { useState } from "react";
import "./Model.css";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import mixpanel from "mixpanel-browser";

function Logout_Model() {
  const navigate = useNavigate();

  const [openModel, setopenModel] = useState(true);

  const logout = () => {
    if (localStorage.getItem("isUser") === "") {
      localStorage.removeItem("isUser");
      localStorage.removeItem("jwtToken");
      localStorage.removeItem("from");
      localStorage.removeItem("url");
      localStorage.removeItem("user");
      localStorage.removeItem("c_id");
      mixpanel.reset();
      navigate("/");
    } else {
      mixpanel.track("Clicked Logout By User");
      localStorage.removeItem("isUser");
      localStorage.removeItem("jwtToken");
      localStorage.removeItem("from");
      localStorage.removeItem("user");
      mixpanel.reset();
      navigate(localStorage.getItem("url"));
    }
    toast.success("Logged Out successfully", {
      position: "top-center",
      autoClose: 2000,
    });
  };

  if (!openModel) {
    navigate("/dashboard");
    return null;
  }

  return (
    <div onClick={() => setopenModel(false)} className="logout_model_logout">
      <div onClick={(e) => e.stopPropagation()} className="model_main_box">
        <span className="model_question">Do You Really Want to Log Out?</span>
        <span className="model_gyan">
          Logging out now will require you to log in again next time you visit.
        </span>
        <div className="model_buttons">
          <button className="model_button" onClick={() => setopenModel(false)}>
            Cancel
          </button>
          <button className="model_button" onClick={logout}>
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}

export default Logout_Model;
