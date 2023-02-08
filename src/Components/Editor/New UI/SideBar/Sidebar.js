import React, { useContext, useEffect } from "react";
import "./Sidebar.css";
import logo from "../Images and svgs/logo.svg";
import Globe from "../Images and svgs/Globe.svg";
import svg1 from "../Images and svgs/dashboard.svg";
import svg2 from "../Images and svgs/Diamond.svg";
import svg3 from "../Images and svgs/Wallet.svg";
import svg4 from "../Images and svgs/copy.svg";
import svg5 from "../Images and svgs/Chart-pie-alt.svg";
import svg6 from "../Images and svgs/copy1.svg";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";


function Sidebar({userData,moreInfo}) {
  const localtion = useLocation()
  const navigate = useNavigate()
  
  

  return (
    <div className="sidebar_main_box">
      <img onClick={()=>{navigate("/")}} src={logo} alt="" className="logo_sidebar" />
      <div>
        <div>
          <section className="creator_sidebar_details">
            <img
              src={userData?.photo}
              alt=""
              onClick={()=>{window.open(`/c/${userData?.slug}`)}}
            />
            <div>
              <p className="text_sidebar_01">{userData?.name}</p>
              <div className="text_sidebar_02">
                <span>
                  <i className="fa-solid fa-star"></i> { moreInfo ? moreInfo?.Rating : "4.1"}
                </span>
                <span className="reviews_from_sidebar" onClick={()=>{navigate("/newUi/reviews")}}>{ moreInfo ? moreInfo?.Reviews : "--"} Reviews</span>
              </div>
            </div>
          </section>
          <span onClick={()=>{window.open(`/c/${userData?.slug}`)}}>
            <img src={Globe} alt="" />
            &nbsp;&nbsp;Public Profile
          </span>
        </div>
        <section className="sidebar_navigation">
          <Link to="/newUi/dashboard" className={`${(localtion.pathname==="/newUi/dashboard" || localtion.pathname==="/newUi/createservice") && "sidebar_navigation_active"} sidebar_navigation_normal`}> 
            <img src={svg1} alt="" />
            Dashboard
          </Link>
          <Link to="/newUi/mycontents" className={`${localtion.pathname==="/newUi/mycontents" && "sidebar_navigation_active"} sidebar_navigation_normal`}>
            <img src={svg2} alt="" />
            My Content
          </Link>
          <Link to="/newUi/payments" className={`${localtion.pathname==="/newUi/payments" && "sidebar_navigation_active"} sidebar_navigation_normal`}>
            <img src={svg3} alt="" />
            Payment
          </Link>
          <Link to="/newUi/requests" className={`${localtion.pathname==="/newUi/requests" && "sidebar_navigation_active"} sidebar_navigation_normal`}>
            <img src={svg4} alt="" />
            Requests
          </Link>
          <Link to="/newUi/stats" className={`${localtion.pathname==="/newUi/stats" && "sidebar_navigation_active"} sidebar_navigation_normal`}>
            <img src={svg5} alt="" />
            Statistics
          </Link>
        </section>
      </div>

      {userData?.inviteCode && 
      <section className="invite_sidebar">
        <h3>invite</h3>
        <span>Copy & Send to friends for Faster approval</span>
        <div onClick={()=>{toast.info("Invite Code Copied Successfully",{position:"top-center",autoClose:1500}); navigator.clipboard.writeText(userData?.inviteCode)}} >
          {userData?.inviteCode}{" "}
          <span>
            <img src={svg6} alt="" />
          </span>
        </div>
      </section>}
    </div>
  );
}

export default Sidebar;
