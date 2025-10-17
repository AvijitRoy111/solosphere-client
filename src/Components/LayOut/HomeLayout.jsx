import { Outlet } from "react-router-dom";
import Navbar from "../Navbar/Navbar";
import Footer from "../Footer/Footer";


const HomeLayout = () => {
     return (
          <div className="flex flex-col min-h-screen">
               <Navbar/>
               <div className="flex flex-grow mt-20">
                    <Outlet></Outlet>
               </div>
               <Footer/>
          </div>
     );
};

export default HomeLayout;