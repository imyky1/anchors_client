import { createContext, useState } from "react";
import { host } from "../config/config";

export const userContext = createContext();

const UserState = (props) => {
  // ROUTE 1 : USER SIGN up
  //const userSignup = async( name, email, password, location) =>{
  //    const response = await fetch(`${host}/api/user/createuser`, {
  //        method: 'POST',
  //        headers: {
  //            Accept: "application/json",
  //            "Content-Type": "application/json",
  //            "Access-Control-Allow-Credentials": true
  //        },
  //        body: JSON.stringify({
  //            name,email, password ,location
  //        })
  //    })
  //    const json = await response.json();
  //    if (json.success) {
  //        setisuserLoggedIn(true)
  //        localStorage.setItem('jwtToken', json.jwtToken)
  //    } else {
  //        if (typeof (json.error) === 'object') {
  //             //alert(json.error[0].msg)
  //            return;
  //        }
  //        //alert(json.error)
  //   }
  //}
  //// ROUTE 2 : USER LOG IN
  //const userlogIn = async ( email, password) => {
  //    const response = await fetch(`${host}/api/user/login`, {
  //        method: 'POST',
  //        headers: {
  //            Accept: "application/json",
  //            "Content-Type": "application/json",
  //            "Access-Control-Allow-Credentials": true
  //        },
  //        body: JSON.stringify({
  //             email, password
  //        })
  //    })
  //    const json = await response.json();
  //    if (json.success) {
  //        setisuserLoggedIn(true)
  //        localStorage.setItem('jwtToken', json.jwtToken)
  //    } else {
  //        if (typeof (json.error) === 'object') {
  //            alert(json.error[0].msg)
  //            return;
  //        }
  //        alert(json.error)
  //    }
  //}

  //Used to verify if payments took place or not-------------
  const verifyPaymentsinBackend = async (
    razorpay_payment_id,
    razorpay_order_id,
    razorpay_signature,
    amount,
    status,
    serviceid,
    creatorId,
    paidUser,
    orderType,
    orderFrom
  ) => {
    try {
      const response = await fetch(`${host}/api/payment/paymentVerification`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "Access-Control-Allow-Credentials": true,
        },
        body: JSON.stringify({
          razorpay_payment_id,
          razorpay_order_id,
          razorpay_signature,
        }),
      });
      const json = await response.json();
      if (json.success && json.verified) {
        // i.e payment has been verified now user order placing
        const success = await userPlaceOrder(
          amount,
          status,
          serviceid,
          creatorId,
          paidUser,
          orderType,
          orderFrom,
          razorpay_payment_id,
          razorpay_order_id,
          razorpay_signature
        );
        if (success) {
          return { success: true, orderPlaced: true, paymentRecieved: true };
        } else {
          return { success: true, orderPlaced: false, paymentRecieved: true };
        }
      } else {
        return { success: true, orderPlaced: false, paymentRecieved: false };
      }
    } catch (error) {
      console.error("Some error occured");
    }
  };

  // ROUTE 3 : USER ORDER
  const userPlaceOrder = async (
    amount,
    status,
    serviceid,
    creatorId,
    paidUser,
    orderType,
    orderFrom,
    razorpayPaymentId,
    razorpayOrderId,
    razorpaySignature
  ) => {
    const response = await fetch(
      `${host}/api/user/service/neworder/${serviceid}`,
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "Access-Control-Allow-Credentials": true,
          "jwt-token": localStorage.getItem("jwtToken"),
        },
        body: JSON.stringify({
          amount,
          status,
          orderType,
          razorpayPaymentId,
          razorpayOrderId,
          razorpaySignature,
          orderFrom: orderFrom ? orderFrom : "user",
        }),
      }
    );
    const json = await response.json();
    if (json.success) {
      const res2 = await addSubscriber(creatorId, paidUser);
      return json.success;
    } else {
      return json.success;
    }
  };

  const addSubscriber = async (id, isPaid) => {
    // USER LOGIN IS REQUIRED
    const response = await fetch(`${host}/api/subscribe/new/${id}`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "Access-Control-Allow-Credentials": true,
        "jwt-token": localStorage.getItem("jwtToken"),
      },
      body: JSON.stringify({
        isPaid: isPaid,
      }),
    });

    const res = await response.json();
    return res.success;
  };

  const checkSubscriber = async (id) => {
    // USER LOGIN IS REQUIRED
    const response = await fetch(`${host}/api/subscribe/checkforsubscribe`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "Access-Control-Allow-Credentials": true,
        "jwt-token": localStorage.getItem("jwtToken"),
      },
      body: JSON.stringify({
        id: id?.toString(),
      }),
    });
    const res = await response.json();
    return res.success;
  };

  // get user details
  const getUserDetails = async () => {
    // USER LOGIN IS REQUIRED
    const response = await fetch(`${host}/api/user/getUserDetails`, {
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
  };

  // get last user details for a service for social proof

  const lastUser = async (id) => {
    const response = await fetch(`${host}/api/user/recentuserdetail/${id}`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "Access-Control-Allow-Credentials": true,
      },
    });
    const json = await response.json();
    return json;
  };

  // check if userorder already exists or not
  const checkUserOrderPlaced = async (id, orderFrom) => {
    // USER LOGIN IS REQUIRED
    const response = await fetch(`${host}/api/user/checkUserOrder/${id}`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "Access-Control-Allow-Credentials": true,
        "jwt-token": localStorage.getItem("jwtToken"),
      },
      body: JSON.stringify({
        orderFrom: orderFrom ? orderFrom : "user",
      }),
    });
    const json = await response.json();
    return json.success;
  };

  return (
    <userContext.Provider
      value={{
        lastUser,
        checkSubscriber,
        userPlaceOrder,
        verifyPaymentsinBackend,
        addSubscriber,
        getUserDetails,
        checkUserOrderPlaced,
      }}
    >
      {props.children}
    </userContext.Provider>
  );
};

export default UserState;
