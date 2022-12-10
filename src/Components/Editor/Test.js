import React,{useState} from "react";

function Test() {
  const [value, setvalue] = useState()
  const [data, setdata] = useState()


  const handleClick = () => {
    window.location =
      "truecallersdk://truesdk/web_verify?requestNonce=515115151215&partnerKey=VfJBw0e9c586386864769b56aa850f1f66efc&partnerName=Anchors&lang=en&title=signUp"

    setTimeout(function () {
      if (document.hasFocus()) {
        alert("Truecaller not present");
      } else {
        // Truecaller app present on the device and the profile overlay opens
        // The user clicks on verify & you'll receive the user's access token to fetch the profile on your
        // callback URL - post which, you can refresh the session at your frontend and complete the user  verification
        setTimeout(async () => {
          const response = await fetch("https://www.anchors.in:5000/truecaller/auth",{
            method: "GET",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
              "Access-Control-Allow-Credentials": true,
            },
          })
          const json = await response.json()
          setvalue(json)
        }, 2000);

        setTimeout(async () => {
          const response = await fetch(`${value?.endpointforreal}`,{
            method: "GET",
            headers: {
              Accept: "application/json",
              "Authorization":`Bearer ${value.accessTokenforreal}`,
            },
          })
          const json = await response.json()
          setdata(json)
        }, 4000);
      }
    }, 600);
    
  };

  return (
    <div className="test">
      <button onClick={handleClick}>Login through Truecaller</button>
      <div className="response">
        <h2>{data?.phoneNumbers}</h2>
        <p>{data?.name?.first + data?.name?.last}</p>
        <p>{data?.onlineIdentities?.email}</p>
      </div>
    </div>
  );
}

export default Test;
