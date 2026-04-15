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
                    💰আমাদের এখানে সকল প্রকার হলমার্কযুক্ত স্বর্ণ, রূপা এবং হীরা অত্যন্ত বিশ্বস্ততার সাথে ক্রয়-বিক্রয় করা হয়। গ্রাহকের সন্তুষ্টি ও বিশুদ্ধতার নিশ্চয়তাই আমাদের মূল লক্ষ্য।
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

                {/* 🛍 CTA Button */}
                <div className="absolute bottom-8 left-6 md:left-auto md:right-10">
                    <Link to="/product-card-page">

                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Banner;