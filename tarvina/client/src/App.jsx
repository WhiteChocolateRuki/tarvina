// src/App.jsx
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import AuthPage from "./pages/AuthPage";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import BattlePage from "./pages/BattlePage";
import Feed from "./pages/Feed";
import PostDetail from "./pages/PostDetail";

export default function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <Routes>
       
        <Route path="/" element={<Feed />} />

      
        <Route path="/posts/:id" element={<PostDetail />} /> 

        
        <Route path="/auth" element={<AuthPage />} />


        <Route path="/battle" element={<BattlePage />} />

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
