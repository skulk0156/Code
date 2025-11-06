import User from '../models/User.js';
import bcrypt from 'bcrypt';

const SALT_ROUNDS = 10;

// Add User
export const addUser = async (req, res) => {
  try {
    const { employeeId, name, email, password, role, department, designation, phone, joining_date } = req.body;

    if (!employeeId || !name || !email || !password || !role) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    // Check if user exists
    const existing = await User.findOne({ $or: [{ email }, { employeeId }] });
    if (existing) return res.status(400).json({ message: 'User already exists' });

    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    const newUser = new User({
      employeeId,
      name,
      email,
      password: hashedPassword,
      role,
      department,
      designation,
      phone,
      joining_date,
    });

    await newUser.save();
    res.status(201).json({ message: 'User added successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get Users by role (employee, hr, manager)
export const getUsers = async (req, res) => {
  try {
    const users = await User.find({ role: { $in: ['employee', 'hr', 'manager'] } })
      .select('employeeId name email role department designation phone');
    res.status(200).json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};
