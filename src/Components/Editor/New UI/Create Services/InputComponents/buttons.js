import React from 'react'
import "./components.css"

function buttons1(props) {
  return (
    <button className="button_01_css" style={props?.height && {height:props?.height}} onClick={props.onClick}>
      {props.icon && props.icon}
        {props.text}
    </button>
  )
}

export const Button1 = buttons1