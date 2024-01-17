import React from "react";
import { LazyLoadImage } from "react-lazy-load-image-component";
import ExcelIcon from "../../../../../Utils/Icons/excel-service.svg";
import VideoIcon from "../../../../../Utils/Icons/video-service.svg";
import DocIcon from "../../../../../Utils/Icons/doc-service.svg";
import { useNavigate } from "react-router-dom";
import "../ServicePage.css"


const MoreServices = ({data,background,cardBackground}) => {
  return (
    <section className="new_service_page_other_services_section" style={{background:background ?? ""}}>
      <h2 className="text_type_06_new_service_page">More Services</h2>

      <div>
        {data?.map((e, i) => {
          return <ServiceCards {...e} key={i} cardBackground={cardBackground}/>;
        })}
      </div>
    </section>
  );
};

// Each Service Card ---------------------
export const ServiceCards = ({ sname, simg, mobileSimg, slug, stype , cardBackground }) => {
  const navigate = useNavigate();

  return (
    <div className="new_service_page_service_card" style={{background:cardBackground??""}}>
      <LazyLoadImage src={mobileSimg ?? simg} alt={sname} />
      <h3>
        {sname.length > (window.screen.width > 600 ? 45 : 30)
          ? sname.slice(0, window.screen.width > 600 ? 45 : 30) + "..."
          : sname}
      </h3>

      <span>
        <img
          src={stype === 1 ? ExcelIcon : stype === 2 ? VideoIcon : DocIcon}
          alt=""
        />{" "}
        Document
      </span>

      <button
        onClick={() => {
          navigate(`/s/${slug}`);
        }}
      >
        Explore
      </button>
    </div>
  );
};

export default MoreServices;
