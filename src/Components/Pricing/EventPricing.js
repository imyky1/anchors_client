import React from "react";
import { CardDesign, FAQs } from "./Pricing";
import { ToastContainer } from "react-toastify";
import Footer, { MainNewFooter } from "../Footer/Footer";
import { SuperSEO } from "react-super-seo";
import NavbarCreator, { EventsNavbar } from "../Layouts/Navbar Creator/Navbar";
import mixpanel from "mixpanel-browser";
import { Footer3 } from "../Footer/Footer2";
import { MdDone } from "react-icons/md";

const FAQDetails = [
  {
    question: "Why don't you charge a monthly platform fee?",
    answer:
      "At anchors, we believe in simplicity. We want to make it easy for creators to use our platform without worrying about recurring fees. We only charge a fee if you earn money from our platform. It's as simple as that.",
  },
  {
    question: "Can I join this platform for free?",
    answer:
      "Absolutely! Joining our platform is completely free. There are no hidden charges or fees to join, and we also do not charge a monthly fee.",
  },
  {
    question: "If I share free content, do I still need to pay?",
    answer:
      "No, you do not need to pay if you are providing only free services. anchors is here to support creators, whether they offer free or paid content.",
  },
  {
    question: "How is anchors different from other platforms?",
    answer:
      "anchors isn't just another tool or SaaS platform. We are a creator's home, offering everything they need to unlock their full potential. Our mission is to constantly raise the bar, setting new standards in the creator economy and delivering the best experience possible. We're committed to competing with ourselves, continuously improving to empower creators and help them reach new heights.",
  },
];

const PricingTableData = [
  // {
  //   title: "Host free events",
  //   free: true,
  //   paid: true,
  // },
  {
    title: "Referral benefit feature",
    free: true,
    paid: true,
  },
  {
    title: "Personalised Invite Card",
    free: true,
    paid: true,
  },
  {
    title: "Deep data tracking funnel",
    free: true,
    paid: true,
  },
  {
    title: "WA message alert for Host",
    free: false,
    paid: true,
  },
  {
    title: "WA message alert for Audience",
    free: false,
    paid: true,
  },
  // {
  //   title: "Host Paid Events",
  //   free: false,
  //   paid: true,
  // },
  {
    title: "Export audience data",
    free: false,
    paid: true,
  },
];

const TablePricing = () => {
  return (
    <>
      {window.screen.width > 600 ? (
        <div className="eventPricing_table_wrapper">
          <section>
            <div className="table_back5 table_back1 ">Features</div>
            <div className="table_back1">Free Events</div>
            <div className="table_back1">Paid Events</div>
          </section>

          {PricingTableData?.map((e, i) => {
            return (
              <section>
                <div className="table_back2">{e?.title}</div>
                <div className="table_back3">
                  {e?.free ? (
                    <span className="tick_table_pricing">
                      <MdDone />
                    </span>
                  ) : (
                    ""
                  )}
                </div>
                <div className="table_back4">
                  {e?.paid ? (
                    <span className="tick_table_pricing">
                      <MdDone />
                    </span>
                  ) : (
                    ""
                  )}
                </div>
              </section>
            );
          })}

          <section>
            <div className="table_back6 table_back2">Pricing</div>
            <div className="table_back6 table_back3">Free</div>
            <div className="table_back6 table_back4">10% of Revenue</div>
          </section>

          <section>
            <div></div>
            <div>
              <button
                className="table_pricing_button"
                style={{
                  background: "transparent",
                  border: "1px solid #A7A7A7",
                }}
                onClick={()=>{
                  window.open("https://events.anchors.in/login","_self")
                }}
              >
                Start Free
              </button>
            </div>
            <div>
              <button
                className="table_pricing_button"
                style={{
                  background: "#F00",
                  border: "1px solid #F00",
                  color: "#FFFFFF",
                }}
                onClick={()=>{
                  window.open("https://events.anchors.in/login","_self")
                }}
              >
                Host Event
              </button>
            </div>
          </section>
        </div>
      ) : (
        <div className="mobile_eventOutside_wrapper_table_pricing">
          <div className="eventPricing_table_wrapper">
            <section>
              <div className="table_back5 table_back1 ">Features</div>
              <div className="table_back1">Paid Events</div>
            </section>
            {PricingTableData?.map((e, i) => {
              return (
                <section>
                  <div className="table_back2">{e?.title}</div>
                  <div className="table_back4">
                    {e?.paid ? (
                      <span className="tick_table_pricing">
                        <MdDone />
                      </span>
                    ) : (
                      ""
                    )}
                  </div>
                </section>
              );
            })}

            <section>
              <div className="table_back6 table_back2">Pricing</div>
              <div className="table_back6 table_back4">10% of Revenue</div>
            </section>

            <button
              className="table_pricing_button"
              style={{
                background: "#F00",
                border: "1px solid #F00",
                color: "#FFFFFF",
              }}
              onClick={()=>{
                window.open("https://events.anchors.in/login","_self")
              }}
            >
              Host Event
            </button>
          </div>

          <div className="eventPricing_table_wrapper">
            <section>
              <div className="table_back5 table_back1 ">Features</div>
              <div className="table_back1">Free Events</div>
            </section>
            {PricingTableData?.map((e, i) => {
              return (
                <section>
                  <div className="table_back2">{e?.title}</div>
                  <div className="table_back3">
                    {e?.free ? (
                      <span className="tick_table_pricing">
                        <MdDone />
                      </span>
                    ) : (
                      ""
                    )}
                  </div>
                </section>
              );
            })}

            <section>
              <div className="table_back6 table_back2">Pricing</div>
              <div className="table_back6 table_back3">Free</div>
            </section>

            <button
              className="table_pricing_button"
              style={{
                background: "transparent",
                border: "1px solid #A7A7A7",
              }}
              onClick={()=>{
                window.open("https://events.anchors.in/login","_self")
              }}
            >
              Start Free
            </button>
          </div>
        </div>
      )}
    </>
  );
};

function EventPricing() {
  return (
    <>
      {/* <NavbarCreator /> */}

      <EventsNavbar
        noAccount={true}
        showPricingButton={false}
        position="absolute"
      />

      <div className="main_pricing_wrapper">
        <div className="pricingIntroContainer">
          <h1 className="text01_pricing_box">
            Our Pricing : Simple & Transparent
          </h1>
          <div className="pricing_design01">No Monthly fees</div>
          <p>
            We believe in keeping things simple. As a creator, you won't have to
            worry about any monthly fees. You can use our platform without any
            recurring costs.
          </p>
          {/* <section>
            <span>No Monthly Fees </span>
            <p>
              We believe in keeping things simple. As a creator, you won't have
              to worry about any monthly fees. You can use our platform without
              any recurring costs.
            </p>
          </section> */}
        </div>

        <section>
          <TablePricing />
        </section>

        <section>
          <FAQs data={FAQDetails} />
        </section>

        {/* <div className="extra_section_sample_page" style={{height:"58vh",alignItems:`${window.screen.width < 600 ? "center":"flex-start"}`}}>
        <h3 style={window.screen.width < 600 ? {fontSize:"23px",width:"90vw",textAlign:"center"} : {}}>Are you ready to revolutionize your event hosting experience?</h3>
        <button
          className="button_sample_page01"
          style={window.screen.width < 600 ? {margin: "0 auto",fontSize:"15px",padding:"15px 30px"} : {}}
          onClick={() => {
            localStorage.getItem("jwtToken") &&
            localStorage.getItem("isUser") === ""
              ? window.open("/dashboard", "_self")
              : window.open("/signup/creators", "_self");
            mixpanel.track("Yes, I'm ready!");
          }}
        >
          Yes, I'm ready!{" "}
        </button>
      </div> */}
      </div>

      <MainNewFooter
      onEvents={true}
        footerOptions1={[
          {
            title: "Event Pricing",
            link: "https://www.anchors.in/eventpricing",
          },
          {
            title: "Sample Event Page",
            link: "https://www.anchors.in/e/how-to-become-a-product-manager",
          },
          {
            title: "Sample Referral Page",
            link: "https://www.anchors.in/static/success",
          },
        ]}
        noPrivacyPolicy={false}
        noRefund={false}
        useEventsLogo = {true}
      />
      <ToastContainer />
      <SuperSEO title="Anchors - Pricing" />
    </>
  );
}

export default EventPricing;
