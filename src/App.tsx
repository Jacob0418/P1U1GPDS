import { BrowserRouter, Routes, Route } from "react-router-dom";
import './App.css'
import HomePage from './pages/Home-page'
import Dashboard from "./pages/Dashboard";
import Login from "./pages/AuthPage";
import ParcelsPage from "./pages/ParcelsPage";
import DeletedParcelsPage from "./pages/DeletedParcelsPage";
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from '../src/components/auth/ProtectedRoute';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/parcels" element={<ProtectedRoute><ParcelsPage /></ProtectedRoute>} />
          <Route path="/deletedParcels" element={<ProtectedRoute><DeletedParcelsPage /></ProtectedRoute>} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App