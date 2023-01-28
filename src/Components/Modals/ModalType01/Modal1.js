import mixpanel from 'mixpanel-browser'
import React from 'react'
import { useNavigate } from 'react-router-dom'
import "./Modal.css"

function Modal1({open,toClose}) {
    const navigate = useNavigate()

    if(!open){
        return null
    }

  return (
    <div className="mainpage_modal_outside">
        <div className="modal_mainpage">
        <i className="fa-solid fa-xmark cross_modal fa-lg" onClick={toClose}></i>
            <section className="left_side_modal">
                <img src={require("./Location.png")} alt="" />
            </section>
            <section className="right_side_modal">
                <h1 className='modal_header_01'>Congratulations !</h1>
                <p>Fantastic news, you've reached a notable number of followers</p>
                <br/>
                <p>Ready to unlock the full potential of the creator economy</p>
                <br/>
                <button className='button_modal_01' onClick={()=>{
                    mixpanel.track("Apply Now clicked on Success Modal from Main Page");
                    navigate("/signup/creators")}}>Apply Now</button>
            </section>
        </div>
    </div>
  )
}

export default Modal1