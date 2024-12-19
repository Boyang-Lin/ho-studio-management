import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    // Check current session
    const checkSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (mounted) {
          if (error || !session) {
            console.log("No session found, redirecting to login");
            navigate("/login", { replace: true });
          }
          setIsLoading(false);
        }
      } catch (error) {
        console.error("Session check error:", error);
        if (mounted) {
          navigate("/login", { replace: true });
          setIsLoading(false);
        }
      }
    };

    // Initial session check
    checkSession();

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log("Auth state changed:", event);
        
        if (mounted) {
          if (event === 'SIGNED_OUT' || !session) {
            navigate("/login", { replace: true });
          }
          setIsLoading(false);
        }
      }
    );

    // Cleanup
    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return <>{children}</>;
};

export default ProtectedRoute;