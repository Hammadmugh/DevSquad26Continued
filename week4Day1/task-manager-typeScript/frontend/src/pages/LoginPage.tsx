import { useState } from 'react';
import LoginForm from '../components/LoginForm';
import RegisterForm from '../components/RegisterForm';

const LoginPage = () => {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Card Container */}
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-800 mb-2">TaskMaster</h1>
            <p className="text-gray-600">
              {isLogin
                ? 'Welcome back! Log in to your account'
                : 'Create a new account to get started'}
            </p>
          </div>

          {/* Forms */}
          {isLogin ? (
            <LoginForm onSwitchToRegister={() => setIsLogin(false)} />
          ) : (
            <RegisterForm onSwitchToLogin={() => setIsLogin(true)} />
          )}

          {/* Toggle Auth Mode */}
        </div>

        {/* Additional Info */}
        <div className="text-center mt-8 text-white">
          <p className="text-sm opacity-90">
            Secure and simple task management
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;