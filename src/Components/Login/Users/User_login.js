import React ,{useEffect} from 'react'
import { Link, useLocation } from 'react-router-dom';
import "./User_login.css"
import { host } from '../../../config/config';
import mixpanel from "mixpanel-browser"




function User_login({open,onClose}) {
  const location = useLocation()


  if (!open) {
    return null;
  }


  const handleGoogle = async() => {
    mixpanel.track("User login through Google" , {
      user:""
  })
    localStorage.setItem('isUser', true)
    localStorage.setItem('from','google')
    localStorage.setItem('url', location.pathname)
    window.open(`${host}/google/auth`, "_self");
  }

  const _handlelinkedin = async () => {
    mixpanel.track("User login through Linkedin" , {
      user:""
  })
    localStorage.setItem('isUser', true)
    localStorage.setItem('from', 'linkedin')
    localStorage.setItem('url', location.pathname)
    window.open(`${host}/login/auth/linkedin`, "_self");
  };

  return (
    <div onClick={onClose} className="user_model">
      <div onClick={(e)=>e.stopPropagation()} className="model_main_box user_model_box">
        <img src={require("../../logo.png")} alt="logo"/>
        <span className="usermodel_question">
          Login with Anchors
        </span>
        <div className="model_buttons user_model_button" >
          <button className="model_button" onClick={_handlelinkedin} >
          <i class="fa-brands fa-linkedin fa-xl"></i> Login with LinkedIn
          </button>
        <button  className="model_button" onClick={handleGoogle} >
          <img src={require("../../google.png")} alt="" />
        Login with Google
          </button>
        </div>
        <span className="terms_conditions">By going forward, you're agreeing to Anchors <span>Terms of use</span> and <Link to="/privacy-policy" target="_blank"><span> Privacy Policies</span></Link>.</span>
      </div>
    </div>
    
  )
}

export default User_login