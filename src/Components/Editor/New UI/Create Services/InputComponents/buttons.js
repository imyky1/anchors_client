import React from 'react'
import "./components.css"

function buttons1(props) {
  return (
    <button className="button_01_css" onClick={props.onClick}>
        {props.text}
    </button>
  )
}

export const Button1 = buttons1