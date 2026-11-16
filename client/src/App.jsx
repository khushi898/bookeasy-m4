import {Routes, Route} from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import Home from "./pages/Home.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Services from "./pages/Services.jsx";
import MyAppointments from "./pages/MyAppointments.jsx";
import Admin from "./pages/Admin.jsx";
import NotFound from "./pages/NotFound.jsx";

export default function App(){
  return(
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="mx-auto max-w-5xl px-4 py-8">
        <Routes>
          <Route path="/" element={<Home />}/>
          <Route path="/login" element={<Login />}/>
          <Route path="/register" element={<Register />}/>
          <Route path="/services" element={<Services />}/>
          <Route 
            path="/my-appointments" 
            element={<ProtectedRoute><MyAppointments /></ProtectedRoute>}
            />
          <Route 
            path="/admin"
            element={<ProtectedRoute adminOnly><Admin /></ProtectedRoute>}
            />
            <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
    </div>
  )
}