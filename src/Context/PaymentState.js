import { createContext, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { host } from "../config/config";
import { toast } from "react-toastify";
import { userContext } from "./UserState";

export const paymentContext = createContext();

const PaymentState = (props) => {
  // Used to create Razor pay order using amount
  const createRazorpayClientSecret = async (amount) => {
    try {
      const response = await fetch(`${host}/api/payment/createOrder`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "Access-Control-Allow-Credentials": true,
          "jwt-token": localStorage.getItem("jwtToken"),
        },
        body: JSON.stringify({ amount: parseInt(amount) * 100 }),
      });
      const json = await response.json();
      if (json.success) {
        return json.order;
      }
      return json.success;
    } catch (error) {
      toast.error("Some Error from Razorpay", {
        position: "top-center",
        autoClose: 2000,
      });
    }
  };

  // used to get razor pay api
  const razorpay_key = async () => {
    const res = await fetch(`${host}/api/payment/getRazorpayKey`, {
      method: "GET",
      headers: {
        "jwt-token": localStorage.getItem("jwtToken"),
      },
    });
    const json = await res.json();
    return json.key;
  };

  const checkfororder = async (serviceID, userType, type) => {
    // type means that the event
    try {
      const response = await fetch(`${host}/api/payment/checkOrderPlaced`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "Access-Control-Allow-Credentials": true,
          "jwt-token": localStorage.getItem("jwtToken"),
        },
        body: JSON.stringify({ serviceID, userType, type }),
      });
      const json = await response.json();
      return json;
    } catch (error) {}
  };

  // Inform Lark bot about default in payment gateway
  const informLarkBot = async (
    paid,
    amount,
    sname,
    paymentId,
    email,
    issue
  ) => {
    try {
      const response = await fetch(`${host}/api/payment/informLarkRoute`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "Access-Control-Allow-Credentials": true,
          "jwt-token": localStorage.getItem("jwtToken"),
        },
        body: JSON.stringify({ paid, amount, sname, paymentId, email, issue }),
      });
      const json = await response.json();
      return json.success;
    } catch (error) {}
  };

  // update or create the payment informations ---------------------
  const fillPaymentinformation = async (name, acNumber, ifsc) => {
    try {
      const response = await fetch(`${host}/payments/fillPaymentInfo`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "Access-Control-Allow-Credentials": true,
          "jwt-token": localStorage.getItem("jwtToken"),
        },
        body: JSON.stringify({
          name,
          acNumber,
          ifsc,
          updatedOn: Date.now(),
          status: 1,
        }),
      });
      const json = await response.json();
      return json;
    } catch (error) {
      console.error(error);
    }
  };

  // fetch payment informations ---------------------
  const fetchPaymentinformation = async (name, acNumber, ifsc) => {
    try {
      const response = await fetch(`${host}/payments/fetchPaymentDetails`, {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "Access-Control-Allow-Credentials": true,
          "jwt-token": localStorage.getItem("jwtToken"),
        },
      });
      const json = await response.json();
      return json;
    } catch (error) {
      console.error(error);
    }
  };

  // Create user order easebuzz ----------------
  const createUserOrderEaseBuzz = async (
    orderFrom,
    orderFor,
    amount,
    sname,
    referralCode,
    id
  ) => {
    try {
      const response = await fetch(
        `${host}/api/payment/userOrder/createOrderEaseBuzz/${id}`,
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            "Access-Control-Allow-Credentials": true,
            "jwt-token": localStorage.getItem("jwtToken"),
          },
          body: JSON.stringify({
            orderFrom,
            orderFor,
            amount,
            sname,
            referralCode,
          }),
        }
      );
      const json = await response.json();
      return json;

    } catch (error) {
      toast.error("Some Error from Easebuzz", {
        position: "top-center",
        autoClose: 2000,
      });
    }
  };

  // Get easebuzz api key ----------
  const easeBuzzApiKey = async () => {
    const res = await fetch(`${host}/api/payment/getEaseBuzzKey`, {
      method: "GET",
      headers: {
        "jwt-token": localStorage.getItem("jwtToken"),
      },
    });
    const json = await res.json();
    return json.key;
  };

  return (
    <paymentContext.Provider
      value={{
        createRazorpayClientSecret,
        razorpay_key,
        checkfororder,
        fetchPaymentinformation,
        fillPaymentinformation,
        informLarkBot,
        createUserOrderEaseBuzz,
        easeBuzzApiKey,
      }}
    >
      {props.children}
    </paymentContext.Provider>
  );
};

export default PaymentState;
