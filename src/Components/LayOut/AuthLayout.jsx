import { Outlet } from "react-router-dom";
import Navbar from "../Navbar/Navbar";


const AuthLayout = () => {
     return (
          <div>
               <Navbar></Navbar>
               <div >
                    <Outlet></Outlet>
               </div>
          </div>
     );
};

export default AuthLayout;