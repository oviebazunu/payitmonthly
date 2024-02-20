import Zoo from "./pages/zoo";
import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Zoo />} />
      </Routes>
    </Router>
  );
}

export default App;
