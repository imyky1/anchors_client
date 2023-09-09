import React from "react";
import Navbar from "../Layouts/Navbar Creator/Navbar";
import { MainNewFooter } from "../Footer/Footer";
import "./Static.css"

const RefundObj = [
  {
    title: "Eligibility for Refunds",
    points: [
      "Digital Products: Refunds are available for digital products purchased directly from anchors within 7 days of the purchase date. To be eligible for a refund, the product must not have been downloaded, accessed, or used in any way.",
      "In case of a failed subscription payment despite successful payment processing by our payment partners, please contact our support team at support@anchors.in within 4 hours. We will review each case individually and make exceptions when necessary to ensure a satisfactory resolution.",
    ],
  },
  {
    title: "Refund Process",
    points: [
      "To request a refund, please contact our support team at support@anchors.in within the specified refund period.",
      "Provide your order details and a valid reason for the refund request.",
      "Our team will review your request and determine if you meet the eligibility criteria.",
      "If your refund request is approved, we will initiate the refund process within 7 working days and notify you via email.",
    ],
  },
  {
    title: "Non-Refundable Items",
    points: [
      "Products that have been downloaded, accessed, or used.",
      "Services that have already been rendered.",
      "Products that were purchased during a promotional or discounted period, unless otherwise specified.",
    ],
  },
  {
    title: "Damaged or Defective Products",
    points: [
      "If you encounter any issues with the functionality or performance of our digital products, please contact our support team immediately. We will work with you to resolve the issue and provide a suitable solution.",
    ],
  },
  {
    title: "No Physical Product Returns",
    points: [
      "Since we do not offer physical products, there is no requirement to return any items.",
    ],
  },
  // { title: "", points: [] },
];

const Refund = () => {
  return (
    <>
      <Navbar noAccount={true} backgroundDark={true} />

      <div className="static_pages_outer_wrapper">
        <h1 className="static_page_text_01">Refund Policy</h1>
        <section>
          Thank you for choosing anchors. We value your satisfaction and want to
          ensure a positive experience with our digital products. Please review
          our refund policy below.
          <br />
          <br />
          {RefundObj?.map((e, i) => {
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
          Please note that this refund policy applies only to purchases made
          directly through the anchors platform. If you purchase our products
          through third-party platforms or resellers, please refer to their
          respective refund policies.
          <br />
          <br />
          If you have any questions or need further assistance regarding our
          refund policy, please contact our support team. We are here to assist
          you.
          <br />
          <br />
          Last updated: Aug 09, 2023
        </section>
      </div>

      <MainNewFooter
       onEvents={true} />
    </>
  );
};

export default Refund;
