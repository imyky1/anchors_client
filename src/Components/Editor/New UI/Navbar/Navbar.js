import React from "react";
import "./Navbar.css";

function Navbar({ChangeModalState,ModalState}) {

  // handles the openeing of the creator modal
  const handleModalOpening = (e) =>{
    e?.stopPropagation()
    ModalState ? ChangeModalState(false) : ChangeModalState(true)
  }


  return (
    <div className="navbar_outside_container">
      <img
        className="creators_navbar_image"
        src="https://media.npr.org/assets/img/2022/11/08/ap22312071681283-0d9c328f69a7c7f15320e8750d6ea447532dff66.jpg"
        alt=""
        onClick={handleModalOpening}
      />
    </div>
  );
}

export default Navbar;
