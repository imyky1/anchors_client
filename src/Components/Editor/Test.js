// // App.jsx / App.tsx

// import React, { Component, useState } from "react";
// import { CKEditor } from "@ckeditor/ckeditor5-react";
// import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

// let Test = () => {

//   const [Content, setContent] = useState("")

//   console.log(Content)
//   return (
//     <div className="App" style={{ width: "50vw", height: "50vh" }}>
//       <h2>Using CKEditor&nbsp;5 build in React</h2>
//       <CKEditor
//         editor={ClassicEditor}
//         data="<p>Hello from CKEditor&nbsp;5!</p>"
//         onReady={(editor) => {
//           // You can store the "editor" and use when it is needed.
//           console.log("Editor is ready to use!", editor);
//         }}
//         onChange={(event, editor) => {
//           const data = editor.getData();
//           setContent(data)
//         }}
//         onBlur={(event, editor) => {
//           console.log("Blur.", editor);
//         }}
//         onFocus={(event, editor) => {
//           console.log("Focus.", editor);
//         }}
//       />
//     </div>
//   );
// };

// export default Test;


import React from 'react'

const Test = () => {
  return (
    <div>Test</div>
  )
}

export default Test
