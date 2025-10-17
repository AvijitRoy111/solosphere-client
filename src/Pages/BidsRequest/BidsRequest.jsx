import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../Components/AuthProvider/AuthProvider";
import {
  Check,
  CheckCheck,
  CheckCheckIcon,
  ClipboardMinus,
  OctagonX,
  SquareX,
  Trash,
  X,
} from "lucide-react";

const BidsRequest = () => {
  const { user } = useContext(AuthContext);
  const [bidRequest, setBidRequest] = useState([]);
  const [modal, setModal] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [bidsPerPage, setBidsPerPage] = useState(5);

  useEffect(() => {
    if (!user?.email) return;
    const getData = async () => {
      const { data } = await axios.get(
        `${import.meta.env.VITE_api}/bids/bids-request/${user?.email}`
      );
      setBidRequest(data.data);
    };
    getData();
  }, [user]);

  // Pagination logic
  const totalPages = Math.ceil(bidRequest.length / bidsPerPage);
  const startIndex = (currentPage - 1) * bidsPerPage;
  const currentBids = bidRequest.slice(startIndex, startIndex + bidsPerPage);

  const handlePageChange = (page) => setCurrentPage(page);
  const handleNext = () =>
    currentPage < totalPages && setCurrentPage(currentPage + 1);
  const handlePrev = () => currentPage > 1 && setCurrentPage(currentPage - 1);

  // Handle Accept
  const handleAccept = async (bid) => {
    if (bid.status === "In Progress" || bid?.status?.status === "In Progress") {
      setModal({
        type: "failed",
        message: "This bid is already marked as In Progress",
        bidId: bid._id,
      });
      return;
    }

    try {
      const { data } = await axios.patch(
        `${import.meta.env.VITE_api}/bids/${bid._id}`,
        { status: "In Progress" }
      );

      if (data.success) {
        setModal({
          type: "success",
          message: "Bid updated to In Progress successfully!",
          bidId: bid._id,
        });
      }
    } catch (error) {
      console.error(error.message);
    }
  };

  //Handle Reject
  const handleReject = async (bid) => {
    if (bid.status === "Rejected" || bid?.status?.status === "Rejected") {
      setModal({
        type: "failed",
        message: "This bid is already rejected",
        bidId: bid._id,
      });
      return;
    }

    try {
      const { data } = await axios.patch(
        `${import.meta.env.VITE_api}/bids/${bid._id}`,
        { status: "Rejected" }
      );

      if (data.success) {
        setModal({
          type: "reject",
          message: "Bid rejected successfully!",
          bidId: bid._id,
        });
      }
    } catch (error) {
      console.error(error.message);
    }
  };

  // Handle Delete
  const handleDelete = (bid) => {
    setModal({
      type: "deleteConfirm",
      message: `Are you sure you want to delete "${bid.job_title}"?`,
      bidId: bid._id,
    });
  };

  //  Confirm Delete
  const confirmDelete = async () => {
    try {
      const { data } = await axios.delete(
        `${import.meta.env.VITE_api}/bids/request/${modal.bidId}`
      );

      if (data.success) {
        setBidRequest((prev) => prev.filter((b) => b._id !== modal.bidId));
        setModal({
          type: "deleteSuccess",
          message: "Bid deleted successfully!",
        });
      }
    } catch (error) {
      console.error("Delete failed:", error.message);
    }
  };

  //  Close Modal and Update UI
  const closeModal = () => {
    if (modal?.type === "success") {
      setBidRequest((prev) =>
        prev.map((bid) =>
          bid._id === modal.bidId ? { ...bid, status: "In Progress" } : bid
        )
      );
    }
    if (modal?.type === "reject") {
      setBidRequest((prev) =>
        prev.map((bid) =>
          bid._id === modal.bidId ? { ...bid, status: "Rejected" } : bid
        )
      );
    }
    setModal(null);
  };

  // Pagination buttons generator
  const renderPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (currentPage <= 3) {
        pages.push(1, 2, 3, 4, "...", totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(
          1,
          "...",
          totalPages - 3,
          totalPages - 2,
          totalPages - 1,
          totalPages
        );
      } else {
        pages.push(
          1,
          "...",
          currentPage - 1,
          currentPage,
          currentPage + 1,
          "...",
          totalPages
        );
      }
    }

    return pages.map((num, i) =>
      num === "..." ? (
        <span key={i} className="px-3 py-1 text-gray-500">
          ...
        </span>
      ) : (
        <button
          key={num}
          onClick={() => handlePageChange(num)}
          className={`px-3 py-1 rounded-md text-sm font-medium ${
            currentPage === num
              ? "bg-blue-600 "
              : "bg-gray-200 text-gray-800 hover:bg-gray-300"
          }`}
        >
          {num}
        </button>
      )
    );
  };

  return (
    <section className="container px-4 mx-auto pt-12">
      <div className="flex items-center gap-x-3">
        <h2 className="text-lg font-medium  ">Bid Requests</h2>
        <span className="px-3 py-2 text-base text-white bg-blue-600 rounded-full ">
          {bidRequest.length} Requests
        </span>
      </div>

      <div className="flex flex-col mt-6">
        <div className="overflow-hidden border border-gray-200 md:rounded-lg">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="py-3.5 px-4 text-sm text-gray-500">Title</th>
                <th className="py-3.5 px-4 text-sm text-gray-500">Email</th>
                <th className="py-3.5 px-4 text-sm text-gray-500">Deadline</th>
                <th className="py-3.5 px-4 text-sm text-gray-500">Price</th>
                <th className="py-3.5 px-4 text-sm text-gray-500">Category</th>
                <th className="py-3.5 px-4 text-sm text-gray-500">Status</th>
                <th className="py-3.5 px-4 text-sm text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentBids.map((bid) => (
                <tr key={bid._id}>
                  <td className="px-4 py-4 text-sm text-gray-500">
                    {bid.job_title}
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-500">
                    {bid.buyer_email}
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-500">
                    {new Date(bid.deadline).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-500">
                    {bid.price}
                  </td>
                  <td className="px-2 py-4 text-sm">
                    <p className="text-center px-1 py-1 rounded-full text-white bg-blue-600 text-xs">
                      {bid.catagory}
                    </p>
                  </td>
                  <td className="px-4 py-4 text-sm font-medium">
                    {bid.status === "In Progress" ? (
                      <div className="inline-flex items-center px-3 py-1 rounded-full gap-x-2 bg-green-100/60 text-green-500">
                        <span className="h-1.5 w-1.5 rounded-full bg-green-500"></span>
                        <h2 className="text-sm font-normal">In Progress</h2>
                      </div>
                    ) : bid.status === "Rejected" ? (
                      <div className="inline-flex items-center px-3 py-1 rounded-full gap-x-2 bg-red-100/60 text-red-600">
                        <span className="h-1.5 w-1.5 rounded-full bg-red-600"></span>
                        <h2 className="text-sm font-normal">Rejected</h2>
                      </div>
                    ) : (
                      <div className="inline-flex items-center px-3 py-1 rounded-full gap-x-2 bg-yellow-100/60 text-yellow-600">
                        <span className="h-1.5 w-1.5 rounded-full bg-yellow-600"></span>
                        <h2 className="text-sm font-normal ">Pending</h2>
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-4 text-sm">
                    <div className="flex items-center gap-x-6">
                      <button
                        onClick={() => handleAccept(bid)}
                        title="Mark as In Progress"
                      >
                        <span className="text-xl font-bold text-green-600">
                          {" "}
                          <CheckCheck />
                        </span>
                      </button>
                      <button
                        onClick={() => handleReject(bid)}
                        title="Reject Bid"
                      >
                        <span className="text-xl font-bold text-red-600">
                          <SquareX />
                        </span>
                      </button>
                      <button
                        onClick={() => handleDelete(bid)}
                        title="Delete Bid"
                      >
                        <span className="text-xl font-bold text-red-600">
                          <Trash />
                        </span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {bidRequest.length > bidsPerPage && (
          <div className="flex flex-col md:flex-row items-center justify-center mt-8 gap-4">
            <div className="flex items-center gap-2 flex-wrap justify-center">
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

              {renderPageNumbers()}

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

            <div className="flex items-center gap-2">
              <span className="text-sm ">Per Page:</span>
              <select
                className="border bg-white p-2 text-black rounded-md"
                value={bidsPerPage}
                onChange={(e) => {
                  setBidsPerPage(Number(e.target.value));
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

      {/* MODALS */}
      {modal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl text-center w-96">
            {modal.type === "deleteConfirm" && (
              <div className="flex flex-col items-center justify-center text-center ">
                {/* Icon Section */}
                <div className="flex items-center justify-center bg-red-600 text-white w-24 h-24 rounded-full mb-2">
                  <ClipboardMinus size={60} />
                </div>

                {/* Message */}
                <h3 className="text-lg font-semibold mb-2">{modal.message}</h3>

                {/* Buttons */}
                <div className="flex justify-center gap-4 mt-4">
                  <button
                    onClick={confirmDelete}
                    className="px-6 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition"
                  >
                    Confirm
                  </button>
                  <button
                    onClick={closeModal}
                    className="px-6 py-2 bg-gray-300 rounded-md hover:bg-gray-400 transition"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

            {/* Other modal types */}
            {["deleteSuccess", "success", "reject", "failed"].includes(
              modal.type
            ) && (
              <div className="flex flex-col items-center justify-center text-center ">
                {/* Icon */}
                <div
                  className={`flex items-center justify-center w-24 h-24 rounded-full mb-4 ${
                    modal.type === "success" || modal.type === "deleteSuccess"
                      ? "bg-green-100 text-green-500"
                      : modal.type === "reject"
                      ? "bg-red-100 text-red-500"
                      : "bg-yellow-100 text-yellow-500"
                  }`}
                >
                  {modal.type === "success" ||
                  modal.type === "deleteSuccess" ? (
                    <CheckCheck size={60} />
                  ) : modal.type === "reject" ? (
                    <X size={60}/>
                  ) : (
                    <OctagonX  size={60}/>
                  )}
                </div>

                {/* Message */}
                <h3 className="text-lg font-semibold mb-2">{modal.message}</h3>

                {/* Close Button */}
                <button
                  onClick={closeModal}
                  className={`mt-4 px-6 py-2 rounded-md transition ${
                    modal.type === "success" || modal.type === "deleteSuccess"
                      ? "bg-green-600 hover:bg-green-700 text-white"
                      : modal.type === "reject"
                      ? "bg-red-500 hover:bg-red-600 text-white"
                      : "bg-yellow-500 hover:bg-yellow-600 text-white"
                  }`}
                >
                  Close
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
};

export default BidsRequest;
