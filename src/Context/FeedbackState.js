import React, { createContext,useState } from 'react'
import { Navigate } from 'react-router-dom';
import { host } from "../config/config";

export const feedbackcontext = createContext()
 
const FeedbackState = ( props ) => {
    const [feedbacks, setFeedbacks] = useState([])


    // CHECK IF THE FEEDBACK IS ALREADY SUBMITTED
    const checkFB = async(serviceID) => {
        const response = await fetch(`${host}/api/feedback/checkFeedback/${serviceID}` , {
            method: "GET",
            headers: {
                "jwt-token": localStorage.getItem('jwtToken') // USER LOGIN
            }
        })
        const json = await response.json()
        return json.success;
    }



    // Get all the feedbacks for a particular service using serviceid
    //const allfbforservice = async(id) =>{
    //    const response = await fetch(`${host}/api/feedback/all/${id}` , {
    //        method: "GET",
    //    })
    //    const json = await response.json()
    //    return json
    //}


    //get all the feedback of a creator
    const getallfeedback = async (id)=>{
        const response = await fetch(`${host}/api/feedback/all/${id}`,{
            method:"GET"
        })
        const json = await response.json()
        if(json.success){
            setFeedbacks(json.res)
        }
        else{
            //error
        }
    }

    
    // create a new feedback
    const createFeedback = async(serviceID ,rating , description) => {
        const response = await fetch(`${host}/api/feedback/giveFeedback/${serviceID}`, {
            method: "POST",
            headers: {
                "Content-type" : "application/json",
                "jwt-token": localStorage.getItem('jwtToken') // USER LOGIN
            },
            body : JSON.stringify({
                rating,
                desc : description
            })
        })
        const json = await response.json()
        return json.success
    }

    // create a new query from user to creator profile
    const createRequest = async(creatorID , query,paid,amount) => {
        const response = await fetch(`${host}/api/query/giverequest/${creatorID}`, {
            method: "POST",
            headers: {
                "Content-type" : "application/json",
                "jwt-token": localStorage.getItem('jwtToken') // USER LOGIN
            },
            body : JSON.stringify({
                query:query,
                paid:paid,
                amount:amount
            })
        })
        const json = await response.json()
        return json
    }


    // check for if request already exists in database on not
    const checkRequest = async(creatorID)=>{
        const response = await fetch(`${host}/api/query/checkrequest/${creatorID}`, {
            method: "GET",
            headers: {
                "Content-type" : "application/json",
                "jwt-token": localStorage.getItem('jwtToken') // USER LOGIN
            }
        })
        const json = await response.json()
        return json
    }


    // searches for the feedback once the use login for its previous unfeedbacked services
  const checkFBlatest = async() =>{
    const response = await fetch(`${host}/api/feedback/checklatestFeedback` , {
        method: "GET",
        headers: {
            "jwt-token": localStorage.getItem('jwtToken') // USER LOGIN
        }
    })
    const json = await response.json()
    return json
}

    // get the current rating of the creator
    const getRatingCreator = async (id) =>{
        const response = await fetch(`${host}/api/feedback/rating/${id}` , {
            method: "GET",
            headers: {
                "jwt-token": localStorage.getItem('jwtToken') // USER LOGIN
            }
        })
        const json = await response.json()
        if(json.success){
            return json.rating;
        }
        else{
            return 4.1
        }
    }

    const getallfb = async () =>{
        const response = await fetch(`${host}/api/feedback/getallfb` , {
            method: "GET",
        })
        const json = await response.json()
        if(json.success){
            return json.feedbacks;
        }
        else{
            return json.success
        }
    }




    
    return (
        <feedbackcontext.Provider value={{ checkRequest,getallfb,getRatingCreator,feedbacks,checkFB, createFeedback,getallfeedback,createRequest,checkFBlatest }} >
        {props.children}
    </feedbackcontext.Provider>
  )
}

export default FeedbackState