import React from "react";
import { LazyLoadImage } from "react-lazy-load-image-component";
import PNGIMG from "../../../../../Utils/Images/default_user.png";
import { RiStarSFill } from "react-icons/ri";

// Review Section -----------------
const ReviewsSection = (data) => {
  return (
    <section className="new_service_page_other_services_section">
      <h2 className="text_type_06_new_service_page">User Reviews</h2>

      <div>
        {data?.data?.map((e, i) => {
          return <ReviewCards {...e} key={i} />;
        })}
      </div>
    </section>
  );
};

// Each Review Card ---------------------
export const ReviewCards = ({ name, desc, rating, photo }) => {
  return (
    <div className="new_service_page_review_card">
      <section>
        <LazyLoadImage
          src={photo}
          alt=""
          onError={({ currentTarget }) => {
            currentTarget.onerror = null; // prevents looping
            currentTarget.src = PNGIMG;
          }}
          className="user_profile_pic"
        />

        <div>
          <span>
            {name ? (name.length > 10 ? name.slice(0, 10) + ".." : name) : "--"}
          </span>
          <p>
            {Array(rating)
              .fill("a")
              ?.map((e, i) => {
                return (
                  <RiStarSFill
                    size={window.screen.width > 600 ? 16 : 12}
                    color="rgba(255, 214, 0, 1)"
                  />
                );
              })}
          </p>
        </div>
      </section>

      <p>{desc}</p>
    </div>
  );
};

export default ReviewsSection;
