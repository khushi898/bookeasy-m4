import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="py-16 text-center">
      <p className="text-5xl font-bold text-teal-700">404</p>
      <h1 className="mt-4 text-2xl font-bold text-gray-800">Page not found</h1>
      <p className="mt-2 text-gray-600">
        Sorry, the page you're looking for doesn't exist.
      </p>
      <Link
        to="/"
        className="mt-6 inline-block rounded bg-teal-700 px-6 py-3 font-medium text-white hover:bg-teal-800"
      >
        Back to home
      </Link>
    </div>
  );
}