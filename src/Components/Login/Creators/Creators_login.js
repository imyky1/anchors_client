import React, { useRef, useEffect } from "react";
import "./Creators_login.css";
import { host } from "../../../config/config.js";

function Creators_login() {
  const ref = useRef();

  //const handleShowPassword = () =>{
  //  const doc = document.getElementById("show_pass")
  //  if(doc.checked == true){
  //    ref.current.type = "text"
  //  }else{
  //    ref.current.type = "password"
  //  }
  //}

  const handleGoogle = async () => {
    localStorage.setItem("isUser", "");
    localStorage.setItem("from", "google");
    window.open(`${host}/google/auth`, "_self");
  };

  const handlelinkedin = async () => {
    localStorage.setItem("isUser", "");
    localStorage.setItem("from", "linkedin");
    window.open(`${host}/login/auth/linkedin`, "_self");
  };

  return (
    <div className="creator_login">
      <div className="creator_login_header">
        <div className="logo_loginPage">
          <img src={require("../../logo.png")} alt="Logo" />
          <span>anchors</span>
        </div>
        <a
          href="https://forms.gle/BSX2K1ty1bQF7J3t8"
          target="_blank"
          rel="noreferrer"
        >
          <button className="waitlist">Join Waitlist</button>
        </a>
      </div>
      <div className="main_page_login">
        <div className="gyan_container">
          <img src={require("../../main2.png")} alt="" />
        </div>
        <div className="login_container">
          <h1>Welcome Back Anchor</h1>
          <button className="linkedin_auth_link" onClick={handlelinkedin}>
            <i className="fa-brands fa-linkedin-in"></i> Login with LinkedIn
          </button>

          <button className="google_auth_link" onClick={handleGoogle}>
            <i className="fa-brands fa-google"></i> Login with Google
          </button>
          {/* <form>
            <input
              className="input_cred"
              type="email"
              name="email_id"
              id="email_id"
              disabled={true}
              placeholder="Enter your email"
            />
            <input
              className="input_cred"
              ref={ref}
              type="password"
              name="password"
              id="password"
              disabled={true}
              placeholder="Password"
            />
            <div className="login_check">
            <input disabled={true} type="checkbox" name="show_pass" id="show_pass"  onClick={handleShowPassword}/>
            <label htmlFor="show_pass" onClick={handleShowPassword}>Show Password</label>
            </div>
            <input disabled={true} type="submit" className="login_submit" value="Login" />
          </form> */}
        </div>
      </div>
    </div>
  );
}

export default Creators_login;
