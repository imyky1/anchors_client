import React, { useEffect, useState } from "react";
import "./frame.css";
import { host } from "../../config/config";
import profile from "../../Utils/Images/default_user.png";
import { LazyLoadImage } from "react-lazy-load-image-component";
import mixpanel from "mixpanel-browser";

const Frame = ({setLoading}) => {
  const [creators, setCreators] = useState([]);

  useEffect(() => {
    setLoading(true)
    fetch(`${host}/api/creator/getAllCreator`)
      .then((response) => response.json())
      .then((data) => {
        setLoading(false)
        if (data.success) {
          setCreators(data.details);
        } else {
          console.log("Error fetching data:", data.error);
        }
      })
      .catch((error) => {
        setLoading(false)
        console.error("Error fetching data:", error);
      });
  }, []);


  return (
    <div className="image_conatiner">
      {creators.map((creator, index) => (
        <div key={index} className="image_section" onClick={()=>{mixpanel.track("Creator Clicked in approved Creators",{
          creator:creator?.name
        })}}>
          <a
            href={creator.linkedInLink ? creator.linkedInLink : `/${creator.link}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <LazyLoadImage
              src={creator?.profile ?? profile}
              alt={creator?.name}
              className="image"
              onError={({ currentTarget }) => {
                currentTarget.onerror = null;
                currentTarget.src = profile;
              }}
            />
          </a>
          <div className="text"> {creator.name}</div>
        </div>
      ))}
    </div>
  );
};

export default Frame;
