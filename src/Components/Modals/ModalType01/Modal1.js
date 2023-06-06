import mixpanel from 'mixpanel-browser'
import React from 'react'
import { useNavigate } from 'react-router-dom'
import "./Modal.css"

// success from eligibility -----------------------------------------

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
                <h1 className='modal_header_01'>Hooray!</h1>
                <p>You want us? We want you too!</p>
                <p>Looks like you have seen struggle and come out ahead. Welcome home!</p>
                <p>Together, we will unleash the beast of your utmost potential.</p>
                <br/>
                <button className='button_modal_01' onClick={()=>{
                    mixpanel.track("Creator's Signup");
                    navigate("/signup/creators")}}>Apply Now</button>
            </section>
        </div>
    </div>
  )
}

export default Modal1