import React from "react";
import { Helmet } from "react-helmet";

function Seo({
  title = "anchors - Home for Creators | Monetize Content, Skills & Time",
  description = "anchors is the premium community platform exclusively for creators who are looking to take their content and careers to the next level. Our platform offers a range of tools and features to help creators manage their content, engage with their audience, and monetize their creations. Whether you're a social media influencer, blogger, vlogger, or podcaster, anchors provide an exclusive and supportive community that helps you grow and unlock the full potential of the creator's economy. Join our community of creators and start monetizing your content, skills, and time today!",
  imgUrl = "https://www.anchors.in:5000/api/file/anchors-logo.jpeg",
  keywords = "Join Anchors for creators,Exclusive community for creators,Monetize your content on Anchors,Creator economy platform,Connect with fellow creators on Anchors,Manage and monetize your content on Anchors,Unlock your potential on Anchors,Anchors for social media influencers, bloggers, vloggers, and podcasters,Collaborate with creators on Anchors,Join the Anchors community and grow your career as a creator",
}) {
  return (
    <Helmet>
      <title>{title}</title>
      <meta name="title" content={title} />
      <meta name="description" content={description} />
      <link
        rel="canonical"
        href={`https://www.anchors.in${window.location.pathname}`}
      />
      <meta name="keywords" content={keywords} />

      {/* <!-- Facebook Meta Tags --> */}
      <meta
        property="og:url"
        content={`https://www.anchors.in${window.location.pathname}`}
      />
      <meta property="og:type" content="website" />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={imgUrl} />

      {/* <!-- Twitter Meta Tags --> */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta property="twitter:domain" content="anchors.in" />
      <meta
        property="twitter:url"
        content={`https://www.anchors.in${window.location.pathname}`}
      />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={imgUrl} />
    </Helmet>
  );
}

export default Seo;
