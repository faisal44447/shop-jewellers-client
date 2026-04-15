import React from 'react';
import { FaPhoneAlt, FaWhatsapp } from 'react-icons/fa';

const Contact = () => {
    return (
        <div className='relative overflow-hidden bg-black py-20 mt-10 mx-5 rounded-[40px] shadow-2xl border border-yellow-900/30'>
            {/* Background Decor */}
            <div className="absolute top-0 left-0 w-64 h-64 bg-yellow-600/10 blur-[100px] rounded-full"></div>
            <div className="absolute bottom-0 right-0 w-64 h-64 bg-yellow-900/20 blur-[100px] rounded-full"></div>

            <div className='relative z-10 text-center space-y-8'>
                <div className="space-y-2">
                    <h2 className='text-5xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-b from-yellow-200 via-yellow-500 to-yellow-700 tracking-tight'>
                        Get In Touch
                    </h2>
                    <p className='text-gray-400 tracking-[0.3em] uppercase text-sm'>Experience Luxury Service</p>
                </div>

                <div className='inline-block bg-white/5 backdrop-blur-md border border-white/10 p-8 rounded-3xl'>
                    <p className='text-4xl md:text-6xl font-black text-yellow-500 tracking-tighter hover:scale-105 transition-transform duration-500 cursor-pointer'>
                        +880 1706 044447
                    </p>
                </div>

                <div className='flex flex-col sm:flex-row justify-center gap-6 mt-6'>
                    {/* Call Button */}
                    <a
                        href="tel:+8801706044447"
                        className='group relative flex items-center justify-center gap-3 bg-gradient-to-r from-yellow-600 to-yellow-400 text-black font-bold px-10 py-4 rounded-full overflow-hidden transition-all hover:shadow-[0_0_20px_rgba(234,179,8,0.4)]'
                    >
                        <FaPhoneAlt /> Call Now
                    </a>

                    {/* WhatsApp Button */}
                    <a
                        href="https://wa.me/8801706044447"
                        target="_blank"
                        rel="noopener noreferrer"
                        className='flex items-center justify-center gap-3 border border-green-500/50 hover:bg-green-500/10 text-green-500 font-bold px-10 py-4 rounded-full transition-all'
                    >
                        <FaWhatsapp className='text-xl' /> WhatsApp
                    </a>
                </div>

                <p className='text-gray-500 text-lg font-medium italic'>
                    "২৪ ঘণ্টা, ৭ দিন আপনার আস্থার সাথে আমরা আছি"
                </p>
            </div>
        </div>
    );
};

export default Contact;