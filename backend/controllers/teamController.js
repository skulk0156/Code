import Team from "../models/Team.js";
import User from "../models/User.js";

// ================================
// Create a new team (Admin only)
// ================================
export const createTeam = async (req, res) => {
  try {
    const { team_name, team_leader_id, member_ids } = req.body;

    if (!team_name || !team_leader_id) {
      return res.status(400).json({ message: "Team name and leader are required" });
    }

    const members = member_ids ? member_ids.map(id => ({ employee: id })) : [];

    const team = await Team.create({
      team_name,
      team_leader: team_leader_id,
      members
    });

    await team.populate("team_leader", "name role email");
    await team.populate("members.employee", "name role email");

    res.status(201).json({ message: "Team created successfully", team });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// ================================
// Get all teams
// - Admin sees all
// - Members see only teams they are in
// ================================
export const getTeams = async (req, res) => {
  try {
    let teams;

    if (req.user.role === "admin") {
      teams = await Team.find()
        .populate("team_leader", "name role email department designation phone joining_date")
        .populate("members.employee", "name role email department designation phone joining_date");
    } else {
      teams = await Team.find({
        $or: [
          { team_leader: req.user.id },
          { "members.employee": req.user.id }
        ]
      })
        .populate("team_leader", "name role email department designation phone joining_date")
        .populate("members.employee", "name role email department designation phone joining_date");
    }

    res.json(teams);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};


// ================================
// Update a team (Admin only)
// ================================
export const updateTeam = async (req, res) => {
  try {
    const { id } = req.params;
    const { team_name, team_leader_id, member_ids } = req.body;

    const members = member_ids ? member_ids.map(empId => ({ employee: empId })) : [];

    const team = await Team.findByIdAndUpdate(
      id,
      {
        team_name,
        team_leader: team_leader_id,
        members
      },
      { new: true }
    )
      .populate("team_leader", "name role email")
      .populate("members.employee", "name role email");

    if (!team) return res.status(404).json({ message: "Team not found" });

    res.json({ message: "Team updated successfully", team });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// ================================
// Delete a team (Admin only)
// ================================
export const deleteTeam = async (req, res) => {
  try {
    const { id } = req.params;

    const team = await Team.findByIdAndDelete(id);

    if (!team) return res.status(404).json({ message: "Team not found" });

    res.json({ message: "Team deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// ================================
// Get a single team by ID
// ================================
export const getTeamById = async (req, res) => {
  try {
    const { id } = req.params;
    const team = await Team.findById(id)
      .populate("team_leader", "name role email")
      .populate("members.employee", "name role email");

    if (!team) return res.status(404).json({ message: "Team not found" });

    res.json(team);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

