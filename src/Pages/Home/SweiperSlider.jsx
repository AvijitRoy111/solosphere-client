import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import image2 from "../../assets/images/carosul-2.jpg";
import image3 from "../../assets/images/carosul-3.jpg";
import image1 from "../../assets/images/carosul-4.jpg";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Link } from "react-router-dom";

const SweiperSlider = () => {
  const slides = [
    {
      id: 1,
      img: "https://images.unsplash.com/photo-1556761175-b413da4baf72?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1374&q=80",
      title: "Discover New Places",
      desc: "Explore the world with amazing destinations waiting for you.",
    },
    {
      id: 2,
      img: image1,
      title: "Adventure Awaits",
      desc: "Take the journey of a lifetime with unforgettable experiences.",
    },
    {
      id: 3,
      img: image2,
      title: "Relax & Enjoy",
      desc: "Find peace in beautiful landscapes around the world.",
    },
    {
      id: 4,
      img: image3,
      title: "Your Dream Vacation",
      desc: "Make memories that last forever with loved ones.",
    },
  ];

  return (
    <div className="w-full h-[500px]">
      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        navigation
        pagination={{ clickable: true }}
        autoplay={{ delay: 3000, disableOnInteraction: false }}
        loop={true}
        className="h-full"
      >
        {slides.map((slide) => (
          <SwiperSlide key={slide.id}>
            <div className="relative h-full w-full rounded-md overflow-hidden">
              {/* Image */}
              <img
                src={slide.img}
                alt={slide.title}
                className="w-full h-full object-cover"
              />

              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent"></div>

              {/* Content */}
              <div className="absolute inset-0 flex flex-col items-center justify-center  text-center px-6">
                <h2 className="text-4xl font-bold text-white mb-4">
                  {slide.title}
                </h2>
                <p className="mb-6 text-white">{slide.desc}</p>
                <div className="flex gap-4 justify-center">
                  <button
                    onClick={() => {
                      const section = document.getElementById("tab-category");
                      section?.scrollIntoView({ behavior: "smooth" });
                    }}
                    className="px-6 py-2 bg-blue-700 text-white rounded-lg shadow hover:bg-primary/80 transition"
                  >
                    Explore
                  </button>
                  <Link to="/allJobs">
                    <button className="px-6 py-2 bg-white text-black rounded-lg shadow hover:bg-gray-200 transition">
                      See More ...
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default SweiperSlider;
