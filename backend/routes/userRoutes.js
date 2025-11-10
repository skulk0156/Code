import express from "express";
import {
  loginUser,
  createUser,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
  upload
} from "../controllers/userController.js";

const router = express.Router();

router.post("/login", loginUser);
router.post("/register", upload.single("profileImage"), createUser);
router.get("/", getUsers);
router.get("/:id", getUserById);
router.put("/:id", upload.single("profileImage"), updateUser);
router.delete("/:id", deleteUser);

export default router;
