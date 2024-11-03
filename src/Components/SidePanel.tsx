import React, { useState, useEffect } from "react";
import { getProfile, updatePrediction } from "../api/api";

import MyLeagues from "../Components/MyLeagues";
import NewLeague from "../Components/CreateLeague/NewLeague";
import JoinLeague from "../Components/CreateLeague/JoinLeague";
import { useSession } from "../context/SessionContext";

export const SidePanel = () => {
  const [username, setUsername] = useState("");

  const { session } = useSession();
  const user = session?.user;

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        if (user) {
          const profile = await getProfile(user.id);

          if (profile.username) {
            setUsername(profile.username);
          }
        }
      } catch (error) {
        console.error("Error fetching predictions:", error);
      } finally {
      }
    };

    fetchProfile();
  }, []);

  return (
    <div
      style={{
        height: "100vh",
        backgroundColor: "white",
        width: "300px",
        borderRight: "1px solid black",
        padding: "20px",
        textAlign: "left",
      }}
    >
      <div>VotePot</div>
      <div> {username} </div>
      <MyLeagues />
      <JoinLeague />
      <NewLeague />
    </div>
  );
};

export default SidePanel;
