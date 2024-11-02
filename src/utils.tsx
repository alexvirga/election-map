import { SelectedElectoralVotes } from "./usStatesPathData";

export const calculateTotals = (selectedStates: SelectedElectoralVotes) => {
  let democratVotes = 0;
  let republicanVotes = 0;

  for (const state in selectedStates) {
    if (selectedStates[state].party === 1) {
      democratVotes += selectedStates[state].electoral_allocation;
    } else if (selectedStates[state].party === 2) {
      republicanVotes += selectedStates[state].electoral_allocation;
    }
  }
  return { democratVotes, republicanVotes };
};
