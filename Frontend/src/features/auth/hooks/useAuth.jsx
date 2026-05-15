import { useContext } from "react";
import { AuthContext } from "../auth.context";
import { login , logout , register , getMe } from "../services/auth.api";
import { useEffect } from "react";

export const useAuth = ()=>{
  const context = useContext(AuthContext) ;
  const {user , setUser  , loading , setLoading} = context 

  const handleLogin = async ({email , password})=>{
    setLoading(true) ;
    try{
const data = await login({email , password}) ;
    setUser(data.user) ;
    }
    catch(err){
      throw err ;
    } finally{
    setLoading(false) }
  }
  const handleRegister = async ({userName ,email , password})=>{
    setLoading(true) ;
    try{
    const data = await register({userName , email , password})
    setUser(data.user) ;
    }
    catch(err) {

    }
    finally {
    setLoading(false) }
  }

    const handleLogout = async ()=>{
    setLoading(true) ;
    try{
    const data = await logout()
    setUser(null) ;
    }catch(err){

    }finally{
    setLoading(false) }
  }


  return {user , loading , handleLogin , handleLogout , handleRegister}


}