import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "../api/supabase";
import USMap from "./Map/USMap";
import { SelectedElectoralVotes } from "../types";
import { usStatesPathData, electoralVotes } from "../usStatesPathData";
import LeagueResultsTable from "./LeagueResultsTable";
type Member = {
  user_id: string;
  profile: {
    username: string | null;
    electoral_predictions: SelectedElectoralVotes;
  };
};

export const LeagueDetails = () => {
  const { id: leagueId } = useParams<{ id: string }>();
  const [members, setMembers] = useState<Member[]>([]);
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);

  const [status, setStatus] = useState("");

  useEffect(() => {
    if (!leagueId) {
      setStatus("Error: League ID is missing");
      console.error("League ID is undefined or missing.");
      return;
    }

    const fetchMembers = async () => {
      setStatus("Loading...");
      const { data, error } = await supabase
        .from("user_leagues")
        .select("user_id, profile(username, electoral_predictions )")
        .eq("league_id", leagueId);

      if (error) {
        setStatus(`Error fetching members: ${error.message}`);
      } else {
        setMembers(data as unknown as Member[]);
        setStatus("");
      }
    };

    fetchMembers();
  }, [leagueId]);

  const handleMemberClick = (member: Member) => {
    setSelectedMember(member);
    console.log("members", members);
  };

  return (
    <div>
      <h1>League Members</h1>
      {status && <p>{status}</p>}
      <ul>
        {members.map((member) => (
          <li key={member.user_id}>
            <button onClick={() => handleMemberClick(member)}>
              {member.profile.username || "Anonymous"}
            </button>
          </li>
        ))}
      </ul>

      <LeagueResultsTable members={members} />

      {/* {selectedMember && (
        <div>
          <h2>Prediction for {selectedMember.profile.username}</h2>
          <USMap
            selectedStates={
              selectedMember.profile.electoral_predictions || electoralVotes
            }
            setSelectedStates={() => {}}
          />
        </div>
      )} */}
    </div>
  );
};

export default LeagueDetails;
