import React from "react";
import "./components.css";

function fields_Labels1(props) {
  return (
    // Normal type -1 text field used in create
    <div className="textfiled_container_01">
      <span className="label_type_01">{props.label}</span>
      <input
        type="text"
        className="input_type_01"
        placeholder={props.placeholder}
        value={props.value}
      />
    </div>
  );
}

// upload file - id is required

function fields_Labels2(props) {
  return (
    // Normal type -1 text field used in create
    <div className="textfiled_container_01">
      <span className="label_type_01">{props.label}</span>
      <input type="file" id={props.id} style={{ display: "none" }} />
      <label htmlFor={props.id} className="input_type_02">
        <i className="fa-solid fa-plus fa-xl"></i>
        <span>Browse</span>
        <p>{props.info}</p>
      </label>
    </div>
  );
}

// checkbox radio file - id is required

function fields_Labels3(props) {
  return (
    // Normal type -1 text field used in create
    <div className="radiofilled_container_01">
      <span className="label_type_02">{props.label}</span>
      <label className="switch_type_01">
        <input type="checkbox" />
        <span className="slider_type_01 round_type_01"></span>
      </label>
    </div>
  );
}

function fields_Labels4(props) {
  return (
    // Normal type -1 text field used in create
    <div className="textfiled_container_01">
      <input
        type="text"
        className="input_type_01"
        placeholder={props.placeholder}
        value={props.value}
        name={props.name}
        id={props.id}
        onChange={props.onChange}
      />
    </div>
  );
}

export const TextField1 = fields_Labels1;
export const UploadField1 = fields_Labels2;
export const RadioField1 = fields_Labels3;
export const SocialFields = fields_Labels4;
