import { FaInstagram, FaFacebookF } from "react-icons/fa";

const Header = () => {
  return (
    <header className="w-full bg-orange-50 shadow px-20 py-6">
      {/* Flex wrapper for layout switching */}
      <div className="flex flex-col md:flex-row items-center justify-between space-y-6 md:space-y-0">
        
        {/* Left: Logo image */}
        <div className="w-full md:w-1/3 flex justify-center md:justify-start">
          <img
            src="images/logo.png"
            alt="Logo"
            className="h-24 md:h-40 lg:h-52 object-contain"
          />
        </div>

        {/* Center: Brand name */}
        <div className="w-full md:w-1/3 flex justify-center text-center">
          <span
            style={{ fontFamily: '"Rock 3D", cursive' }}
            className="text-5xl md:text-7xl text-orange-400 tracking-tighter font-extrabold"
          >
            BABIES AND BREW
          </span>
        </div>

        {/* Right: Socials + Location */}
        <div className="w-full md:w-1/3 flex flex-col items-center md:items-end text-right space-y-3">
          {/* Social Icons */}
          <div className="flex space-x-4">
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-orange-600 transition-transform transform hover:scale-110"
            >
              <FaInstagram className="h-7 w-7" />
            </a>
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-blue-600 transition-transform transform hover:scale-110"
            >
              <FaFacebookF className="h-7 w-7" />
            </a>
          </div>

          {/* Location Text */}
          <p className="text-sm text-gray-700">123 Coffee Ave, Brewtown, WA</p>

          {/* Embedded Map */}
          <div className="w-full max-w-[220px] h-[130px] border border-gray-300 rounded overflow-hidden shadow-sm">
            <iframe
              title="Location Map"
              width="100%"
              height="100%"
              frameBorder="0"
              style={{ border: 0 }}
              referrerPolicy="no-referrer-when-downgrade"
              src="https://www.google.com/maps?q=123+Coffee+Ave+Brewtown+WA&output=embed"
              allowFullScreen
            ></iframe>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
