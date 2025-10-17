import { useContext } from "react";
import { AuthContext } from "../AuthProvider/AuthProvider";
import { Navigate, useLocation } from "react-router-dom";


const PrivateRoutes = ({children}) => {
     const {user, loading} =useContext(AuthContext);
     const loaction = useLocation()

     if(user) return children;
     if(loading) return <p>Loading.....</p>

     return <Navigate to="/signIn" state={loaction.pathname} replace={true}></Navigate>
};

export default PrivateRoutes;