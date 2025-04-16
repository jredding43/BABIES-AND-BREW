import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";


const App: React.FC = () => {
  return (
    <Router basename="/BABIES-AND-BREW">
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
    </Router>
  );
};

export default App;
