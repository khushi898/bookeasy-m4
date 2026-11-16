import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Home() {
  const { user } = useAuth();

  const steps = [
    { title: "1. Choose a service", text: "From check-ups to physiotherapy, with clear prices in £." },
    { title: "2. Pick a time", text: "See only the times that are still free on your chosen day." },
    { title: "3. You're booked", text: "View or cancel your appointments any time." },
  ];

  return (
    <div className="py-10 text-center">
      <h1 className="text-3xl font-bold text-gray-800 sm:text-4xl">
        Book your clinic appointment in minutes
      </h1>
      <p className="mx-auto mt-4 max-w-xl text-gray-600">
        Choose a service, pick a free time that suits you, and manage your
        bookings in one place. No phone calls, no double-bookings.
      </p>

      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link
          to="/services"
          className="rounded bg-teal-700 px-6 py-3 font-medium text-white hover:bg-teal-800"
        >
          Browse services
        </Link>
        {!user && (
          <Link
            to="/register"
            className="rounded border border-teal-700 px-6 py-3 font-medium text-teal-700 hover:bg-teal-50"
          >
            Create an account
          </Link>
        )}
      </div>

      <div className="mt-12 grid gap-4 text-left sm:grid-cols-3">
        {steps.map((step) => (
          <div key={step.title} className="rounded-lg bg-white p-5 shadow">
            <h2 className="font-semibold text-gray-800">{step.title}</h2>
            <p className="mt-1 text-sm text-gray-600">{step.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}