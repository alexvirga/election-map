import { supabase } from "../api/supabase";
import { useNavigate } from "react-router-dom";

export const Navbar = () => {
  const navigate = useNavigate(); // Hook for navigation

  return (
    <div>
      {/* <button
        onClick={() => navigate("/")}
        className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
      >
        Home
      </button> */}

      {/* <button
        onClick={() => navigate("/new-league")}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        New League
      </button> */}
      {/* <button
        onClick={() => navigate("/join-league")}
        className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
      >
        Join League
      </button> */}
      {/* <button
        onClick={() => navigate("/my-leagues")}
        className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
      >
        My Leagues
      </button> */}
      <button
        onClick={() => supabase.auth.signOut()}
        className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
      >
        Sign Out
      </button>
    </div>
  );
};

export default Navbar;
