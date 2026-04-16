import Link from 'next/link';
import { useAuthStore } from '@/lib/store';
import { useRouter } from 'next/navigation';
import NotificationCenter from './NotificationCenter';

export default function Navbar() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    logout();
    router.push('/login');
  };

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white shadow-md z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl">💬</span>
            <span className="font-bold text-gray-900 hidden sm:inline">
              Comment System
            </span>
          </Link>

          <div className="flex items-center gap-4">
            {!user ? (
              // Show Register/Login buttons when NOT authenticated
              <>
                <Link
                  href="/register"
                  className="px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition text-sm font-medium"
                >
                  Register
                </Link>
                <Link
                  href="/login"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm font-medium"
                >
                  Login
                </Link>
              </>
            ) : (
              // Show user profile and logout when authenticated
              <>
                <NotificationCenter />
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                    {user.username?.charAt(0).toUpperCase()}
                  </div>
                  <button
                    onClick={handleLogout}
                    className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition text-sm"
                  >
                    Logout
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
