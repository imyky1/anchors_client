import React, { useRef, useState,useCallback,useEffect } from "react";
import { host, jwtTokenDeveloper } from "../../config/config";
import { useNavigate } from "react-router-dom";
import { useCookies } from 'react-cookie';
import "./Login.css"
import Navbar from "../../Components/Layouts/Navbar Creator/Navbar";

function Login() {
  const ref = useRef();
  const navigate = useNavigate();
  const [cookies, setCookie] = useCookies();
  const [sentOTP,setsentOTP] = useState(false)

  const [data, setData] = useState({ email: "", password: "", otp:"" });

  const handleShowPassword = () => {
    const doc = document.getElementById("show_pass");
    if (doc.checked === true) {
      ref.current.type = "text";
    } else {
      ref.current.type = "password";
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch(`${host}/api/developer/login`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "Access-Control-Allow-Credentials": true,
      },
      body: JSON.stringify({ email: data.email, password: data.password }),
    });
    const json = await response.json();
    if (json.success) {
      localStorage.setItem("jwtTokenD", json.jwtToken);
      localStorage.setItem("isDev", true);
      navigate("/developer/admin");
    } else {
      alert("Invalid Credentials Please Try Again");
    }
  };
  

  const handleSubmitOTP = async (e) => {
    e.preventDefault();
    const response = await fetch(`${host}/api/email/sendMsg?message=Login&number=6267941318&subject=Anchors`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "Access-Control-Allow-Credentials": true,
      }
    });
    const json = await response.json();
    if(json?.MessageID){
      setsentOTP(true)
      let otpcode =  parseInt(json?.code - 145626) * 562002;
      setCookie('ccoondfe', otpcode, { maxAge:120 });
    }
  };
  

  const CheckOTP = async () =>{
    let code = cookies?.ccoondfe

    if(data.otp === (parseInt(code)/562002).toString()){
      localStorage.setItem("jwtTokenD",jwtTokenDeveloper);
      localStorage.setItem("isDev", true);
      setCookie('devsession', true , { maxAge:30*24*60*60*1000 });
      navigate("/developer/admin");
    } else {
      alert("Invalid OTP Please Try Again");
    }
  }


  const handleChange = (e) => {
    e.preventDefault();
    setData({ ...data, [e.target.name]: e.target.value });
  };



  return (
    <div className="creator_login">

      <Navbar noAccount={true}/>

      <div className="main_page_login">
        <div className="gyan_container">
          Hello, Anchors Builders <br />
          Let's work hard and raise the level of Anchors together.
        </div>
        <div className="login_container_developer" style={{ height: "79vh" }}>
          <h2>Welcome Back Builders</h2>
          {/* <img src={require("../../Components/logo2.png")} alt="logo" style={{width:"5rem",height:"5rem",marginBottom:"-50px"}} /> */}
          {/* <form style={{ marginTop: "25px" }}>
            <input
              className="input_cred"
              type="email"
              name="email"
              id="email"
              onChange={handleChange}
              placeholder="Enter your email"
            />
            <input
              className="input_cred"
              ref={ref}
              type="password"
              name="password"
              id="password"
              onChange={handleChange}
              placeholder="Password"
            />
            <div className="login_check">
              <input
                type="checkbox"
                name="show_pass"
                id="show_pass"
                onClick={handleShowPassword}
              />
              <label htmlFor="show_pass" onClick={handleShowPassword}>
                Show Password
              </label>
            </div>
            <input
              type="submit"
              className="login_submit"
              value="Login"
              onClick={handleSubmit}
            />
          </form> */}
          {/* <h2 style={{ marginTop: "13px" }}>--------------- or ------------</h2> */}
          {/* <input
            type="submit"
            className="login_submit"
            value={sentOTP ? "OTP Sent" : "Login with OTP"}
            onClick={handleSubmitOTP}
            style={{ marginTop: "15px" }}
          /> */}
          <button onClick={handleSubmitOTP} className="button_login_dev">{sentOTP ? "OTP Sent" : "Login with OTP"}</button>

          {sentOTP && <div className="otp_modal_developers">
            <input
              className="input_cred"
              type="number"
              name="otp"
              id="otp"
              value={data.otp}
              placeholder="Enter OTP"
              onChange={handleChange}
            />
            
            <button onClick={CheckOTP} className="button_login_dev">Submit</button>
            {/* <p onClick={resetTimer}>
              Resend Code in <span className="timer">{timer + "s"}</span>
            </p> */}
          </div>}
        </div>
      </div>
    </div>
  );
}

export default Login;
