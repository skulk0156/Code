import mongoose from "mongoose";

const teamSchema = new mongoose.Schema(
  {
    team_name: { type: String, required: true },

    // Link to User model for leader
    team_leader: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

    // Members array
    members: [
      {
        employee: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
      }
    ],
  },
  { timestamps: true }
);

const Team = mongoose.model("Team", teamSchema);
export default Team;
