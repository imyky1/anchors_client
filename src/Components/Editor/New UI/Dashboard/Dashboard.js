import React from "react";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";

function Dashboard() {
  const navigate = useNavigate()

  return (
    <div className="main_dashboard_conatiner">
      <div>
        <h2 className="text_01_dashboard">Welcome to anchors</h2>
        <span className="text_02_dashboard">
          you can upload Excel sheets, Important Document, Notes, Interview
          Questions & Videos
        </span>
        <section>
            <div onClick={()=>navigate("/createservice?type=pdf")} className="dashboard_options">Create PDF</div>
            <div onClick={()=>navigate("/createservice?type=excel")} className="dashboard_options">Create Excelsheet</div>
            <div onClick={()=>navigate("/createservice?type=video")} className="dashboard_options">Upload Video</div>
        </section>
      </div>
    </div>
  );
}

export default Dashboard;
