import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { SuperSEO } from "react-super-seo";
import { toast } from "react-toastify";
import { paymentContext } from "../../../../Context/PaymentState";
import { LoadTwo } from "../../../Modals/Loading";
import SuccessModal from "../../../Modals/ServiceSuccess/Modal1";
import { Button1 } from "../Create Services/InputComponents/buttons";
import { TextField1 } from "../Create Services/InputComponents/fields_Labels";
import "./PaymentInfo.css";

function PaymentInfo() {
  const navigate = useNavigate();
  const { fetchPaymentinformation, fillPaymentinformation } =
    useContext(paymentContext);
  const [paymentData, setpaymentData] = useState({
    name: "",
    acNumber: "",
    ifsc: "",
  });
  const [openLoading, setOpenLoading] = useState(false);
  const [openModal, setOpenModal] = useState(false);

  useEffect(() => {
    setOpenLoading(true);
    fetchPaymentinformation().then((e) => {
      if (e?.success) {
        setpaymentData(e?.info);
      }
      setOpenLoading(false);
    });
  }, []);


  const handleSubmit = async (e) => {
    if (
      paymentData?.name !== "" &&
      paymentData?.acNumber?.toString().length > 0 &&
      paymentData?.ifsc !== ""
    ) {
      let res = await fillPaymentinformation(
        paymentData?.name,
        paymentData?.acNumber,
        paymentData?.ifsc
      );
      if (res.success) {
        setOpenModal(true)
      } else {
        toast.info("Could not save the details, Try again !!!", {
          position: "top-center",
          autoClose: 2000,
        });
      }
    } else {
      toast.info("Fill all the mandatory details", {
        position: "top-center",
        autoClose: 2000,
      });
    }
  };

  const handleChange = (e) => {
    setpaymentData({ ...paymentData, [e.target.name]: e.target.value });
  };

  return (
    <>
    {openModal && <SuccessModal type="Payment-Success" toClose={()=>{setOpenModal(false)}}/>}
      {openLoading && <LoadTwo open={openLoading} />}
      <div className="payment_info_main_container">
        <section className="headers_section_paymentInfo">
          <h1 className="text_type01_payment_info">Account Details</h1>
          <Button1
            onClick={() => {
              navigate("/dashboard/paymentSummary");
            }}
            text="Earnings Summary"
          />
            
        </section>

        <section className="main_details_section_paymentInfo">
          <TextField1
            label="Account holder name"
            name="name"
            id="name"
            required={true}
            value={paymentData?.name}
            placeholder="Enter Account holder name here"
            onChange={handleChange}
          />
          <TextField1
            label="Account Number"
            name="acNumber"
            id="acNumber"
            required={true}
            type="number"
            value={paymentData?.acNumber}
            placeholder="Enter Account number here"
            onChange={handleChange}
          />
          <TextField1
            label="IFSC Code"
            name="ifsc"
            id="ifsc"
            required={true}
            value={paymentData?.ifsc}
            placeholder="Enter ifsc code here"
            onChange={handleChange}
          />

          <Button1 text="Save and Publish" onClick={handleSubmit} />
        </section>
      </div>
      <SuperSEO title="Anchors - Payment Details" />
    </>
  );
}

export default PaymentInfo;
