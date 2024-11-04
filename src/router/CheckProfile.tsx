import { useEffect, useState } from "react";
import { useSession } from "../context/SessionContext";
import { supabase } from "../api/supabase";
import CreateUserName from "../pages/CreateUsername";

const CheckProfile = ({ children }: any) => {
  const { session } = useSession();
  const [hasProfile, setHasProfile] = useState<boolean | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      if (session) {
        const { data, error } = await supabase
          .from("profile")
          .select("username")
          .eq("id", session.user.id)
          .single();

        if (error?.code === "PGRST116" || !data?.username) {
          setHasProfile(false);
        } else {
          setHasProfile(!!data);
        }
      }
    };

    fetchProfile();
  }, []);

  if (hasProfile === null) {
    return <div>Loading...</div>;
  }

  if (!hasProfile) {
    return <CreateUserName />;
  }

  return <>{children}</>;
};

export default CheckProfile;
