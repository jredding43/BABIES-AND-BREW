import { useState } from "react";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";

const CollapsibleSection = ({ title, children }: { title: string; children: React.ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border border-orange-200 rounded-md shadow p-4">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex justify-between items-center w-full text-left text-lg font-semibold text-orange-600"
      >
        {title}
        {isOpen ? <FaChevronUp /> : <FaChevronDown />}
      </button>

      {isOpen && <div className="mt-4">{children}</div>}
    </div>
  );
};

export default CollapsibleSection;
