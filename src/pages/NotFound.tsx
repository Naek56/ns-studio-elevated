import { useLocation } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-grid px-6">
      <div className="mc-panel max-w-md p-10 text-center">
        <h1 className="wordmark mb-4 text-6xl">404</h1>
        <p className="font-round mb-6 text-lg text-muted-foreground">
          Ce bloc n'existe pas. Retourne au spawn.
        </p>
        <a href="/" className="mc-btn">
          Retour à l'accueil
        </a>
      </div>
    </div>
  );
};

export default NotFound;
