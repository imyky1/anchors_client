import React from 'react'
import { LazyLoadImage } from 'react-lazy-load-image-component';
import PNGIMG from "../../../Utils/Images/default_user.png";

const WallOfLove = ({ data }) => {
    return (
      <section className="wall_of_love">
        <h1 className="headers1_mainpage">Wall Of Love</h1>
        <div>
          {data
            ? data
                ?.filter((e1) => {
                  return e1?.userID?.name;
                })
                .map((e) => {
                  return (
                    <div className="feedback_box_mainpage" key={e?.userID}>
                      <section>
                        <LazyLoadImage
                          src={e?.userID?.photo}
                          onError={({ currentTarget }) => {
                            currentTarget.onerror = null; // prevents looping
                            currentTarget.src = PNGIMG;
                          }}
                          alt="userimag"
                        />
                        <div>
                          <span className="user_name_mainpage">
                            {e?.userID?.name.length > 13
                              ? e?.userID?.name.slice(0, 13) + "..."
                              : e?.userID?.name}
                          </span>
                          {/* <span className="user_email_mainpage">
                              abc@gmail.com
                            </span> */}
                        </div>
                      </section>
                      <p>
                        {e?.desc}
                      </p>
                    </div>
                  );
                })
            : ""}
        </div>
      </section>
    );
  };

export default WallOfLove