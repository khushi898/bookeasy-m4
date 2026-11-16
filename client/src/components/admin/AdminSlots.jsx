import { useEffect, useState } from "react";
import api from "../../api/axios";

const today = () => new Date().toISOString().slice(0, 10);

export default function AdminSlots() {
  const [date, setDate] = useState(today());
  const [slots, setSlots] = useState([]);
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  // Load free slots for the chosen date
  useEffect(() => {
    setLoading(true);
    setError("");
    api
      .get("/slots", { params: { date } })
      .then((res) => setSlots(res.data))
      .catch((err) => setError(err.response?.data?.message || "Could not load slots"))
      .finally(() => setLoading(false));
  }, [date]);

  const handleAdd = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setSaving(true);
    try {
      const res = await api.post("/slots", { date, startTime, endTime });
      setSlots((prev) =>
        [...prev, res.data].sort((a, b) => a.startTime.localeCompare(b.startTime))
      );
      setStartTime("");
      setEndTime("");
      setMessage("Slot added");
    } catch (err) {
      setError(err.response?.data?.message || "Could not add slot");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this slot?")) return;
    setError("");
    setMessage("");
    try {
      await api.delete(`/slots/${id}`);
      setSlots((prev) => prev.filter((s) => s._id !== id));
      setMessage("Slot deleted");
    } catch (err) {
      setError(err.response?.data?.message || "Could not delete slot");
    }
  };

  const inputClass =
    "rounded border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-600";

  return (
    <div>
      {/* Date picker */}
      <label htmlFor="slot-date" className="mb-1 block text-sm font-medium">Date</label>
      <input
        id="slot-date"
        type="date"
        min={today()}
        value={date}
        onChange={(e) => setDate(e.target.value)}
        className={`${inputClass} mb-6`}
      />

      {/* Add slot form */}
      <form onSubmit={handleAdd} className="mb-6 rounded-lg bg-white p-5 shadow">
        <h2 className="mb-4 text-lg font-semibold">Add a slot on {date}</h2>
        <div className="flex flex-wrap items-end gap-4">
          <div>
            <label htmlFor="start" className="mb-1 block text-sm font-medium">Start time</label>
            <input id="start" type="time" required value={startTime} onChange={(e) => setStartTime(e.target.value)} className={inputClass} />
          </div>
          <div>
            <label htmlFor="end" className="mb-1 block text-sm font-medium">End time</label>
            <input id="end" type="time" required value={endTime} onChange={(e) => setEndTime(e.target.value)} className={inputClass} />
          </div>
          <button
            type="submit"
            disabled={saving}
            className="rounded bg-teal-700 px-4 py-2 text-sm font-medium text-white hover:bg-teal-800 disabled:opacity-50"
          >
            {saving ? "Adding..." : "Add slot"}
          </button>
        </div>
      </form>

      {error && <p className="mb-4 rounded bg-red-50 p-3 text-sm text-red-700">{error}</p>}
      {message && <p className="mb-4 rounded bg-green-50 p-3 text-sm text-green-700">{message}</p>}

      {/* Free slots list */}
      <h2 className="mb-2 text-lg font-semibold">Free slots</h2>
      {loading && <p className="text-gray-500">Loading slots...</p>}
      {!loading && slots.length === 0 && (
        <p className="text-gray-500">No free slots on this date.</p>
      )}
      {!loading && slots.length > 0 && (
        <ul className="grid gap-2 sm:grid-cols-3 lg:grid-cols-4">
          {slots.map((s) => (
            <li key={s._id} className="flex items-center justify-between rounded bg-white px-3 py-2 shadow">
              <span className="text-sm">{s.startTime}–{s.endTime}</span>
              <button
                onClick={() => handleDelete(s._id)}
                aria-label={`Delete slot ${s.startTime}`}
                className="text-sm text-red-700 hover:underline"
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}