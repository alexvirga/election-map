import { useState } from "react";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "../../api/supabase";
import { useSession } from "../../context/SessionContext";
import { Navigate } from "react-router-dom";

type ExtendedAuthError = {
  message: string;
  status?: number;
  error_description?: string; // Added this property
};

const AuthPage = () => {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");

  const { session } = useSession();

  if (session) {
    return <Navigate to="/home" />;
  }

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();

    setLoading(true);
    const { error } = await supabase.auth.signInWithOtp({ email });

    if (error) {
      const extendedError = error as ExtendedAuthError;
      alert(extendedError.error_description || extendedError.message);
    } else {
      alert("Check your email for the login link!");
    }
    setLoading(false);
  };

  return (
    <div className="row flex flex-center">
      <div className="col-6 form-widget">
        <h1 className="header">Supabase + React</h1>
        <p className="description">
          Sign in via magic link with your email below
        </p>
        <form className="form-widget" onSubmit={handleLogin}>
          <div>
            <input
              className="inputField"
              type="email"
              placeholder="Your email"
              value={email}
              required={true}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <button className={"button block"} disabled={loading}>
              {loading ? <span>Loading</span> : <span>Send magic link</span>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AuthPage;
