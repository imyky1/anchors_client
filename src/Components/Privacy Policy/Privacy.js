import React,{useEffect} from "react";
import "./Privacy.css";


function Privacy() {

  return (
    <>
      <div className="mainpage_header creator_login_header ">
          <div className="logo">
            <img src={require("../logo.png")} alt="Logo" />
            <span>anchors</span>
          </div>
        </div>
      <div className="privacy_policy">
        <h1>Privacy Policy</h1>
        <section>
          This Privacy Policy describes how your personal information is
          collected, used, and shared when you visit or make a purchase from &nbsp;
           <a href="http://www.anchors.in" target="_blank"  rel="noreferrer">https://www.anchors.in</a>&nbsp;  (the “Site”).
          <h2>PERSONAL INFORMATION WE COLLECT</h2>
          When you visit the Site, we automatically collect certain information
          about your device, including information about your web browser, IP
          address, time zone, and some of the cookies that are installed on your
          device. Additionally, as you browse the Site, we collect information
          about the individual web pages or products that you view, what
          websites or search terms referred you to the Site, and information
          about how you interact with the Site. We refer to this
          automatically-collected information as “Device Information.” When we
          talk about “Personal Information” in this Privacy Policy, we are
          talking both about Device Information and Order Information.
          <h2>HOW DO WE USE YOUR PERSONAL INFORMATION</h2>
          We use the Order Information that we collect generally to fulfill any
          orders placed through the Site (including processing your payment
          information, arranging for shipping, and providing you with invoices
          and/or order confirmations). Additionally, we use this Order
          Information to: Communicate with you; Screen our orders for potential
          risk or fraud; and When in line with the preferences you have shared
          with us, provide you with information or advertising relating to our
          products or services. We use the Device Information that we collect to
          help us screen for potential risk and fraud (in particular, your IP
          address), and more generally to improve and optimize our Site (for
          example, by generating analytics about how our customers browse and
          interact with the Site, and to assess the success of our marketing and
          advertising campaigns).
          <h2>SHARING YOUR PERSONAL INFORMATION</h2>
          We share your Personal Information with third parties to help us use
          your Personal Information, as described above. For example, We use
          Google Analytics to help us understand how our customers use the site
          Finally, we may also share your Personal Information to comply with
          applicable laws and regulations, to respond to a subpoena, search
          warrant or other lawful request for information we receive, or to
          otherwise protect our rights.
          <h2>DON NOT TRACK</h2>
          Please note that we do not alter our Site’s data collection and use
          practices when we see a Do Not Track signal from your browser.
          <h2>YOUR RIGHTS</h2>
          If you are a European resident, you have the right to access personal
          information we hold about you and to ask that your personal
          information be corrected, updated, or deleted. If you would like to
          exercise this right, please contact us through the contact information
          below. Additionally, if you are a European resident we note that we
          are processing your information in order to fulfill contracts we might
          have with you (for example if you make an order through the Site), or
          otherwise to pursue our legitimate business interests listed above.
          Additionally, please note that your information will be transferred
          outside of Europe, including to Canada and the United States.
          <h2>DATA RETENTION</h2>
          When you place an order through the Site, we will maintain your Order
          Information for our records unless and until you ask us to delete this
          information.
          <h2>MINORS</h2>
          The Site is not intended for individuals under the age of 13.
          <h2>CHANGES</h2>
          We may update this privacy policy from time to time in order to
          reflect, for example, changes to our practices or for other
          operational, legal or regulatory reasons.
          <h2>CONTACT US</h2>
          For more information about our privacy practices, if you have
          questions, or if you would like to make a complaint, please contact us
          by e-mail at support@anchors.in.
        </section>
      </div>
    </>
  );
}

export default Privacy;
