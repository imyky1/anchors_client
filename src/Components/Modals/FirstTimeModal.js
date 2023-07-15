import React from "react";
import "./Model.css"
import upload from "../../Utils/Icons/upload.svg"
import volume from "../../Utils/Icons/volume.svg"
import track from "../../Utils/Icons/track.svg"

function FirstTimeModal({onClose}) {
  return <div className="creator_feedback_modal_wrapper">

    <div className="firstTimeModal_main_box">
        <h2>Key steps to increase revenue as an
approved creator</h2>

        <section>
            <div>
                <img src={upload} alt="" />
                <section>
                    <h3>Upload Valuable Content</h3>
                    <p>Share your expertise through documents or events.</p>
                </section>
            </div>
            <div>
            <img src={volume} alt="" />
                <section>
                    <h3>Promote</h3>
                    <p>Copy the link and share on your social media.</p>
                </section>
            </div>
            <div>
            <img src={track} alt="" />
                <section>
                    <h3>Track Performance</h3>
                    <p>Sit back and check your content's performance.</p>
                </section>
            </div>
        </section>

        <button onClick={onClose}>Go to Dashboard</button>
    </div>  
  </div>;
}

export default FirstTimeModal;
