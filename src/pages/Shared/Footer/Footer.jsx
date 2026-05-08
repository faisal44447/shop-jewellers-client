import shopLogo from "../../../assets/shopLogo.png";
import {
    FaFacebook,
    FaYoutube,
    FaTwitter,
    FaMapMarkerAlt,
    FaPhoneAlt,
} from "react-icons/fa";

const Footer = () => {
    return (
        <footer className="bg-[#0a0a0a] text-gray-400 pt-16 pb-8 px-6 md:px-10 mt-20 border-t border-yellow-900/20">

            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12">

                {/* ================= BRAND ================= */}
                <div className="space-y-4 text-center md:text-left">

                    <img
                        src={shopLogo}
                        alt="LAIVIN Jewellers"
                        className="w-28 mx-auto md:mx-0 brightness-125 hover:scale-105 transition"
                    />

                    <h2 className="text-xl font-bold text-yellow-500 tracking-widest uppercase">
                        LAIVIN JEWELLERS Ltd.
                    </h2>

                    <p className="text-sm leading-relaxed max-w-xs mx-auto md:mx-0">
                        Exquisite craftsmanship and timeless elegance since 2024.
                        We bring premium jewelry for your special moments.
                    </p>

                </div>

                {/* ================= CONTACT ================= */}
                <div className="text-center">

                    <h6 className="text-yellow-500 font-bold uppercase tracking-widest mb-6">
                        Contact Info
                    </h6>

                    <ul className="space-y-4 text-sm">

                        <li className="flex items-center justify-center gap-2 hover:text-yellow-500 transition">
                            <FaMapMarkerAlt className="text-yellow-600" />
                            Dhaka, Bangladesh
                        </li>

                        <li className="flex items-center justify-center gap-2 hover:text-yellow-500 transition">
                            <FaPhoneAlt className="text-yellow-600" />
                            +880 1706 044447
                        </li>

                    </ul>

                </div>

                {/* ================= SOCIAL ================= */}
                <div className="text-center md:text-right space-y-6">

                    <h6 className="text-yellow-500 font-bold uppercase tracking-widest">
                        Connect with Us
                    </h6>

                    <div className="flex justify-center md:justify-end gap-6 text-2xl">

                        <a
                            href="#"
                            aria-label="Facebook"
                            className="hover:text-yellow-500 hover:-translate-y-1 transition"
                        >
                            <FaFacebook />
                        </a>

                        <a
                            href="#"
                            aria-label="YouTube"
                            className="hover:text-yellow-500 hover:-translate-y-1 transition"
                        >
                            <FaYoutube />
                        </a>

                        <a
                            href="#"
                            aria-label="Twitter"
                            className="hover:text-yellow-500 hover:-translate-y-1 transition"
                        >
                            <FaTwitter />
                        </a>

                    </div>

                </div>

            </div>

            {/* ================= BOTTOM ================= */}
            <div className="mt-16 pt-6 border-t border-white/10 text-center text-xs tracking-widest uppercase">

                <p>
                    © {new Date().getFullYear()} All rights reserved by{" "}
                    <span className="text-yellow-500 font-bold">
                        LAIVIN JEWELLERS Ltd.
                    </span>
                </p>

            </div>

        </footer>
    );
};

export default Footer;