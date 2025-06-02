import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import useToken from "../hooks/useToken";

const AddEmployee = () => {
  const navigate = useNavigate();
  const [url, getTokenLocalStorage] = useToken();
  const token = getTokenLocalStorage();

  const [formData, setFormData] = useState({
    full_name: "",
    employee_id: "",
    job_title: "",
    joining_date: "",
    contact: "",
    email: "",
    dob: "",
    present_address: "",
    permanent_address: "",
    nationality: "",
    national_id: "",
    passport_id: "",
    marital_status: "",
    religion: "",
    blood_group: "",
    dual_citizenship: "",
    gender: "",
    emergency_contact: "",
    emergency_relationship: "",
    nominee_name: "",
    nominee_relationship: "",
    bank_name: "",
    bank_account_number: "",
    bank_account_name: "",
    e_tin: "",
    status: "Active",
    photo: null,
    pre_work_his: "",
    submit_doc: [{ title: "", file: null }], // Array to handle multiple documents
  });
  const [successMessage, setSuccessMessage] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleDocChange = (index, field, value) => {
    setFormData((prev) => {
      const newSubmitDoc = [...prev.submit_doc];
      newSubmitDoc[index][field] = value;
      return { ...prev, submit_doc: newSubmitDoc };
    });
  };

  const handleFileChange = (index, e) => {
    const file = e.target.files[0];
    setFormData((prev) => {
      const newSubmitDoc = [...prev.submit_doc];
      newSubmitDoc[index].file = file;
      return { ...prev, submit_doc: newSubmitDoc };
    });
  };

  const addDocument = () => {
    setFormData((prev) => ({
      ...prev,
      submit_doc: [...prev.submit_doc, { title: "", file: null }],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    Object.keys(formData).forEach((key) => {
      if (key !== "submit_doc" && formData[key]) {
        data.append(key, formData[key]);
      }
    });
    formData.submit_doc.forEach((doc, index) => {
      if (doc.title) data.append(`submit_doc[${index}][title]`, doc.title);
      if (doc.file) data.append(`submit_doc[${index}][file]`, doc.file);
    });

    try {
      const response = await fetch(`${url}/employee/`, {
        method: "POST",
        headers: {
          Authorization: `Token ${token}`,
        },
        body: data,
      });
      const result = await response.json();
      if (result.success) {
        setSuccessMessage("Employee added successfully!");
        setFormData({
          full_name: "",
          employee_id: "",
          job_title: "",
          joining_date: "",
          contact: "",
          email: "",
          dob: "",
          present_address: "",
          permanent_address: "",
          nationality: "",
          national_id: "",
          passport_id: "",
          marital_status: "",
          religion: "",
          blood_group: "",
          dual_citizenship: "",
          gender: "",
          emergency_contact: "",
          emergency_relationship: "",
          nominee_name: "",
          nominee_relationship: "",
          bank_name: "",
          bank_account_number: "",
          bank_account_name: "",
          e_tin: "",
          status: "Active",
          photo: null,
          pre_work_his: "",
          submit_doc: [{ title: "", file: null }],
        });
        setTimeout(() => navigate("/employee-list"), 2000); // Redirect after 2 seconds
      } else {
        setError(result.message || "Failed to add employee");
      }
    } catch (err) {
      setError("An error occurred while adding the employee: " + err.message);
    }
  };

  const handleAddFile = (e, field) => {
    e.preventDefault();
    setFormData((prev) => ({ ...prev, [field]: e.target.files[0] }));
  };

  return (
    <div className="bg-white mt-16 p-4 sm:p-6 md:p-8 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Add Employee</h1>

      {/* Error and Success Messages */}
      {error && (
        <div className="mt-4 p-4 bg-red-100 text-red-700 rounded-md text-sm sm:text-base">
          {error}
        </div>
      )}
      {successMessage && (
        <div className="mt-4 p-4 bg-green-100 text-green-700 rounded-md text-sm sm:text-base">
          {successMessage}
        </div>
      )}

      <form onSubmit={handleSubmit} className="mt-6">
        {/* Image Section at Top Left */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700">Photo</label>
          <div className="mt-1 w-24 h-24 border-2 border-dashed border-gray-300 flex items-center justify-center">
            <input
              type="file"
              name="photo"
              onChange={(e) => handleAddFile(e, "photo")}
              className="hidden"
              id="photo-upload"
            />
            <label
              htmlFor="photo-upload"
              className="cursor-pointer text-center text-sm text-gray-600"
            >
             Upload image
            </label>
            {formData.photo && <span className="mt-2 block text-sm">{formData.photo.name}</span>}
          </div>
        </div>

        {/* Row 1: Name, Employee ID, Job Title, Joining Date */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Name *</label>
            <input
              type="text"
              name="full_name"
              value={formData.full_name}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2 sm:p-3 focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm sm:text-base"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Employee ID *</label>
            <input
              type="text"
              name="employee_id"
              value={formData.employee_id}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2 sm:p-3 focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm sm:text-base"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Job Title *</label>
            <input
              type="text"
              name="job_title"
              value={formData.job_title}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2 sm:p-3 focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm sm:text-base"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Joining Date *</label>
            <input
              type="date"
              name="joining_date"
              value={formData.joining_date}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2 sm:p-3 focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm sm:text-base"
              required
            />
          </div>
        </div>

        {/* Row 2: Phone Number, Email, Date of Birth, Present Address */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Phone Number *</label>
            <input
              type="tel"
              name="contact"
              value={formData.contact}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2 sm:p-3 focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm sm:text-base"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Email *</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2 sm:p-3 focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm sm:text-base"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Date of Birth *</label>
            <input
              type="date"
              name="dob"
              value={formData.dob}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2 sm:p-3 focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm sm:text-base"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Present Address *</label>
            <input
              type="text"
              name="present_address"
              value={formData.present_address}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2 sm:p-3 focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm sm:text-base"
              required
            />
          </div>
        </div>

        {/* Row 3: Permanent Address, Nationality, National ID, Passport ID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Permanent Address *</label>
            <input
              type="text"
              name="permanent_address"
              value={formData.permanent_address}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2 sm:p-3 focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm sm:text-base"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Nationality *</label>
            <input
              type="text"
              name="nationality"
              value={formData.nationality}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2 sm:p-3 focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm sm:text-base"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">National ID *</label>
            <input
              type="text"
              name="national_id"
              value={formData.national_id}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2 sm:p-3 focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm sm:text-base"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Passport ID *</label>
            <input
              type="text"
              name="passport_id"
              value={formData.passport_id}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2 sm:p-3 focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm sm:text-base"
              required
            />
          </div>
        </div>

        {/* Row 4: Marital Status, Religion, Blood Group, Dual Citizenship */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Marital Status *</label>
            <select
              name="marital_status"
              value={formData.marital_status}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2 sm:p-3 focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm sm:text-base"
              required
            >
              <option value="">Select</option>
              <option value="Single">Single</option>
              <option value="Married">Married</option>
              <option value="Divorced">Divorced</option>
              <option value="Widowed">Widowed</option>
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Religion *</label>
            <select
              name="religion"
              value={formData.religion}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2 sm:p-3 focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm sm:text-base"
              required
            >
              <option value="">Select</option>
              <option value="Islam">Islam</option>
              <option value="Hinduism">Hinduism</option>
              <option value="Buddhism">Buddhism</option>
              <option value="Christianity">Christianity</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Blood Group *</label>
            <select
              name="blood_group"
              value={formData.blood_group}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2 sm:p-3 focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm sm:text-base"
              required
            >
              <option value="">Select</option>
              <option value="A+">A+</option>
              <option value="A-">A-</option>
              <option value="B+">B+</option>
              <option value="B-">B-</option>
              <option value="AB+">AB+</option>
              <option value="AB-">AB-</option>
              <option value="O+">O+</option>
              <option value="O-">O-</option>
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Dual Citizenship</label>
            <input
              type="text"
              name="dual_citizenship"
              value={formData.dual_citizenship}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2 sm:p-3 focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm sm:text-base"
            />
          </div>
        </div>

        {/* Row 5: Gender, Emergency Contact, Emergency Relationship, Nominee Name */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Gender *</label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2 sm:p-3 focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm sm:text-base"
              required
            >
              <option value="">Select</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Emergency Contact *</label>
            <input
              type="tel"
              name="emergency_contact"
              value={formData.emergency_contact}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2 sm:p-3 focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm sm:text-base"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Emergency Relationship</label>
            <input
              type="text"
              name="emergency_relationship"
              value={formData.emergency_relationship}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2 sm:p-3 focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm sm:text-base"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Nominee Name</label>
            <input
              type="text"
              name="nominee_name"
              value={formData.nominee_name}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2 sm:p-3 focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm sm:text-base"
            />
          </div>
        </div>

        {/* Row 6: Nominee Relationship, Bank Name, Bank Account Number, Bank Account Name */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Nominee Relationship</label>
            <input
              type="text"
              name="nominee_relationship"
              value={formData.nominee_relationship}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2 sm:p-3 focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm sm:text-base"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Bank Name</label>
            <input
              type="text"
              name="bank_name"
              value={formData.bank_name}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2 sm:p-3 focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm sm:text-base"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Bank Account Number</label>
            <input
              type="text"
              name="bank_account_number"
              value={formData.bank_account_number}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2 sm:p-3 focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm sm:text-base"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Bank Account Name</label>
            <input
              type="text"
              name="bank_account_name"
              value={formData.bank_account_name}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2 sm:p-3 focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm sm:text-base"
            />
          </div>
        </div>

        {/* Row 7: E-TIN, Status */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">E-TIN</label>
            <input
              type="text"
              name="e_tin"
              value={formData.e_tin}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2 sm:p-3 focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm sm:text-base"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Status *</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2 sm:p-3 focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm sm:text-base"
              required
            >
              {[
                { value: "Active", label: "Active" },
                { value: "Inactive", label: "Inactive" },
                { value: "On Leave", label: "On Leave" },
                { value: "Resigned", label: "Resigned" },
                { value: "Terminated", label: "Terminated" },
              ].map((status) => (
                <option key={status.value} value={status.value}>
                  {status.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Row 8: Previous Work History (Full-Width Text Editor) */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Previous Work History</label>
          <textarea
            name="pre_work_his"
            value={formData.pre_work_his}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md p-2 sm:p-3 focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm sm:text-base"
            rows="4"
          />
        </div>

        {/* Row 9: Submit Document Section */}
        <div className="mt-6">
          <div className="flex items-center mb-4">
            <label className="block text-sm font-medium text-gray-700">Submit Document</label>
            <button
              type="button"
              onClick={addDocument}
              className="ml-2 text-xl text-blue-500 hover:text-blue-700"
            >
              +
            </button>
          </div>
          {formData.submit_doc.map((doc, index) => (
            <div key={index} className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Document Title</label>
                <input
                  type="text"
                  value={doc.title}
                  onChange={(e) => handleDocChange(index, "title", e.target.value)}
                  className="mt-1 block w-full border border-gray-300 rounded-md p-2 sm:p-3 focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm sm:text-base"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Attach Document</label>
                <div className="mt-1 flex items-center">
                  <input
                    type="file"
                    onChange={(e) => handleFileChange(index, e)}
                    className="hidden"
                    id={`doc-upload-${index}`}
                  />
                  <label
                    htmlFor={`doc-upload-${index}`}
                    className="cursor-pointer bg-blue-500 text-white px-4 py-2 rounded-md"
                  >
                    Add File
                  </label>
                  {doc.file && <span className="ml-2 text-sm">{doc.file.name}</span>}
                </div>
              </div>
            </div>
          ))}
        </div>

        <button
          type="submit"
          className="mt-6 bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-purple-500"
        >
          Add Employee
        </button>
      </form>
    </div>
  );
};

export default AddEmployee;