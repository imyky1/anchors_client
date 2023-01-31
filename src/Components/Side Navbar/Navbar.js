import React, { useContext, useEffect } from "react";
import "./Navbar.css";
import { Link, useLocation } from "react-router-dom";
import { linkedinContext } from "../../Context/LinkedinState";
import { creatorContext } from "../../Context/CreatorState";
import { LazyLoadImage } from "react-lazy-load-image-component";
import PNGIMG from "../Main Page/default_profile.png";

function Navbar() {
  const location = useLocation();
  const { loginInfo } = useContext(linkedinContext);
  const { getAllCreatorInfo, allCreatorInfo, basicNav } =
    useContext(creatorContext);

  useEffect(() => {
    getAllCreatorInfo();
    // eslint-disable-next-line
  }, []);

  return (
    <div className="side_navbar">
      <Link
        className="creators_profile"
        target="_blank"
        rel="noreferrer"
        to={`c/${localStorage.getItem("c_id")}`}
      >
        <LazyLoadImage
          effect="blur"
          src={
            loginInfo?.photo
              ? loginInfo?.photo
              : allCreatorInfo?.profile
              ? allCreatorInfo?.profile
              : basicNav?.photo
          }
          alt="..."
          onError={({ currentTarget }) => {
            currentTarget.onerror = null; // prevents looping
            currentTarget.src = PNGIMG;
          }}
          className="c_pic"
          placeholderSrc="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSHaAfOzOEovz1u7rsIMbl_SzAAxk99xlyxAVJ4r3475UvmyHLFVZSZkaGSbLFc5PNRO3A&usqp=CAU"
        />
        <span className="c_name">
          {loginInfo?.name ? loginInfo?.name : basicNav?.name}
        </span>
        <span className="c_email">
          {loginInfo?.email ? loginInfo?.email : basicNav?.email}
        </span>
      </Link>

      <ul className="nav_items">
        <Link
          to="/creator_info"
          className={`${
            location.pathname === "/creator_info" ? "active" : ""
          } items`}
        >
          <li>Personal Info</li>
        </Link>
        <Link
          to="/dashboard"
          className={`${
            location.pathname === "/dashboard" ? "active" : ""
          } items`}
        >
          <li>Dashboard</li>
        </Link>
        <Link
          to="/subscriberlist"
          className={`${
            location.pathname === "/subscriberlist" ? "active" : ""
          } items`}
        >
          <li>Subscriber List</li>
        </Link>
        <Link
          to="/servicelist"
          className={`${
            location.pathname === "/servicelist" ? "active" : ""
          } items`}
        >
          <li>Services Detail</li>
        </Link>
        <Link
          to="/user_reviews"
          className={`${
            location.pathname === "/user_reviews" ? "active" : ""
          } items`}
        >
          <li>User Reviews</li>
        </Link>
        <Link
          to="/user_requests"
          className={`${
            location.pathname === "/user_requests" ? "active" : ""
          } items`}
        >
          <li>Requested Resources</li>
        </Link>
        <a
          href="/logout"
          className={`${location.pathname === "/logout" ? "active" : ""} items`}
        >
          <li>Logout</li>
        </a>
      </ul>
    </div>
  );
}

export default Navbar;
