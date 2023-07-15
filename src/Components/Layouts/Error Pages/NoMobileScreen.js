import React from 'react'
import "./Styles.css"

function NoMobileScreen() {
  return (
    <div className='error_pages_wrapper'>
        <h3>This is not available on mobile devices. Please check on a desktop for a better experience.</h3>
        <button onClick={()=>{window.open("/","_self")}}>Go to Homepage</button>
    </div>
  )
}

export default NoMobileScreen