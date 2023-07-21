import React from 'react'
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { useNavigate } from 'react-router-dom';

// Each Service Card ---------------------
const ServiceCards = ({ sname, simg, slug, stype }) => {
    const navigate = useNavigate();
  
    return (
      <div className="new_service_page_service_card">
        <LazyLoadImage src={simg} alt={sname} />
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

export default ServiceCards