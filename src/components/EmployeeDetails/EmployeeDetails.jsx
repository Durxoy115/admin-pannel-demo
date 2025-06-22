import React, { useState, useEffect } from "react";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { IoAttach } from "react-icons/io5";
import { PiPlayBold } from "react-icons/pi";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import useToken from "../hooks/useToken";
import YearlySingleEmployeeSalary from "../YearlySingleEmployeeSalary/YearlySingleEmployeeSalary";

const EmployeeDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [fileName, setFileName] = useState(null);
  const [file, setFile] = useState(null);
  const [docDeleteId, setDocDeleteId] = useState("");
  const [url, getTokenLocalStorage] = useToken();
  const [successMessage, setSuccessMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [imagePreview, setImagePreview] = useState(null);
  const [disabledAttachIndex, setDisabledAttachIndex] = useState(null); // Track disabled <IoAttach>

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
    submit_doc: [{ title: "", file: "", existing_file: null, id: null }],
    submit_doc_del: "",
  });

  // Fetch employee data on component mount
  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        const response = await fetch(`${url}/employee/?employee_id=${id}`, {
          headers: {
            Authorization: `Token ${token}`,
          },
        });
        const result = await response.json();
        if (result.success) {
          const employee = result.data;
          setFileName(
            employee.submit_doc?.map((doc) => ({
              title: doc.document_name || "",
            })) || [{ title: "", file: null }]
          );
          setFormData({
            full_name: employee.full_name || "",
            employee_id: employee.employee_id || "",
            job_title: employee.job_title || "",
            joining_date: employee.joining_date || "",
            contact: employee.contact || "",
            email: employee.email || "",
            dob: employee.dob || "",
            present_address: employee.present_address || "",
            permanent_address: employee.permanent_address || "",
            nationality: employee.nationality || "",
            national_id: employee.national_id || "",
            passport_id: employee.passport_id || "",
            marital_status: employee.marital_status || "",
            religion: employee.religion || "",
            blood_group: employee.blood_group || "",
            dual_citizenship: employee.dual_citizenship || "",
            gender: employee.gender || "",
            emergency_contact: employee.emergency_contact || "",
            emergency_relationship: employee.emergency_relationship || "",
            nominee_name: employee.nominee_name || "",
            nominee_relationship: employee.nominee_relationship || "",
            bank_name: employee.bank_name || "",
            bank_account_number: employee.bank_account_number || "",
            bank_account_name: employee.bank_account_name || "",
            e_tin: employee.e_tin || "",
            status: employee.status || "Active",
            photo: null,
            pre_work_his: employee.pre_work_his || "",
            submit_doc: employee.submit_doc?.map((doc) => ({
              id: doc.id || null,
              title: doc.document_name || "",
              file: null,
              existing_file: doc.document_file || null,
            })) || [{ title: "", file: null, existing_file: null }],
            submit_doc_del: employee.submit_doc_del,
          });
          if (employee.photo) {
            setImagePreview(`${url}${employee.photo}`);
          }
        } else {
          setError(result.message || "Failed to fetch employee data");
        }
      } catch (err) {
        setError("An error occurred while fetching employee data: " + err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchEmployee();
  }, [url, token, id]);

  // Handle file preview on <PiPlayBold> click
  const handleFilePreview = (doc, index) => {
    try {
      setDisabledAttachIndex(index); // Disable <IoAttach> for this document
      let fileUrl;
      if (doc.file) {
        // Local file
        fileUrl = URL.createObjectURL(doc.file);
      } else if (doc.existing_file) {
        // Server file
        fileUrl = doc.existing_file.startsWith("http") ? doc.existing_file : `${url}${doc.existing_file}`;
      } else {
        throw new Error("No file available to preview");
      }
      window.open(fileUrl, "_blank");
      // Optionally revoke local URL after a delay
      if (doc.file) {
        setTimeout(() => URL.revokeObjectURL(fileUrl), 5000);
      }
      // Reset disabled state after a delay (e.g., 3 seconds)
      setTimeout(() => setDisabledAttachIndex(null), 3000);
    } catch (err) {
      setError("Error previewing file: " + err.message);
    }
  };

  if (loading) {
    return <div className="text-center p-4">Loading...</div>;
  }



  return (
    <div className="bg-white mt-4 sm:mt-8 lg:mt-16 p-1 sm:p-6 lg:p-8 lg:px-12 max-w-full mx-auto">
      <h1 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">Employee Details</h1>

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

      <div className="mt-4 sm:mt-6">
        <div className="mb-4 sm:mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-1"></label>
          <div className="mt-1 w-24 h-24 sm:w-32 sm:h-32 border-2 border-dashed border-gray-300 flex items-center justify-center rounded-md">
            {imagePreview ? (
              <img
                src={imagePreview}
                alt="Preview"
                className="w-full h-full object-cover rounded-md"
              />
            ) : (
              <span className="text-xs sm:text-sm text-gray-600">No image</span>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
            <p className="block w-full border border-gray-300 rounded-md p-1 sm:p-2 text-sm sm:text-base bg-gray-100">
              {formData.full_name || "-"}
            </p>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Employee ID</label>
            <p className="block w-full border border-gray-300 rounded-md p-1 sm:p-2 text-sm sm:text-base bg-gray-100">
              {formData.employee_id || "-"}
            </p>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Job Title</label>
            <p className="block w-full border border-gray-300 rounded-md p-1 sm:p-2 text-sm sm:text-base bg-gray-100">
              {formData.job_title || "-"}
            </p>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Joining Date</label>
            <p className="block w-full border border-gray-300 rounded-md p-1 sm:p-2 text-sm sm:text-base bg-gray-100">
              {formData.joining_date || "-"}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
            <p className="block w-full border border-gray-300 rounded-md p-1 sm:p-2 text-sm sm:text-base bg-gray-100">
              {formData.contact || "-"}
            </p>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <p className="block w-full border border-gray-300 rounded-md p-1 sm:p-2 text-sm sm:text-base bg-gray-100">
              {formData.email || "-"}
            </p>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
            <p className="block w-full border border-gray-300 rounded-md p-1 sm:p-2 text-sm sm:text-base bg-gray-100">
              {formData.dob || "-"}
            </p>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Present Address</label>
            <p className="block w-full border border-gray-300 rounded-md p-1 sm:p-2 text-sm sm:text-base bg-gray-100">
              {formData.present_address || "-"}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Permanent Address</label>
            <p className="block w-full border border-gray-300 rounded-md p-1 sm:p-2 text-sm sm:text-base bg-gray-100">
              {formData.permanent_address || "-"}
            </p>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Nationality</label>
            <p className="block w-full border border-gray-300 rounded-md p-1 sm:p-2 text-sm sm:text-base bg-gray-100">
              {formData.nationality || "-"}
            </p>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">National ID</label>
            <p className="block w-full border border-gray-300 rounded-md p-1 sm:p-2 text-sm sm:text-base bg-gray-100">
              {formData.national_id || "-"}
            </p>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Passport ID</label>
            <p className="block w-full border border-gray-300 rounded-md p-1 sm:p-2 text-sm sm:text-base bg-gray-100">
              {formData.passport_id || "-"}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Marital Status</label>
            <p className="block w-full border border-gray-300 rounded-md p-1 sm:p-2 text-sm sm:text-base bg-gray-100">
              {formData.marital_status || "-"}
            </p>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Religion</label>
            <p className="block w-full border border-gray-300 rounded-md p-1 sm:p-2 text-sm sm:text-base bg-gray-100">
              {formData.religion || "-"}
            </p>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Blood Group</label>
            <p className="block w-full border border-gray-300 rounded-md p-1 sm:p-2 text-sm sm:text-base bg-gray-100">
              {formData.blood_group || "-"}
            </p>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Dual Citizenship</label>
            <p className="block w-full border border-gray-300 rounded-md p-1 sm:p-2 text-sm sm:text-base bg-gray-100">
              {formData.dual_citizenship || "-"}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
            <p className="block w-full border border-gray-300 rounded-md p-1 sm:p-2 text-sm sm:text-base bg-gray-100">
              {formData.gender || "-"}
            </p>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Emergency Contact</label>
            <p className="block w-full border border-gray-300 rounded-md p-1 sm:p-2 text-sm sm:text-base bg-gray-100">
              {formData.emergency_contact || "-"}
            </p>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Emergency Relationship</label>
            <p className="block w-full border border-gray-300 rounded-md p-1 sm:p-2 text-sm sm:text-base bg-gray-100">
              {formData.emergency_relationship || "-"}
            </p>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Nominee Name</label>
            <p className="block w-full border border-gray-300 rounded-md p-1 sm:p-2 text-sm sm:text-base bg-gray-100">
              {formData.nominee_name || "-"}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Nominee Relationship</label>
            <p className="block w-full border border-gray-300 rounded-md p-1 sm:p-2 text-sm sm:text-base bg-gray-100">
              {formData.nominee_relationship || "-"}
            </p>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Bank Name</label>
            <p className="block w-full border border-gray-300 rounded-md p-1 sm:p-2 text-sm sm:text-base bg-gray-100">
              {formData.bank_name || "-"}
            </p>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Bank Account Number</label>
            <p className="block w-full border border-gray-300 rounded-md p-1 sm:p-2 text-sm sm:text-base bg-gray-100">
              {formData.bank_account_number || "-"}
            </p>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Bank Account Name</label>
            <p className="block w-full border border-gray-300 rounded-md p-1 sm:p-2 text-sm sm:text-base bg-gray-100">
              {formData.bank_account_name || "-"}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">E-TIN</label>
            <p className="block w-full border border-gray-300 rounded-md p-1 sm:p-2 text-sm sm:text-base bg-gray-100">
              {formData.e_tin || "-"}
            </p>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <p className="block w-full border border-gray-300 rounded-md p-1 sm:p-2 text-sm sm:text-base bg-gray-100">
              {formData.status || "-"}
            </p>
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Previous Work History</label>
          <div className="border border-gray-300 rounded-md text-sm sm:text-base bg-gray-100 p-2">
            <ReactQuill
              value={formData.pre_work_his || "-"}
              readOnly={true}
              theme="bubble"
              className="bg-gray-100"
            />
          </div>
        </div>

        <div className="mt-4 sm:mt-6">
          <div className="flex items-center mb-4">
            <label className="block text-sm font-medium text-gray-700">Submitted Documents</label>
          </div>
          {formData.submit_doc.map((doc, index) => (
            <div key={index} className="w-full md:w-1/2 flex flex-col sm:flex-row gap-4 mb-4 items-center">
              <div className="w-full sm:w-1/2">
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                  Document Title
                </label>
                <p className="block w-full border border-gray-300 rounded-md p-2 text-sm sm:text-base bg-gray-100">
                  {doc.title || "-"}
                </p>
              </div>
              <div className="w-full sm:w-1/2">
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                  Document
                </label>
                <div className="relative w-full">
                  <p className="block w-full border border-gray-300 rounded-md p-2 pr-12 text-sm sm:text-base bg-gray-100 text-gray-700">
                    {doc.file ? doc.file.name : doc.existing_file ? doc.existing_file.split("/").pop() : "-"}
                  </p>
                  {doc.existing_file && (
                    <a
                      href={doc.existing_file}
                      target="_blank"
                      disabled 
                      rel="noopener noreferrer"
                      className={`absolute right-2 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-600 text-xs sm:text-sm ${
                        disabledAttachIndex === index ? "pointer-events-none opacity-50" : ""
                      }`}
                    >
                      {/* <IoAttach className="inline-block" /> */}
                    </a>
                  )}
                </div>
              </div>
              <PiPlayBold
                className="text-4xl mt-5 p-1 rounded-md cursor-pointer"
                style={{ backgroundColor: "#CEDBFF" }}
                onClick={() => handleFilePreview(doc, index)}
              />
            </div>
          ))}
        </div>
      </div>
      <YearlySingleEmployeeSalary />
    </div>
  );
};

export default EmployeeDetails;