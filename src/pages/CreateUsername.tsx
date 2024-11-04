import { useState } from "react";
import { createProfile } from "../api/api";
import { useSession } from "../context/SessionContext";
import { useNavigate } from "react-router-dom";

export const CreateUserName = () => {
  const [username, setUserName] = useState("");

  const { session } = useSession();
  const user = session?.user;
  const navigate = useNavigate();

  if (!user) {
    return <p> no user </p>;
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    console.log(name);
    setUserName(name);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const { success } = await createProfile(user?.id, username);

    if (success) {
      return navigate(`/`);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={username}
          placeholder="Username"
          onChange={handleChange}
        />
        <button type="submit"> Continue </button>
      </form>
    </div>
  );
};

export default CreateUserName;
