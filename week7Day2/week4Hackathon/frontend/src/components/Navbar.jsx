import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { authService } from '../services/authService';
import ProfileOverlay from './ProfileOverlay';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showProfileOverlay, setShowProfileOverlay] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const isAuthenticated = authService.isAuthenticated();
  const isAdmin = authService.isAdmin();
  const currentUser = authService.getCurrentUser();

  const handleNavigation = (path) => {
    navigate(path);
    setIsMenuOpen(false);
  };

  const handleLogout = () => {
    authService.logout();
    navigate('/');
    setIsMenuOpen(false);
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="fixed top-0 w-full z-50 border-b border-neutral-800/30">

      {/* Container */}
      <div className="max-w-7xl mx-auto">

        {/* Desktop */}
        <div className="hidden lg:flex items-center justify-between px-8 py-5">

          {/* Logo */}
          <img src="/logo.png" alt="StreamVibe" className="h-12" />

          {/* Center Menu */}
          <div className="flex items-center gap-4 px-6 py-2 bg-neutral-900 border border-neutral-800 rounded-xl">

            <button onClick={() => handleNavigation('/')} className={`px-5 py-2 rounded-lg text-sm transition ${isActive('/') ? 'bg-neutral-800 text-white' : 'text-neutral-400 hover:text-white'}`}>
              Home
            </button>

            <button onClick={() => handleNavigation('/movies-shows')} className={`px-5 py-2 rounded-lg text-sm transition ${isActive('/movies-shows') ? 'bg-neutral-800 text-white' : 'text-neutral-400 hover:text-white'}`}>
              Movies & Shows
            </button>

            <button className="text-neutral-400 hover:text-white text-sm">
              Support
            </button>

            <button onClick={() => handleNavigation('/subscriptions')} className={`px-5 py-2 rounded-lg text-sm transition ${isActive('/subscriptions') ? 'bg-neutral-800 text-white' : 'text-neutral-400 hover:text-white'}`}>
              Subscriptions
            </button>
          </div>

          {/* Right Side - Auth & Icons */}
          <div className="flex items-center gap-4">
            {!isAuthenticated ? (
              <>
                <button 
                  onClick={() => handleNavigation('/login')}
                  className="px-4 py-2 text-sm text-neutral-300 hover:text-white transition"
                >
                  Login
                </button>
                <button 
                  onClick={() => handleNavigation('/register')}
                  className="px-4 py-2 text-sm bg-neutral-900 border border-neutral-700 hover:border-neutral-600 text-white rounded-lg transition"
                >
                  Register
                </button>
              </>
            ) : (
              <>
                {isAdmin && (
                  <button 
                    onClick={() => handleNavigation('/admin/dashboard')}
                    className="px-4 py-2 text-sm bg-neutral-900 border border-neutral-700 hover:border-neutral-600 text-white rounded-lg transition"
                  >
                    Admin Panel
                  </button>
                )}
                <button 
                  onClick={() => setShowProfileOverlay(!showProfileOverlay)}
                  className="h-8 w-8 rounded-full bg-red-600 flex items-center justify-center text-white text-sm font-semibold hover:bg-red-700 transition relative"
                >
                  {currentUser?.email?.[0].toUpperCase()}
                </button>
              </>
            )}
            <img src="/search.png" className="h-6 w-6 cursor-pointer" />
            <img src="/bellIcon.png" className="h-6 w-6 cursor-pointer" />
          </div>
        </div>

        {/* Mobile */}
        <div className="lg:hidden flex items-center justify-between px-8 py-4">

          <img src="/logo.png" alt="StreamVibe" className="h-9" />

          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="p-3 bg-neutral-900 border border-neutral-700 rounded-lg"
          >
            <img src="/hamburger.png" className="h-6 w-6" />
          </button>
        </div>

        {/* Mobile Menu (Animated) */}
        <div
          className={`lg:hidden overflow-hidden transition-all duration-300 ${
            isMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
          }`}
        >
          <div className="pb-4 flex flex-col gap-2 bg-black border-t border-neutral-800">

            <button onClick={() => handleNavigation('/')} className={`w-full px-4 py-3 rounded-lg text-sm transition ${isActive('/') ? 'bg-neutral-800 text-white' : 'text-neutral-400 hover:text-white'}`}>
              Home
            </button>

            <button onClick={() => handleNavigation('/movies-shows')} className={`text-left w-full px-4 py-3 rounded-lg text-sm transition ${isActive('/movies-shows') ? 'bg-neutral-800 text-white' : 'text-neutral-400 hover:text-white'}`}>
              Movies & Shows
            </button>

            <button className="text-left px-4 py-3 text-neutral-400 hover:text-white text-sm">
              Support
            </button>

            <button onClick={() => handleNavigation('/subscriptions')} className="text-left w-full px-4 py-3 text-neutral-400 hover:text-white text-sm">
              Subscriptions
            </button>

            {!isAuthenticated ? (
              <>
                <button 
                  onClick={() => handleNavigation('/login')}
                  className="w-full px-4 py-3 text-sm text-neutral-300 hover:text-white transition text-left"
                >
                  Login
                </button>
                <button 
                  onClick={() => handleNavigation('/register')}
                  className="w-full px-4 py-3 text-sm bg-neutral-900 border border-neutral-700 hover:border-neutral-600 text-white rounded-lg transition"
                >
                  Register
                </button>
              </>
            ) : (
              <>
                {isAdmin && (
                  <button 
                    onClick={() => handleNavigation('/admin/dashboard')}
                    className="w-full px-4 py-3 text-sm bg-neutral-900 border border-neutral-700 hover:border-neutral-600 text-white rounded-lg transition"
                  >
                    Admin Panel
                  </button>
                )}
                <button 
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-3 text-neutral-400 hover:text-neutral-300 text-sm transition"
                >
                  Logout ({currentUser?.email})
                </button>
              </>
            )}

          </div>
        </div>

      </div>

      {/* Profile Overlay */}
      {showProfileOverlay && isAuthenticated && (
        <ProfileOverlay 
          onLogout={() => {
            handleLogout();
            setShowProfileOverlay(false);
          }}
          onClose={() => setShowProfileOverlay(false)}
        />
      )}
    </nav>
  );
}