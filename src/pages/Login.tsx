import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Container from "@/components/Container";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Login = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const checkSession = async () => {
      try {
        // Clear any existing session first
        await supabase.auth.signOut();
        
        const { data: { session }, error } = await supabase.auth.getSession();
        if (session && !error) {
          navigate("/", { replace: true });
        }
      } catch (error) {
        console.error("Session check error:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "There was a problem checking your session. Please try again.",
        });
      } finally {
        setIsLoading(false);
      }
    };

    // Check initial session
    checkSession();

    // Listen for auth state changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session) {
        navigate("/", { replace: true });
      } else if (event === 'SIGNED_OUT') {
        setIsLoading(false);
      }
    });

    // Cleanup subscription
    return () => subscription.unsubscribe();
  }, [navigate, toast]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <Container className="max-w-md py-8">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold">Project Management</h1>
          <p className="text-muted-foreground mt-2">Sign in to your account</p>
        </div>
        <Auth
          supabaseClient={supabase}
          appearance={{ 
            theme: ThemeSupa,
            variables: {
              default: {
                colors: {
                  brand: '#000000',
                  brandAccent: '#666666',
                }
              }
            }
          }}
          theme="light"
          providers={[]}
          redirectTo={window.location.origin}
          view="sign_in"
          localization={{
            variables: {
              sign_up: {
                email_label: "Email",
                password_label: "Password",
                button_label: "Sign Up"
              }
            }
          }}
          magicLink={false}
          socialLayout="horizontal"
          showLinks={true}
          additionalData={{
            full_name: {
              required: true,
              label: "Full Name"
            }
          }}
        />
      </Container>
    </div>
  );
};

export default Login;