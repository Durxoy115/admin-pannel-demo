import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { TfiPlus } from 'react-icons/tfi';

const EditUserProfile = () => {
    const [editProfile, setEditProfile] = useState({ first_name: '', last_name: '', email: '', contact: '', photo: null });
    const { id } = useParams();
    const navigate = useNavigate();
    const [imagePreview, setImagePreview] = useState(null);
    console.log("ID is----",id);
    useEffect(() => {
        const fetchClientDetails = async () => {
            try {
                const response = await fetch(`https://admin.zgs.co.com/auth/user/?user_id=${id}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: 'Token 4bc2a75c04006d4e540a8b38f86612dc0b1da466',
                    },
                });
                console.log(id);
                if (response.ok) {
                    const data = await response.json();
                    setEditProfile({
                        first_name: data?.data?.first_name || '',
                        last_name: data?.data?.last_name || '',
                        email: data?.data?.email || '',
                        contact: data?.data?.contact || '',
                        photo: data?.data?.photo || null
                    });
                    if (data?.data?.photo) {
                        setImagePreview(data.data.photo);
                    }
                } else {
                    console.error('Failed to fetch client details.');
                }
            } catch (error) {
                console.error('Error fetching client data:', error);
            }
        };

        fetchClientDetails();
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setEditProfile({ ...editProfile, [name]: value });
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
            setEditProfile({ ...editProfile, photo: file });
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
            const response = await fetch(`https://admin.zgs.co.com/auth/user/?user_id=${id}`, {
                method: 'PUT',
                headers: {
                    Authorization: 'Token 4bc2a75c04006d4e540a8b38f86612dc0b1da466',
                },
                body: formData,
            });

            if (response.ok) {
                alert('Profile updated successfully!');
                navigate('/user-profile');
            } else {
                console.error('Failed to update profile.');
            }
        } catch (error) {
            console.error('Error updating profile:', error);
        }
    };

    return (
        <div className="p-6">
            <div className="flex items-start justify-around mb-4">
                <h2 className="text-3xl font-semibold">Edit Profile</h2>
                <button className="bg-blue-700 text-lg p-2 text-white rounded" onClick={() => navigate(-1)}>Back</button>
            </div>
            <form onSubmit={handleSubmit} className="w-full flex flex-col items-center justify-center">
                <div className="w-full max-w-6xl bg-white p-6 rounded-lg shadow-md relative">
                    <div className="grid grid-cols-3 gap-6 items-start">
                        <div className="flex flex-col items-center col-span-1">
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
                        <div className="col-span-2 grid grid-cols-2 gap-6">
                            <div>
                                <label className="block mb-2 font-medium">First Name</label>
                                <input
                                    type="text"
                                    name="first_name"
                                    value={editProfile.first_name}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border rounded-lg"
                                />
                            </div>
                            <div>
                                <label className="block mb-2 font-medium">Last Name</label>
                                <input
                                    type="text"
                                    name="last_name"
                                    value={editProfile.last_name}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border rounded-lg"
                                />
                            </div>
                            <div>
                                <label className="block mb-2 font-medium">Email</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={editProfile.email}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border rounded-lg"
                                />
                            </div>
                            <div>
                                <label className="block mb-2 font-medium">Phone Number</label>
                                <input
                                    type="text"
                                    name="contact"
                                    value={editProfile.contact}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border rounded-lg"
                                />
                            </div>
                        </div>
                    </div>
                    <button type="submit" className="mt-4 bg-blue-700 text-lg p-2 text-white rounded ms-auto">Update Profile</button>
                </div>
            </form>
        </div>
    );
};

export default EditUserProfile;
