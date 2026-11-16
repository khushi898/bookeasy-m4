import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function ProtectedRoute({children,adminOnly=false}){
    const {user,loading}=useAuth();

    if(loading) return <p className="text-gray-500">Loading...</p>;
    if(!user) return <Navigate to="/login" replace/>;
    if(adminOnly && user.role !== "admin") return <Navigate to="/" replace/>;
    return children;

}