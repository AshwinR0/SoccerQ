import { useLocation } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="text-center animate-fade-in">
        <div className="text-8xl mb-4 text-gradient-pitch">404</div>
        <h1 className="mb-4 text-2xl font-bold text-foreground">Page Not Found</h1>
        <p className="mb-6 text-muted-foreground max-w-md">
          The page you're looking for doesn't exist. It might have been moved or deleted.
        </p>
        <a 
          href="/" 
          className="inline-flex items-center px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium"
        >
          Return to Home
        </a>
      </div>
    </div>
  );
};

export default NotFound;
