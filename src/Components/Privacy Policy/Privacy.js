import mixpanel from "mixpanel-browser";
import React, { useEffect } from "react";
import { SuperSEO } from "react-super-seo";
import "./Privacy.css";

function Privacy() {
  // Visited page mix panel
  useEffect(() => {
    mixpanel.track("Visited Privacy Policy");
  }, []);

  return (
    <>
      <div className="mainpage_header creator_login_header ">
        <div className="logo">
          <img src={require("../logo.png")} alt="Logo" />
          <span>anchors</span>
          <p className="beta_tagname">Beta</p>
        </div>
      </div>
      <div className="privacy_policy">
        <h1>Privacy Policy</h1>
        <section>
          This Privacy Policy describes how anchors ("we," "us," or "our")
          collects, uses, and discloses personal information when you use our
          website, services, and platform (collectively, the "Platform"). By
          accessing or using the Platform, you agree to the terms of this
          Privacy Policy.
          <h2>1. Information We Collect:</h2>
          <ul>
            <li>
              <b>Personal Information:</b> When you create an account on
              anchors, we may collect personal information such as your name,
              email address, and contact details.
            </li>
            <li>
              <b>Usage Information:</b> We collect information about your
              interactions with the Platform, such as your IP address, device
              information, and browsing activities.
            </li>
            <li>
              <b>Cookies and Similar Technologies:</b> We may use cookies and
              similar technologies to enhance your experience and collect
              information about your usage of the Platform.
            </li>
          </ul>
          <h2>2. Use of Information:</h2>
          <ul>
            <li>
              We use the collected information to provide, maintain, and improve
              the Platform's functionality and personalize your experience.
            </li>
            <li>
              We may use your information to communicate with you, respond to
              your inquiries, and provide customer support.
            </li>
            <li>
              We may use aggregated and anonymized data for analytical purposes,
              including understanding user preferences and trends.
            </li>
          </ul>
          <h2>3. Information Sharing:</h2>
          <ul>
            <li>
              We may share your personal information with trusted third-party
              service providers who assist us in operating and maintaining the
              Platform.
            </li>
            <li>
              We may share your information in response to a legal obligation,
              to protect our rights or the rights of others, or in the event of
              a corporate transaction.
            </li>
            <li>
              We do not sell, rent, or lease your personal information to third
              parties for their marketing purposes.
            </li>
          </ul>
          <h2>4. Data Security:</h2>
          <ul>
            <li>
              We take reasonable measures to protect your personal information
              from unauthorized access, disclosure, alteration, or destruction.
            </li>
            <li>
              However, no method of transmission over the internet or electronic
              storage is 100% secure, and we cannot guarantee absolute security.
            </li>
          </ul>
          <h2>5. Children's Privacy:</h2>
          <ul>
            <li>
              The Platform is not intended for children under the age of 13. We
              do not knowingly collect personal information from children. If
              you believe we have inadvertently collected information from a
              child, please contact us.
            </li>
          </ul>
          <h2>6. Third-Party Links and Services:</h2>
          <ul>
            <li>
              The Platform may contain links to third-party websites or
              services. We are not responsible for the privacy practices or
              content of such third parties. We encourage you to review their
              privacy policies.
            </li>
          </ul>
          <h2>7. Account Information:</h2>
          <ul>
            <li>
              When you create an account on anchors, we may collect additional
              information such as your username, password, and profile picture.
            </li>

            <li>
              This information is used to authenticate your account and
              personalize your experience on the Platform.
            </li>
          </ul>
          <h2>8. Payment Information:</h2>
          <ul>
            <li>
              If you choose to monetize your content on anchors, we may collect
              payment information such as your bank account details or PayPal
              email address.
            </li>
            <li>
              This information is securely processed and used solely for the
              purpose of facilitating payments to you.
            </li>
          </ul>
          <h2>9. User-generated Content:</h2>
          <ul>
            <li>
              Any content you upload, publish, or share on anchors, including
              text, images, videos, or other media, may be stored on our
              servers.
            </li>
            <li>
              We do not claim ownership of your content, but we may use it to
              provide and improve our services, as outlined in the Terms of
              Service.
            </li>
          </ul>
          <h2>10. Communication Preferences:</h2>
          <ul>
            <li>
              We may send you promotional emails, newsletters, or notifications
              regarding your account and Platform updates.
            </li>
            <li>
              You can manage your communication preferences through your account
              settings or by following the unsubscribe instructions provided in
              the emails.
            </li>
          </ul>
          <h2>11. Data Retention:</h2>
          <ul>
            <li>
              We retain your personal information for as long as necessary to
              fulfill the purposes outlined in this privacy policy unless a
              longer retention period is required or permitted by law.
            </li>
          </ul>
          <h2>12. International Data Transfers:</h2>
          <ul>
            <li>
              If you access anchors from outside the country where our servers
              are located, your personal information may be transferred and
              processed in other countries.
            </li>
          </ul>

          <br/>
          <br/>
          By accessing and using the anchors Platform, you acknowledge that you
          have read and understood this Privacy Policy and agree to the
          collection, use, and disclosure of your personal information as
          described herein.
        </section>
      </div>
      <SuperSEO title="Anchors - Privacy Policy" />
    </>
  );
}

export default Privacy;
