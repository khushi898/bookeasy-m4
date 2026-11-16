import { useEffect,useState } from "react";
import api from "../../api/axios";

const emptyForm={ name:"",description: "",duration: "",price: ""};

export default function AdminServices(){
       const [services, setServices] = useState([]);
       const [form, setForm] = useState(emptyForm);
       const [editingId, setEditingId] = useState(null);
       const [loading, setLoading] = useState(true);
       const [saving, setSaving] = useState(false);
       const [error, setError] = useState("");
       const [message, setMessage] = useState("");

       useEffect(()=>{
        api
         .get("/services",{params: {limit:50}})
         .then((res)=>setServices(res.data.services))
         .catch((err)=>setError(err.response?.data?.message || "Could not load services"))
         .finally(()=>setLoading(false));
       },[]);

       //one handler for every input
       const handleChange=(e)=>{
        setForm({ ...form, [e.target.name]: e.target.value });
       };

       const handleSubmit=async(e)=>{
        e.preventDefault();
        setError("");
        setMessage("");
        setSaving(true);

        const data={
            ...form,
            duration:Number(form.duration),
            price:Number(form.price),
        };

        try{
            if(editingId){
                const res=await api.put(`/services/${editingId}`,data);
                setServices((prev)=>prev.map((s)=>(s._id === editingId ? res.data : s)));
                setMessage("Service updated");
            }else{
                const res=await api.post("/services",data);
                setServices((prev)=>
                [...prev,res.data].sort((a,b)=>a.name.localeCompare(b.name))
            );
            setMessage("Service added");
            }
            setForm(emptyForm);
            setEditingId(null);
        }catch(err){
            setError(err.response?.data?.message || "Could not save service");
        }finally{
            setSaving(false);
        }
       };

       const handleEdit = (service) => {
    setEditingId(service._id);
    setForm({
      name: service.name,
      description: service.description || "",
      duration: String(service.duration),
      price: String(service.price),
    });
    setMessage("");
    setError("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setForm(emptyForm);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this service?")) return;
    setError("");
    setMessage("");
    try {
      await api.delete(`/services/${id}`);
      setServices((prev) => prev.filter((s) => s._id !== id));
      setMessage("Service deleted");
    } catch (err) {
      setError(err.response?.data?.message || "Could not delete service");
    }
  };

  const inputClass =
    "w-full rounded border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-600";

  return (
    <div>
      {/* Add / edit form */}
      <form onSubmit={handleSubmit} className="mb-6 rounded-lg bg-white p-5 shadow">
        <h2 className="mb-4 text-lg font-semibold">
          {editingId ? "Edit service" : "Add a service"}
        </h2>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="name" className="mb-1 block text-sm font-medium">Name</label>
            <input id="name" name="name" required value={form.name} onChange={handleChange} className={inputClass} />
          </div>
          <div>
            <label htmlFor="description" className="mb-1 block text-sm font-medium">Description</label>
            <input id="description" name="description" maxLength={500} value={form.description} onChange={handleChange} className={inputClass} />
          </div>
          <div>
            <label htmlFor="duration" className="mb-1 block text-sm font-medium">Duration (minutes)</label>
            <input id="duration" name="duration" type="number" min={5} max={480} required value={form.duration} onChange={handleChange} className={inputClass} />
          </div>
          <div>
            <label htmlFor="price" className="mb-1 block text-sm font-medium">Price (£)</label>
            <input id="price" name="price" type="number" min={0} step="0.01" required value={form.price} onChange={handleChange} className={inputClass} />
          </div>
        </div>

        {error && <p className="mt-4 rounded bg-red-50 p-3 text-sm text-red-700">{error}</p>}
        {message && <p className="mt-4 rounded bg-green-50 p-3 text-sm text-green-700">{message}</p>}

        <div className="mt-4 flex gap-3">
          <button
            type="submit"
            disabled={saving}
            className="rounded bg-teal-700 px-4 py-2 text-sm font-medium text-white hover:bg-teal-800 disabled:opacity-50"
          >
            {saving ? "Saving..." : editingId ? "Save changes" : "Add service"}
          </button>
          {editingId && (
            <button type="button" onClick={cancelEdit} className="rounded border px-4 py-2 text-sm">
              Cancel
            </button>
          )}
        </div>
      </form>

      {/* List */}
      {loading && <p className="text-gray-500">Loading services...</p>}
      {!loading && services.length === 0 && <p className="text-gray-500">No services yet.</p>}

      <ul className="space-y-3">
        {services.map((s) => (
          <li
            key={s._id}
            className="flex flex-col gap-3 rounded-lg bg-white p-4 shadow sm:flex-row sm:items-center sm:justify-between"
          >
            <div>
              <p className="font-semibold text-gray-800">{s.name}</p>
              <p className="text-sm text-gray-600">
                {s.duration} min · £{s.price}
                {s.description && ` · ${s.description}`}
              </p>
            </div>
            <div className="flex gap-2">
              <button onClick={() => handleEdit(s)} className="rounded border px-3 py-1 text-sm hover:bg-gray-50">
                Edit
              </button>
              <button
                onClick={() => handleDelete(s._id)}
                className="rounded border border-red-300 px-3 py-1 text-sm text-red-700 hover:bg-red-50"
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}