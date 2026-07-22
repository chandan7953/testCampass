import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";

import Splash from "./pages/Splash";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Login from "./pages/Login";


function App() {
  return (
    <BrowserRouter>
         <Navbar />
      <Routes>
        {/* Public Pages */}
        <Route path="/" element={<Splash />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />

        {/* Authentication */}
        <Route path="/login" element={<Login />} />
        

        {/* 404 Page */}
        <Route
          path="*"
          element={
            <div className="flex min-h-screen items-center justify-center bg-[#0A0A0F] text-white">
              <div className="text-center">
                <h1 className="text-6xl font-bold">404</h1>
                <p className="mt-4 text-gray-400">Page Not Found</p>
              </div>
            </div>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;