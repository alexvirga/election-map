import { SelectedElectoralVotes } from "../types";
import { supabase } from "./supabase";

export const ensureProfileExists = async (user: string) => {
  try {
    const { data: profile, error } = await supabase
      .from("profile")
      .select("id")
      .eq("id", user)
      .single();

    if (!profile && !error) {
      const { error: insertError } = await supabase
        .from("profile")
        .insert([{ id: user }]);

      if (insertError) {
        console.error("Error creating profile:", insertError.message);
      } else {
        console.log("Profile created successfully");
      }
    }
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error checking profile existence:", error.message);
    }
  }
};

// export const createProfile = async (userId: string, username: string) => {
//   try {
//     const { error: insertError } = await supabase
//       .from("profile")
//       .insert([{ id: userId, username: username }]);
//   } catch (error) {
//     if (error) {
//       console.error("Error creating profile");
//     }
//   }
// };

export const createProfile = async (id: string, username: string) => {
  try {
    const { data, error } = await supabase
      .from("profile")
      .upsert([{ id, username }], { onConflict: "id" });

    if (error) {
      console.error("Error creating profile:", error.message);
      return { success: false, message: error.message };
    }

    console.log("Profile created successfully:", data);
    return { success: true, data };
  } catch (err) {
    console.error("Unexpected error:", err);
    return { success: false, message: "An unexpected error occurred" };
  }
};

export const getProfile = async (userId: string) => {
  const { data, error } = await supabase
    .from("profile")
    .select("*")
    .eq("id", userId)
    .single();

  if (error) throw error;
  return data;
};

export const updatePrediction = async (
  userId: string,
  selectedStates: SelectedElectoralVotes
) => {
  const { error } = await supabase
    .from("profile")
    .update({
      electoral_predictions: selectedStates,
    })
    .eq("id", userId);

  if (error) {
    throw error;
  }
};

export const predictionApi = {
  async createPrediction(
    userId: string,
    selectedStates: SelectedElectoralVotes
  ) {
    const { data, error } = await supabase
      .from("state_predictions")
      .upsert(
        {
          user_id: userId,
          predictions: selectedStates,
        },
        { onConflict: "user_id" }
      )
      .eq("id", userId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async updatePrediction(
    userId: string,
    id: string,
    selectedStates: SelectedElectoralVotes
  ) {
    const { error } = await supabase
      .from("state_predictions")
      .update({
        predictions: selectedStates,
      })
      .eq("id", id)
      .eq("user_id", userId); // Ensure update is scoped to the correct user

    if (error) throw error;
  },

  async getUserPredictions(userId: string) {
    const { data, error } = await supabase
      .from("state_predictions")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data;
  },
};
