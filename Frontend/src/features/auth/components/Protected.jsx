import React from "react";
import { useAuth } from "../hooks/useAuth";

import { Navigate , useLocation} from "react-router";


export const Protected = ({children}) => {
  const {user , loading } = useAuth() ;
  const location = useLocation() ;

  if (loading) {
    return (<main><h1>Loading......</h1></main>)
  }

  if (!user) {
    return <Navigate to={'/login'} state={{from:location}} replace ></Navigate>
  }
  return children 
}
