import { useLoaderData } from "react-router-dom";
import TabCatagory from "../../Components/TabCatagory/TabCatagory";
import SweiperSlider from "./SweiperSlider";

const Home = () => {
  return (
    <div className="w-full pt-2 px-4  md:px-12 lg:px-20">
      <SweiperSlider></SweiperSlider>
      <section id="tab-category" className="mt-10">
        <TabCatagory/>
      </section>
    </div>
  );
};

export default Home;
