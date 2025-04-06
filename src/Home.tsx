import React from "react";
import Header from "./components/Header";
import MainContent from "./components/MainContent";

const Home:React.FC = () => {

    return(
        <div> 
        
            {/* Header */}
            <Header />

            {/* Main Content */}
            <MainContent />
        </div>  
    );
};

export default Home;