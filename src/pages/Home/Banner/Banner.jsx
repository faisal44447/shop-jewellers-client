import { Link } from "react-router-dom";
import ShopBanner from "../../../assets/Shop Banner.jpg";

const Banner = ({ goldData }) => {
    // ডাটা না থাকলে এরর হ্যান্ডেল করার জন্য ডিফল্ট ভ্যালু বা অপশনাল চেইনিং নিশ্চিত করা হয়েছে
    const bdtFormatter = (price) => price?.toLocaleString('en-IN', { minimumFractionDigits: 2 }) || "0.00";

    return (
        <div className="mt-8">
            {/* 📢 Marquee Section */}
            <div className="bg-black text-yellow-400 py-2 overflow-hidden border-b border-yellow-600/30">
                <marquee behavior="scroll" direction="left" className="font-medium tracking-wide">
                    💰 আজকের Gold Price Live Update | 24K, 22K, 21K, 18K Gold Price Bangladesh | 
                    স্বর্ণের দাম প্রতিদিন আপডেট করা হয় | সেরা দামে কেনাকাটা করুন Laivin Jewellers-এ 💎
                </marquee>
            </div>

            {/* 🖼 Hero Banner Container */}
            <div className="w-full max-w-6xl mx-auto mt-6 relative rounded-3xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.4)] group">
                
                {/* Banner Image with subtle zoom on hover */}
                <img 
                    className="w-full h-[350px] md:h-[500px] object-cover transition-transform duration-1000 group-hover:scale-105" 
                    src={ShopBanner} 
                    alt="Jewellery Banner"
                />

                {/* Dark Overlay for better text visibility */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>

                {/* 💰 GOLD PRICE FLOATING CARD */}
                <div className="absolute top-6 left-6 md:top-10 md:left-10 bg-black/60 backdrop-blur-md p-5 rounded-2xl border border-yellow-500/20 shadow-2xl">
                    <div className="mb-3">
                        <p className="text-yellow-500 text-xs uppercase tracking-[0.2em] font-bold">Live Rate</p>
                        <h2 className="text-white text-xl md:text-3xl font-black">
                            ৳ {bdtFormatter(goldData?.priceBDT)} <span className="text-sm font-normal text-gray-300">/ vori</span>
                        </h2>
                    </div>

                    <div className="h-[1px] bg-yellow-500/30 my-3"></div>

                    {/* 🥇 KARAT PRICES GRID */}
                    <div className="grid grid-cols-2 gap-x-6 gap-y-2">
                        <div className="flex flex-col">
                            <span className="text-yellow-500 text-[10px] font-bold">24K (Pure)</span>
                            <span className="text-white text-sm font-semibold">৳ {bdtFormatter(goldData?.karat?.["24k"])}</span>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-yellow-500 text-[10px] font-bold">22K (Cadmium)</span>
                            <span className="text-white text-sm font-semibold">৳ {bdtFormatter(goldData?.karat?.["22k"])}</span>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-yellow-500 text-[10px] font-bold">21K</span>
                            <span className="text-white text-sm font-semibold">৳ {bdtFormatter(goldData?.karat?.["21k"])}</span>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-yellow-500 text-[10px] font-bold">18K</span>
                            <span className="text-white text-sm font-semibold">৳ {bdtFormatter(goldData?.karat?.["18k"])}</span>
                        </div>
                    </div>
                </div>

                {/* 🛍 CTA Button */}
                <div className="absolute bottom-8 left-6 md:left-auto md:right-10">
                    <Link to="/product-card-page">
                        <button className="px-8 py-3 bg-yellow-500 hover:bg-yellow-600 text-black font-bold rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center gap-2">
                            View Collections
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="ArrowRightIcon" />
                            </svg>
                        </button>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Banner;