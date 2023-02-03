import React from "react";
import "./Sidebar.css";
import logo from "../Images and svgs/logo.svg";
import Globe from "../Images and svgs/Globe.svg";
import svg1 from "../Images and svgs/dashboard.svg";
import svg2 from "../Images and svgs/Diamond.svg";
import svg3 from "../Images and svgs/Wallet.svg";
import svg4 from "../Images and svgs/copy.svg";
import svg5 from "../Images and svgs/Chart-pie-alt.svg";
import svg6 from "../Images and svgs/copy1.svg";

function Sidebar({ setOpenPage, openPage }) {
  return (
    <div className="sidebar_main_box">
      <img src={logo} alt="" className="logo_sidebar" />
      <div>
        <div>
          <section className="creator_sidebar_details">
            <img
              src="https://media.npr.org/assets/img/2022/11/08/ap22312071681283-0d9c328f69a7c7f15320e8750d6ea447532dff66.jpg"
              alt=""
            />
            <div>
              <p className="text_sidebar_01">Himanshu Kumar</p>
              <div className="text_sidebar_02">
                <span>
                  <i class="fa-solid fa-star"></i> 4.5
                </span>
                <span className="reviews_from_sidebar">99 Reviews</span>
              </div>
            </div>
          </section>
          <span>
            <img src={Globe} alt="" />
            &nbsp;&nbsp;Public Profile
          </span>
        </div>
        <section className="sidebar_navigation">
          <div onClick={() => setOpenPage(0)}>
            <img src={svg1} alt="" />
            Dashboard
          </div>
          <div onClick={() => setOpenPage(1)}>
            <img src={svg2} alt="" />
            My Content
          </div>
          <div onClick={() => setOpenPage(2)}>
            <img src={svg3} alt="" />
            Payment
          </div>
          <div onClick={() => setOpenPage(3)}>
            <img src={svg4} alt="" />
            Requests
          </div>
          <div onClick={() => setOpenPage(4)}>
            <img src={svg5} alt="" />
            Statistics
          </div>
        </section>
      </div>

      <section className="invite_sidebar">
        <h3>invite</h3>
        <span>Copy & Send to friends for Faster approval</span>
        <div>
          KA2104{" "}
          <span>
            <img src={svg6} alt="" />
          </span>
        </div>
      </section>
    </div>
  );
}

export default Sidebar;
