import React from 'react'
import Navbar from './Navbar'
import { Outlet } from 'react-router'
import FooterSec from './Footer'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { addUser } from '../utils/userSlice'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { BASE_URL } from '../utils/constants'


const Body = () => {
  const dispatch=useDispatch();
  const navigate=useNavigate();

  const userData = useSelector((store) => store.user);
  const fetchUser=async ()=>{
    if(userData) return;
    try{
      const res= await axios.get(BASE_URL+ "/profile", {withCredentials:true});
      console.log(res.data);
      dispatch(addUser(res.data));
    }
    catch(err){
      
      navigate("/");
      console.error(err);
    }
  }

  useEffect(() => {
    fetchUser()
  }, []);


  return (
    <div>
        <Navbar/>
        <Outlet/>
        <FooterSec/>
    </div>
  )
}

export default Body