import { Link } from "react-router-dom";
import ShopBanner from "../../../assets/Shop Banner.jpg";

const Banner = () => {

    return (
        <div className="mt-10">

            {/* ================= NEWS TICKER (MODERN MARQUEE) ================= */}
            <div className="bg-black text-yellow-400 py-2 border-b border-yellow-600/30 overflow-hidden">

                {/* 📢 Marquee Section */}
            <div className="bg-black text-yellow-400 py-2 overflow-hidden border-b border-yellow-600/30">
                <marquee behavior="scroll" direction="left" className="font-medium tracking-wide">
                    💰আমাদের এখানে সকল প্রকার হলমার্কযুক্ত স্বর্ণ, রূপা এবং হীরা অত্যন্ত বিশ্বস্ততার সাথে ক্রয়-বিক্রয় করা হয়। গ্রাহকের সন্তুষ্টি ও বিশুদ্ধতার নিশ্চয়তাই আমাদের মূল লক্ষ্য।
                </marquee>
            </div>

            </div>

            {/* ================= HERO BANNER ================= */}
            <div className="w-full max-w-6xl mx-auto mt-6 relative rounded-3xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.4)] group">

                <img
                    className="w-full h-[350px] md:h-[500px] object-cover transition-transform duration-1000 group-hover:scale-105"
                    src={ShopBanner}
                    alt="Jewellery Banner"
                />

                {/* DARK OVERLAY */}
                <div className="absolute inset-0 bg-black/30"></div>

                {/* CTA BUTTON */}
                <div className="absolute bottom-8 left-6 md:right-10 md:left-auto">

                    <Link
                        to="/dashboard/product-card-page"
                        className="bg-gradient-to-r from-yellow-500 to-yellow-300 text-black font-bold px-6 py-3 rounded-full shadow-lg hover:scale-105 transition"
                    >
                        🛍 Shop Now
                    </Link>

                </div>

            </div>

        </div>
    );
};

export default Banner;