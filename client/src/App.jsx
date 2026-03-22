 import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login.jsx";
import Tasks from "./pages/Tasks.jsx";

function App() {
  const token = localStorage.getItem("token");

  return (
    <Routes>
      <Route
        path="/"
        element={token ? <Navigate to="/tasks" /> : <Login />}
      />
      <Route
        path="/tasks"
        element={
          <div>
           
            {token ? <Tasks /> : <Navigate to="/" />}
          </div>
        }
      />
    </Routes>
    
  );
}

export default App;