import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";
import Logo from "./Logo";

const Navbar = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const linkClass = ({ isActive }) =>
    `block text-sm font-medium transition ${
      isActive
        ? "text-blue-500"
        : "text-gray-400 hover:text-white"
    }`;

  return (
    <header className="border-b border-[#1c1c24] bg-[#0a0a0f]">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        {/* Logo */}
        <NavLink
          to="/"
          onClick={() => setIsOpen(false)}
        >
          <Logo />
        </NavLink>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-8 md:flex">
          <NavLink to="/" className={linkClass}>
            Home
          </NavLink>

          <NavLink to="/about" className={linkClass}>
            About
          </NavLink>

          <NavLink to="/contact" className={linkClass}>
            Contact
          </NavLink>

          <button
            onClick={() => navigate("/login")}
            className="rounded-xl bg-blue-500 px-5 py-2 text-sm font-semibold text-white transition hover:bg-blue-600"
          >
            Login
          </button>
        </nav>

        {/* Mobile Menu Button */}
        <button
          className="text-white md:hidden"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="border-t border-[#1c1c24] bg-[#0a0a0f] md:hidden">
          <nav className="flex flex-col gap-5 px-6 py-5">
            <NavLink
              to="/"
              className={linkClass}
              onClick={() => setIsOpen(false)}
            >
              Home
            </NavLink>

            <NavLink
              to="/about"
              className={linkClass}
              onClick={() => setIsOpen(false)}
            >
              About
            </NavLink>

            <NavLink
              to="/contact"
              className={linkClass}
              onClick={() => setIsOpen(false)}
            >
              Contact
            </NavLink>

            <button
              onClick={() => {
                navigate("/login");
                setIsOpen(false);
              }}
              className="mt-2 w-full rounded-xl bg-blue-500 px-5 py-2 text-sm font-semibold text-white transition hover:bg-blue-600"
            >
              Login
            </button>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Navbar;