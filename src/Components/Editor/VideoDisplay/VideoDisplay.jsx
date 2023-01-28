import React from "react";

const VideoDisplay = () => {
  // useEffect(() => {
  //   const getsignedurl = async () => {
  //     try {
  //       const response = await fetch(`${host}/api/file/getSignedVideourl`, {
  //         method: "GET",
  //       });
  //       const json = await response.json();
  //       setSignedUrl(json.signedurl);
  //       return json;
  //     } catch (error) {
  //       console.error(error);
  //     }
  //   };
  //   getsignedurl();
  // });

  return (
    <div>
      <div className="videostreaming">
        <h2 style={{ padding: "20px" }}>Service Title</h2>
        <video width="90%" height="50%" controls controlsList="nodownload">
          <source src="https://d2tnr5ylewtxw9.cloudfront.net/2023-01-18%2022-53-31.mp4?Expires=1675284537&Key-Pair-Id=K3065PMLWN1QK8&Signature=xINjuMkbjqtDb63j1bdkjYCWmfGhT2WYhYWIvIeXziOaDfIALSLZZxeNCdDAcoDMEi3r7nEbTkGpc1f5TpTzTIjbBzYwFC6zr1lwCPyuNRjv~iY790Jzx2HME6X2hUQ0tZByxL91edBHMT-uLDdS2gUfRoi4NUpFWF9MulTfcyBylT6-7-zdQTwtRXHsMqPHnYpfLDTYdSr~BuWEkRfzDIYsLBrnn7PRGRz-AwFRGioK8mNVwGKMmswkE3dWqYQuE9h5JBX~U5jvmbP93wqNuI7Cb0cI3~311g7brnRipTlVlAvJsl~rby3HszCIwtY06VomgX5y2mlvuAlYBhtHIg__"></source>
        </video>
      </div>
    </div>
  );
};

export default VideoDisplay;
