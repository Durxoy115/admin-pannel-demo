import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { TfiPlus } from 'react-icons/tfi';
import { IoArrowBack } from "react-icons/io5";
import useToken from "../hooks/useToken";

const EditUserProfile = () => {
  const [editProfile, setEditProfile] = useState({
    first_name: '',
    last_name: '',
    email: '',
    contact: '',
    photo: null, // This will only hold a File object for uploading
  });
  const [imagePreview, setImagePreview] = useState(null);
  const { id } = useParams();
  const navigate = useNavigate();
  const [url, getTokenLocalStorage] = useToken();
  const token = getTokenLocalStorage();

  useEffect(() => {
    const fetchClientDetails = async () => {
      try {
        const response = await fetch(`${url}/auth/user/?user_id=${id}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Token ${token}`,
          },
        });
        const data = await response.json();
        if (response.ok && data.success) {
          setEditProfile({
            first_name: data?.data?.first_name || '',
            last_name: data?.data?.last_name || '',
            email: data?.data?.email || '',
            contact: data?.data?.contact || '',
            photo: null, // Keep as null; we use imagePreview for display
          });
          if (data?.data?.photo) {
            setImagePreview(`https://admin.zgs.co.com${data.data.photo}`);
          }
        } else {
          console.error('Failed to fetch client details:', data.message);
        }
      } catch (error) {
        console.error('Error fetching client data:', error);
      }
    };

    fetchClientDetails();
  }, [id, url, token]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditProfile({ ...editProfile, [name]: value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setEditProfile({ ...editProfile, photo: file });
      setImagePreview(URL.createObjectURL(file)); // Create a preview URL for the new file
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('first_name', editProfile.first_name);
    formData.append('last_name', editProfile.last_name);
    formData.append('email', editProfile.email);
    formData.append('contact', editProfile.contact);
    if (editProfile.photo) {
      formData.append('photo', editProfile.photo);
    }

    try {
      const response = await fetch(`${url}/auth/user/?user_id=${id}`, {
        method: 'PUT',
        headers: {
          Authorization: `Token ${token}`,
        },
        body: formData,
      });

      const result = await response.json();
      if (response.ok && result.success) {
        alert('Profile updated successfully!');
        navigate('/profile');
      } else {
        console.error('Failed to update profile:', result.message);
        alert('Failed to update profile: ' + (result.message || 'Unknown error'));
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('An error occurred while updating the profile.');
    }
  };

  return (
    <div className="p-6 relative bg-gray-100 min-h-screen">
      <button className="absolute top-0 left-0 p-2 text-3xl text-black" onClick={() => navigate(-1)}>
        <IoArrowBack />
      </button>
      <h2 className="text-3xl font-semibold text-center mb-4">Edit Profile</h2>
      <form onSubmit={handleSubmit} className="w-full flex flex-col">
        <div className="w-full  bg-white p-6 rounded-lg shadow-md relative">
          <div className="flex gap-20 items-start">
            <div className="flex flex-col">
              <label
                htmlFor="imageUpload"
                className="cursor-pointer flex flex-col items-center justify-center text-gray-300 bg-gray-100 rounded-md w-28 h-28 border-dashed border-2 border-gray-300"
              >
                {imagePreview ? (
                  <img
                    src={imagePreview}
                    alt="Profile Preview"
                    className="w-full h-full object-cover rounded-md"
                  />
                ) : (
                  <TfiPlus className="text-4xl" />
                )}
              </label>
              <input
                id="imageUpload"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
            </div>
            <div className="col-span-3 w-full b grid grid-cols-3 gap-6">
              <div>
                <label className="block mb-2  font-medium">First Name</label>
                <input
                  type="text"
                  name="first_name"
                  value={editProfile.first_name}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border bg-gray-200 rounded-lg"
                />
              </div>
              <div>
                <label className="block mb-2 font-medium">Last Name</label>
                <input
                  type="text"
                  name="last_name"
                  value={editProfile.last_name}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border bg-gray-200 rounded-lg"
                />
              </div>
              <div>
                <label className="block mb-2 font-medium">Email</label>
                <input
                  type="email"
                  name="email"
                  value={editProfile.email}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border bg-gray-200 rounded-lg"
                />
              </div>
              <div>
                <label className="block mb-2 font-medium">Phone Number</label>
                <input
                  type="text"
                  name="contact"
                  value={editProfile.contact}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border bg-gray-200 rounded-lg"
                />
              </div>
            </div>
          </div>
          <div className="flex justify-center mt-4">
            <button type="submit" className="bg-blue-700 w-72 text-lg p-2 px-6 text-white rounded-lg">Save</button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default EditUserProfile;