import { useCallback, useEffect, useRef, useState } from "react";
import Cropper from "react-easy-crop";
import useClickOutside from "./clickOutside";
import getCroppedImg from "./getCroppedImg";
import PulseLoader from "react-spinners/PulseLoader";
import "./style.css";

export default function Cover({ cover, setImage, close }) {
  const [showCoverMneu, setShowCoverMenu] = useState(false);
  const [coverPicture, setCoverPicture] = useState(cover);
  const [loading, setLoading] = useState(false);
  const [show, setShow] = useState(false);
  const menuRef = useRef(null);
  const refInput = useRef(null);
  const cRef = useRef(null);
  useClickOutside(menuRef, () => setShowCoverMenu(false));
  const [error, setError] = useState("");

  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);
  const getCroppedImage = useCallback(async () => {
    try {
      const img = await getCroppedImg(
        coverPicture,
        croppedAreaPixels,
        setImage
      );

      return img;
    } catch (error) {
      console.log(error);
    }
  }, [croppedAreaPixels]);
  const coverRef = useRef(null);
  const [width, setWidth] = useState();
  useEffect(() => {
    setWidth(coverRef.current.clientWidth);
  }, [window.innerWidth]);

  const updateCoverPicture = async () => {
    try {
      setLoading(true);
      let img = await getCroppedImage();
      setImage(img);
      // this can be used to download any image from webpage to local disk
      let xhr = new XMLHttpRequest();
      xhr.responseType = "blob";

      xhr.onload = function () {
        let a = document.createElement("a");
        a.href = window.URL.createObjectURL(xhr.response);
        a.download = "image_name.png";
        a.style.display = "none";
        document.body.appendChild(a);
        a.click();
        a.remove();
      };
      xhr.open("GET", img); // This is to download the canvas Image
      xhr.send();
      close(false);
      // let blob = await fetch(img).then((b) => b.blob());
      // const path = `${user.username}/cover_pictures`;
      // let formData = new FormData();
      // formData.append("file", blob);
      // formData.append("path", path);
      // const res = await uploadImages(formData, path, user.token);
      // const updated_picture = await updateCover(res[0].url, user.token);
      // if (updated_picture === "ok") {
      //   const new_post = await createPost(
      //     "coverPicture",
      //     null,
      //     null,
      //     res,
      //     user.id,
      //     user.token
      //   );
      //   console.log(new_post);
      //   if (new_post === "ok") {
      //     setLoading(false);
      //     setCoverPicture("");
      //     cRef.current.src = res[0].url;
      //   } else {
      //     setLoading(false);

      //     setError(new_post);
      //   }
      // } else {
      //   setLoading(false);

      //   setError(updated_picture);
      // }
    } catch (error) {
      setLoading(false);
      // setError(error);
      console.log(error);
    }
  };
  return (
    <div className="profile_cover" ref={coverRef}>
      {error && (
        <div className="postError comment_error cover_error">
          <div className="postError_error">{error}</div>
          <button className="blue_btn" onClick={() => setError("")}>
            Try again
          </button>
        </div>
      )}
      {coverPicture && (
        <div className="cover_crooper">
          <Cropper
            image={coverPicture}
            crop={crop}
            zoom={zoom}
            aspect={3 / 1}
            maxZoom={3}
            onCropChange={setCrop}
            onCropComplete={onCropComplete}
            onZoomChange={setZoom}
            showGrid={true}
            objectFit="horizontal-cover"
          />
        </div>
      )}
      {coverPicture && (
        <div className="save_changes_cover">
          <div className="save_changes_right">
            <button
              className="blue_btn opacity_btn"
              onClick={() => {
                setCoverPicture("");
                close(false);
              }}
            >
              Cancel
            </button>
            <button className="blue_btn " onClick={() => updateCoverPicture()}>
              {loading ? <PulseLoader color="#fff" size={5} /> : "Save changes"}
            </button>
          </div>
        </div>
      )}
      {error && (
        <div className="postError comment_error cover_error">
          <div className="postError_error">{error}</div>
          <button className="blue_btn" onClick={() => setError("")}>
            Try again
          </button>
        </div>
      )}
      {cover && !coverPicture && (
        <img src={cover} className="cover" alt="" ref={cRef} />
      )}
    </div>
  );
}
