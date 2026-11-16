import {Link,NavLink,useNavigate} from "react-router-dom";
import {useAuth} from "../context/AuthContext.jsx";

export default function Navbar(){
    const {user,logout}=useAuth();
    const navigate=useNavigate();

    const handleLogout=()=>{
        logout();
        navigate("/login");
    };
    const linkClass=({ isActive })=>
        isActive ? "font-semibold text-teal-700" : "text-gray-600 hover:text-teal-700";

    return(
        <nav className="border-b bg-white">
            <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-3 px-4 py-3">
                <Link to="/" className="text-xl font-bold text-teal-700">
                 BookEasy
                </Link>

                <div className="flex flex-wrap items-center gap-4 text-sm">
                    <NavLink to="/services" className={linkClass}>Services</NavLink>

                    {user && (
                        <NavLink tp="/my-appointments" className={linkClass}>My Appointments</NavLink>
                    )}
                    {user?.role==="admin" && (
                        <NavLink to="/admin" className={linkClass}>Admin</NavLink>
                    )}
                    {user ? (
                        <>
                        <span className="text-gray-500">Hi, {user.name}</span>
                        <button 
                          onClick={handleLogout}
                          className="rounded bg-gray-100 px-3 py-1 hover:bg-gray-200">
                            Log out
                          </button>
                        </>
                    
                )
            :
            (
                <>
                <NavLink to="/login" className={linkClass}>Log in</NavLink>

                <NavLink to="/register"
            className="rounded bg-teal-700 px-3 py-1 text-white hover:bg-teal-800">
                Sign up
            </NavLink>
                </>
            )}
                </div>
            </div>
        </nav>
    );
}