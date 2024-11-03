import { Link } from "react-router-dom";
import { supabase } from "../api/supabase";
import { useSession } from "../context/SessionContext";
import { Navigate } from "react-router-dom";

const Landing = () => {
  const { session } = useSession();

  if (session?.user) {
    return <Navigate to="/home" />;
  }

  return (
    <main>
      <section className="main-container">
        <h1 className="header-text">React Supabase Auth Template</h1>
        <p>Current User : {session?.user.email || "None"}</p>
        {session ? (
          <button onClick={() => supabase.auth.signOut()}>Sign Out</button>
        ) : (
          <Link to="/auth/sign-in">Sign In</Link>
        )}
        <Link to="/protected">Protected Page 🛡️</Link>
        <div id="divider"></div>
      </section>
    </main>
  );
};

export default Landing;
