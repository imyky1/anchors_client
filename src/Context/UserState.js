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

    


    // ROUTE 3 : USER ORDER
    const userPlaceOrder = async ( amount , status , serviceid, creatorId ,paidUser,razorpayPaymentId , razorpayOrderId , razorpaySignature  ) => {
        const response = await fetch(`${host}/api/user/service/neworder/${serviceid}`, {
            method: 'POST',
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                "Access-Control-Allow-Credentials": true,
                'jwt-token': localStorage.getItem('jwtToken')
            },
            body: JSON.stringify({
                amount , status , razorpayPaymentId , razorpayOrderId , razorpaySignature 
            })
        })
        const json = await response.json();
        if(json.success){
            const res2 = await addSubscriber(creatorId,paidUser)
            return json.success
        }
        else{
            return json.success
        }

    }

    const addSubscriber = async (id , isPaid) => { // USER LOGIN IS REQUIRED
        const response = await fetch(`${host}/api/subscribe/new/${id}`, {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                "Access-Control-Allow-Credentials": true,
                "jwt-token": localStorage.getItem('jwtToken')
            },
            body: JSON.stringify({
                isPaid : isPaid
            })
        })

        
        const res = await response.json()
        return res.success
    }


    const checkSubscriber = async (id) => { // USER LOGIN IS REQUIRED
        const response = await fetch(`${host}/api/subscribe/checkforsubscribe`, {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                "Access-Control-Allow-Credentials": true,
                "jwt-token": localStorage.getItem('jwtToken')
            },
            body: JSON.stringify({
                id:id?.toString()
            })
        })
        const res = await response.json()
        return res.success
    }



    // get user details 
    const getUserDetails = async () => { // USER LOGIN IS REQUIRED
        const response = await fetch(`${host}/api/user/getUserDetails`, {
            method: "GET",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                "Access-Control-Allow-Credentials": true,
                "jwt-token": localStorage.getItem('jwtToken')
            },
            
        })
        const json = await response.json()
        return json
    }

    // get last user details for a service for social proof

    const lastUser = async(id)=>{
        const response = await fetch(`${host}/api/user/recentuserdetail/${id}`, {
            method: "GET",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                "Access-Control-Allow-Credentials": true
            },
            
        })
        const json = await response.json()
        return json
    }


    return (
        <userContext.Provider value={{lastUser,checkSubscriber, userPlaceOrder, addSubscriber,getUserDetails }}>
            {props.children}
        </userContext.Provider>
    )
}

export default UserState;