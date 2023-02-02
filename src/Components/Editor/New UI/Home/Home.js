import React, { useState } from 'react'
import CreatorInfo from '../../../Modals/CreatorProfile/Modal1'
import Dashboard from '../Dashboard/Dashboard'
import Navbar from '../Navbar/Navbar'
import Sidebar from '../SideBar/Sidebar'
import "./Home.css"

function Home() {
  const [openCreatorInfo, setopenCreatorInfo] = useState(false)


  return (
    <div className="main_home_page_container">
      <Sidebar/>
      <div className="right_side_home_page">
        <Navbar ModalState={openCreatorInfo} ChangeModalState={(e)=>setopenCreatorInfo(e)}/>
        <CreatorInfo open={openCreatorInfo} toClose={()=>{setopenCreatorInfo(false)}}/>
        <div className="remaining">
          <Dashboard/>
        </div>
      </div>
    </div>
  )
}

export default Home