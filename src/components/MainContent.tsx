import About from "./About";
import Profiles from "./Profiles";
import Footer from "./Footer";
import { FaClock, FaGift, FaStar } from "react-icons/fa";
import Collapsible from "./Collapsible";

import Menu from "./Menu"; 

const MainContent = () => {
  return (
    <>
    <div className="w-full h-full flex justify-center px-4 py-12">
      <div className="w-full max-w-6xl space-y-12">
      <div className="flex flex-col md:flex-row justify-center gap-8 px-4">

        {/* Sidebar  */}
        <div className="w-full md:w-1/3 space-y-8 rounded ">
            <div className="bg-orange-50 p-4 rounded shadow">
            <h3 className="text-lg font-bold text-orange-500 flex items-center gap-2 mb-2">
                <FaClock /> Hours of Operation
            </h3>
            <ul className="text-sm text-gray-700">
                <li>Mon-Fri: 7am - 6pm</li>
                <li>Sat: 8am - 5pm</li>
                <li>Sun: 8am - 2pm</li>
            </ul>
            </div>

            <div className="bg-orange-50 p-4 rounded shadow">
            <h3 className="text-lg font-bold text-orange-500 flex items-center gap-2 mb-2">
                <FaGift /> Gift Cards
            </h3>
            <p className="text-sm text-gray-700">
                Available in-store. Great for any occasion!
            </p>
            </div>

            <div className="bg-orange-50 p-4 rounded shadow">
            <h3 className="text-lg font-bold text-orange-500 flex items-center gap-2 mb-2">
                <FaStar /> Rewards Program
            </h3>
            <p className="text-sm text-gray-700">
                Earn a free drink every 10 visits. Ask us how to sign up!
            </p>
            </div>
        </div>

        {/* About  */}
        <div className="w-full md:w-2/3">
            <About />
        </div>

        </div>
        <Profiles />
        <Menu />
      </div>
    </div>
    <Footer />
    </>
  );
};

export default MainContent;
