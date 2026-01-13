import React, { useState } from 'react';

interface LoginProps {
  onLogin: (email: string) => void;
}

export const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) onLogin(email);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-green-50 dark:bg-gray-900 transition-colors duration-200">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-md border-t-4 border-green-600 dark:border-green-500">
        <h1 className="text-2xl font-bold text-center text-gray-800 dark:text-white mb-6">Carbon Sequestration Calculator</h1>
        <p className="text-center text-gray-500 dark:text-gray-400 mb-6">เข้าสู่ระบบเพื่อเริ่มใช้งาน</p>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2" htmlFor="email">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              required
              className="shadow appearance-none border dark:border-gray-600 rounded w-full py-2 px-3 text-gray-700 dark:text-white dark:bg-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:ring-2 focus:ring-green-500"
              placeholder="example@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <button
            type="submit"
            className="w-full bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-150"
          >
            เข้าสู่ระบบ (Login)
          </button>
        </form>
      </div>
    </div>
  );
};