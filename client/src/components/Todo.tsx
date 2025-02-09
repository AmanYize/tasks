// src/Todo.tsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { AuthContext } from "../context/AuthContext"; // Import AuthContext
import { useContext } from "react";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

interface ITodo {
  _id: string;
  text: string;
  completed: boolean;
}

const Todo: React.FC = () => {
  const [todos, setTodos] = useState<ITodo[]>([]);
  const [text, setText] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Access the logout function from AuthContext
  const { logout } = useContext(AuthContext);

  // Fetch todos on component mount
  useEffect(() => {
    fetchTodos();
  }, []);

  // Fetch todos from the backend
  const fetchTodos = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get<ITodo[]>(`${backendUrl}/api/todos`);
      setTodos(response.data);
    } catch (err) {
      setError("Failed to fetch todos. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Add a new todo
  const addTodo = async () => {
    if (!text.trim()) return; // Prevent empty todos
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post<ITodo>(`${backendUrl}/api/todos`, {
        text,
      });
      setTodos([...todos, response.data]);
      setText("");
    } catch (err) {
      setError("Failed to add todo. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Toggle todo completion status
  const toggleComplete = async (id: string) => {
    const todo = todos.find((todo) => todo._id === id);
    if (!todo) return;
    setLoading(true);
    setError(null);
    try {
      const response = await axios.patch<ITodo>(
        `${backendUrl}/api/todos/${id}`,
        { completed: !todo.completed }
      );
      setTodos(todos.map((todo) => (todo._id === id ? response.data : todo)));
    } catch (err) {
      setError("Failed to update todo. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Delete a todo
  const deleteTodo = async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      await axios.delete(`${backendUrl}/api/todos/${id}`);
      setTodos(todos.filter((todo) => todo._id !== id));
    } catch (err) {
      setError("Failed to delete todo. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-6 space-y-4">
        {/* Header */}
        <h1 className="text-2xl font-bold text-center text-gray-800">
          Todo App
        </h1>

        {/* Sign Out Button */}
        <button
          onClick={logout} // Call the logout function
          className="w-full px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition duration-200"
        >
          Sign Out
        </button>

        {/* Error Message */}
        {error && (
          <div
            className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
            role="alert"
          >
            <span className="block sm:inline">{error}</span>
          </div>
        )}

        {/* Input Field */}
        <div className="flex space-x-2">
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Add a new todo"
            className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={loading}
          />
          <button
            onClick={addTodo}
            className={`px-4 py-2 rounded-md transition duration-200 ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-500 text-white hover:bg-blue-600"
            }`}
            disabled={loading}
          >
            {loading ? "Adding..." : "Add"}
          </button>
        </div>

        {/* Loading Indicator */}
        {loading && (
          <div className="flex justify-center">
            <div className="animate-spin h-5 w-5 border-t-2 border-b-2 border-blue-500 rounded-full"></div>
          </div>
        )}

        {/* Todo List */}
        <ul className="space-y-2">
          {todos.length === 0 && !loading && (
            <li className="text-center text-gray-500">No todos found.</li>
          )}
          {todos.map((todo) => (
            <motion.li
              key={todo._id}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="flex items-center justify-between px-4 py-2 bg-gray-50 rounded-md shadow-sm"
            >
              {/* Todo Text */}
              <span
                className={`flex-1 ${
                  todo.completed
                    ? "line-through text-gray-500"
                    : "text-gray-800"
                }`}
              >
                {todo.text}
              </span>

              {/* Buttons */}
              <div className="flex space-x-2">
                <button
                  onClick={() => toggleComplete(todo._id)}
                  className={`px-3 py-1 text-sm rounded-md ${
                    todo.completed
                      ? "bg-green-500 text-white"
                      : "bg-yellow-500 text-white"
                  } hover:opacity-90 transition duration-200`}
                  disabled={loading}
                >
                  {todo.completed ? "Undo" : "Complete"}
                </button>
                <button
                  onClick={() => deleteTodo(todo._id)}
                  className="px-3 py-1 text-sm bg-red-500 text-white rounded-md hover:bg-red-600 transition duration-200"
                  disabled={loading}
                >
                  Delete
                </button>
              </div>
            </motion.li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Todo;
