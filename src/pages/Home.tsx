import React, { useState } from "react";
import Header from "../components/Header";
import MainContent from "../components/MainContent";
import OrderPage from "../components/OrderPage";

const Home: React.FC = () => {
  const [view, setView] = useState<"home" | "order">("home");

  return (
    <div>
      <Header />

      {/* Toggle Buttons (for now, basic) */}
      <div className="flex justify-center gap-4 my-4">
        <button
          onClick={() => setView("home")}
          className={`px-4 py-2 rounded ${
            view === "home" ? "bg-pink-600 text-white" : "bg-gray-200"
          }`}
        >
          Home
        </button>
        <button
          onClick={() => setView("order")}
          className={`px-4 py-2 rounded ${
            view === "order" ? "bg-pink-600 text-white" : "bg-gray-200"
          }`}
        >
          Order Drinks
        </button>
      </div>

      {/* Toggle View */}
      {view === "home" ? <MainContent /> : <OrderPage />}
    </div>
  );
};

export default Home;
