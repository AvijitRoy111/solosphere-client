import { useContext, useState } from "react";
import { useLoaderData } from "react-router-dom";
import { AuthContext } from "../../Components/AuthProvider/AuthProvider";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import axios from "axios";
import toast from "react-hot-toast";

const JobDetails = () => {

  const { user } = useContext(AuthContext);
  const job = useLoaderData();
  console.log(job.data);
  const [startDate, setStartDate] = useState(new Date());
  const [isModalOpen, setIsModalOpen] = useState(false);

  const {
    _id,
    buyer,
    job_title,
    catagory,
    deadline,
    description,
    min_price,
    max_price,
  } = job.data;

  const handleFormSunmit = async (e) => {
    e.preventDefault();
    const form = e.target;
    const jobId = _id;
    const price = parseFloat(form.price.value);
    const email = form.email.value;
    const description = form.comment.value;
    const deadline = startDate;
    const status = "pending";

    // Validation ...............
    if (isNaN(price) || price <= 0) {
      toast.error("Please enter a valid price!");
      return;
    }

    if (price < min_price) {
      toast.error(`Price must be at least ${min_price}`);
      return;
    }

    if (price > max_price) {
      toast.error(`Price cannot be more than ${max_price}`);
      return;
    }

    if (!email) {
      toast.error("Email is required!");
      return;
    }

    if (user?.email === buyer?.email) {
      toast.error("You cannot bid on your own job!");
      return;
    }

    const bidData = {
      jobId,
      name: user?.displayName,
      price,
      email,
      description,
      job_title,
      buyer: {
        buyer_email: buyer?.email,
      },
      catagory,
      deadline,
      status,
    };

    try {
      const { data } = await axios.post(
        `${import.meta.env.VITE_api}/bids`,
        bidData
      );
      if (data.data.insertedId) {
        setIsModalOpen(true);
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <div className="relative flex flex-col px-4 md:px-10  md:flex-row justify-around gap-5 items-center min-h-[calc(100vh-306px)] md:max-w-screen-xl mx-auto mt-10">
      {/* Job Details */}
      <div className="flex-1 px-6 py-7 bg-white rounded-md shadow-md md:min-h-[350px]">
        <div className="flex items-center justify-between">
          <span className="text-sm font-light text-gray-800 ">
            Deadline: {deadline}
          </span>
          <span className="px-4 py-1 text-xs text-white font-bold uppercase bg-blue-700 rounded-full ">
            {catagory}
          </span>
        </div>

        <div>
          <h1 className="mt-2 text-3xl font-semibold text-gray-800 ">
            {job_title}
          </h1>

          <p className="mt-2 text-lg text-gray-600 ">
            {description?.slice(0, 200)}
          </p>
          <p className="mt-6 text-sm font-bold text-gray-600 ">
            Buyer Details:
          </p>
          <div className="flex items-center gap-5">
            <div>
              <p className="mt-2 text-sm text-gray-600 ">
                Name: {buyer?.name.slice(0, 5).toUpperCase()}
              </p>
              <p className="mt-2 text-sm text-gray-600 ">
                Email: {buyer?.email}
              </p>
            </div>
            <div className="rounded-full object-cover overflow-hidden w-14 h-14">
              <img src={buyer?.photo} alt="" />
            </div>
          </div>
          <p className="mt-6 text-lg font-bold text-gray-600 ">
            Range: ${min_price} - ${max_price}
          </p>
        </div>
      </div>

      {/* Place A Bid Form */}
      <section className="p-6 w-full bg-white rounded-md shadow-md py-8 flex-1 md:min-h-[350px]">
        <h2 className="text-lg font-semibold text-gray-700 capitalize ">
          Place A Bid
        </h2>

        <form onSubmit={handleFormSunmit}>
          <div className="grid grid-cols-1 gap-6 mt-4 sm:grid-cols-2">
            <div>
              <label className="text-gray-700" htmlFor="price">
                Price
              </label>
              <input
                id="price"
                name="price"
                type="number"
                className="w-full px-4 py-2 mt-2 bg-white  border border-gray-300 rounded-md 
        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white focus:"
              />
            </div>

            <div>
              <label className="text-gray-700" htmlFor="emailAddress">
                Email Address
              </label>
              <input
                id="emailAddress"
                name="email"
                type="email"
                readOnly
                defaultValue={user?.email}
                className="w-full px-4 py-2 mt-2 bg-white  border border-gray-300 rounded-md 
        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white focus:"
              />
            </div>

            <div>
              <label className="text-gray-700" htmlFor="comment">
                Comment
              </label>
              <input
                id="comment"
                name="comment"
                type="text"
                placeholder="Write your comment..."
                className="w-full px-4 py-2 mt-2 bg-white  border border-gray-300 rounded-md 
        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white focus:"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-gray-700">Deadline</label>
              <DatePicker
                className="bg-white  px-6 py-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                selected={startDate}
                onChange={(date) => setStartDate(date)}
              />
            </div>
          </div>

          <div className="flex justify-end mt-6">
            <button
              type="submit"
              className="px-8 py-2.5 leading-5 text-white  duration-300 transform bg-gray-700 rounded-md hover:bg-gray-600 focus:outline-none focus:bg-gray-600"
            >
              Place Bid
            </button>
          </div>
        </form>
      </section>

      {/* Success Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg shadow-lg p-8 w-[350px] h-[300px] text-center border-2 border-green-600">
            {/* Success Icon with rounded border */}
            <div className="flex justify-center mb-4">
              <div className="w-20 h-20 flex items-center justify-center rounded-full border-4 border-green-600">
                <svg
                  className="w-10 h-10 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
            </div>

            {/* Text */}
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              Your job data added successfully!
            </h2>

            {/* Close Button */}
            <button
              onClick={() => setIsModalOpen(false)}
              className="mt-6 px-6 py-2 text-white bg-blue-600  rounded-md hover:bg-blue-700 transition"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default JobDetails;
