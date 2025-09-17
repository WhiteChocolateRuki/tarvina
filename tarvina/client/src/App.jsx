// src/App.jsx
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import AuthPage from "./pages/AuthPage";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import BattlePage from "./pages/BattlePage";
import Feed from "./pages/Feed";
import PostDetail from "./pages/PostDetail"; // 🔑 yeni import

export default function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <Routes>
        {/* Herkese açık akış */}
        <Route path="/" element={<Feed />} />

        {/* Tek yazı sayfası */}
        <Route path="/posts/:id" element={<PostDetail />} />  {/* 🔑 eklendi */}

        {/* Giriş/Kayıt */}
        <Route path="/auth" element={<AuthPage />} />

        {/* Battle sayfası */}
        <Route path="/battle" element={<BattlePage />} />

        {/* Kullanıcıya özel panel */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
    </div>
  );
}
