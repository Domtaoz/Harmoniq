import React from "react";

const Login = () => {
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-900 relative overflow-hidden">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-30"
        style={{ backgroundImage: "url('https://images.app.goo.gl/ACPzqtQQiA9YsWrj9')" }}
      ></div>

      {/* Login Card */}
      <div className="bg-white p-8 rounded-2xl shadow-lg w-96 relative z-10">
        <h2 className="text-center text-2xl font-bold text-yellow-500">Login</h2>
        <div className="mt-6">
          
          {/* Username Input */}
          <div className="relative mb-4">
            <input
              type="text"
              placeholder="Username"
              className="w-full p-3 pl-10 border rounded-full focus:outline-none focus:ring-2 focus:ring-yellow-500"
            />
            <span className="absolute left-3 top-3 text-gray-500">👤</span>
          </div>

          {/* Password Input */}
          <div className="relative mb-4">
            <input
              type="password"
              placeholder="Password"
              className="w-full p-3 pl-10 border rounded-full focus:outline-none focus:ring-2 focus:ring-yellow-500"
            />
            <span className="absolute left-3 top-3 text-gray-500">🔒</span>
          </div>

          {/* Divider */}
          <div className="border-b border-gray-300 my-4"></div>

          {/* Login Button */}
          <button className="w-full p-3 bg-pink-500 text-white rounded-full text-lg font-semibold hover:bg-pink-600 transition">
            Login
          </button>

          {/* Register Link */}
          <p className="text-center text-gray-600 mt-4">
            Don't have an account?{" "}
            <span className="text-black font-bold cursor-pointer">Register</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
