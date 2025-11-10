import express from "express";
import { createTeam, getTeams, updateTeam, deleteTeam , getTeamById } from "../controllers/teamController.js";
import { protect, authorizeRoles } from "../middleware/authMiddleware.js"; // Updated import

const router = express.Router();

// Admin can create team
router.post("/", protect, authorizeRoles("admin"), createTeam);

// Get teams (admin sees all, member sees only their teams)
router.get("/", protect, getTeams);

router.get("/:id", getTeamById);

// Update team (admin only)
router.put("/:id", protect, authorizeRoles("admin"), updateTeam);

// Delete team (admin only)
router.delete("/:id", protect, authorizeRoles("admin"), deleteTeam);

export default router;
