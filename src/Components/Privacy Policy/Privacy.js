import mixpanel from "mixpanel-browser";
import React, { useEffect } from "react";
import { SuperSEO } from "react-super-seo";
import "./Privacy.css";
import Navbar from "../Layouts/Navbar Creator/Navbar";
import { MainNewFooter } from "../Footer/Footer";
import "../Static pages/Static.css"

const PrivacyObj = [
  {
    title: "Information We Collect",
    points: [
      "Personal Information: When you create an account on anchors, we may collect personal information such as your name, email address, and contact details.",
      "Usage Information: We collect information about your interactions with the Platform, such as your IP address, device information, and browsing activities.",
      "Cookies and Similar Technologies: We may use cookies and similar technologies to enhance your experience and collect information about your usage of the Platform.",
    ],
  },
  {
    title: "Use of Information",
    points: [
      "We use the collected information to provide, maintain, and improve the Platform's functionality and personalize your experience.",
      "We may use your information to communicate with you, respond to your inquiries, and provide customer support.",
      "We may use aggregated and anonymized data for analytical purposes, including understanding user preferences and trends.",
    ],
  },
  {
    title: "Information Sharing",
    points: [
      "We may share your personal information with trusted third-party service providers who assist us in operating and maintaining the Platform.",
      "We may share your information in response to a legal obligation, to protect our rights or the rights of others, or in the event of a corporate transaction.",
      "We do not sell, rent, or lease your personal information to third parties for their marketing purposes.",
    ],
  },
  {
    title: "Data Security",
    points: [
      "We take reasonable measures to protect your personal information from unauthorized access, disclosure, alteration, or destruction.",
      "However, no method of transmission over the internet or electronic storage is 100% secure, and we cannot guarantee absolute security.",
    ],
  },
  {
    title: "Children's Privacy",
    points: [
      "The Platform is not intended for children under the age of 13. We do not knowingly collect personal information from children. If you believe we have inadvertently collected information from a child, please contact us.",
    ],
  },
  {
    title: "Third-Party Links and Services",
    points: [
      "The Platform may contain links to third-party websites or services. We are not responsible for the privacy practices or content of such third parties. We encourage you to review their privacy policies.",
    ],
  },
  {
    title: "Account Information",
    points: [
      "When you create an account on anchors, we may collect additional information such as your username, password, and profile picture.",
      "This information is used to authenticate your account and personalize your experience on the Platform.",
    ],
  },
  {
    title: "Payment Information",
    points: [
      "If you choose to monetize your content on anchors, we may collect payment information such as your bank account details or PayPal email address.",
      "This information is securely processed and used solely for the purpose of facilitating payments to you.",
    ],
  },
  {
    title: "User-generated Content",
    points: [
      "Any content you upload, publish, or share on anchors, including text, images, videos, or other media, may be stored on our servers",
      "We do not claim ownership of your content, but we may use it to provide and improve our services, as outlined in the Terms of Service.",
    ],
  },
  {
    title: "Communication Preferences",
    points: [
      "We may send you promotional emails, newsletters, or notifications regarding your account and Platform updates.",
      "You can manage your communication preferences through your account settings or by following the unsubscribe instructions provided in the emails.",
    ],
  },
  {
    title: "Data Retention",
    points: [
      "We retain your personal information for as long as necessary to fulfill the purposes outlined in this privacy policy unless a longer retention period is required or permitted by law.",
    ],
  },
  {
    title: "International Data Transfers",
    points: [
      "If you access anchors from outside the country where our servers are located, your personal information may be transferred and processed in other countries.",
    ],
  },
];

const PrivacySection = () => {
  return (
    <>
      <Navbar noAccount={true} backgroundDark={true} />

      <div className="static_pages_outer_wrapper">
        <h1 className="static_page_text_01">Privacy Policy</h1>
        <section>
          This Privacy Policy describes how anchors ("we," "us," or "our")
          collects, uses, and discloses personal information when you use our
          website, services, and platform (collectively, the "Platform"). By
          accessing or using the Platform, you agree to the terms of this
          Privacy Policy.
          <br />
          <br />
          {PrivacyObj?.map((e, i) => {
            return (
              <div key={i}>
                <h2 className="static_page_text_02">{`${i + 1}. ${
                  e?.title
                }:`}</h2>
                <ul>
                  {e?.points?.map((point, index) => {
                    return <li key={`point${index}`}>{point}</li>;
                  })}
                </ul>
              </div>
            );
          })}
          <br />
          <br />
          By accessing and using the anchors Platform, you acknowledge that you have read and understood this Privacy Policy and agree to the collection, use, and disclosure of your personal information as described herein.
        </section>
      </div>

      <MainNewFooter onEvents={true} />
    </>
  );
};

export default PrivacySection;
