import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import Cropper from "react-easy-crop";
import { useNavigate } from "react-router-dom";
import "./Model.css";

function ImagePreview({ open, onClose, img }) {
  const [previmg, setPrevImg] = useState();

  useEffect(() => {
    const objectUrl = URL.createObjectURL(img);

    setPrevImg(objectUrl);
  }, []);

  if (!open) {
    return null;
  }

  return (
    <>
      <div onClick={onClose} className="imagePreviewModal">
        <div
          className="img-preview-modalwrap"
          onClick={(e) => e.stopPropagation()}
        ></div>
      </div>
    </>
  );
}

export default ImagePreview;
