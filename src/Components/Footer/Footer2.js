import React from 'react'
import {ImLinkedin2} from "react-icons/im"
import "./Footer.css"
import mixpanel from 'mixpanel-browser'

function Footer2() {
  return (
    <div className="footer_user_side_anchors">
        <img className='footer-section_logo_02' src={require("./logo-beta-black.png")} alt="" />
        <span className='lower_footer_section_02'>2023 &#169; &nbsp;anchors.in &nbsp;Made in &nbsp; <img className="india_logo" src={require("./India-logo.png")} alt="India" /> </span>
    </div>
  )
}

export const Footer3 = () => {
  return (
    <div className="footer_user_side_anchors2">
      <section style={{display:"flex",alignItems:"center"}}>
        <ImLinkedin2 size={22} onClick={()=>{window.open("https://www.linkedin.com/company/beanchorite/")}}/> &nbsp;
        {window.screen.width < 600 && <a href='/privacy-policy' onClick={()=>{mixpanel.track("Terms & Privacy")}} style={{color:"unset"}}>Terms & privacy</a>}
      </section>
        <span >2023 &#169; &nbsp;anchors.in &nbsp;Made in &nbsp; <img className="india_logo" src={require("./India-logo.png")} alt="India" /> </span>
        {window.screen.width > 600 && <a href='/privacy-policy'  onClick={()=>{mixpanel.track("Terms & Privacy")}}>Terms & privacy</a>}
    </div>
  )
}

export default Footer2