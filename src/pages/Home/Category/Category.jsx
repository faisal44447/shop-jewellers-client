import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import "swiper/css/pagination";
import "swiper/css/autoplay"; // অটো-প্লে এর CSS ইমপোর্ট করুন

// Autoplay মডিউলটি ইমপোর্ট করুন
import { Pagination, Autoplay } from 'swiper/modules';

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
                Welcome to <span className="text-red-500">Laivin Jewellers</span>
            </h1>

            <div className="w-full max-w-6xl px-4">
                <Swiper
                    slidesPerView={1}
                    spaceBetween={30}
                    // অটো-প্লে কনফিগারেশন
                    autoplay={{
                        delay: 2500, // ২.৫ সেকেন্ড পর পর স্লাইড পরিবর্তন হবে
                        disableOnInteraction: false, // মাউস দিয়ে নাড়াচাড়া করলেও অটো-প্লে বন্ধ হবে না
                    }}
                    pagination={{ clickable: true }}
                    breakpoints={{
                        640: { slidesPerView: 2 },
                        1024: { slidesPerView: 3 },
                    }}
                    modules={[Pagination, Autoplay]} // এখানে Autoplay মডিউলটি যোগ করা হয়েছে
                    className="mySwiper"
                >
                    {slides.map((img, index) => (
                        <SwiperSlide key={index} className="pb-14">
                            <div className="h-72 md:h-80 rounded-xl overflow-hidden shadow-2xl border border-gray-800">
                                <img 
                                    className="w-full h-full object-cover transform hover:scale-110 transition duration-500" 
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