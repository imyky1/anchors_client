import React, { useState } from "react";
import "./components.css";
import { useEffect } from "react";
import ReactQuill, { Quill } from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import ImageResize from 'quill-image-resize-module-react';
import BlotFormatter from 'quill-blot-formatter';
import { HiOutlineUpload } from "react-icons/hi";
import { TfiReload } from "react-icons/tfi";
import { AiFillInfoCircle } from "react-icons/ai";
import DatePicker from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";
Quill.register('modules/imageResize', ImageResize);
Quill.register('modules/blotFormatter', BlotFormatter);

export const TooltipBox = ({ text, top, left, points = [] }) => (
  <div className="tooltip-component-box" style={{ top, left } ?? {}}>
    <b>{text}</b>
    {points.length > 0 && (
      <ul>
        {points?.map((e, i) => {
          return <li key={i}>{e}</li>;
        })}
      </ul>
    )}
  </div>
);

// text field -------------------------
function fields_Labels1(props) {
  return (
    // Normal type -1 text field used in create
    <div className="textfiled_container_01">
      <span className="label_type_01">
        {props.label}{" "}
        {props?.required && <span style={{ color: "red" }}>*</span>}
        {props?.labelHelperText && (
          <p
            onClick={() => {
              props?.labelHelperText?.action();
            }}
            className="helper_text_label_type_01"
          >
            {props?.labelHelperText?.text}
          </p>
        )}
      </span>
      <input
        style={props?.height ? { height: props?.height ,  } : {}}
        type={props?.type ? props?.type : "text"}
        className="input_type_01"
        placeholder={props.placeholder}
        value={props?.value}
        onChange={props?.onChange}
        name={props.name}
        id={props.id}
        maxLength={props?.maxLength}
      />
      {props?.verifiedComp && (
        <i className="fa-solid fa-square-check fa-xl verifiedComponent01"></i>
      )}
      <p className="label_type_03" style={{color:props?.infoColor}}>{props.info}</p>
    </div>
  );
}

// Editor text field -------------------------
function EditorText01(props) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    // Normal type -1 text field used in create
    <div className="textfiled_container_01">
      <span className="label_type_04">
        {props?.label}{" "}
        {props?.helperText && (
          <AiFillInfoCircle
            size={20}
            onMouseEnter={() => {
              setIsHovered(true);
            }}
            onMouseLeave={() => {
              setIsHovered(false);
            }}
          />
        )}
        {props?.required && <span style={{ color: "red" }}>*</span>}
        {isHovered && <TooltipBox text={props?.helperText} />}
        {props?.labelHelperText && (
          <p
            onClick={() => {
              props?.labelHelperText?.action();
            }}
            className="helper_text_label_type_01"
          >
            {props?.labelHelperText?.text}
          </p>
        )}
      </span>
      <ReactQuill
        theme="snow"
        value={props?.Content}
        onChange={(e) => {
          props?.setContent(e);
        }}
        className="quill-editor"
        placeholder={props?.placeholder}

        modules={{
          toolbar: [
            [{ size: [] }],
            ['bold', 'italic', 'underline', 'strike', 'blockquote'],
            [
              { list: 'ordered' },
              { list: 'bullet' },
              { indent: '-1' },
              { indent: '+1' }
            ],
            ['link', 'image', 'video'],
            ['clean']
          ],
          clipboard: {
            // toggle to add extra line breaks when pasting HTML:
            matchVisual: false
          },
          imageResize: {
            parchment: Quill.import('parchment'),
            modules: ['Resize', 'DisplaySize']
          },
          blotFormatter: {}
      }}

      />
      <p className="label_type_03" style={props?.infoStyle} onClick={props?.infoClick}>{props.info}</p>
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
        {fileName ? (
          <TfiReload color={"white"} size={22} />
        ) : (
          <HiOutlineUpload color={"white"} size={22} />
        )}
        <span>{fileName ? "Replace" : "Browse"}</span>
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
    props?.onChange(e.target.files[0]);
    if (props?.onChangeFunction) {
      props?.onChangeFunction(e);
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
        {props.defaultRadioLabel && (
          <div className="radiofiled_container_01">
            <span className="label_type_02">{props.defaultRadioLabel} </span>
            <label className="switch_type_01">
              <input
                type="checkbox"
                onChange={(event) => props.defaultRadioOnChange(event)}
              />
              <span className="slider_type_01 round_type_01"></span>
            </label>
          </div>
        )}
      </div>

      <input
        type="file"
        id={props.id}
        disabled={props?.disabled}
        style={{ display: "none" }}
        onChange={handleChange}
        accept={props.FileType}
      />
      <label htmlFor={props.id} className="input_type_02">
        {fileName ? (
          <TfiReload color={"white"} size={22} />
        ) : (
          <HiOutlineUpload color={"white"} size={22} />
        )}
        <span>{fileName ? "Replace" : "Browse"}</span>
        <p>
          {props?.disabled
            ? "Using Default Banner (in png)"
            : fileName
            ? fileName
            : props.info}
        </p>
      </label>
    </div>
  );
}

// upload new ui field
function UploadField03(props) {
  const [fileName, setfileName] = useState();
  const [isHovered, setIsHovered] = useState(false);

  const handleChange = (e) => {
    setfileName(e?.target.files[0]?.name);
    props?.onChange(e?.target.files[0]);
    if (props?.onChangeFunction) {
      props?.onChangeFunction(e);
    }
  };

  return (
    // Normal type -1 text field used in create
    <div className="textfiled_container_01">
      <span className="label_type_04">
        {props.label}{" "}
        {props?.helperText && (
          <AiFillInfoCircle
            size={20}
            onMouseEnter={() => {
              setIsHovered(true);
            }}
            onMouseLeave={() => {
              setIsHovered(false);
            }}
          />
        )}
        {props?.required && <span style={{ color: "red" }}>*</span>}
        {isHovered && <TooltipBox text={props?.helperText} />}
      </span>
      <input
        type="file"
        id={props.id}
        style={{ display: "none" }}
        onChange={handleChange}
        accept={props.FileType}
      />
      <label htmlFor={props.id} className="input_type_04">
        {fileName || props?.disabled ? (
          <TfiReload color={"white"} size={22} />
        ) : (
          <HiOutlineUpload color={"white"} size={22} />
        )}
      </label>
      <p className="label_type_03">
        {fileName
          ? fileName.split(".")[0].slice(0, 15) + "." + fileName.split(".")[1]
          : props.info}
      </p>
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

// Social fields ---------------
function fields_Labels4(props) {
  return (
    // Normal type -1 text field used in create
    <div className="textfield_container_03">
      {props.icons && (
        <i
          style={{
            color: "gray",
          }}
        >
          {props?.icons}
        </i>
      )}
      <input
        type="text"
        className="input_type_03"
        placeholder={props.placeholder}
        value={props.value}
        name={props.name}
        id={props.id}
        onChange={props.onChange}
      />
    </div>
  );
}

// date picker ---------
function DatePicker01(props) {
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

      <div className="textfield_container_03">
        <DatePicker
          selected={props?.value ?? Date.now()}
          showYearDropdown
          id={props?.id}
          name={props?.name}
          dateFormat="dd-MM-yyyy"
          minDate={new Date()}
          onChange={(date) => props?.onChange(date)}
          placeholderText={props?.placeholder}
        />
      </div>
    </div>
  );
}

// tags section ------------------------------
function Tags01(props) {
  const handleKeyDown = (e) => {
    if (e.key !== "Enter") return; // If the pressed key is not Enter, exit the function.
    const value = e.target.value; // Get the value from the input field.

    if (value.includes(",")) {
      let arrcomma = value.split(","); // Split the value by commas into an array.
      props.setTags([...props?.tags, ...arrcomma]); // Concatenate the new tags to the existing tags.
      e.target.value = ""; // Clear the input field.
      return;
    }

    if (!value.trim()) return; // If the value is empty or only consists of whitespace, exit the function.

    // Add the value as a new tag.
    props?.setTags([...props?.tags, value]);
    e.target.value = ""; // Clear the input field.
  };

  const removeTag = (index) => {
    props?.setTags(props?.tags.filter((e, i) => i !== index));
  };

  return (
    // Normal type -1 text field used in create
    <div className="textfiled_container_01">
      <span className="label_type_01">
        {props?.label}{" "}
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
          id={props?.id}
          name={props?.name}
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
          // disabled={true}
          readOnly={true}
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
                  setdropValue(e?.text ?? e);
                  setOpenDropDown(false);
                  props?.selectedValue(e?.text ?? e);
                  // props?.onClick();
                }}
              >
                {e?.icon}
                {e?.text ?? e}
              </span>
            );
          })}
        </div>
      )}
    </div>
  );
}

function Select01(props) {
  return (
    // Normal type -1 text field used in create
    <div className="textfiled_container_02">
      <span className="label_type_01">
        {props?.label}{" "}
        {props?.required && <span style={{ color: "red" }}>*</span>}
      </span>

      <section>
        {props?.value?.map((e, i) => {
          return (
            <span
              className={`select_button_type_01 ${
                props?.defaultValue === e ? "select_button_type_01_active" : ""
              }`}
              key={i}
              onClick={() => {
                props.selectedValue(e);
              }}
            >
              {e}
            </span>
          );
        })}
      </section>
    </div>
  );
}

function Table01({ headArray = [], bodyArray = [], gridConfig }) {
  return (
    <div className="table_component_wrapper01">
      {/* table head --------- */}
      <section style={{ gridTemplateColumns: gridConfig }}>
        {headArray?.map((e) => {
          return <span key={e}>{e}</span>;
        })}
      </section>

      {/* table body */}
      <div>
        {bodyArray?.map((elem, i) => {
          return (
            <div
              className="table_component_body01"
              style={{ gridTemplateColumns: gridConfig }}
            >
              {elem &&
                elem?.map((e, i) => {
                  return <span>{e}</span>;
                })}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function TextArea01(props) {
  return (
    // Normal type -1 text field used in create
    <div className="textfiled_container_01">
      <span className="label_type_01">
        {props?.label}{" "}
        {/* {props?.required && <span style={{ color: "red" }}>*</span>}
        {props?.labelHelperText && 
          <p onClick={()=>{props?.labelHelperText?.action()}} className="helper_text_label_type_01"> 
            {props?.labelHelperText?.text}
          </p>
        } */}
      </span>
      <textarea
        className="textarea_type_01"
        placeholder={props?.placeholder}
        value={props?.value}
        onChange={props?.onChange}
        name={props?.name}
        id={props?.id}
      />

      {/* {props?.verifiedComp && (
        <i className="fa-solid fa-square-check fa-xl verifiedComponent01"></i>
      )} */}
    </div>
  );
}

export const TextField1 = fields_Labels1;
export const Editor1 = EditorText01;
export const UploadField1 = UploadField01;
export const UploadField2 = UploadField02;
export const UploadField3 = UploadField03;
export const RadioField1 = fields_Labels3;
export const SocialFields = fields_Labels4;
export const Tags1 = Tags01;
export const Dropdown1 = Dropdown01;
export const Select1 = Select01;
export const DatePicker1 = DatePicker01;
export const Table1 = Table01;
export const TextArea1 = TextArea01;
