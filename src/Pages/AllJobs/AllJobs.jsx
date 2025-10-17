import axios from "axios";
import { useEffect, useState } from "react";
import Jobcard from "./JobCard/Jobcard";

const AllJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);

  // Filters & states
  const [category, setCategory] = useState("");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("");
  const [itemsPerPage, setItemsPerPage] = useState(6);
  const [currentPage, setCurrentPage] = useState(1);

  // Fetch data
  useEffect(() => {
    const getData = async () => {
      const { data } = await axios.get(`${import.meta.env.VITE_api}/jobs`);
      setJobs(data.data);
      setFilteredJobs(data.data);
    };
    getData();
  }, []);

  // Filter + Sort + Search
  useEffect(() => {
    let updatedJobs = [...jobs];

    if (category) {
      updatedJobs = updatedJobs.filter(
        (job) => job.catagory.toLowerCase() === category.toLowerCase()
      );
    }

    if (search) {
      updatedJobs = updatedJobs.filter((job) =>
        job.job_title.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (sort === "asc") {
      updatedJobs = updatedJobs.sort(
        (a, b) => new Date(a.deadline) - new Date(b.deadline)
      );
    } else if (sort === "dsc") {
      updatedJobs = updatedJobs.sort(
        (a, b) => new Date(b.deadline) - new Date(a.deadline)
      );
    }

    setFilteredJobs(updatedJobs);
    setCurrentPage(1);
  }, [category, search, sort, jobs]);

  // Pagination
  const totalPages = Math.ceil(filteredJobs.length / itemsPerPage);
  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentJobs = filteredJobs.slice(indexOfFirst, indexOfLast);

  const handlePrev = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handleReset = () => {
    setCategory("");
    setSearch("");
    setSort("");
    setItemsPerPage(6);
    setCurrentPage(1);
    setFilteredJobs(jobs);
  };

  return (
    <div className="container px-6 py-10 mx-auto min-h-[calc(100vh-306px)] flex flex-col justify-between">
      {/* Filters */}
      <div>
        <div className="flex flex-col md:flex-row justify-center items-center gap-5">
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="bg-gray-50 text-black border p-4 rounded-lg"
          >
            <option value="">Filter By Category</option>
            <option value="Web Development">Web Development</option>
            <option value="Graphics Design">Graphics Design</option>
            <option value="Digital Marketing">Digital Marketing</option>
          </select>

          {/* Search */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
            }}
          >
            <div className="flex p-1 overflow-hidden border rounded-lg focus-within:ring focus-within:ring-opacity-40 focus-within:border-blue-400 focus-within:ring-blue-300">
              <input
                className="px-6 py-2 text-gray-800 placeholder-gray-500 bg-white outline-none"
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Enter Job Title"
              />
              <button
                type="submit"
                className="px-4 py-3 text-sm font-medium text-gray-100 uppercase transition bg-blue-700 rounded-md hover:bg-blue-600"
              >
                Search
              </button>
            </div>
          </form>

          {/* Sort */}
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="bg-gray-50 text-black border p-4 rounded-md"
          >
            <option value="">Sort By Deadline</option>
            <option value="dsc">Descending Order</option>
            <option value="asc">Ascending Order</option>
          </select>

          {/* Reset */}
          <button
            onClick={handleReset}
            className="bg-blue-700 text-white  py-3 px-4 rounded-md hover:bg-blue-600"
          >
            Reset
          </button>
        </div>

        {/* Jobs */}
        <div className="grid grid-cols-1 gap-8 mt-8 xl:mt-16 md:grid-cols-2 lg:grid-cols-3">
          {currentJobs.map((job) => (
            <Jobcard key={job._id} job={job} />
          ))}
        </div>
      </div>

      {/*  New Pagination (Mobile Friendly) */}
      {filteredJobs.length > 0 && (
        <div className="flex flex-col items-center justify-center mt-10 gap-4">
          <div className="flex flex-wrap items-center justify-center gap-1 sm:gap-2">
            {/* Prev Button */}
            <button
              onClick={handlePrev}
              disabled={currentPage === 1}
              className={`px-3 py-1 text-sm rounded-md transition ${
                currentPage === 1
                  ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                  : "text-blue-600 hover:bg-blue-100"
              }`}
            >
              Prev
            </button>

            {/* Dynamic Page Numbers */}
            {(() => {
              const pages = [];
              const maxVisible = 4;
              let start = Math.max(1, currentPage - 2);
              let end = Math.min(totalPages, start + maxVisible - 1);

              if (end - start < maxVisible - 1) {
                start = Math.max(1, end - maxVisible + 1);
              }

              if (start > 1) {
                pages.push(
                  <button
                    key={1}
                    onClick={() => setCurrentPage(1)}
                    className={`px-3 py-1 text-sm rounded-md ${
                      currentPage === 1
                        ? "bg-blue-600 "
                        : "text-blue-600 hover:bg-blue-100"
                    }`}
                  >
                    1
                  </button>
                );
                if (start > 2) pages.push(<span key="start-dots">…</span>);
              }

              for (let i = start; i <= end; i++) {
                pages.push(
                  <button
                    key={i}
                    onClick={() => setCurrentPage(i)}
                    className={`px-3 py-1 text-sm rounded-md ${
                      currentPage === i
                        ? "bg-blue-600 "
                        : "text-blue-600 hover:bg-blue-100"
                    }`}
                  >
                    {i}
                  </button>
                );
              }

              if (end < totalPages) {
                if (end < totalPages - 1)
                  pages.push(<span key="end-dots">…</span>);
                pages.push(
                  <button
                    key={totalPages}
                    onClick={() => setCurrentPage(totalPages)}
                    className={`px-3 py-1 text-sm rounded-md ${
                      currentPage === totalPages
                        ? "bg-blue-600 "
                        : "text-blue-600 hover:bg-blue-100"
                    }`}
                  >
                    {totalPages}
                  </button>
                );
              }

              return pages;
            })()}

            {/* Next Button */}
            <button
              onClick={handleNext}
              disabled={currentPage === totalPages}
              className={`px-3 py-1 text-sm rounded-md transition ${
                currentPage === totalPages
                  ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                  : "text-blue-600 hover:bg-blue-100"
              }`}
            >
              Next
            </button>
          </div>

          {/* Jobs per page selector */}
          <div className="flex items-center gap-2">
            <span className="text-gray-700 dark:text-white text-sm">Jobs per page:</span>
            <select
              className="border bg-white text-sm text-black p-1.5 rounded-md"
              value={itemsPerPage}
              onChange={(e) => {
                setItemsPerPage(Number(e.target.value));
                setCurrentPage(1);
              }}
            >
              <option value={3}>3</option>
              <option value={6}>6</option>
              <option value={9}>9</option>
            </select>
          </div>
        </div>
      )}
    </div>
  );
};

export default AllJobs;
