import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const checkSession = async () => {
      try {
        // First try to get the session from localStorage
        const storedSession = localStorage.getItem('sb-axogrfruqxnddnrrgzua-auth-token');
        
        if (!storedSession) {
          console.log("No stored session found");
          if (mounted) {
            navigate("/login", { replace: true });
            setIsLoading(false);
          }
          return;
        }

        // Then verify the session with Supabase
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (mounted) {
          if (error) {
            console.error("Session error:", error);
            navigate("/login", { replace: true });
          } else if (!session) {
            console.log("No active session found");
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
          } else if (event === 'SIGNED_IN') {
            // Ensure the session is properly stored
            const currentSession = await supabase.auth.getSession();
            if (!currentSession.data.session) {
              navigate("/login", { replace: true });
            }
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