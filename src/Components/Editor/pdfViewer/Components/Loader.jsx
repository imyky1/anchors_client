import React from "react";

const Loader = ({ isLoading }) => {
  if (!isLoading) return null;
  return (
    <div id="loader" className="loadingbarpdf">
      <p>Loading...</p>
    </div>
  );
};

export default Loader;
