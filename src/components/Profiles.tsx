import { useState } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

const crew = [
  {
    name: "Sarah Johnson",
    role: "Owner & Head Barista",
    image: "https://jredding43.github.io/BABIES-AND-BREW/images/female2.jpg",
    favoriteDrink: "Caramel Oat Milk Latte",
    bio: "A mom of two and coffee enthusiast, Sarah started Babies and Brew to give parents a cozy space to unwind, caffeinate, and connect.",
  },
  {
    name: "Marcus Lee",
    role: "Barista & Music Coordinator",
    image: "https://jredding43.github.io/BABIES-AND-BREW/images/male1.jpg",
    favoriteDrink: "Vanilla Cold Brew",
    bio: "Marcus brings the good vibes with every cup and keeps the playlists fresh. He makes a mean mocha and an even better dad joke.",
  },
  {
    name: "Lena Rose",
    role: "Barista",
    image: "https://jredding43.github.io/BABIES-AND-BREW/images/female1.jpg",
    favoriteDrink: "Honey Lavender Matcha",
    bio: "Lena keeps the play area fun and safe for little ones. She's passionate about early childhood development and toddler dance parties.",
  },
];

const Profiles = () => {
  const [index, setIndex] = useState(0);
  const member = crew[index];

  const handlePrev = () => {
    setIndex((prev) => (prev === 0 ? crew.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setIndex((prev) => (prev === crew.length - 1 ? 0 : prev + 1));
  };

  return (
    <section className="bg-orange-50 py-16 px-4 rounded-lg shadow-md">
      <div className="max-w-4xl mx-auto text-center">
        <h2
          className="text-6xl font-bold text-orange-400 mb-10"
          style={{ fontFamily: '"Rock 3D", cursive' }}
        >
          Meet the Crew
        </h2>

        {/* Profile Card */}
        <div className="relative bg-orange-100 p-6 rounded-lg shadow-md flex flex-col md:flex-row items-center md:items-start">
          {/* Arrows */}
          <button
            onClick={handlePrev}
            className="absolute left-[-2rem] top-1/2 transform -translate-y-1/2 text-orange-400 hover:text-orange-600"
          >
            <FaChevronLeft size={48} />
          </button>

          <img
            src={member.image}
            alt={member.name}
            className="w-128 h-96 rounded object-cover mb-4 md:mb-0 md:mr-6 bg-gray-200"
          />

          <div className="flex flex-col items-left text-left mt-20">
            <p className="text-sm uppercase text-orange-600 font-medium mb-2">
              Favorite Drink: {member.favoriteDrink}
            </p>
            <h3 className="text-xl font-bold text-orange-500 mt-10">{member.name}</h3>
            <p className="text-sm text-gray-600 italic mb-2">{member.role}</p>
            <p className="text-sm text-gray-700 leading-relaxed mt-20">{member.bio}</p>
          </div>

          <button
            onClick={handleNext}
            className="absolute right-[-2rem] top-1/2 transform -translate-y-1/2 text-orange-400 hover:text-orange-600"
          >
            <FaChevronRight size={48} />
          </button>
        </div>
      </div>
    </section>
  );
};

export default Profiles;
