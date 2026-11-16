import { useState } from "react";
import { Link , useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Register(){
    const {register} =useAuth();
    const navigate=useNavigate();

    const [name,setName]=useState("");
    const [email,setEmail]=useState("");
    const [password,setPassword]=useState("");
    const [error,setError]=useState("");
    const [submitting,setSubmitting]=useState(false);


    const handleSubmit=async(e)=>{
            e.preventDefault();
            setError("");
            setSubmitting(true);
            try{
                await register(name,email,password);
                navigate("/services");
            }catch(err){
                setError(err.response?.data?.message || "Sign up failed. Please try again.");
    
            }finally{
                setSubmitting(false);
            }
        };
        const inputClass="w-full rounded border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-600";

        return(
            <div className="mx-auto max-w-sm rounded-lg bg-white p-6 shadow">
                <h1 className="mb-4 text-2xl font-bold text-gray-800">Create an account</h1>
    
                {error && (
                    <p className="mb-4 rounded bg-red-50 p-3 text-sm text-red-700">{error}</p>
    
                )}
    
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="name" className="mb-1 block text-sm font-medium">
                            Name
                        </label>
                        <input
                          id="name"
                          required 
                          minLength={2}
                          value={name}
                          onChange={(e)=>setName(e.target.value)}
                          className={inputClass}
                          />
                    </div>

                     <div>
                        <label htmlFor="email" className="mb-1 block text-sm font-medium">
                            Email
                        </label>
                        <input
                          id="email"
                          type="email"
                          required 
                          value={email}
                          onChange={(e)=>setEmail(e.target.value)}
                          className={inputClass}
                          />
                    </div>
    
                    <div>
                        <label htmlFor="password" className="mb-1 block text-sm font-medium">
                            Password
                        </label>
                         <input
                          id="password"
                          type="password"
                          required 
                          minLength={6}
                          value={password}
                          onChange={(e)=>setPassword(e.target.value)}
                          className={inputClass}
                          />
                        <p className="mt-1 text-xs text-gray-500">At least 6 characters</p>
                    </div>
                    <button
                     type="submit"
                     disabled={submitting}
                     className="w-full rounded bg-teal-700 py-2 font-medium text-white hover:bg-teal-800 disabled:opacity-50"
                     >
                        {submitting ? "Creating account..." : "Sign up"}
                     </button>
                </form>
                <p className="mt-4 text-center text-sm text-gray-600">
                    Already have an account?{" "}
                    <Link to="/login" className="text-teal-700 hover:underline">
                    Log in</Link>
                </p>
            </div>
        )
}