import React, { useState } from 'react';
import Navbar from './Navbar';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const roles = ['employee', 'hr', 'manager', 'admin'];
const genders = ['Male', 'Female', 'Other'];

const AddEmployee = () => {
  const [formData, setFormData] = useState({
    employeeId: '',
    name: '',
    email: '',
    role: 'employee',
    department: '',
    designation: '',
    phone: '',
    dob: '',
    joiningDate: '',
    password: '',
    confirmPassword: '',
    gender: 'Male',
  });

  const [loading, setLoading] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const [preview, setPreview] = useState('');
  const [errors, setErrors] = useState({});
  const [passwordStrength, setPasswordStrength] = useState(0);

  // Validators
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const phoneRegex = /^[0-9]{10}$/;

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({ ...prev, [name]: value }));

    // Live validation
    switch (name) {
      case 'email':
        setErrors((prev) => ({
          ...prev,
          email: emailRegex.test(value) ? '' : 'Invalid email format',
        }));
        break;
      case 'phone':
        setErrors((prev) => ({
          ...prev,
          phone: phoneRegex.test(value) ? '' : 'Phone must be 10 digits',
        }));
        break;
      case 'password':
        let strength = 0;
        if (value.length >= 8) strength++;
        if (/[A-Z]/.test(value)) strength++;
        if (/[0-9]/.test(value)) strength++;
        if (/[\W]/.test(value)) strength++;
        setPasswordStrength(strength);

        setErrors((prev) => ({
          ...prev,
          password:
            strength < 3
              ? 'Password should have 8+ chars, uppercase, number & symbol'
              : '',
        }));

        setErrors((prev) => ({
          ...prev,
          confirmPassword:
            formData.confirmPassword && formData.confirmPassword !== value
              ? 'Passwords do not match'
              : '',
        }));
        break;
      case 'confirmPassword':
        setErrors((prev) => ({
          ...prev,
          confirmPassword:
            value !== formData.password ? 'Passwords do not match' : '',
        }));
        break;
      default:
        break;
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setProfileImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (Object.values(errors).some((err) => err)) {
      toast.error('Please fix the errors before submitting');
      return;
    }

    setLoading(true);
    try {
      const data = new FormData();
      Object.keys(formData).forEach((key) => data.append(key, formData[key]));
      if (profileImage) data.append('profileImage', profileImage);

      await axios.post('http://localhost:5000/api/users', data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      toast.success('Employee added successfully!');
      setFormData({
        employeeId: '',
        name: '',
        email: '',
        role: 'employee',
        department: '',
        designation: '',
        phone: '',
        dob: '',
        joiningDate: '',
        password: '',
        confirmPassword: '',
        gender: 'Male',
      });
      setProfileImage(null);
      setPreview('');
      setErrors({});
      setPasswordStrength(0);
    } catch (err) {
      console.error(err);
      toast.error('Failed to add employee');
    } finally {
      setLoading(false);
    }
  };

  const InputField = ({ label, name, type = 'text', tooltip }) => (
    <div className="relative group w-full">
      <input
        type={type}
        name={name}
        value={formData[name]}
        onChange={handleChange}
        placeholder=" "
        className={`peer w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-sky-300 outline-none ${
          errors[name] ? 'border-red-500' : 'border-sky-200'
        }`}
        required
      />
      <label className="absolute left-3 top-2 text-gray-500 text-sm transition-all duration-200 peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-base peer-focus:top-[-0.5rem] peer-focus:text-sky-600 peer-focus:text-sm bg-white px-1">
        {label}
      </label>
      {tooltip && (
        <span className="absolute right-2 top-2 text-gray-400 text-xs group-hover:text-gray-600 transition">
          {tooltip}
        </span>
      )}
      {errors[name] && <p className="text-red-500 text-xs mt-1">{errors[name]}</p>}
    </div>
  );

  const PasswordStrengthMeter = () => {
    const colors = ['bg-red-400', 'bg-yellow-400', 'bg-orange-400', 'bg-green-500'];
    return (
      <div className="w-full h-2 bg-gray-200 rounded mt-1">
        <div
          style={{ width: `${(passwordStrength / 4) * 100}%` }}
          className={`h-2 rounded ${colors[passwordStrength - 1] || ''} transition-all duration-300`}
        ></div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-blue-100">
      <Navbar />
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
      <div className="flex justify-center py-12 px-4">
        <div className="bg-white rounded-2xl shadow-xl w-full max-w-3xl p-6 md:p-8 space-y-4 transform hover:scale-105 transition-transform duration-300">
          <h2 className="text-2xl font-bold text-sky-600 text-center mb-4">
            Add New Employee
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InputField label="Employee ID" name="employeeId" />
              <InputField label="Full Name" name="name" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InputField label="Email" name="email" type="email" />
              <div className="relative group">
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-sky-200 rounded-lg focus:ring-2 focus:ring-sky-300 bg-white"
                >
                  {roles.map((r) => (
                    <option key={r} value={r}>
                      {r.charAt(0).toUpperCase() + r.slice(1)}
                    </option>
                  ))}
                </select>
                <label className="absolute -top-3 left-3 text-gray-500 text-sm bg-white px-1">
                  Role
                </label>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InputField label="Department" name="department" />
              <InputField label="Designation" name="designation" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InputField label="Phone" name="phone" />
              <InputField label="Date of Birth" name="dob" type="date" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InputField label="Joining Date" name="joiningDate" type="date" />
              <div className="relative group">
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-sky-200 rounded-lg focus:ring-2 focus:ring-sky-300 bg-white"
                >
                  {genders.map((g) => (
                    <option key={g} value={g}>{g}</option>
                  ))}
                </select>
                <label className="absolute -top-3 left-3 text-gray-500 text-sm bg-white px-1">
                  Gender
                </label>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InputField label="Password" name="password" type="password" />
              <InputField label="Confirm Password" name="confirmPassword" type="password" />
            </div>
            <PasswordStrengthMeter />

            <div className="flex flex-col items-center gap-2">
              <label className="cursor-pointer text-sky-500 font-medium">
                Upload Profile Image
                <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
              </label>
              {preview && (
                <img
                  src={preview}
                  alt="Preview"
                  className="w-24 h-24 object-cover rounded-full border-2 border-sky-300 shadow-md"
                />
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-sky-400 to-sky-600 text-white py-2 rounded-lg font-semibold hover:scale-105 transition-transform"
            >
              {loading ? 'Adding...' : 'Add Employee'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddEmployee;
