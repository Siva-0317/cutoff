import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { auth } from "./firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import Landing from "./pages/Landing";
import ExtensionPopup from "./pages/ExtensionPopup";

function ProtectedRoute({ children }) {
  const [user, loading] = useAuthState(auth);
  if (loading) return <p style={{ padding: 40 }}>Loading...</p>;
  if (!user) return <Navigate to="/login" />;
  return children;
}

function App() {
  // If ?ext=true is in the URL, render the Chrome Extension Popup instead of the full app
  const isExt = new URLSearchParams(window.location.search).get("ext") === "true";
  
  if (isExt) {
    return <ExtensionPopup />;
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;