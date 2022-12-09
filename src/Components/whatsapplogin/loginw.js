import React from "react";
import "./loginw.css";
function LoginWhatsapp() {
  const handlelogin = () => {
    var options = {
      method: "POST",
      headers: {
        appId: "OTPLess:ZOBXLTVKLACASMPPBVCINROWRZRPZRJU",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        loginMethod: "WHATSAPP",
        redirectionURL: "https://www.anchors.in/login/whatsapp/token",
      }),
    };
    fetch("https://api.otpless.app/v1/client/user/session/initiate", options)
      .then((intent) => intent.json())
      .then((we) =>
        window.open(we.data.intent, "_blank", "noopener,noreferrer")
      )
      .catch((err) => console.log(err));
  };

  return (
    <div className="login_whatsapp_wrapper">
      Login With whatsapp
      <button onClick={handlelogin}>LOGIN THROUGH WHATSAPP</button>
    </div>
  );
}
export default LoginWhatsapp;
