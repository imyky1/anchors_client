import React,{useEffect} from "react";

function PreviewService({open, onClose , sname, sdesc, ldesc, simg}) {

  useEffect(() => {
    if(ldesc && document.querySelector(".desc_preview")){
      document.querySelector(".desc_preview").innerHTML = ldesc
    }

    if (simg && document.querySelector("#previewImg")) {
      document.querySelector("#previewImg").src = URL.createObjectURL(simg)
    }
    
  }, [open])
  

  if (!open) {
    return null;
  }


  return (
    <>
      <div onClick={onClose} className="model preview_model_box">
        <div
          onClick={(e) => e.stopPropagation()}
          className="model_main_box email_box preview_model"
        >
          <i className="fa-solid fa-xmark fa-xl" onClick={onClose}/>
          <span className="model_question">Preview</span>
          <div className="preview_section">
            <img id="previewImg" src="https://thumbs.dreamstime.com/b/banner-empty-asphalt-road-autumn-fall-forest-autumnal-background-selective-focus-177744195.jpg" alt="" />
            <div>
            <h1>{sname ? sname : "Service Name"}</h1>
            <p>{sdesc ? sdesc :"Lorem ipsum dolor sit amet consectetur adipisicing elit. Architecto eligendi non illum, tempora repellat deserunt."}</p>
            </div>
            <div>
            <h2>Resource Description</h2>
            <p className="desc_preview">Lorem ipsum dolor sit amet consectetur adipisicing elit. Architecto eligendi non illum, tempora repellat deserunt. Lorem ipsum dolor sit ametione Lorem ipsum, dolor sit amet consectetur adipisicing elit. Vel nesciunt repellat, quaerat atque incidunt impedit a quia ex beatae! Ipsa obcaecati excepturi, natus, aspernatur quas totam cumque placeat sit a laudantium, distinctio aliquam nemo omnis.</p>
            </div>

          </div>
        </div>
      </div>
    </>
  );
}

export default PreviewService;
