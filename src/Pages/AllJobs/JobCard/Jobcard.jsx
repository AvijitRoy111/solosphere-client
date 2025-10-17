import { Link } from "react-router-dom";


const Jobcard = ({job}) => {
     const {_id, job_title, catagory, deadline, description, min_price, max_price} =job;
     return (
           <Link to={`/jobDetails/${_id}`} className='w-full max-w-sm px-4 py-3 bg-white rounded-md shadow-md hover:scale-[1.05] transition-all'>
      <div className='flex items-center justify-between'>
        <span className='text-xs font-light text-gray-800 '>
          Deadline: {new Date(deadline).toLocaleDateString()}
        </span>
        <span className='px-3 text-[8px] text-white py-2 uppercase bg-blue-800 rounded-full '>
          {catagory}
        </span>
      </div>

      <div>
        <h1 className='mt-2 text-lg font-semibold text-gray-800 '>
          {job_title}
        </h1>

        <p className='mt-2 text-sm text-gray-600 '>
          {description}
        </p>
        <p className='mt-2 text-sm font-bold text-gray-600 '>
          Range: ${min_price} - ${max_price}
        </p>
      </div>
    </Link>
     );
};

export default Jobcard;