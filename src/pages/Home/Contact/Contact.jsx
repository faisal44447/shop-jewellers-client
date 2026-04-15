import React from 'react';

const Contact = () => {
    return (
        <div className='bg-gradient-to-r from-black via-gray-900 to-black h-[400px] flex items-center justify-center mt-10 mx-5 rounded-5xl shadow-2xl'>

            <div className='text-center space-y-6'>

                <h2 className='text-5xl font-bold text-yellow-400 tracking-wide'>
                    📞 Contact Us
                </h2>

                <div className='mx-auto px-5 md:px-10'>
                    <p className='text-3xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-yellow-500 to-yellow-700 tracking-widest break-words'>
                        +8801706044447
                    </p>
                </div>

                {/* Buttons */}
                <div className='flex flex-col sm:flex-row justify-center gap-4 mt-4'>
                    {/* Call Button */}
                    <a
                        href="tel:+8801706044447"
                        className='bg-yellow-500 hover:bg-yellow-600 text-black font-bold px-6 py-3 rounded-xl transition duration-300 shadow-lg'
                    >
                        📞 Call Now
                    </a>

                    {/* WhatsApp Button */}
                    <a
                        href="https://wa.me/8801706044447?text=Hello%20I%20want%20to%20contact%20you"
                        target="_blank"
                        rel="noopener noreferrer"
                        className='bg-green-500 hover:bg-green-600 text-white font-bold px-6 py-3 rounded-xl transition duration-300 shadow-lg'
                    >
                        💬 WhatsApp
                    </a>
                </div>

                <p className='text-gray-400 text-lg font-bold'>
                    ২৪ ঘণ্টা, ৭ দিন আপনার সাপোর্টের জন্য উপস্থিত আছি
                </p>

            </div>

        </div>
    );
};

export default Contact;