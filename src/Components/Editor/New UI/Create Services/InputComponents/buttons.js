import React from 'react'
import "./components.css"


// Normal for black theme
function buttons1(props) {
  return (
    <button className="button_01_css" style={props?.height && {height:props?.height}} onClick={props.onClick}>
        {props.text}
      {props.icon && props.icon}
    </button>
  )
}

function buttons2(props) {
  return (
    <button className="button_02_css" style={props?.height && {height:props?.height}} onClick={props.onClick}>
      {props.icon && props.icon}
        {props.text}
    </button>
  )
}

// Without border etc
function buttons3(props) {
  return (
    <button className="button_03_css" style={props?.height && {height:props?.height}} onClick={props.onClick}>
      {props.icon && props.icon}
        {props.text}
    </button>
  )
}

export const Button1 = buttons1
export const Button2 = buttons2
export const Button3 = buttons3