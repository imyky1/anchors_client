import React from "react";
import { useNavigate } from "react-router-dom";
import { SuperSEO } from "react-super-seo";
import "./Dashboard.css";
import mixpanel from "mixpanel-browser";

function Dashboard() {
  const navigate = useNavigate()

  return (
    <>
    <div className="main_dashboard_conatiner">
      <div>
        <h2 className="text_01_dashboard">Welcome! Everything you need to NAIL IT is here!</h2>
        <span className="text_02_dashboard">
        Upload interview prep documents, food recipes and inspiring videos here - in the format of your choice
        </span>
        <section>
            <div onClick={()=>{navigate("/createservice?type=pdf");mixpanel.track("Share a pdf")}} className="dashboard_options">Share a PDF</div>
            <div onClick={()=>{navigate("/createservice?type=excel");mixpanel.track("Share a excel")}} className="dashboard_options">Share an Excel</div>
            <div onClick={()=>{navigate("/createservice?type=video");mixpanel.track("Share a video")}} className="dashboard_options">Share a Video</div>
        </section>
      </div>
    </div>
    <SuperSEO title="Anchors - Dashboard" />
    </>
  );
}

export default Dashboard;
