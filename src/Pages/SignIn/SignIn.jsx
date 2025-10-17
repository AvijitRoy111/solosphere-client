import { Link, useLocation, useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { useContext, useState } from "react";
import { AuthContext } from "../../Components/AuthProvider/AuthProvider";
import toast from "react-hot-toast";
import axios from "axios";

const SignIn = () => {
  const [showPassword, setShowPassword] = useState(false);
  const { signInWithGoogle, signIn } = useContext(AuthContext);
  const location = useLocation();
  const from = location.state || "/";
  const navigate = useNavigate();

  // sign in with google.............
  const handleSignInWithGoogle = async () => {
    try {
      const result = await signInWithGoogle();
      if (!result?.user?.email) {
        toast.error("No email found in Google account");
        return;
      }

      const { data } = await axios.post(
        `${import.meta.env.VITE_api}/jwt`,
        { email: result.user.email },
        { withCredentials: true }
      );
      toast.success("User SignIn Successful");
      navigate("/");
    } catch (error) {
      toast.error(error.message);
    }
  };

  // sign in with google and password........
  const signInWithEmailAndPassword = async (e) => {
    e.preventDefault();
    const form = e.target;
    const email = form.email.value;
    const password = form.password.value;
    console.log(email, password);

    // user login............
    try {
      const result = await signIn(email, password);
      if (!result?.user?.email) {
        toast.error("No email found in Google account");
        return;
      }
      const { data } = await axios.post(
        `${import.meta.env.VITE_api}/jwt`,
        { email: result.user.email },
        { withCredentials: true }
      );
      navigate(from);
      toast.success("User SignIn Successfull");
    } catch (error) {
      toast.error(error?.message);
    }
  };

  return (
    <div className=" flex justify-center pt-20 items-center py-12 px-4 md:px-6  duration-300">
      <div className="flex w-full max-w-sm mx-auto overflow-hidden bg-white dark:bg-gray-800 rounded-2xl shadow-2xl lg:max-w-4xl  duration-300">
        {/* Left Image */}
        <div
          className="hidden bg-cover bg-center lg:block lg:w-1/2"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1606660265514-358ebbadc80d?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1575&q=80')`,
          }}
        ></div>

        {/* Right Form */}
        <div className="w-full px-6 py-8 md:px-8 lg:w-1/2">
          {/* Logo */}
          <div className="flex justify-center mx-auto">
            <img
              className="w-auto h-8 sm:h-10"
              src="https://merakiui.com/images/logo.svg"
              alt="Logo"
            />
          </div>

          <p className="mt-3 text-xl font-semibold text-center text-gray-700 dark:text-gray-200">
            Welcome back!
          </p>

          {/* Google Sign-In */}
          <div
            onClick={handleSignInWithGoogle}
            className="flex cursor-pointer items-center justify-center mt-4 text-gray-700 dark:text-gray-200 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700  duration-300"
          >
            <div className="px-4 py-2">
              <svg className="w-6 h-6" viewBox="0 0 40 40">
                <path
                  d="M36.3425 16.7358H35V16.6667H20V23.3333H29.4192C28.045 27.2142 24.3525 30 20 30C14.4775 30 10 25.5225 10 20C10 14.4775 14.4775 9.99999 20 9.99999C22.5492 9.99999 24.8683 10.9617 26.6342 12.5325L31.3483 7.81833C28.3717 5.04416 24.39 3.33333 20 3.33333C10.7958 3.33333 3.33335 10.7958 3.33335 20C3.33335 29.2042 10.7958 36.6667 20 36.6667C29.2042 36.6667 36.6667 29.2042 36.6667 20C36.6667 18.8825 36.5517 17.7917 36.3425 16.7358Z"
                  fill="#FFC107"
                />
                <path
                  d="M5.25497 12.2425L10.7308 16.2583C12.2125 12.59 15.8008 9.99999 20 9.99999C22.5491 9.99999 24.8683 10.9617 26.6341 12.5325L31.3483 7.81833C28.3716 5.04416 24.39 3.33333 20 3.33333C13.5983 3.33333 8.04663 6.94749 5.25497 12.2425Z"
                  fill="#FF3D00"
                />
                <path
                  d="M20 36.6667C24.305 36.6667 28.2167 35.0192 31.1742 32.34L26.0159 27.975C24.3425 29.2425 22.2625 30 20 30C15.665 30 11.9842 27.2359 10.5975 23.3784L5.16254 27.5659C7.92087 32.9634 13.5225 36.6667 20 36.6667Z"
                  fill="#4CAF50"
                />
                <path
                  d="M36.3425 16.7358H35V16.6667H20V23.3333H29.4192C28.7592 25.1975 27.56 26.805 26.0133 27.9758C26.0142 27.975 26.015 27.975 26.0158 27.9742L31.1742 32.3392C30.8092 32.6708 36.6667 28.3333 36.6667 20C36.6667 18.8825 36.5517 17.7917 36.3425 16.7358Z"
                  fill="#1976D2"
                />
              </svg>
            </div>
            <span className="w-5/6 px-4 py-3 font-bold text-center">
              Sign in with Google
            </span>
          </div>

          {/* Divider */}
          <div className="flex items-center justify-between mt-6">
            <span className="w-1/5 border-b border-gray-300 dark:border-gray-500 lg:w-1/4"></span>
            <div className="text-xs text-center text-gray-500 dark:text-gray-400 uppercase hover:underline">
              or login with email
            </div>
            <span className="w-1/5 border-b border-gray-300 dark:border-gray-500 lg:w-1/4"></span>
          </div>

          {/* Email/Password Form */}
          <form onSubmit={signInWithEmailAndPassword}>
            <div className="mt-4">
              <label
                htmlFor="LoggingEmailAddress"
                className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Email Address
              </label>
              <input
                id="LoggingEmailAddress"
                name="email"
                type="email"
                autoComplete="email"
                className="block w-full px-4 py-2  bg-gray-300 border border-gray-300 dark:border-gray-600 rounded-lg focus:border-blue-400 focus:ring focus:ring-blue-300 focus:ring-opacity-40 focus:outline-none  duration-300"
              />
            </div>

            <div className="mt-4 relative">
              <label
                htmlFor="loggingPassword"
                className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Password
              </label>
              <input
                id="loggingPassword"
                name="password"
                type={showPassword ? "password" : "text"}
                autoComplete="current-password"
                className="block w-full px-4 py-2   bg-gray-300    border border-gray-300 dark:border-gray-600 rounded-lg focus:border-blue-400 focus:ring focus:ring-blue-300 focus:ring-opacity-40 focus:outline-none  duration-300"
              />
              <span
                className="absolute bottom-2 right-3"
                onClick={() => {
                  setShowPassword(!showPassword);
                }}
              >
                {showPassword ? <EyeOff /> : <Eye />}
              </span>
            </div>

            <div className="mt-6">
              <button className="w-full px-6 py-3 text-sm font-medium tracking-wide  capitalize  duration-300 transform bg-gray-800 dark:bg-gray-700 rounded-lg hover:bg-gray-700 dark:hover:bg-gray-600 focus:outline-none focus:ring focus:ring-gray-300 focus:ring-opacity-50">
                Sign In
              </button>
            </div>
          </form>

          {/* Sign up link */}
          <div className="flex items-center justify-between mt-4">
            <span className="w-1/5 border border-white md:w-1/4"></span>
            <Link
              to="/signUp"
              className="text-xs text-blue-700  uppercase hover:underline"
            >
              or sign up
            </Link>
            <span className="w-1/5 border border-white md:w-1/4"></span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
