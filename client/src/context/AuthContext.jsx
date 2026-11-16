import { createContext,useContext,useEffect,useState } from "react";
import api from "../api/axios";

const AuthContext=createContext(null);

export function AuthProvider({children}){
    const [user,setUser]=useState(null);
    const[loading,setLoading]=useState(true);

    //on page load:

    useEffect(()=>{
        const token=localStorage.getItem("token");
        if(!token){
            setLoading(false);
            return;
        }
        api
          .get("/auth/me")
          .then((res)=>setUser(res.data))
          .catch(()=>localStorage.removeItem("token"))
          .finally(()=>setLoading(false));
    },[]);

    const login=async (email,password)=>{
        const res=await api.post("/auth/login", {email,password});
        const {token, ...userData}=res.data;
        localStorage.setItem("token",token);
        setUser(userData);
    };
    const register=async(name,email,password)=>{
        await api.post("/auth/register",{name, email, password});
        await login(email,password);
    };
    const logout=()=>{
        localStorage.removeItem("token");
        setUser(null);
    };
    return(
        <AuthContext.Provider value={{user,loading,login,register,logout}}>
            {children}
        </AuthContext.Provider>
    );
}
export const useAuth=()=>useContext(AuthContext);