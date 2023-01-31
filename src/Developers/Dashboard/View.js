import React, { useState, useEffect } from "react";
import { host } from "../../config/config";
import { useNavigate } from "react-router-dom";
import "./View.css";
import Moment from "moment";

function View() {
  const [allcreators, setallcreators] = useState([]);
  const navigate = useNavigate()

  const getjwt = async (id,status)=>{
      const response = await fetch(`${host}/api/developer/getCreatorJwt`, {
          method: "POST",
          headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
              "Access-Control-Allow-Credentials": true,
            },
            body: JSON.stringify({id:id,status:status})
        });
        const json = await response.json();
        if (json.success) {
            localStorage.setItem("jwtToken",json.jwtToken)
            localStorage.setItem("isUser","")
            
        }
       
    };


  useEffect(() => {
    const allcreators = async () => {
      const response = await fetch(`${host}/api/developer/getallCreator`, {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Access-Control-Allow-Credentials": true,
          "jwt-token":localStorage.getItem("jwtTokenD")
        },
      });
      const json = await response.json();
      if (json.success) {
        setallcreators(json.creators);
      }
      else{
          alert("You are not allowed to Access")
          document.querySelector(".logout_admin_panel")?.click()
        }
    };
    allcreators();
  }, []);


  const handleLogout = () =>{
    localStorage.removeItem("jwtTokenD")
    localStorage.removeItem("jwtToken")
    localStorage.removeItem("isUser")
    localStorage.removeItem("isDev")
    localStorage.removeItem("c_id")
    navigate("/")
  }

  const handleClick = async (id,status)=>{
    await getjwt(id,status).then(()=>{
      if(status === 1 ){
        window.open("/dashboard")    
      }
      else{
        window.open("/waitlist")    
      }
    })
  }

  if(!localStorage.getItem("jwtTokenD") || !localStorage.getItem("isDev")){
    window.open("/developer/login","_self")
  }

  return (
    <div className="admin_container">
      <div className="profile_header" style={{ border: "none" }}>
        <div className="logo">
          <img src={require("../../Components/logo.png")} alt="Logo" />
          <span>Anchors</span>
        </div>
        {localStorage.getItem("jwtTokenD") && <button className="logout_admin_panel" onClick={handleLogout}>Logout</button>}
      </div>

      <div className="creator_display_list">
        {allcreators.length !==0 ? allcreators.map((e, index) => {
        const date = Moment(e?.createdOn).format().split("T")[0];
        const time = Moment(e?.createdOn).format().split("T")[1].split("+")[0];
          return (
            <div className="creator_item" key={index} onClick={()=>handleClick(e?._id,e?.status)}>
              <div className="profile_creator">
                <img
                  src={e?.photo}
                  alt="..."
                />
                <span>{e?.name}</span>
              </div>
              <div className="other_details_creator">
                <span className="email_creator">
                  <b>Email: </b> {e?.email}
                </span>
                <span className="slug_creator">
                  <b>Slug: </b> {e?.slug}
                </span>
                <span className="joined_creator">
                  <b>Joined On: </b> {date}, {time}
                </span>
              </div>
                {e?.status === 1 ?
              <span className="accessible">Approved</span>:
              <span className="naccessible">Not Approved</span>}
            </div>
          );
        }):""}
      </div>
    </div>
  );
}

export default View;
