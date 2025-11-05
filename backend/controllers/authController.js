import User from '../models/User.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const SALT_ROUNDS = 10;

// Add user
export const addUser = async (req, res) => {
  try {
    const { employeeId, password, role } = req.body;
    if (!employeeId || !password || !role) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const existingUser = await User.findOne({ employeeId });
    if (existingUser) {
      return res.status(400).json({ message: 'Employee ID already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    const newUser = new User({ employeeId, password: hashedPassword, role });
    await newUser.save();

    res.status(201).json({ message: 'User added successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Login user with role validation
export const loginUser = async (req, res) => {
  try {
    const { employeeId, password, role } = req.body;
    if (!employeeId || !password || !role) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const user = await User.findOne({ employeeId });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check role
    if (user.role !== role) {
      return res.status(401).json({ message: 'Role does not match' });
    }

    // Generate JWT token (expires in 1 day)
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.status(200).json({
      message: 'Login successful',
      token,
      user: { id: user._id, employeeId: user.employeeId, role: user.role },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};
