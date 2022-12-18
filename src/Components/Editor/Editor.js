import ReactDOM from "react-dom";
import React, { useMemo } from "react";
import JoditEditor from "jodit-react";

const ReactEditor = ({ readOnly = true, content, setContent, placeholder }) => {
  const editor = React.useRef(null);
  const config = {
    placeholder: placeholder || "Please Describe your workshop briefly...",
  };
  return (
    <>
      <JoditEditor
        ref={editor}
        config={config}
        onChange={(e) => {
          setContent(e);
        }}
        value={content}
      />
    </>
  );
};

export default ReactEditor;
