import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  employeeId: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['admin', 'employee', 'hr', 'manager'], required: true },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('User', userSchema);
