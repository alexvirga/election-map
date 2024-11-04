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

export const isAfter6PMNov5th2024 = () => {
  const currentTime = new Date();

  const targetTime = new Date(Date.UTC(2024, 10, 5, 23, 0, 0));

  return currentTime > targetTime;
};
