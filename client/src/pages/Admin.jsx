import { useState } from "react";
import AdminAppointments from "../components/admin/AdminAppointments.jsx";
import AdminServices from "../components/admin/AdminServices.jsx";
import AdminSlots from "../components/admin/AdminSlots.jsx";

const tabs=[
    {id:"appointments", label:"Appointments"},
    {id:"services", label:"Services"},
    {id:"slots", label:"Slots"},
];

export default function Admin(){
    const[tab,setTab]=useState("appointments");

    return(
        <div>
            <h1 className="mb-4 text-2xl font-bold text-gray-800">Admin Dashboard</h1>
            <div className="mb-6 flex gap-2 border-b">
                {tabs.map((t)=>(
                    <button 
                      key={t.id}
                      onClick={()=>setTab(t.id)}
                      className={`-mb-px border-b-2 px-4 py-2 text-sm font-medium ${
                        tab===t.id   ?  "border-teal-700 text-teal-700"
                        : "border-transparent text-gray-500 hover:text-gray-700"

                      }`}
                      >
                        {t.label}
                      </button>
                ))}
            </div>
            {tab === "appointments" && <AdminAppointments />}
            {tab === "services" && <AdminServices />}
            {tab === "slots" && <AdminSlots />}
        </div>
    );
}