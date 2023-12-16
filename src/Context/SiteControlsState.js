import { useState } from "react";
import { createContext } from "react";

export const siteControlContext = createContext();

const SiteControlsState = (props) => {
    const [shortSidebar, setShortSidebar] = useState(false)     // uses short sidebaar and also hides navbar on dashboard

  return (
    <siteControlContext.Provider value={{shortSidebar,setShortSidebar}}> {props.children}</siteControlContext.Provider>
  );
};


export default SiteControlsState;