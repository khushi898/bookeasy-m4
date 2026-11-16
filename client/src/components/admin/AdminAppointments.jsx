import { useEffect, useState } from "react";
import api from "../../api/axios";

const statusStyles = {
  booked: "bg-teal-100 text-teal-800",
  cancelled: "bg-gray-100 text-gray-600",
  completed: "bg-blue-100 text-blue-800",
};

export default function AdminAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [status, setStatus] = useState("");
  const [date, setDate] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [busyId, setBusyId] = useState(null);

  // Reload when a filter or the page changes
  useEffect(() => {
    setLoading(true);
    setError("");
    const params = { page, limit: 10 };
    if (status) params.status = status;
    if (date) params.date = date;

    api
      .get("/appointments", { params })
      .then((res) => {
        setAppointments(res.data.appointments);
        setTotalPages(res.data.totalPages || 1);
      })
      .catch((err) =>
        setError(err.response?.data?.message || "Could not load appointments")
      )
      .finally(() => setLoading(false));
  }, [status, date, page]);

  // action is "complete" or "cancel"
  const updateStatus = async (id, action) => {
    if (action === "cancel" && !window.confirm("Cancel this appointment?")) return;
    setBusyId(id);
    setError("");
    try {
      await api.patch(`/appointments/${id}/${action}`);
      const newStatus = action === "complete" ? "completed" : "cancelled";
      setAppointments((prev) =>
        prev.map((a) => (a._id === id ? { ...a, status: newStatus } : a))
      );
    } catch (err) {
      setError(err.response?.data?.message || "Could not update appointment");
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div>
      {/* Filters */}
      <div className="mb-4 flex flex-wrap gap-3">
        <div>
          <label htmlFor="status" className="mb-1 block text-sm font-medium">Status</label>
          <select
            id="status"
            value={status}
            onChange={(e) => { setStatus(e.target.value); setPage(1); }}
            className="rounded border px-3 py-2"
          >
            <option value="">All</option>
            <option value="booked">Booked</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
        <div>
          <label htmlFor="filter-date" className="mb-1 block text-sm font-medium">Date</label>
          <input
            id="filter-date"
            type="date"
            value={date}
            onChange={(e) => { setDate(e.target.value); setPage(1); }}
            className="rounded border px-3 py-2"
          />
        </div>
        {(status || date) && (
          <button
            onClick={() => { setStatus(""); setDate(""); setPage(1); }}
            className="self-end text-sm text-teal-700 hover:underline"
          >
            Clear filters
          </button>
        )}
      </div>

      {error && <p className="mb-4 rounded bg-red-50 p-3 text-sm text-red-700">{error}</p>}
      {loading && <p className="text-gray-500">Loading appointments...</p>}
      {!loading && appointments.length === 0 && (
        <p className="text-gray-500">No appointments found.</p>
      )}

      {/* List */}
      {!loading && appointments.length > 0 && (
        <ul className="space-y-3">
          {appointments.map((a) => (
            <li
              key={a._id}
              className="flex flex-col gap-3 rounded-lg bg-white p-4 shadow sm:flex-row sm:items-center sm:justify-between"
            >
              <div>
                <p className="font-semibold text-gray-800">
                  {a.service?.name || "Service removed"}
                </p>
                <p className="text-sm text-gray-600">
                  {a.slot?.date} · {a.slot?.startTime}–{a.slot?.endTime}
                </p>
                <p className="text-sm text-gray-500">
                  {a.user?.name} ({a.user?.email})
                </p>
                {a.notes && <p className="mt-1 text-sm text-gray-500">Note: {a.notes}</p>}
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <span className={`rounded-full px-3 py-1 text-xs font-medium ${statusStyles[a.status]}`}>
                  {a.status}
                </span>
                {a.status === "booked" && (
                  <>
                    <button
                      onClick={() => updateStatus(a._id, "complete")}
                      disabled={busyId === a._id}
                      className="rounded bg-blue-600 px-3 py-1 text-sm text-white hover:bg-blue-700 disabled:opacity-50"
                    >
                      Complete
                    </button>
                    <button
                      onClick={() => updateStatus(a._id, "cancel")}
                      disabled={busyId === a._id}
                      className="rounded border border-red-300 px-3 py-1 text-sm text-red-700 hover:bg-red-50 disabled:opacity-50"
                    >
                      Cancel
                    </button>
                  </>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-6 flex items-center justify-center gap-4">
          <button
            onClick={() => setPage((p) => p - 1)}
            disabled={page === 1}
            className="rounded border px-3 py-1 disabled:opacity-40"
          >
            Previous
          </button>
          <span className="text-sm text-gray-600">Page {page} of {totalPages}</span>
          <button
            onClick={() => setPage((p) => p + 1)}
            disabled={page === totalPages}
            className="rounded border px-3 py-1 disabled:opacity-40"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}