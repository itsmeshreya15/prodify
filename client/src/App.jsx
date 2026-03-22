import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Tasks from "./pages/Tasks";

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