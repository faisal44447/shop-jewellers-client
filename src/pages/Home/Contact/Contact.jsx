import React from "react";
import { FaPhoneAlt, FaWhatsapp } from "react-icons/fa";

const Contact = () => {
    return (
        <div className="relative overflow-hidden bg-black py-20 mt-10 mx-5 rounded-[40px] shadow-2xl border border-yellow-900/30">

            {/* ================= BACKGROUND EFFECT ================= */}
            <div className="absolute top-0 left-0 w-64 h-64 bg-yellow-600/10 blur-[120px] rounded-full"></div>
            <div className="absolute bottom-0 right-0 w-64 h-64 bg-yellow-900/20 blur-[120px] rounded-full"></div>

            <div className="relative z-10 text-center space-y-10 px-4">

                {/* TITLE */}
                <div className="space-y-3">
                    <h2 className="text-5xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-b from-yellow-200 via-yellow-500 to-yellow-700">
                        Get In Touch
                    </h2>

                    <p className="text-gray-400 tracking-[0.3em] uppercase text-xs md:text-sm">
                        Experience Luxury Service
                    </p>
                </div>

                {/* PHONE DISPLAY */}
                <div className="inline-block bg-white/5 backdrop-blur-md border border-white/10 px-10 py-6 rounded-3xl transition hover:scale-105 duration-300">
                    <p className="text-3xl md:text-5xl font-black text-yellow-500 tracking-tight">
                        +880 1706 044447
                    </p>
                </div>

                {/* BUTTONS */}
                <div className="flex flex-col sm:flex-row justify-center gap-5 mt-6">

                    {/* CALL */}
                    <a
                        href="tel:+8801706044447"
                        className="flex items-center justify-center gap-3 bg-gradient-to-r from-yellow-600 to-yellow-400 text-black font-bold px-10 py-4 rounded-full transition hover:shadow-[0_0_25px_rgba(234,179,8,0.5)] hover:scale-105"
                    >
                        <FaPhoneAlt />
                        Call Now
                    </a>

                    {/* WHATSAPP */}
                    <a
                        href="https://wa.me/8801706044447"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-3 border border-green-500/60 text-green-400 font-bold px-10 py-4 rounded-full transition hover:bg-green-500/10 hover:scale-105"
                    >
                        <FaWhatsapp className="text-xl" />
                        WhatsApp
                    </a>

                </div>

                {/* FOOTER TEXT */}
                <p className="text-gray-500 text-sm md:text-lg italic">
                    "২৪ ঘণ্টা, ৭ দিন আপনার আস্থার সাথে আমরা আছি"
                </p>

            </div>
        </div>
    );
};

export default Contact;