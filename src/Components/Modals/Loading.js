import React from 'react'
import "./Model.css"

function Loading() {
  return (
    <div className="loading_bar">
        <img src={require("../logo.png")} alt="Loading" className='loader_home' />
    </div>
  )
}

function LoadingOne( {open}){
  if(!open){
    return null
  }

  return(
    <div className="loadbar2">
        <img src={require("../logo.png")} alt="..Loading" className='loader_home load2' />
    </div>
  )
}

// For user side pages
function LoadingTwo( {open}){
  return(
    <div className="loadbar3">
        <img src={require("../logo.png")} alt="..Loading" className='loader_home load2' />
    </div>
  )
}



export const LoadOne = Loading;
export const LoadTwo = LoadingOne;
export const LoadThree = LoadingTwo;
