import React, { useState, useEffect } from 'react';
import { host, jwtTokenDeveloper } from '../../config/config';
import { ToastContainer, toast } from 'react-toastify';

const Upload = () => {
  const [selectedImage, setSelectedImage] = useState(null);

  const [images, setImages] = useState([]);

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    setSelectedImage(file);
  };

  const handleSubmit = async () => {
    if (selectedImage) {
      try {
        const formData = new FormData();
        formData.append('file', selectedImage);

        const response = await fetch(`${host}/api/developer/upload/s3/upload`, {
          method: 'POST',
          headers: {
            "jwt-token": localStorage.getItem("jwtToken"),
          },
          body: formData,
        });

      } catch (error) {
        console.log('Error:', error);
      }
    }
  };

  const copyToClipboard = (url) => {
    console.log(url)
    navigator.clipboard.writeText(url)
    toast.info('URL is copied to the clipboard!');
  };


  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await fetch(`${host}/api/developer/upload/s3/images`, {
          headers: {
            "jwt-token": localStorage.getItem("jwtToken"),
          },
        });

        if (response.ok) {
          const data = await response.json();
          setImages(data.images);
        } else {
          console.log('Error:', response.status);
        }
      } catch (error) {
        console.log('Error:', error);
      }
    };

    fetchImages();
  }, []);

  if (!localStorage.getItem("jwtTokenD") || !localStorage.getItem("isDev")) {
    window.open("/developer/login", "_self");
  }

  console.log(images)

  return (
    <>
    <ToastContainer/>
    <div>
      <h1>Upload an Image</h1>
      <input type="file" onChange={handleImageChange} />
      <button onClick={handleSubmit}>Submit</button>


      {images?.length > 0 && (
        <div>
          <h2>All Images</h2>
          <div style={{ display: 'flex', flexWrap: 'wrap' , gap:"10px" }}>
            {images?.map((image, index) => (
              <div key={index} style={{ margin: '10px',border:"1px solid black" }} onClick={()=>copyToClipboard(image?.url)}>
                  <img
                    src={image?.url}
                    alt={image?.key}
                    style={{ width: '250px', cursor: 'pointer' }}
                  />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
    </>
  );
};

export default Upload;