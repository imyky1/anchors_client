import React from "react";
import { useNavigate } from "react-router-dom";
import "./Modal.css";

function Modal1({ open, toClose }) {
  const navigate = useNavigate();
  open &&
    document?.addEventListener("click", () => {
      toClose();
    });

  if (!open) {
    return null;
  }

  return (
    //<div className="creator_modal_outside_container">
    <div className="creator_modal_info" onClick={(e) => e?.stopPropagation()}>
      <section className="profile_section_creator_info">
        <img
          src="https://media.npr.org/assets/img/2022/11/08/ap22312071681283-0d9c328f69a7c7f15320e8750d6ea447532dff66.jpg"
          alt=""
        />
        <span>Himanshu Kumar</span>
        <div>
          <span className="hover_span_modal_creatorinfo">99 Reviews</span>
          <span>
            <i class="fa-solid fa-star"></i> 4.5
          </span>
          <span className="hover_span_modal_creatorinfo">8 Services</span>
        </div>
        <button
          onClick={() => {
            navigate("/newUi/editprofile");
            toClose();
          }}
        >
          Edit Profile
        </button>
      </section>

      <section className="options_creator_profile_info">
        <div>View Public Profile</div>
        <div>Pricing</div>
        <div>Help</div>
      </section>

      <div className="logout_button_modal">
        <i class="fa-solid fa-right-from-bracket fa-lg"></i>
      </div>
    </div>
    //</div>
  );
}

export default Modal1;
