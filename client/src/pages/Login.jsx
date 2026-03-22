import { useState } from "react";
import { login } from "../services/auth";
import { useNavigate } from "react-router-dom";
const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
  e.preventDefault();

  if (!email || !password) {
    alert("Please enter email and password");
    return;
  }

  try {
    const res = await login({ email, password });

    localStorage.setItem("token", res.data.accessToken);

    alert("Login successful");

    window.location.href = "/tasks"; // ✅ clean redirect

  } catch (err) {
    alert("Login failed");
  }
};

return (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500">
    
    <div className="bg-white p-8 rounded-2xl shadow-2xl w-96">
      
      <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
        Welcome 👋
      </h2>

      <form onSubmit={handleLogin} className="flex flex-col gap-4">
        
        {/* EMAIL */}
        <input
          type="email"
          placeholder="Email"
          className="w-full p-3 border-2 border-gray-300 rounded-lg bg-white text-black placeholder-gray-500 focus:outline-none focus:border-indigo-500"
          onChange={(e) => setEmail(e.target.value)}
        />

        {/* PASSWORD */}
        <input
          type="password"
          placeholder="Password"
          className="w-full p-3 border-2 border-gray-300 rounded-lg bg-white text-black placeholder-gray-500 focus:outline-none focus:border-indigo-500"
          onChange={(e) => setPassword(e.target.value)}
        />

        {/* BUTTON */}
        <button className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition">
          Login
        </button>

      </form>

    </div>
  </div>
);
};
export default Login;