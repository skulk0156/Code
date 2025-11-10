// AddEmployee.jsx
import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FaEye, FaEyeSlash, FaRegCopy } from "react-icons/fa";
import Swal from "sweetalert2";
import axios from "axios";
import Navbar from "./Navbar";
import Footer from "./Footer";

const departments = [
  "Engineering",
  "HR",
  "Finance",
  "Marketing",
  "Sales",
  "Operations",
  "IT Support",
  "Customer Service",
  "Logistics",
  "Legal",
  "Procurement",
  "R&D",
  "Quality",
  "Admin",
  "Production",
  "Maintenance",
  "Design",
  "Training",
  "Compliance",
  "Analytics",
  "Strategy",
  "Security",
  "Public Relations",
  "Facilities",
  "Health & Safety",
  "UX/UI",
  "Data Science",
  "Content",
  "Business Development",
  "Innovation"
];

const designations = [
  "Manager",
  "Senior Engineer",
  "Junior Engineer",
  "Intern",
  "Team Lead",
  "HR Executive",
  "Finance Analyst",
  "Marketing Specialist",
  "Sales Associate",
  "Operations Manager",
  "IT Support Engineer",
  "Customer Support Rep",
  "Logistics Coordinator",
  "Legal Advisor",
  "Procurement Officer",
  "R&D Scientist",
  "Quality Analyst",
  "Admin Assistant",
  "Production Supervisor",
  "Maintenance Technician",
  "Designer",
  "Trainer",
  "Compliance Officer",
  "Data Analyst",
  "Strategy Consultant",
  "Security Officer",
  "PR Executive",
  "Facilities Manager",
  "Safety Officer",
  "Content Writer",
  "Business Developer",
  "Innovation Lead",
  "UX Designer",
  "UI Designer",
  "Data Engineer",
  "Product Manager",
  "Software Engineer",
  "Network Engineer",
  "Cloud Engineer",
  "DevOps Engineer",
  "Database Admin",
  "AI Specialist",
  "Machine Learning Engineer",
  "Cybersecurity Analyst",
  "Marketing Manager",
  "Sales Manager",
  "Operations Executive",
  "HR Manager",
  "Finance Manager",
  "Legal Manager",
  "Customer Success Manager"
];

const AddEmployee = () => {
  const [formData, setFormData] = useState({
    employeeId: "",
    fullName: "",
    email: "",
    phone: "",
    gender: "",
    dob: null,
    joiningDate: null,
    password: "",
    confirmPassword: "",
    department: "",
    designation: "",
    role: "employee",
    profileImage: null,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  // Generate Employee ID yymm + 4 random digits
  const generateEmployeeId = (joiningDate) => {
    if (!joiningDate) return "";
    const year = String(joiningDate.getFullYear()).slice(-2);
    const month = String(joiningDate.getMonth() + 1).padStart(2, "0");
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    return `${year}${month}${randomNum}`;
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "profileImage") {
      setFormData((prev) => ({ ...prev, profileImage: files[0] }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleDateChange = (date, field) => {
    if (field === "joiningDate") {
      const empId = generateEmployeeId(date);
      setFormData((prev) => ({ ...prev, [field]: date, employeeId: empId }));
    } else {
      setFormData((prev) => ({ ...prev, [field]: date }));
    }
  };

  const copyEmpId = async () => {
    if (!formData.employeeId) return;
    try {
      await navigator.clipboard.writeText(formData.employeeId);
      Swal.fire({
        icon: "success",
        title: "Copied!",
        text: "Employee ID copied to clipboard",
        timer: 1500,
        showConfirmButton: false,
      });
    } catch (err) {
      console.error(err);
    }
  };

  const validateForm = () => {
    const {
      fullName,
      email,
      phone,
      gender,
      dob,
      joiningDate,
      password,
      confirmPassword,
      department,
      designation,
    } = formData;

    if (!fullName) return "Full Name is required";
    if (!email) return "Email is required";
    if (!phone) return "Phone number is required";
    if (!gender) return "Gender is required";
    if (!dob) return "Date of Birth is required";
    if (!joiningDate) return "Joining Date is required";
    if (!department) return "Department is required";
    if (!designation) return "Designation is required";
    if (!password) return "Password is required";
    if (password !== confirmPassword) return "Passwords do not match";

    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const error = validateForm();
    if (error) {
      Swal.fire({
        icon: "error",
        title: "Validation Error",
        text: error,
      });
      return;
    }

    // Show confirmation modal
    const result = await Swal.fire({
      title: "Confirm Employee Details",
      html: `
        <strong>Employee ID:</strong> ${formData.employeeId} <br/>
        <strong>Name:</strong> ${formData.fullName} <br/>
        <strong>Email:</strong> ${formData.email} <br/>
        <strong>Phone:</strong> ${formData.phone} <br/>
        <strong>Gender:</strong> ${formData.gender} <br/>
        <strong>DOB:</strong> ${formData.dob.toLocaleDateString()} <br/>
        <strong>Joining Date:</strong> ${formData.joiningDate.toLocaleDateString()} <br/>
        <strong>Department:</strong> ${formData.department} <br/>
        <strong>Designation:</strong> ${formData.designation} <br/>
      `,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Confirm",
    });

    if (!result.isConfirmed) return;

    // Prepare FormData for API
    // Prepare FormData for API
const data = new FormData();
data.append("employeeId", formData.employeeId);
data.append("name", formData.fullName); // <-- map fullName to name
data.append("email", formData.email);
data.append("role", formData.role);
data.append("password", formData.password);
data.append("department", formData.department);
data.append("designation", formData.designation);
if (formData.profileImage) data.append("profileImage", formData.profileImage);
data.append("phone", formData.phone);
data.append("joining_date", formData.joiningDate?.toISOString());


    try {
      const res = await axios.post(
        "http://localhost:5000/api/users/register",
        data,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      Swal.fire({
        icon: "success",
        title: "Employee Added",
        text: `Employee ${res.data.user.name} added successfully!`,
      });

      // Reset form
      setFormData({
        employeeId: "",
        fullName: "",
        email: "",
        phone: "",
        gender: "",
        dob: null,
        joiningDate: null,
        password: "",
        confirmPassword: "",
        department: "",
        designation: "",
        role: "employee",
        profileImage: null,
      });
    } catch (err) {
      console.error(err);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: err.response?.data?.message || "Something went wrong",
      });
    }
  };

  return (
    <div>
      <Navbar />
      <div className="min-h-screen bg-blue-100 flex justify-center items-center px-4 py-8">
        <form
          onSubmit={handleSubmit}
          className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-2xl space-y-6"
        >
          <h2 className="text-3xl font-bold text-center text-blue-700 mb-6">
            Add New Employee
          </h2>

          {/* Employee ID */}
          <div>
            <label className="block mb-2 font-semibold text-gray-700">
              Employee ID
            </label>
            <div className="relative flex items-center">
              <input
                type="text"
                name="employeeId"
                value={formData.employeeId}
                readOnly
                className="w-full p-3 pr-12 border border-gray-300 rounded-lg bg-gray-100"
              />
              <button
                type="button"
                onClick={copyEmpId}
                className="absolute right-3 flex items-center justify-center text-gray-600 hover:text-gray-800 top-1/2 transform -translate-y-1/2"
                title="Copy Employee ID"
              >
                <FaRegCopy />
              </button>
            </div>
          </div>

          {/* Full Name & Email */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block mb-2 font-semibold text-gray-700">
                Full Name
              </label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="Enter full name"
                className="w-full p-3 border border-gray-300 rounded-lg"
              />
            </div>
            <div>
              <label className="block mb-2 font-semibold text-gray-700">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter email"
                className="w-full p-3 border border-gray-300 rounded-lg"
              />
            </div>
          </div>

          {/* Phone & Gender */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block mb-2 font-semibold text-gray-700">
                Phone Number
              </label>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Enter phone number"
                className="w-full p-3 border border-gray-300 rounded-lg"
              />
            </div>
            <div>
              <label className="block mb-2 font-semibold text-gray-700">
                Gender
              </label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg bg-white"
              >
                <option value="">Select gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          {/* DOB & Joining Date */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block mb-2 font-semibold text-gray-700">
                Date of Birth
              </label>
              <DatePicker
                selected={formData.dob}
                onChange={(date) => handleDateChange(date, "dob")}
                dateFormat="dd/MM/yyyy"
                maxDate={new Date()}
                placeholderText="Select date of birth"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 cursor-pointer"
              />
            </div>
            <div>
              <label className="block mb-2 font-semibold text-gray-700">
                Joining Date
              </label>
              <DatePicker
                selected={formData.joiningDate}
                onChange={(date) => handleDateChange(date, "joiningDate")}
                dateFormat="dd/MM/yyyy"
                placeholderText="Select joining date"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 cursor-pointer"
              />
            </div>
          </div>

          {/* Department & Designation */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block mb-2 font-semibold text-gray-700">
                Department
              </label>
              <select
                name="department"
                value={formData.department}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg bg-white"
              >
                <option value="">Select Department</option>
                {departments.map((d, i) => (
                  <option key={i} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block mb-2 font-semibold text-gray-700">
                Designation
              </label>
              <select
                name="designation"
                value={formData.designation}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg bg-white"
              >
                <option value="">Select Designation</option>
                {designations.map((d, i) => (
                  <option key={i} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Password & Confirm */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative flex flex-col justify-center">
              <label className="block mb-2 font-semibold text-gray-700">
                Password
              </label>
              <div className="relative flex items-center">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter password"
                  className="w-full p-3 pr-12 border border-gray-300 rounded-lg"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 flex items-center justify-center text-gray-600 hover:text-gray-800 top-1/2 transform -translate-y-1/2"
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>
            <div className="relative flex flex-col justify-center">
              <label className="block mb-2 font-semibold text-gray-700">
                Confirm Password
              </label>
              <div className="relative flex items-center">
                <input
                  type={showConfirm ? "text" : "password"}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm password"
                  className="w-full p-3 pr-12 border border-gray-300 rounded-lg"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-3 flex items-center justify-center text-gray-600 hover:text-gray-800 top-1/2 transform -translate-y-1/2"
                >
                  {showConfirm ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>
          </div>

          {/* Profile Image */}
          <div>
            <label className="block mb-2 font-semibold text-gray-700">
              Profile Image
            </label>
            <input
              type="file"
              name="profileImage"
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg p-2"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white font-semibold py-3 rounded-lg hover:bg-blue-700 transition duration-200"
          >
            Add Employee
          </button>
        </form>
      </div>
      <Footer/>
    </div>
  );
};

export default AddEmployee;
