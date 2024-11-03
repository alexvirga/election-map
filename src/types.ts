export interface Prediction {
  id: string;
  user_id: string;
  name: string;
  predictions: {
    [stateCode: string]: {
      electoral_allocation: number;
      party: number;
    };
  };
  created_at: string;
}

export type SelectedElectoralVotes = {
  [key: string]: { electoral_allocation: number; party: number };
};
