import React,{useState,useContext,useEffect} from 'react'
import { LoadOne } from './Modals/Loading'
import {useParams,useNavigate} from "react-router-dom"
import ServiceContext from '../Context/services/serviceContext';

function Redirect_servworkshop() {
    const {id} = useParams();
    const navigate = useNavigate()
    const [redirecting, setredirecting] = useState(false)
    const [slug, setSlug] = useState("")
    const {getworkshopslugfromcpyid} = useContext(ServiceContext)
    
    useEffect(() => {
        getworkshopslugfromcpyid(id).then((e)=>{
            console.log(e)
        if(e.success){
            setSlug(e.slug)
            setredirecting(true)
        }
        else{
            navigate("/")
            
        }
      })

      // eslint-disable-next-line
    }, [])


    if(redirecting){
        navigate(`/w/${slug}`)
    }
    
  return (
    <>
    {!redirecting && <LoadOne/>}
    </>
  )
}

export default Redirect_servworkshop