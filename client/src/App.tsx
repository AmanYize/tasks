// src/App.tsx
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom"; // Remove BrowserRouter (Router)
import { AuthContext } from "./context/AuthContext";
import Todo from "./components/Todo";
import AuthForm from "./components/AuthForm";

const App: React.FC = () => {
  const { token } = React.useContext(AuthContext);

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<AuthForm isLogin={true} />} />
      <Route path="/register" element={<AuthForm isLogin={false} />} />

      {/* Protected Route */}
      <Route
        path="/todos"
        element={token ? <Todo /> : <Navigate to="/login" />}
      />

      {/* Redirect to Login by Default */}
      <Route path="/" element={<Navigate to="/login" />} />
    </Routes>
  );
};

export default App;
