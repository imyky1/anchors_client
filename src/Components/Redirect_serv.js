import React, { useState, useContext, useEffect } from "react";
import { LoadOne } from "./Modals/Loading";
import { useParams, useNavigate } from "react-router-dom";
import ServiceContext from "../Context/services/serviceContext";

function Redirect_serv() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [redirecting, setredirecting] = useState(false);
  const [slug, setSlug] = useState("");
  const { getslugfromcpyid } = useContext(ServiceContext);

  useEffect(() => {
    const pathname = window.location.pathname;

    // Define the regular expression pattern
    const pattern = /^\/c\//;

    // Test if the pathname matches the pattern
    if (pattern.test(pathname)) {
      // redirect /c/ to new creator profile page
      setSlug(id);
      setredirecting(true);

    } else {
      getslugfromcpyid(id).then((e) => {
        if (e.success) {
          setSlug(e.slug);
          setredirecting(true);
        } else {
          navigate("/");
        }
      });
    }

    // eslint-disable-next-line
  }, []);

  if (redirecting) {
    navigate(`/${slug}`);
  }

  return <>{!redirecting && <LoadOne />}</>;
}

export default Redirect_serv;
