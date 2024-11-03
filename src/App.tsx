import { useState, useEffect } from "react";
import "./App.css";
import Dashboard from "./pages/Dashboard";
import { supabase } from "./api/supabase";
import { useSession } from "./context/SessionContext";
import CreateUserName from "./pages/CreateUsername";

function App() {
  const { session } = useSession();
  const [profile, setProfile] = useState(null);
  const user = session?.user;

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        if (user) {
          const { data, error } = await supabase
            .from("profile")
            .select(`username`)
            .eq("id", user.id)
            .single();
          if (data) {
            setProfile(data.username);
          }
        }
      } catch (error) {
        console.error("Error fetching predictions:", error);
      } finally {
        // setLoading(false);
      }
    };

    fetchProfile();
  }, []);
  return <>{profile ? <Dashboard /> : <CreateUserName />}</>;
}

export default App;
