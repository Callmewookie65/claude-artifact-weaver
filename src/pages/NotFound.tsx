
import { useLocation } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f0f2f5]">
      <div className="text-center bg-white p-12 rounded-2xl shadow-sm">
        <h1 className="text-5xl font-bold mb-6 bg-gradient-custom">404</h1>
        <p className="text-xl text-[#555] mb-8">Oops! Page not found</p>
        <a href="/" className="btn-primary no-underline inline-block">
          Return to Home
        </a>
      </div>
    </div>
  );
};

export default NotFound;
