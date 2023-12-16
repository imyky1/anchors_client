import React from "react";
import { LoadThree } from "../Modals/Loading";
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

const CheckPayment = () => {
  const navigate = useNavigate()
    const {type, slug} = useParams()

  useEffect(() => {
    let data = localStorage.getItem("stripeData");
    let finaldata = JSON.parse(data)

    localStorage.removeItem("stripeData")

    if(type === "event"){
      navigate(`/e/${slug}?txnId=${finaldata?.sessionId}`)
    }

    else{
      navigate(`/s/${slug}?txnId=${finaldata?.sessionId}`)
    }

  }, []);

  return <LoadThree />;
};

export default CheckPayment;
