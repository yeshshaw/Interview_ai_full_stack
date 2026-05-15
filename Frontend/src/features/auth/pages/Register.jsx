import React from 'react'
import { useState } from 'react';
import {useNavigate , Link} from 'react-router'
import {useAuth } from "../hooks/useAuth"

const Register = () => { 
  const [userName , setUserName] = useState('') ;
  const [email , setEmail] = useState('') ;
  const [password , setPassword] = useState('') ;
  const navigate = useNavigate() ;
  const { loading , handleRegister } = useAuth() ;

  const handleSubmit = async (e)=>{
    e.preventDefault() ;
 try {
    await handleRegister({userName , email , password }) ;
    navigate('/')
 }catch (err ) {
  setError(
    err?.response?.data?.message || "Login failed"
  )
 }
  }
  if(loading) {
    return(<main><h1>Loading......</h1></main>)
  }
  return (
    <main>
      <div className="form-container">
        <h1>Register</h1>
        <form onSubmit={handleSubmit}>

        <div className="input-group">
          <label   htmlFor="email">username</label>
          <input onChange={(e)=>{setUserName(e.target.value)}} type="text" name="userName" id="userName" placeholder='Enter username '/>

        </div>

        <div className="input-group">
          <label htmlFor="email">Email</label>
          <input onChange={(e)=>{setEmail(e.target.value)}} type="email" name="email" id="email" placeholder='Enter email address '/>

        </div>
        <div className="input-group">
          <label htmlFor="password">Password</label>
          <input onChange={(e)=>{setPassword(e.target.value)}} type="password" name="password" id="password" placeholder='Enter password '/>
          
        </div>

        <button className='button primary-button'>register</button>

        <p>Already have an account? <Link to={"/login"}>login</Link></p>


        </form>
      </div>
    </main>
  )
}

export default Register