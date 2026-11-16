import {useEffect,useState} from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";

export default function Services(){
    const [services,setServices]=useState([]);
    const [page,setPage]=useState(1);
    const [totalPages,setTotalPages]=useState(1);
    const [search,setSearch]=useState("");
    const [query,setQuery]=useState("");
    const [loading,setLoading]=useState(true);
    const [error,setError]=useState("");


    useEffect(()=>{
        const timer=setTimeout(()=>{
            setQuery(search);
            setPage(1);
        },400);
        return()=>clearTimeout(timer);
    },[search]);

    //Load services whenever page or search changes   
    useEffect(()=>{
        setLoading(true);
        setError("");
        api
          .get("/services",{params: {page,limit:6,search:query}})
          .then((res)=>{
            setServices(res.data.services);
            setTotalPages(res.data.totalPages || 1 );

          })
          .catch((err)=>
              setError(err.response?.data?.message || "Could not load services")
        )
        .finally(()=>setLoading(false));
    },[page,query]);

    return(
        <div>
            <h1 className="mb-4 text-2xl font-bold text-gray-800">Our Services</h1>
            <label htmlFor="search" className="sr-only">Search Services</label>
            <input 
               id="search"
               type="search"
               placeholder="Search Services..."
               value={search}
               onChange={(e)=> setSearch(e.target.value)}
               className="mb-6 w-full rounded border px-3 py-2 sm:max-w-xs focus:outline-none focus:ring-2 focus:ring-teal-600"
               />
               {loading && <p className="text-gray-500">Loading Services...</p>}
               {error && ( <p className="rounded bg-red-50 p-3 text-sm text-red-700">{error}</p>
            )}

            {!loading && !error && services.length === 0 && (
                <p className="text-gray-500">No services found!</p>
            )}

             {!loading && !error && services.length > 0 && (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {services.map((service)=>(
                        <div key={service._id} className="flex flex-col rounded-lg bg-white p-5 shadow">
                            <h2 className="text-lg font-semibold text-gray-800">{service.name}</h2> 
                            <p className="mt-1 flex-1 text-sm text-gray-600">{service.description}</p> 
                            <div className="mt-4 flex items-center justify-between text-sm">
                                <span className="text-gray-500">{service.duration} min</span>
                                <span className="font-semibold text-teal-700">£{service.price}</span>
                            </div>
                            <Link to={`/book/${service._id}`}
                            className="mt-4 rounded bg-teal-700 py-2 text-center text-sm font-medium text-white hover:bg-teal-800">
                                Book
                            </Link>
                            </div>
                ))}
                </div>
            )}
            {totalPages > 1 && (
                <div className="mt-6 flex items-center justify-center gap-4">
                    <button 
                     onClick={()=>setPage((p)=>p-1)}
                     disabled={page===1}
                     className="rounded border px-3 py-1 disabled:opacity-40"
                     >
                        Previous
                     </button>
                     <span className="text-sm text-gray-600">
                        Page {page} of {totalPages}
                     </span>
                     <button 
                     onClick={()=>setPage((p)=>p+1)}
                     disabled={page===totalPages}
                     className="rounded border px-3 py-1 disabled:opacity-40"
                     >
                        Next
                     </button>
                     </div>

            )}
        </div>
    );
}