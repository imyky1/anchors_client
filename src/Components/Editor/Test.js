import React, { useContext, useEffect, useState } from "react";
import { linkedinContext } from "../../Context/LinkedinState";
import { atcb_action, atcb_init } from "add-to-calendar-button";
import "add-to-calendar-button/assets/css/atcb.css";

function Test() {
  const { truecallerlogin, truecallervalue } = useContext(linkedinContext);

  const handleClick = async () => {
    await truecallerlogin();
  };

  useEffect(() => {
    atcb_init();
  }, []);

  return (
    <div className="test">
      <button onClick={handleClick}>Login through Truecaller</button>
      <div className="response">
        <h1>{truecallervalue ? "something" : "nothing yet..."}</h1>
        <div>{truecallervalue?.success}</div>
        <h2>PHONE NO .. - {truecallervalue.userdata?.phoneNumbers}</h2>
        <p>
          NAME -{" "}
          {truecallervalue.userdata?.name?.first +
            " " +
            truecallervalue.userdata?.name?.last}
        </p>
        <p>EMAIL - {truecallervalue.userdata?.onlineIdentities?.email}</p>
      </div>
      <div>
        <div className="atcb">
          {"{"}
          "name":"Add the title of your event", "description":"A nice
          description does not hurt", "startDate":"2022-02-21",
          "endDate":"2022-03-24", "startTime":"10:13", "endTime":"17:57",
          "location":"Somewhere over the rainbow", "label":"Add to Calendar",
          "options":[ "Apple", "Google", "iCal", "Microsoft365", "Outlook.com",
          "Yahoo" ], "timeZone":"Europe/Berlin", "iCalFileName":"Reminder-Event"
          {"}"}
        </div>
      </div>
    </div>
  );
}

export default Test;
