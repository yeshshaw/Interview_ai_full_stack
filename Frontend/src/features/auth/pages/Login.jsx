import React from 'react'
import "../auth.form.scss"
import { Link , useNavigate , useLocation} from 'react-router';
import { useAuth } from '../hooks/useAuth';
import { useState } from 'react';
 const Login = () => {
  const navigate = useNavigate() ;
  const {loading , handleLogin} = useAuth()
  const [email , setEmail] = useState("")
  const [password , setPassword ] = useState("")
  const [error, setError] = useState(""); 
  const location = useLocation() ;
  const from = location.state?.from?.pathname || "/"
  async function handleSubmit(e) {
   
    e.preventDefault() ;
    try
    {
    await handleLogin({email , password}) ;
     navigate(from , {replace : true});
    }catch(err) {
      setError(err?.response?.data?.message || "Login failed")
    }
  }
  if (loading) {
    return(
      <main>
        <h1>Loading......</h1>
      </main>
    )
  }
  return (
    <main>
      <div className="form-container">
        <h1>Login</h1>
        <form onSubmit={handleSubmit}>
          {error && <p className="error-message">{error}</p>}

        <div className="input-group">
          <label htmlFor="email">Email</label>
          <input onChange={(e)=>{setEmail(e.target.value)}} type="email" name="email" id="email" placeholder='Enter email address '/>

        </div>
        <div className="input-group">
          <label htmlFor="password">Password</label>
          <input onChange={(e)=>{setPassword(e.target.value)}} type="password" name="password" id="password" placeholder='Enter password '/>
          
        </div>

        <button className='button primary-button'>Login</button>
                <p>Don't have an account? <Link to={"/register"}>register</Link></p>



        </form>
      </div>
    </main>
  )
}

export default Login
