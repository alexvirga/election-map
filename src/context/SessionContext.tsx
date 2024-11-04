import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../api/supabase";
import LoadingPage from "../pages/LoadingPage";
import { Session } from "@supabase/supabase-js";

const SessionContext = createContext<{
  session: Session | null;
}>({
  session: null,
});

export const useSession = () => {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error("useSession must be used within a SessionProvider");
  }
  return context;
};

type Props = { children: React.ReactNode };
export const SessionProvider = ({ children }: Props) => {
  const [session, setSession] = useState<Session | null>(null);

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const handleAuthStateChange = async () => {
      const { data: authListener } = supabase.auth.onAuthStateChange(
        async (_, session) => {
          setSession(session);

          setIsLoading(false);
        }
      );

      return () => {
        console.log("Cleaning up listener...");
        authListener?.subscription.unsubscribe();
      };
    };

    handleAuthStateChange();
  }, []);

  return (
    <SessionContext.Provider value={{ session }}>
      {isLoading ? <LoadingPage /> : children}
    </SessionContext.Provider>
  );
};
