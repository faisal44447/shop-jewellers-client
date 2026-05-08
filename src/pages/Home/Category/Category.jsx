import { Swiper, SwiperSlide } from "swiper/react";

import "swiper/css";
import "swiper/css/pagination";

import { Pagination, Autoplay } from "swiper/modules";

import slide1 from "../../../assets/Slide 1.jpg";
import slide2 from "../../../assets/Slide 2.jpg";
import slide3 from "../../../assets/Slide 3.jpg";
import slide4 from "../../../assets/Slide 4.jpg";
import slide5 from "../../../assets/Slide 5.jpg";
import slide6 from "../../../assets/Slide 6.jpg";
import slide7 from "../../../assets/Slide 7.jpg";

const Category = () => {
    const slides = [slide1, slide2, slide3, slide4, slide5, slide6, slide7];

    return (
        <div className="min-h-[80vh] flex flex-col items-center justify-center bg-gradient-to-r from-black to-gray-900 text-white py-10">

            <h1 className="text-4xl md:text-6xl font-bold text-center mb-12">
                Welcome to <span className="text-yellow-500">Laivin Jewellers</span>
            </h1>

            <div className="w-full max-w-6xl px-4">

                <Swiper
                    slidesPerView={1}
                    spaceBetween={25}
                    loop={true}
                    autoplay={{
                        delay: 2500,
                        disableOnInteraction: false,
                        pauseOnMouseEnter: true,
                    }}
                    pagination={{ clickable: true }}
                    breakpoints={{
                        640: { slidesPerView: 2 },
                        1024: { slidesPerView: 3 },
                    }}
                    modules={[Pagination, Autoplay]}
                    className="mySwiper"
                >

                    {slides.map((img, index) => (
                        <SwiperSlide key={index} className="pb-12">

                            <div className="h-72 md:h-80 rounded-xl overflow-hidden shadow-2xl border border-gray-800 group">

                                <img
                                    className="w-full h-full object-cover transition duration-500 group-hover:scale-110"
                                    src={img}
                                    alt={`Jewellery ${index + 1}`}
                                />

                            </div>

                        </SwiperSlide>
                    ))}

                </Swiper>

            </div>
        </div>
    );
};

export default Category;