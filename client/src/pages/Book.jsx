import { useEffect,useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api/axios";

const today=()=>new Date().toISOString().slice(0,10);
export default function Book(){
    const {serviceId}=useParams();
    const navigate=useNavigate();

    const[service,setService]=useState(null);
    const[date,setDate]=useState(today());
    const[slots,setSlots]=useState([]);
    const[selectedSlot,setSelectedSlot]=useState(null);
    const[notes,setNotes]=useState("");
    const[loadingSlots,setLoadingSlots]=useState(false);
    const[refreshKey,setRefreshKey]=useState(0);
    const [error,setError]=useState("");
    const[submitting,setSubmitting]=useState(false);

    //load service detail  
    useEffect(()=>{
        api  
         .get(`/services/${serviceId}`)
         .then((res)=>setService(res.data))
         .catch((err)=>setError(err.response?.data?.message || "Could not load service"));

    },[serviceId]);

    //load free slots 

    useEffect(()=>{
        setLoadingSlots(true);
        setSelectedSlot(null);
        api  
         .get("/slots",{params:{date}})
         .then((res)=>setSlots(res.data))
         .catch(()=>setSlots([]))
         .finally(()=>setLoadingSlots(false));
    },[date,refreshKey]);

    const handleBook = async () => {
    if (!selectedSlot) return;
    setError("");
    setSubmitting(true);
    try {
      await api.post("/appointments", { serviceId, slotId: selectedSlot, notes });
      navigate("/my-appointments");
    } catch (err) {
      setError(err.response?.data?.message || "Booking failed. Please try again.");
      // Someone else took the slot: reload the list
      if (err.response?.status === 409) setRefreshKey((k) => k + 1);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-xl rounded-lg bg-white p-6 shadow">
      <h1 className="text-2xl font-bold text-gray-800">Book an appointment</h1>

      {service && (
        <p className="mt-1 text-gray-600">
          {service.name} · {service.duration} min ·{" "}
          <span className="font-semibold text-teal-700">£{service.price}</span>
        </p>
      )}

      {error && (
        <p className="mt-4 rounded bg-red-50 p-3 text-sm text-red-700">{error}</p>
      )}

      <label htmlFor="date" className="mb-1 mt-6 block text-sm font-medium">
        Choose a date
      </label>
      <input
        id="date"
        type="date"
        min={today()}
        value={date}
        onChange={(e) => setDate(e.target.value)}
        className="rounded border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-600"
      />

      <p className="mb-2 mt-6 text-sm font-medium">Available times</p>
      {loadingSlots && <p className="text-sm text-gray-500">Loading times...</p>}
      {!loadingSlots && slots.length === 0 && (
        <p className="text-sm text-gray-500">No free times on this date. Try another day.</p>
      )}
      {!loadingSlots && slots.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {slots.map((slot) => (
            <button
              key={slot._id}
              type="button"
              onClick={() => setSelectedSlot(slot._id)}
              className={`rounded border px-3 py-2 text-sm ${
                selectedSlot === slot._id
                  ? "border-teal-700 bg-teal-700 text-white"
                  : "hover:border-teal-700"
              }`}
            >
              {slot.startTime}–{slot.endTime}
            </button>
          ))}
        </div>
      )}

      <label htmlFor="notes" className="mb-1 mt-6 block text-sm font-medium">
        Notes (optional)
      </label>
      <textarea
        id="notes"
        rows={3}
        maxLength={300}
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        className="w-full rounded border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-600"
      />

      <button
        onClick={handleBook}
        disabled={!selectedSlot || submitting}
        className="mt-6 w-full rounded bg-teal-700 py-2 font-medium text-white hover:bg-teal-800 disabled:opacity-50"
      >
        {submitting ? "Booking..." : "Confirm booking"}
      </button>
    </div>
  );
}
