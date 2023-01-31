import React, { useState, useEffect } from "react";
import "./ReviewDetail.css";
import ShowReviewModel from "../../Modals/ShowReviewModel"

function ReviewDetail(props) {
  const [openModel, setOpenModel] = useState(false);
  const [changeStatus, setChangeStatus] = useState(1);

  
  useEffect(() => {
    const doc = document.getElementById(`checkbox_review_${props.sno}`)
    if(doc && props.status === 1){
      doc.checked = true
    }else{
      doc.checked = false
    }
    // eslint-disable-next-line
  }, [openModel]);


  const handleCheckClick = () =>{
    const doc = document.getElementById(`checkbox_review_${props.sno}`)
    if(doc.checked){ // means now it is checked
      setChangeStatus(1)
      setOpenModel(true)
    }
    else{ // means now it is unchecked
      setChangeStatus(0)
      setOpenModel(true)
    }
  }

  return (
    <>
      <div className="review_details">
        <span>{props.sno}</span>
        <span>{props.name ? props.name : "--"}</span>
        <span>{props.sname}</span>
        <span>{props.rating}</span>
        <span>{props.desc}</span>
        <span>
          {props.date}
        </span>
        
        <span onClick={handleCheckClick}>
          <label className="switch2">
            <input type="checkbox" id={`checkbox_review_${props.sno}`} />
            <span className="slider2 round2"></span>
          </label>
        </span>
      </div>
      <ShowReviewModel
        id={props.id}
        status={changeStatus}
        open={openModel}
        progress={props.progress}
        onClose={() => {
          setOpenModel(false);
        }}
      />
    </>
  );
}

export default ReviewDetail;
