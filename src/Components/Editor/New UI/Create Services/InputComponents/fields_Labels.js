import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import React, { useState } from "react";
import "./components.css";
import { useEffect } from "react";

// text field -------------------------
function fields_Labels1(props) {
  return (
    // Normal type -1 text field used in create
    <div className="textfiled_container_01">
      <span className="label_type_01">
        {props.label}{" "}
        {props?.anchorLink && (
          <a
            href={props?.anchorLink?.url}
            target="_blank"
            rel="noreferrer"
            style={{ textDecoration: "underLine" }}
          >
            {props?.anchorLink?.text}
          </a>
        )}
        {props?.required && <span style={{ color: "red" }}>*</span>}
      </span>
      <input
        type={props?.type ? props?.type : "text"}
        className="input_type_01"
        placeholder={props.placeholder}
        value={props.value}
        onChange={props.onChange}
        name={props.name}
        id={props.id}
      />
      {props?.verifiedComp && (
        <i className="fa-solid fa-square-check fa-xl verifiedComponent01"></i>
      )}
    </div>
  );
}

// Editor text field -------------------------
function EditorText01(props) {
  return (
    // Normal type -1 text field used in create
    <div className="textfiled_container_01">
      <span className="label_type_01">
        {props?.label}{" "}
        {props?.required && <span style={{ color: "red" }}>*</span>}
      </span>
      <CKEditor
        editor={ClassicEditor}
        data={props?.Content ? props?.Content : ""}
        config={{
          placeholder: props?.placeholder,
          toolbar: [
            "|",
            "bold",
            "italic",
            "blockQuote",
            "link",
            "numberedList",
            "bulletedList",
            "imageUpload",
            "|",
            "undo",
            "redo",
          ],
        }}
        onChange={(event, editor) => {
          const data = editor.getData();
          props?.setContent(data);
        }}
      />
      <p className="label_type_03">{props.info}</p>
    </div>
  );
}

// upload field - id is required
function UploadField01(props) {
  const [fileName, setfileName] = useState();

  const handleChange = (e) => {
    setfileName(e.target.files[0].name);
    props.onChange(e.target.files[0]);
    if (props.onChangeFunction) {
      props.onChangeFunction(e);
    }
  };

  return (
    // Normal type -1 text field used in create
    <div className="textfiled_container_01">
      <span className="label_type_01">
        {props.label}{" "}
        {props?.required && <span style={{ color: "red" }}>*</span>}
      </span>
      <input
        type="file"
        id={props.id}
        style={{ display: "none" }}
        onChange={handleChange}
        accept={props.FileType}
      />
      <label htmlFor={props.id} className="input_type_02">
        <i className="fa-solid fa-plus fa-xl"></i>
        <span>Browse</span>
        <p>{fileName ? fileName : props.info}</p>
      </label>
    </div>
  );
}

// upload file with default options
function UploadField02(props) {
  const [fileName, setfileName] = useState();

  const handleChange = (e) => {
    setfileName(e.target.files[0].name);
    props.onChange(e.target.files[0]);
    if (props.onChangeFunction) {
      props.onChangeFunction(e);
    }
  };

  return (
    // Normal type -1 text field used in create
    <div className="textfiled_container_01">
      <div className="upload_default_wrapper">
        <span className="label_type_01">
          {props.label}{" "}
          {props?.required && <span style={{ color: "red" }}>*</span>}
        </span>

        {/* Radio button ---------- */}
        <div className="radiofiled_container_01">
          <span className="label_type_02">{props.defaultRadioLabel} </span>
          <label className="switch_type_01">
            <input
              type="checkbox"
              onChange={(event) =>
                props.defaultRadioOnChange(event)
              }
            />
            <span className="slider_type_01 round_type_01"></span>
          </label>
        </div>
      </div>

      <input
        type="file"
        id={props.id}
        style={{ display: "none" }}
        onChange={handleChange}
        accept={props.FileType}
      />
      <label htmlFor={props.id} className="input_type_02">
        <i className="fa-solid fa-plus fa-xl"></i>
        <span>Browse</span>
        <p>{fileName ? fileName : props.info}</p>
      </label>
    </div>
  );
}

// checkbox radio field --------------------------------------------------------------------
function fields_Labels3(props) {
  return (
    // Normal type -1 text field used in create
    <div className="radiofiled_container_01">
      <span className="label_type_02">
        {props.label}{" "}
        {props?.required && <span style={{ color: "red" }}>*</span>}
      </span>
      <label className="switch_type_01">
        {props.onChange ? (
          <input
            type="checkbox"
            checked={props?.value}
            onChange={(event) => props.onChange(event.target.checked)}
          />
        ) : (
          <input type="checkbox" />
        )}
        <span className="slider_type_01 round_type_01"></span>
      </label>
    </div>
  );
}

// social fields --------------------------------------------
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

// tags section ------------------------------
function Tags01(props) {
  const handleKeyDown = (e) => {
    if (e.key !== "Enter") return;
    const value = e.target.value;
    if (value.includes(",")) {
      let arrcomma = value.split(",");
      props.setTags([...props.tags, ...arrcomma]);
      e.target.value = "";
      return;
    }
    if (!value.trim()) return;
    props.setTags([...props.tags, value]);
    e.target.value = "";
  };
  const removeTag = (index) => {
    props?.setTags(props.tags.filter((e, i) => i !== index));
  };

  return (
    // Normal type -1 text field used in create
    <div className="textfiled_container_01">
      <span className="label_type_01">
        {props.label}{" "}
        {props?.required && <span style={{ color: "red" }}>*</span>}
      </span>
      <div className="tags01_box">
        {props?.tags?.map((e, i) => {
          return (
            <span key={i}>
              {e} <i class="fa-solid fa-xmark" onClick={() => removeTag(i)}></i>
            </span>
          );
        })}
        <input
          type="text"
          className="input_type_03"
          placeholder={props.placeholder}
          onKeyDown={handleKeyDown}
        />
      </div>
      <p className="label_type_03">{props.info}</p>
    </div>
  );
}

// dropdown section ---------------------------------------

function Dropdown01(props) {
  const [OpenDropDown, setOpenDropDown] = useState(false);
  const [dropValue, setdropValue] = useState("");

  OpenDropDown &&
    document.addEventListener("click", () => {
      setOpenDropDown(false);
    });

  useEffect(() => {
    if (props?.defaultValue) {
      setdropValue(props?.defaultValue);
    }
  }, [props?.defaultValue]);

  return (
    // Normal type -1 text field used in create
    <div
      className="textfiled_container_01"
      onClick={(e) => {
        e.stopPropagation();
      }}
    >
      <span className="label_type_01">
        {props.label}{" "}
        {props?.required && <span style={{ color: "red" }}>*</span>}
      </span>
      <div
        className="dropdown_input_01"
        onClick={() => {
          setOpenDropDown(!OpenDropDown);
        }}
      >
        <input
          type="text"
          className="input_type_01"
          placeholder={props.placeholder}
          disabled={true}
          name={props.name}
          id={props.id}
          value={dropValue}
        />
        <i class="fa-solid fa-caret-down"></i>
      </div>
      {OpenDropDown && (
        <div className="dropdown_menu_options">
          {props?.value.map((e, i) => {
            return (
              <span
                key={i}
                onClick={() => {
                  setdropValue(e);
                  setOpenDropDown(false);
                  props.selectedValue(e);
                }}
              >
                {e}
              </span>
            );
          })}
        </div>
      )}
    </div>
  );
}

export const TextField1 = fields_Labels1;
export const Editor1 = EditorText01;
export const UploadField1 = UploadField01;
export const UploadField2 = UploadField02;
export const RadioField1 = fields_Labels3;
export const SocialFields = fields_Labels4;
export const Tags1 = Tags01;
export const Dropdown1 = Dropdown01;
