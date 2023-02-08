import React, { useContext } from "react";
import "./Model.css";
import ServiceContext from "../../Context/services/serviceContext";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Delete_Model({ id, open, onClose, progress, status }) {
  const context = useContext(ServiceContext);
  const { deleteService } = context;

  const handleDelete = async () => {
    progress(0);
    const success = await deleteService(id, status);
    if (success) {
      toast.success("Status Changed Successfull", {
        position: "top-center",
        autoClose: 2000,
      });
    } else {
      toast.error("Some error occured", {
        position: "top-center",
        autoClose: 2000,
      });
    }
    progress(100);
    window.location.reload();
  };

  if (!open) {
    return null;
  }

  return (
    <>
      <div onClick={onClose} className="model">
        <div onClick={(e) => e.stopPropagation()} className="model_main_box">
          <span className="model_question">
            Are you sure you want to change the status to{" "}
            {status == 0 ? <b>"OFF"</b> : <b>"ON"</b>}?
          </span>
          <span className="model_gyan">
            {status === 0 ? (
              <>This will prevent your fans from accessing the service.</>
            ) : (
              <>This will allow your fans to access the service.</>
            )}
          </span>
          <div className="model_buttons">
            <button className="model_button" onClick={handleDelete}>
              Save Changes
            </button>
            <button className="model_button" onClick={onClose}>
              Cancel
            </button>
          </div>
        </div>
      </div>
      <ToastContainer />
    </>
  );
}

export default Delete_Model;
