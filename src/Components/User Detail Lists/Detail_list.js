import React from "react";
import "./Detail_list.css";
import Moment from "moment";

function Detail_list(props) {
  let email =
    props.info?.userID?.email?.split("@")[0].length > 6
      ? props.info?.userID?.email?.split("@")[0].substr(0, 5) +
        "....@" +
        props.info?.userID?.email?.split("@")[1]
      : props.info?.userID?.email?.split("@")[0].substr(0, 3) +
        "....@" +
        props.info?.userID?.email?.split("@")[1];
  const date = Moment(props.info?.orderDate).format().split("T")[0];
  const time = Moment(props.info?.orderDate)
    .format()
    .split("T")[1]
    .split("+")[0];

  return (
    <div className="detail_list_main">
      <span>{props?.sno}</span>
      <span>{props.info?.userID ? props.info?.userID?.name : "----"}</span>
      <span>{props.info?.userID?.email ? email : "----"}</span>
      <span>
        {props.info?.userID?.location
          ? props.info?.userID?.location?.city +
            ", " +
            props.info?.userID?.location?.country
          : "----"}
      </span>
      <span>{props.info?.amount}</span>
      <span>
        {date}&nbsp; {time}
      </span>
    </div>
  );
}

export default Detail_list;
