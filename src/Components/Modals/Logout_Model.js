import React, { useContext, useState } from "react";
import "./Model.css";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import mixpanel from "mixpanel-browser";
import ServiceContext from "../../Context/services/serviceContext";

function Logout_Model() {
  const navigate = useNavigate();

  const [openModel, setopenModel] = useState(true);

  const logout = () => {
    if (localStorage.getItem("isUser") === "") {
      localStorage.removeItem("isUser");
      localStorage.removeItem("jwtToken");
      localStorage.removeItem("from");
      localStorage.removeItem("url");
      localStorage.removeItem("user");
      localStorage.removeItem("c_id");
      mixpanel.reset();
      navigate("/");
    } else {
      mixpanel.track("Clicked Logout By User");
      localStorage.removeItem("isUser");
      localStorage.removeItem("jwtToken");
      localStorage.removeItem("from");
      localStorage.removeItem("user");
      mixpanel.reset();
      window.open(localStorage.getItem("url"),"_self");
    }
    toast.success("Logged Out successfully", {
      position: "top-center",
      autoClose: 2000,
    });
  };

  if (!openModel) {
    navigate("/dashboard");
    return null;
  }

  return (
    <div onClick={() => setopenModel(false)} className="logout_model_logout">
      <div onClick={(e) => e.stopPropagation()} className="model_main_box">
        <span className="model_question">Do You Really Want to Log Out?</span>
        <span className="model_gyan">
          Logging out now will require you to log in again next time you visit.
        </span>
        <div className="model_buttons">
          <button className="model_button" onClick={() => setopenModel(false)}>
            Cancel
          </button>
          <button className="model_button" onClick={logout}>
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}

function Delete_Model({onClose,data}) {

  const {deleteService} = useContext(ServiceContext)

  const handleDelete = async () =>{
    const success = await deleteService(
      data?._id,
      2,
      data?.selected === "events" ? "event" : "document"
    ); // changing status of the service / eevent

    if(success){
      toast.success("Content Deleted Successfully", {
        position: "top-center",
        autoClose: 2000,
      });
      onClose();
    }

    else{
      toast.error("Some error occured", {
        position: "top-center",
        autoClose: 2000,
      });
      onClose()
    }

  }

  return (
    <div onClick={onClose} className="logout_model_logout">
      <div onClick={(e) => e.stopPropagation()} className="model_main_box">
        <span className="model_question">Delete Resource</span>
        <span className="model_gyan">
          Once deleted, you will not be able to recover this resource. Do you
          want to continue?
        </span>
        <div className="model_buttons">
          <button className="model_button" onClick={handleDelete}>
            Yes, delete
          </button>
          <button className="model_button" onClick={onClose}>
            No
          </button>
        </div>
      </div>
    </div>
  );
}

export default Logout_Model;
export const DeleteModal = Delete_Model;
