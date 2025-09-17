// Navbar.jsx

import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../features/authSlice";

export default function Navbar() {
  const token = useSelector((s) => s.auth.token);
  const dispatch = useDispatch();

  return (
    <nav className="block w-screen bg-[#0088ff]">
      {/* custom-navbar sınıfını div'e ekleyin */}
      <div className="w-full px-6 custom-navbar flex items-center justify-between">
        
        {/* Logo */}
        <Link to="/" className="text-xl font-bold hover:opacity-80 transition">
          
        </Link>

        {/* Ortadaki Menü */}
        {/* custom-navbar-link-container sınıfını ekleyin */}
        <div className="flex custom-navbar-link-container text-base md:text-lg font-semibold">
          <Link to="/" className="hover:opacity-80 transition">
            Blog
          </Link>
          <Link to="/dashboard" className="hover:opacity-80 transition">
            Dashboard
          </Link>
          <Link to="/battle" className="hover:opacity-80 transition">
            Battle
          </Link>
        </div>
      

        {/* Sağda Auth Buton */}
          <div>
            {token ? (
              <Link
                to="/"
                onClick={() => dispatch(logout())}
                className="right px-3 py-5 text-sm hover:bg-white/20 transition"
              >
                Çıkış
              </Link>
            ) : (
              <Link
                to="/auth"
                className="right px-3 py-5 text-sm hover:bg-white/20 transition"
              >
                Giriş / Kayıt
              </Link>
            )}
          </div>
      </div>
    </nav>
  );
}