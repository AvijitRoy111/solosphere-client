import { useTheme } from "../hooks/useTheme";
import { Sun, Moon, Menu, X, User } from "lucide-react";
import logo from "../../assets/images/logo.png";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../AuthProvider/AuthProvider";
import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  const { user, logOut, loading } = useContext(AuthContext);
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    if (user) navigate("/");
  }, [user, navigate]);

  // Listen for window resize
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleLogout = async () => {
    try {
      await logOut();
      navigate("/");
      setShowDropdown(false);
    } catch (error) {
      console.error(error.message);
    }
  };

  return (
    <nav className="w-full fixed z-50 bg-white dark:bg-gray-900 shadow-md border-b border-gray-200 dark:border-gray-700 duration-300 px-4 md:px-12 lg:px-20">
      <div className="flex justify-between items-center h-16">
        {/* Left: Logo */}
        <div className="flex gap-2 items-center">
          <img className="w-auto h-8 brightness-200" src={logo} alt="Logo" />
          <span className="font-extrabold text-xl text-white">SoloSphere</span>
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-5">
          <ul className="flex gap-4 text-gray-800 dark:text-gray-200 font-medium">
            <li>
              <Link
                to="/"
                className="hover:bg-blue-600 px-3 py-1 rounded duration-200"
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                to="/allJobs"
                className="hover:bg-blue-600 px-3 py-1 rounded duration-200"
              >
                All Jobs
              </Link>
            </li>
          </ul>

          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            className={`p-2 rounded transition ${
              theme === "light"
                ? "hover:bg-gray-100 text-gray-700"
                : "hover:bg-gray-700 text-yellow-400"
            }`}
          >
            {theme === "light" ? (
              <Moon className="w-5 h-5" />
            ) : (
              <Sun className="w-5 h-5" />
            )}
          </button>

          {/* User Icon / Dropdown */}
          {loading ? (
            <div className="w-10 h-10 border-4 border-dashed rounded-full animate-spin dark:border-violet-600"></div>
          ) : user ? (
            <div className="relative">
              <div
                onClick={() => setShowDropdown(!showDropdown)}
                className="cursor-pointer w-10 h-10 rounded-full overflow-hidden border-2 border-transparent hover:border-blue-500 transition flex items-center justify-center bg-gray-200 dark:bg-gray-700"
              >
                <img
                  src={user.photoURL}
                  alt="User"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Dropdown (Desktop only) */}
              {!isMobile && showDropdown && (
                <div className="absolute right-0 mt-2 w-52 bg-white dark:bg-gray-800 shadow-lg rounded-md p-3 text-gray-800 dark:text-gray-100 z-50">
                  <ul className="flex flex-col gap-2 text-sm font-medium">
                    <li>
                      <Link
                        to="/add-job"
                        onClick={() => setShowDropdown(false)}
                        className="block px-3 py-2 rounded hover:bg-blue-600 transition"
                      >
                        Add Job
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/my-posted-job"
                        onClick={() => setShowDropdown(false)}
                        className="block px-3 py-2 rounded hover:bg-blue-600 transition"
                      >
                        My Posted Jobs
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/my-bids"
                        onClick={() => setShowDropdown(false)}
                        className="block px-3 py-2 rounded hover:bg-blue-600 transition"
                      >
                        My Bids
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/bids-request"
                        onClick={() => setShowDropdown(false)}
                        className="block px-3 py-2 rounded hover:bg-blue-600 transition"
                      >
                        Bid Requests
                      </Link>
                    </li>
                    <li>
                      <button
                        onClick={handleLogout}
                        className="w-full text-left bg-blue-600 text-white py-2 px-3 rounded hover:bg-blue-700 transition"
                      >
                        Logout
                      </button>
                    </li>
                  </ul>
                </div>
              )}
            </div>
          ) : (
            <User
              className="w-6 h-6 text-gray-800 dark:text-white cursor-pointer"
              onClick={() => navigate("/signIn")}
            />
          )}
        </div>

        {/* Mobile Right Side */}
        <div className="md:hidden flex items-center gap-3">
          <button
            onClick={toggleTheme}
            className={`p-2 rounded transition ${
              theme === "light"
                ? "text-gray-700 hover:bg-gray-100"
                : "text-yellow-400 hover:bg-gray-700"
            }`}
          >
            {theme === "light" ? (
              <Moon className="w-5 h-5" />
            ) : (
              <Sun className="w-5 h-5" />
            )}
          </button>

          {/* User Icon */}
          {loading ? (
            <div className="w-8 h-8 rounded-full flex items-center justify-center bg-gray-200 dark:bg-gray-700">
              <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : user ? (
            <div
              className="w-8 h-8 rounded-full border cursor-pointer flex items-center justify-center bg-gray-200 dark:bg-gray-700"
              onClick={() => setShowDropdown(!showDropdown)}
            >
              <img
                src={user.photoURL}
                alt="User"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover rounded-full"
              />
            </div>
          ) : (
            <User
              className="w-6 h-6 text-gray-800 dark:text-white cursor-pointer"
              onClick={() => navigate("/signIn")}
            />
          )}

          {/* Menu Icon */}
          <button
            onClick={() => setMenuOpen(true)}
            className="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition"
          >
            <Menu className="w-6 h-6 text-white" />
          </button>
        </div>
      </div>

      {/*  Mobile-only dropdown */}
      {isMobile && showDropdown && user && !menuOpen && (
        <div className="absolute right-4 top-16 bg-white dark:bg-gray-800 shadow-lg rounded-md p-3 w-32 z-50">
          <p className="text-sm text-center font-semibold text-gray-700 dark:text-gray-100 mb-2">
            {user.displayName || "User"}
          </p>
          <button
            onClick={handleLogout}
            className="w-full bg-blue-600 text-white py-1 rounded hover:bg-blue-700 transition"
          >
            Logout
          </button>
        </div>
      )}

      {/* Mobile Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-72 bg-white dark:bg-gray-900 shadow-lg z-[100] transform transition-transform duration-300 ease-in-out ${
          menuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between px-4 py-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2">
            {user ? (
              <img
                src={user.photoURL}
                alt="User"
                referrerPolicy="no-referrer"
                className="w-8 h-8 rounded-full"
              />
            ) : (
              <Link to="/signIn">
                <User className="w-6 h-6 text-white" />
              </Link>
            )}
            <button
              onClick={toggleTheme}
              className={`p-2 rounded transition ${
                theme === "light"
                  ? "text-gray-700 hover:bg-gray-100"
                  : "text-yellow-400 hover:bg-gray-700"
              }`}
            >
              {theme === "light" ? <Moon /> : <Sun />}
            </button>
          </div>
          <button
            onClick={() => setMenuOpen(false)}
            className="p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition"
          >
            <X className="w-6 h-6 text-white" />
          </button>
        </div>

        <ul className="flex flex-col gap-4 mt-6 px-4 text-gray-800 dark:text-gray-200 font-medium">
          <li>
            <Link
              to="/"
              onClick={() => setMenuOpen(false)}
              className="block px-3 py-2 rounded hover:bg-blue-600 transition"
            >
              Home
            </Link>
          </li>
          <li>
            <Link
              to="/allJobs"
              onClick={() => setMenuOpen(false)}
              className="block px-3 py-2 rounded hover:bg-blue-600 transition"
            >
              All Jobs
            </Link>
          </li>

          {user ? (
            <>
              <li>
                <Link
                  to="/add-job"
                  onClick={() => setMenuOpen(false)}
                  className="block px-3 py-2 rounded hover:bg-blue-600 transition"
                >
                  Add Job
                </Link>
              </li>
              <li>
                <Link
                  to="/my-posted-job"
                  onClick={() => setMenuOpen(false)}
                  className="block px-3 py-2 rounded hover:bg-blue-600 transition"
                >
                  My Posted Jobs
                </Link>
              </li>
              <li>
                <Link
                  to="/my-bids"
                  onClick={() => setMenuOpen(false)}
                  className="block px-3 py-2 rounded hover:bg-blue-600 transition"
                >
                  My Bids
                </Link>
              </li>
              <li>
                <Link
                  to="/bids-request"
                  onClick={() => setMenuOpen(false)}
                  className="block px-3 py-2 rounded hover:bg-blue-600 transition"
                >
                  Bid Requests
                </Link>
              </li>
              <li className="mt-2">
                <button
                  onClick={() => {
                    handleLogout();
                    setMenuOpen(false);
                  }}
                  className="w-full bg-blue-600 text-white text-center py-2 rounded hover:bg-blue-700 transition"
                >
                  Logout
                </button>
              </li>
            </>
          ) : (
            <li>
              <Link
                to="/signIn"
                onClick={() => setMenuOpen(false)}
                className="block px-3 py-2 rounded hover:bg-blue-600 transition"
              >
                Login
              </Link>
            </li>
          )}
        </ul>
      </div>

      {menuOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-[99]"
          onClick={() => setMenuOpen(false)}
        ></div>
      )}
    </nav>
  );
};

export default Navbar;
