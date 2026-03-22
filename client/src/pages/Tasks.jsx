import { useState, useEffect } from "react";
import {
  getTasks,
  createTask,
  deleteTask,
  updateTask,
} from "../services/task";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { motion } from "framer-motion";

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState("");
  const [dark, setDark] = useState(false);

  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
    toast.success("Logged out");
  };

  const fetchTasks = async () => {
    try {
      const res = await getTasks();
      setTasks(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      toast.error("Failed to load tasks");
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) navigate("/");
    else fetchTasks();
  }, [navigate]);

  const handleAdd = async () => {
    if (!title.trim()) return toast.error("Enter task");

    await createTask({ title });
    setTitle("");
    fetchTasks();
    toast.success("Task added");
  };

  const handleDelete = async (id) => {
    await deleteTask(id);
    fetchTasks();
    toast.success("Task deleted");
  };

  const handleEdit = (task) => {
    setEditingId(task._id);
    setEditText(task.title);
  };

  const handleUpdate = async (id) => {
    await updateTask(id, { title: editText });
    setEditingId(null);
    fetchTasks();
    toast.success("Task updated");
  };

  const toggleComplete = async (task) => {
    await updateTask(task._id, {
      ...task,
      completed: !task.completed,
    });
    fetchTasks();
  };

  // 📊 Stats
  const total = tasks.length;
  const completed = tasks.filter((t) => t.completed).length;
  const pending = total - completed;

  return (
    <div
      className={`min-h-screen p-6 transition ${
        dark
          ? "bg-gray-900 text-white"
          : "bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100"
      }`}
    >
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">✨ My Tasks</h1>

        <div className="flex gap-3">
          <button
            onClick={() => setDark(!dark)}
            className="px-4 py-2 rounded-lg bg-gray-700 text-white"
          >
            {dark ? "☀️ Light" : "🌙 Dark"}
          </button>

          <button
            onClick={handleLogout}
            className="bg-red-500 px-4 py-2 rounded-lg text-white"
          >
            Logout
          </button>
        </div>
      </div>

      {/* 📊 Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-white/70 backdrop-blur-md p-4 rounded-xl shadow text-center">
          <p className="text-gray-500">Total</p>
          <h2 className="text-2xl font-bold">{total}</h2>
        </div>

        <div className="bg-green-100 p-4 rounded-xl shadow text-center">
          <p className="text-green-700">Completed</p>
          <h2 className="text-2xl font-bold">{completed}</h2>
        </div>

        <div className="bg-yellow-100 p-4 rounded-xl shadow text-center">
          <p className="text-yellow-700">Pending</p>
          <h2 className="text-2xl font-bold">{pending}</h2>
        </div>
      </div>

      {/* Add Task */}
      <div className="flex gap-3 mb-6">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleAdd()}
          placeholder="Add task..."
          className="flex-1 p-3 rounded-lg text-black"
        />
        <button
          onClick={handleAdd}
          className="bg-indigo-500 text-white px-5 rounded-lg"
        >
          Add
        </button>
      </div>

      {/* Task List */}
      <div className="grid gap-4">
        {tasks.map((task) => (
          <motion.div
            key={task._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.03 }}
            transition={{ duration: 0.2 }}
            className={`p-4 rounded-xl shadow flex justify-between items-center transition ${
              dark ? "bg-gray-800 text-white" : "bg-white text-black"
            }`}
          >
            {/* Left */}
            <div className="flex items-center gap-3 w-full">
              <input
                type="checkbox"
                checked={task.completed || false}
                onChange={() => toggleComplete(task)}
                className="w-5 h-5"
              />

              {editingId === task._id ? (
                <input
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  className="p-2 border rounded w-full"
                />
              ) : (
                <span
                  className={`font-medium ${
                    task.completed
                      ? "line-through opacity-60"
                      : ""
                  }`}
                >
                  {task.title}
                </span>
              )}
            </div>

            {/* Actions */}
            <div className="flex gap-3 ml-3">
              {editingId === task._id ? (
                <button
                  onClick={() => handleUpdate(task._id)}
                  className="text-green-600"
                >
                  ✔️
                </button>
              ) : (
                <button
                  onClick={() => handleEdit(task)}
                  className="text-blue-500"
                >
                  ✏️
                </button>
              )}

              <button
                onClick={() => handleDelete(task._id)}
                className="text-red-500"
              >
                🗑️
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Empty State */}
      {tasks.length === 0 && (
        <p className="text-center text-gray-400 mt-10">
          🎉 No tasks yet. Add one above!
        </p>
      )}
    </div>
  );
};

export default Tasks;