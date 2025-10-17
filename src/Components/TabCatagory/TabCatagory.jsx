import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css";
import JobCard from "../JobCard/JobCard";
import { useEffect, useState } from "react";
import axios from "axios";

const TabCatagory = () => {
  const [jobs, setJobs] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [jobsPerPage, setJobsPerPage] = useState(3);

  useEffect(() => {
    const getData = async () => {
      const { data } = await axios.get(`${import.meta.env.VITE_api}/jobs`);
      setJobs(data.data);
    };
    getData();
  }, []);

  //  Pagination Logic
  const indexOfLastJob = currentPage * jobsPerPage;
  const indexOfFirstJob = indexOfLastJob - jobsPerPage;

  const filterJobs = (category) =>
    jobs.filter((j) => j.catagory?.toLowerCase() === category.toLowerCase());

  const paginate = (array) => array.slice(indexOfFirstJob, indexOfLastJob);

  // Total Pages (Dynamic)
  const totalPages = (totalJobs) => Math.ceil(totalJobs / jobsPerPage);

  // Handle Page Change
  const handlePrev = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };
  const handleNext = (total) => {
    if (currentPage < total) setCurrentPage(currentPage + 1);
  };

  return (
    <div className="mt-20 b-2">
      <div className="flex flex-col items-center justify-center gap-4 mb-16">
        <h1 className="text-4xl font-bold text-center">
          Browse Job By Category
        </h1>
        <p className="text-xl font-medium text-center w-auto md:w-[750px]">
          Browse through all the jobs currently advertised on Job Bank by
          location, category or employer. Top searched job titles.
        </p>
      </div>

      <Tabs>
        <div className="w-full border-b ">
          <TabList className="flex items-center justify-center gap-6">
            <Tab
              className="px-4 py-2 cursor-pointer focus:outline-none"
              selectedClassName="border-t border-l border-r rounded-t-md bg-background text-blue-600 font-semibold -mb-[1px]"
            >
              Web Development
            </Tab>
            <Tab
              className="px-4 py-2 cursor-pointer focus:outline-none"
              selectedClassName="border-t border-l border-r rounded-t-md bg-background text-blue-600 font-semibold -mb-[1px]"
            >
              Graphics Design
            </Tab>
            <Tab
              className="px-4 py-2 cursor-pointer focus:outline-none"
              selectedClassName="border-t border-l border-r rounded-t-md bg-background text-blue-600 font-semibold -mb-[1px]"
            >
              Digital Marketing
            </Tab>
          </TabList>
        </div>

        {/*  Tab Panels */}
        <div className="mt-8">
          {["Web Development", "Graphics Design", "Digital Marketing"].map(
            (category, index) => {
              const filtered = filterJobs(category);
              const pagedJobs = paginate(filtered);
              const total = totalPages(filtered.length);

              return (
                <TabPanel key={index}>
                  {/* Job Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {pagedJobs.map((job) => (
                      <div key={job._id} className="flex justify-center w-full">
                        <JobCard job={job} className="w-full md:w-auto" />
                      </div>
                    ))}
                  </div>

                  {/* Pagination Controls */}
                  {filtered.length > 0 && (
                    <div className="flex flex-col items-center justify-center mt-8 gap-4">
                      {/* Pagination Buttons */}
                      <div className="flex flex-wrap items-center justify-center gap-1 sm:gap-2">
                        {/* Prev Button */}
                        <button
                          onClick={handlePrev}
                          disabled={currentPage === 1}
                          className={`px-3 py-1 text-sm rounded-md transition ${
                            currentPage === 1
                              ? "bg-gray-200  cursor-not-allowed"
                              : "text-blue-600 hover:bg-blue-100"
                          }`}
                        >
                          Prev
                        </button>

                        {/* Dynamic Page Numbers */}
                        {(() => {
                          const pages = [];
                          const totalPageCount = total;
                          const maxVisible = 4;

                          let start = Math.max(1, currentPage - 2);
                          let end = Math.min(
                            totalPageCount,
                            start + maxVisible - 1
                          );

                          if (end - start < maxVisible - 1) {
                            start = Math.max(1, end - maxVisible + 1);
                          }

                          // First page
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

                            if (start > 2) {
                              pages.push(<span key="start-dots">.....</span>);
                            }
                          }

                          // Middle pages
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

                          // Last page
                          if (end < totalPageCount) {
                            if (end < totalPageCount - 1) {
                              pages.push(<span key="end-dots">.....</span>);
                            }

                            pages.push(
                              <button
                                key={totalPageCount}
                                onClick={() => setCurrentPage(totalPageCount)}
                                className={`px-3 py-1 text-sm rounded-md ${
                                  currentPage === totalPageCount
                                    ? "bg-blue-600 "
                                    : "text-blue-600 hover:bg-blue-100"
                                }`}
                              >
                                {totalPageCount}
                              </button>
                            );
                          }

                          return pages;
                        })()}

                        {/* Next Button */}
                        <button
                          onClick={() => handleNext(total)}
                          disabled={currentPage === total}
                          className={`px-3 py-1 text-sm rounded-md transition ${
                            currentPage === total
                              ? "bg-gray-200 text-gray-700 cursor-not-allowed"
                              : "text-blue-700 hover:bg-blue-100"
                          }`}
                        >
                          Next
                        </button>
                      </div>

                      {/* Jobs per page selector */}
                      <div className="flex items-center gap-2">
                        <span className=" text-sm">
                          Jobs per page:
                        </span>
                        <select
                          className="border bg-white text-sm text-white dark:text-black p-1.5 rounded-md"
                          value={jobsPerPage}
                          onChange={(e) => {
                            setJobsPerPage(Number(e.target.value));
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
                </TabPanel>
              );
            }
          )}
        </div>
      </Tabs>
    </div>
  );
};

export default TabCatagory;
