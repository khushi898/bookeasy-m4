import { useEffect,useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";

const statusStyles={
    booked:"bg-teal-100 text-teal-800",
    cancelled:"bg-gray-100 text-gray-600",
    completed:"bg-blue-100 text-blue-800",
};

export default function MyAppointments(){
    const[appointments,setAppointments]=useState([]);
    const[loading,setLoading]=useState(true);
    const[error,setError]=useState("");
    const [cancellingId,setCancellingId]=useState(null);

    useEffect(()=>{
        api 
         .get("/appointments/my")
         .then((res)=>setAppointments(res.data))
         .catch((err)=>setError(err.response?.data?.message || "Could not load appointments")
        )
       .finally(()=>setLoading(false));
    },[]);

    
    const handleCancel=async(id)=>{
        if(!window.confirm("Cancel this appointment?")) return;
        setError("");
        setCancellingId(id);
        try{
            await api.patch(`/appointments/${id}/cancel`);
            //update just this one 
            setAppointments((prev)=>
            prev.map((a)=>(a._id === id ? { ...a, status:"cancelled"} : a))
        );
        }catch(err){
            setError(err.response?.data?.message || "Could not cancel appointment");
        } finally{
            setCancellingId(null);
        }
        };

        if(loading)
            return <p className="text-gray-500">Loading your appointments...</p>;
        return(
            <div>
                <h1 className="mb-4 text--2xl font-bold text-gray-800">My appointments</h1>
                {error && (
                    <p className="mb-4 rounded bg-red-50 p-3 text-sm text-red-700">{error}</p>
                )}

                {appointments.length === 0 ? (
                    <div className="rounded-lg bg-white p-6 text-center shadow">
                        <p className="text-gray-600">You have no appointments yet.</p>
                        <Link to="/services" className="mt-3 inline-block text-teal-700 hover:underline">
                        Browse services</Link>
                    </div>
                ) : (
                    <ul className="space-y-3">
                        {appointments.map((a)=>(
                            <li
                              key={a._id}
                              className="flex flex-col gap-3 rounded-lg bg-white p-4 shadow sm:flex-row sm:items-center sm:justify-between"
                              >
                                <div>
                                    <p className="font-semibold text-gray-800">
                                        {a.service?.name || "Service removed"}
                                    </p>
                                    <p className="text-sm text-gray-600">
                                        {a.slot?.date} . {a.slot?.startTime}-{a.slot?.endTime}
                                        {a.service&& ` . £${a.service.price}`}
                                    </p>

                                    {a.notes && <p className="mt-1 text-sm text-gray-500">Note: {a.notes}</p>}

                                </div>

                                <div className="flex items-center gap-3">
                                    <span className={`rounded-full px-3 py-1 text-xs font-medium ${statusStyles[a.status]}`}>
                                        {a.status}
                                    </span>
                                    {a.status === "booked" && (
                                        <button 
                                         onClick={()=>handleCancel(a._id)}
                                         disabled={cancellingId===a._id}
                                         className="rounded border border-red-300 px-3 py-1 text-sm text-red-700 hover:bg-red-50 disabled:opacity-50"
                                         >
                                            {cancellingId === a._id ? "Cancelling..." : "Cancel"}
                                         </button>
                                    )}
                                </div>
                              </li>
                        ))}
                    </ul>
                )
            }
            </div>
        );
        
    
}