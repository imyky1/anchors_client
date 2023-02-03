import React, { useEffect, useState } from 'react'
import {  useLocation, useNavigate } from 'react-router-dom'
import "./Create.css"
import { Button1 } from './InputComponents/buttons';
import { RadioField1, TextField1, UploadField1 } from './InputComponents/fields_Labels';

function Create() {
    const navigate = useNavigate()

    // for checking the type of service we need to create --------------------------------------
    const {search} = useLocation()
    const query = new URLSearchParams(search);
    const paramsType = query.get('type');
    const [CreateType, setCreateType] = useState()

    useEffect(()=>{
        setCreateType(paramsType)
    },[paramsType])



    // check is the query parameter is changed
    if(!["pdf","excel","video"].includes(CreateType)){
        return navigate("/newUi/dashboard")
    }

  return (
    <div className="main_create_container">
        {/* Heading of the create section ------------------------ */}
        <section className="heading_create_box">
            <h1 className="create_text_01">Create {CreateType==="pdf" ? "PDF" : CreateType==="excel" ? "Excel sheet" : CreateType==="video" ? "Video" : ""}</h1>
            <p className="create_text_02">You can upload notes, Interview Questions, English Vocabulary etc. </p>
        </section>

        {/* form section of create container ---------------------------------------- */}
        <section className="create_form_box">

            {/* left side----------------- */}
            <div className="left_section_form">
                <TextField1 label="Service Title" placeholder="Enter Title Here"/>
                <TextField1 label="Set Maximum Price" placeholder="Max 500"/>
                <UploadField1 label="Upload Banner Image" id="asdas" info="File Size Limit 15 MB Formats - jpg,png"/>
                <RadioField1 label="Use Default Image" id="asdas" />

            </div>

            {/* right side----------------- */}
            <div className="right_section_form">
                <TextField1 label="Service Type " placeholder="Choose a service type"/>
                <TextField1 label="Selling Price " placeholder="Min 99"/>
                <UploadField1 label="Upload Document" id="asd1515" info={CreateType==="pdf" ? "File Size Limit 15 MB Formats - pdf" : CreateType==="excel" ? "File Size Limit 15 MB Formats -xls" : CreateType==="video" ? "File Size Limit 500 MB Formats -Avi,mp4" : ""}/>

            </div>
        </section>

        <section className="advanced_custom_mode_create">
            <span className="create_text_03">Advanced customize</span>
            <section>
            {/* left section -------------------------- */}
            <div className="left_section_form">
            <TextField1 label="Describe about Service" placeholder="Enter Title Here"/>
            </div>


            {/* right section -------------------------- */}
            <div className="right_section_form">
            <TextField1 label={CreateType==="video" ? "Time Duration" : CreateType==="excel" ? "Number of items" : "Number of Pages"} placeholder={CreateType==="video" && "48 Mins" || CreateType==="excel" && "21"}/>
            <RadioField1 label={CreateType==="video" ? "Allow Download"  : "Allow Preview"} id="asdas" />
            </div>
            </section>
        </section>

        <section className="buttons_form">
            <Button1 text="Save and Publish"/>
        </section>
    </div>
  )
}

export default Create