import React from "react";
import "./Navbar.css";

function Navbar({ChangeModalState,ModalState,userData}) {

  // handles the openeing of the creator modal
  const handleModalOpening = (e) =>{
    e?.stopPropagation()
    ModalState ? ChangeModalState(false) : ChangeModalState(true)
  }


  return (
    <div className="navbar_outside_container">
      <img
        className="creators_navbar_image"
        src={userData?.photo}
        alt=""
        onClick={handleModalOpening}
      />
    </div>
  );
}

export default Navbar;
