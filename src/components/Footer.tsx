import { FaInstagram, FaFacebookF } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-orange-100 text-gray-800 py-10 mt-2">
      <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8">
        {/* Brand Info */}
        <div className="text-center md:text-left space-y-2">
          <h2 className="text-2xl font-bold text-orange-500" style={{ fontFamily: '"Rock 3D", cursive' }}>
            Babies and Brew
          </h2>
          <p className="text-sm">Fueling parents one cup at a time ☕</p>
        </div>

        <div className="mt-6 text-center text-xs text-gray-500">
        © {new Date().getFullYear()} Babies and Brew. All rights reserved.
      </div>

        {/* Social Icons */}
        <div className="flex space-x-4 text-xl">
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-orange-500">
            <FaInstagram />
          </a>
          <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="hover:text-blue-500">
            <FaFacebookF />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
