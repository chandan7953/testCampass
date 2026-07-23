import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";

import Splash from "./pages/landing/Splash.jsx";
import About from "./pages/landing/About.jsx";
import Contact from "./pages/landing/Contact.jsx";
import Login from "./pages/auth/Login.jsx";
import Register from "./pages/auth/Register.jsx";
import ForgotPassword from "./pages/auth/ForgotPassword.jsx";
import ResetPassword from "./pages/auth/ResetPassword.jsx";
import { Toaster } from "react-hot-toast";

function App() {
  
  return (
    <BrowserRouter>
    <Toaster
        position="top-right"
        reverseOrder={false}
      />
      <Navbar />
      <Routes>
        {/* Public Pages */}
        <Route path="/" element={<Splash />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />

        {/* Authentication */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route path="/forgot-password" element={<ForgotPassword />} />

        <Route path="/reset-password" element={<ResetPassword />} />

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
