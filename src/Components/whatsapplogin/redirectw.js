import React from "react";
<<<<<<< HEAD
//import OtplessSdk from "otpless-js-sdk";
=======
>>>>>>> 296c25ca92cab169ddcb3410889c9caa12533c72
import { useEffect } from "react";
import { useState } from "react";
import { set } from "react-ga";

const RedirectWhatsapp = () => {
  const [userdetail, setUserDetail] = useState();
  useEffect(() => {
    const urlparam = window.location.search.split("=");
    var options = {
      method: "POST",
      headers: {
        appId: "OTPLess:ZOBXLTVKLACASMPPBVCINROWRZRPZRJU",
        appSecret:
          "tdj4oXecbjBJHkypdzLYfLrypWo3cQsEi37XGn7q7dzA72gpWf1mik6b3fc62OUVR",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        token: urlparam[1],
      }),
    };

    fetch("https://api.otpless.app/v1/client/user/session/userdata", options)
      .then((data) => data.json())
      .then((nextt) =>
        nextt.responseCode === 200
          ? setUserDetail(nextt.data)
          : console.log("Error")
      )
      .catch((err) => console.log(err));
  }, []);
  console.log(userdetail);
  return (
    <div>
      <div>YOU HAVE BEEN LOGGED IN SUCCESSFULLY</div>
      Your Name -{userdetail?.name}
      <div>Your Mobile No -{userdetail?.mobile}</div>
    </div>
  );
};

export default RedirectWhatsapp;
