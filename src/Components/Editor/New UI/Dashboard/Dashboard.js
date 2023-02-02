import React from "react";
import "./Dashboard.css";

function Dashboard() {
  return (
    <div className="main_dashboard_conatiner">
      <div>
        <h2 className="text_01_dashboard">Welcome to anchors</h2>
        <span className="text_02_dashboard">
          you can upload Excel sheets, Important Document, Notes, Interview
          Questions & Videos
        </span>
        <section>
            <div className="dashboard_options">Create PDF</div>
            <div className="dashboard_options">Create Excelsheet</div>
            <div className="dashboard_options">Upload Video</div>
        </section>
      </div>
    </div>
  );
}

export default Dashboard;
