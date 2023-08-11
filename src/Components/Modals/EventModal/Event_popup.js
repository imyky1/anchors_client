import React, { useState } from "react";
import './EventModal.css';
import { BsFillPersonFill } from "react-icons/bs";
import {MdGroups} from 'react-icons/md'
import { useNavigate } from "react-router-dom";

const EventModel = ({onClose}) => {
  const navigate = useNavigate()

  return (
    <div className="event_popup_wrap_up" onClick={onClose}>
      <div className="create_event_head_popup" onClick={(e)=>{e?.stopPropagation()}}>
        <div className="create_event_head_popup_text">
          Who are you creating this Event for?
        </div>
        <div className="create_event_head_popup_total">
          <div
            className="create_event_head_popup_total_frame"
            onClick={()=>{navigate("/dashboard/createevent?type=singlespeaker")}}
          >
            <BsFillPersonFill size={40}/>
            <div
              className="create_event_head_popup_total_frame_text"
            >
              Myself
            </div>
          </div>
          <div
            className="create_event_head_popup_total_frame"
            onClick={()=>{navigate("/dashboard/createevent?type=multiplespeakers")}}
          >
            <MdGroups size={40}/>
            <div
              className="create_event_head_popup_total_frame_text"
            >
              Multiple Speakers
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventModel;