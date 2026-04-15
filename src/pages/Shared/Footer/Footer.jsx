import shopLogo from '../../../assets/shopLogo.png';
import { FaFacebook, FaYoutube, FaTwitter, FaMapMarkerAlt, FaPhoneAlt } from 'react-icons/fa';

const Footer = () => {
    return (
        <footer className="bg-[#0a0a0a] text-gray-400 pt-16 pb-8 px-10 mt-20 border-t border-yellow-900/20">
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 items-start">
                
                {/* Brand Section */}
                <div className="space-y-4 text-center md:text-left">
                    <img src={shopLogo} alt="LAIVIN Logo" className="w-32 mx-auto md:mx-0 brightness-125" />
                    <h2 className="text-xl font-bold text-yellow-500 tracking-widest uppercase">
                        LAIVIN JEWELLERS Ltd.
                    </h2>
                    <p className="text-sm leading-relaxed max-w-xs mx-auto md:mx-0">
                        Exquisite craftsmanship and timeless elegance since 2024. Providing the finest jewelry for your special moments.
                    </p>
                </div>

                {/* Quick Links / Contact */}
                <div className="text-center">
                    <h6 className="text-yellow-500 font-bold uppercase tracking-widest mb-6">Contact Info</h6>
                    <ul className="space-y-4 text-sm">
                        <li className="flex items-center justify-center gap-2 hover:text-yellow-500 transition-colors">
                            <FaMapMarkerAlt className="text-yellow-600" /> Dhaka, Bangladesh
                        </li>
                        <li className="flex items-center justify-center gap-2 hover:text-yellow-500 transition-colors">
                            <FaPhoneAlt className="text-yellow-600" /> +8801706044447
                        </li>
                    </ul>
                </div>

                {/* Social Section */}
                <div className="text-center md:text-right space-y-6">
                    <h6 className="text-yellow-500 font-bold uppercase tracking-widest">Connect with Us</h6>
                    <div className="flex justify-center md:justify-end gap-6">
                        <a href="#" className="text-2xl hover:text-yellow-500 transition-all hover:-translate-y-1"><FaFacebook /></a>
                        <a href="#" className="text-2xl hover:text-yellow-500 transition-all hover:-translate-y-1"><FaYoutube /></a>
                        <a href="#" className="text-2xl hover:text-yellow-500 transition-all hover:-translate-y-1"><FaTwitter /></a>
                    </div>
                </div>
            </div>

            {/* Bottom Section */}
            <div className="mt-16 pt-8 border-t border-white/5 text-center text-xs tracking-widest uppercase">
                <p>© {new Date().getFullYear()} - All rights reserved by 
                    <span className="text-yellow-600 font-bold ml-1">LAIVIN JEWELLERS Ltd.</span>
                </p>
            </div>
        </footer>
    );
};

export default Footer;