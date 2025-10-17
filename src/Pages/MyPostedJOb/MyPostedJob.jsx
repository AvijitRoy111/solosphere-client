import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../Components/AuthProvider/AuthProvider";
import axios from "axios";
import { CheckCheck, ClipboardMinus, FilePenLine, Trash } from "lucide-react";
import { Link } from "react-router-dom";

const MyPostedJob = () => {
  const { user } = useContext(AuthContext);
  const [jobs, setJobs] = useState([]);
  const [showConfirm, setShowConfirm] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  // pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [jobsPerPage, setJobsPerPage] = useState(5);

  useEffect(() => {
    if (user?.email) getData();
  }, [user]);

  const getData = async () => {
    const { data } = await axios.get(
      `${import.meta.env.VITE_api}/jobs/email/${user?.email}`
    );
    setJobs(data.data);
  };

  // Pagination logic
  const totalPages = Math.ceil(jobs.length / jobsPerPage);
  const indexOfLastJob = currentPage * jobsPerPage;
  const indexOfFirstJob = indexOfLastJob - jobsPerPage;
  const currentJobs = jobs.slice(indexOfFirstJob, indexOfLastJob);

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handlePrev = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handlePageClick = (page) => setCurrentPage(page);

  // delete handler
  const handleDelete = async () => {
    try {
      const { data } = await axios.delete(
        `${import.meta.env.VITE_api}/jobs/${selectedId}`
      );

      if (data.data.deletedCount > 0) {
        setJobs((prev) => prev.filter((job) => job._id !== selectedId));
        setShowConfirm(false);
        setShowSuccess(true);
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  // pagination range
  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxVisible = 3;

    let start = Math.max(1, currentPage - 1);
    let end = Math.min(totalPages, start + maxVisible - 1);

    if (end - start + 1 < maxVisible) {
      start = Math.max(1, end - maxVisible + 1);
    }

    for (let i = start; i <= end; i++) {
      pageNumbers.push(i);
    }

    return pageNumbers;
  };

  return (
    <section className="container px-4 mx-auto pt-12">
      <div className="flex items-center gap-x-3">
        <h2 className="text-lg font-medium  ">My Posted Jobs</h2>
        <span className="px-3 py-2 text-base font-bold  text-white bg-blue-600 rounded-full">
          {jobs.length} Jobs
        </span>
      </div>

      <div className="flex flex-col mt-6">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
            <div className="overflow-hidden border border-gray-200 md:rounded-lg">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="py-3.5 px-4 text-sm text-gray-500 text-left">
                      Title
                    </th>
                    <th className="py-3.5 px-4 text-sm text-gray-500 text-left">
                      Deadline
                    </th>
                    <th className="py-3.5 px-4 text-sm text-gray-500 text-left">
                      Price Range
                    </th>
                    <th className="py-3.5 px-4 text-sm text-gray-500 text-left">
                      Category
                    </th>
                    <th className="py-3.5 px-4 text-sm text-gray-500 text-left">
                      Description
                    </th>
                    <th className="py-3.5 px-4 text-sm text-gray-500 text-left">
                      Edit
                    </th>
                  </tr>
                </thead>

                <tbody className="relative bg-white divide-y divide-gray-200">
                  {currentJobs.map((job) => (
                    <tr key={job._id}>
                      <td className="px-4 py-4 text-sm text-gray-500 whitespace-nowrap">
                        {job.job_title}
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-500 whitespace-nowrap">
                        {new Date(job.deadline).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-500 whitespace-nowrap">
                        ${job.min_price}-{job.max_price}
                      </td>
                      <td className="px-4 py-4 text-sm whitespace-nowrap">
                        <span className="px-3 py-1 rounded-full text-white bg-blue-600 text-xs">
                          {job.catagory}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-500 whitespace-nowrap">
                        {job.description.slice(0, 50)}
                      </td>
                      <td className="px-4 py-4 text-sm whitespace-nowrap">
                        <div className="flex items-center gap-x-6">
                          <button
                            onClick={() => {
                              setSelectedId(job._id);
                              setShowConfirm(true);
                            }}
                            className="text-red-500  hover:text-red-600 transition"
                          >
                            <ClipboardMinus size={25} />
                          </button>
                          <Link to={`/updateJob/${job._id}`}>
                            <button className="text-gray-500 hover:text-yellow-500 transition">
                              <FilePenLine />
                            </button>
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination Section */}
            {jobs.length > 0 && (
              <div className="flex flex-col md:flex-row items-center justify-center mt-8 gap-4">
                <div className="flex items-center gap-2">
                  <button
                    onClick={handlePrev}
                    disabled={currentPage === 1}
                    className={`px-4 py-2 rounded-md ${
                      currentPage === 1
                        ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                        : "bg-blue-600  hover:bg-blue-500"
                    }`}
                  >
                    Prev
                  </button>

                  {/* Page Numbers */}
                  <div className="flex items-center gap-2">
                    {getPageNumbers().map((page) => (
                      <button
                        key={page}
                        onClick={() => handlePageClick(page)}
                        className={`px-3 py-1 rounded-md ${
                          currentPage === page
                            ? "bg-blue-600 "
                            : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                        }`}
                      >
                        {page}
                      </button>
                    ))}

                    {totalPages > 3 && currentPage < totalPages - 1 && (
                      <span className="text-gray-500">...</span>
                    )}
                  </div>

                  <button
                    onClick={handleNext}
                    disabled={currentPage === totalPages}
                    className={`px-4 py-2 rounded-md ${
                      currentPage === totalPages
                        ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                        : "bg-blue-600  hover:bg-blue-500"
                    }`}
                  >
                    Next
                  </button>
                </div>

                {/* Per Page Selector */}
                <div className="flex items-center gap-2">
                  <label className="text-gray-600 text-sm dark:text-white">
                    Per page:
                  </label>
                  <select
                    className="border bg-white p-2 text-black rounded-md"
                    value={jobsPerPage}
                    onChange={(e) => {
                      setJobsPerPage(Number(e.target.value));
                      setCurrentPage(1);
                    }}
                  >
                    <option value={5}>5</option>
                    <option value={10}>10</option>
                    <option value={15}>15</option>
                  </select>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Delete Modals */}
      {showConfirm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-50">
          <div className="bg-white p-8 rounded-2xl shadow-2xl text-center w-96 animate-fadeIn">
            {/* Icon */}
            <div className="flex items-center justify-center mx-auto bg-red-100 text-red-500 rounded-full w-24 h-24 mb-4">
              <Trash size={60} />
            </div>

            {/* Heading */}
            <h3 className="text-lg font-semibold mb-2 text-gray-800">
              Are you sure?
            </h3>

            {/* Message */}
            <p className="text-gray-600 mb-4">
              Do you really want to delete this job?
            </p>

            {/* Buttons */}
            <div className="flex justify-center gap-4 mt-4">
              <button
                onClick={() => setShowConfirm(false)}
                className="px-6 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-6 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {showSuccess && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-50">
          <div className="bg-white p-8 rounded-2xl shadow-2xl text-center w-96 animate-fadeIn">
            {/* Icon */}
            <div className="flex items-center justify-center mx-auto bg-green-100 text-green-500 rounded-full w-24 h-24 mb-4">
              <CheckCheck size={60} />
            </div>

            {/* Message */}
            <h3 className="text-lg font-semibold mb-4 text-gray-800">
              Job deleted successfully!
            </h3>

            {/* Button */}
            <button
              onClick={() => setShowSuccess(false)}
              className="mt-4 px-6 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </section>
  );
};

export default MyPostedJob;
