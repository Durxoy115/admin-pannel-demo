// src/components/Dashboard.js

import React, { useState } from 'react';
import { LuCirclePlus } from "react-icons/lu";
import { CgNotes } from "react-icons/cg";
import { IoMdRefresh } from "react-icons/io";
import { BsDownload } from "react-icons/bs";
import AddClientModal from '../AddClientModal/AddClientModal'; // Import the AddClientModal component

const Dashboard = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleOpenModal = () => setIsModalOpen(true);
    const handleCloseModal = () => setIsModalOpen(false);

    const handleSave = (formData) => {
        console.log(formData); // Process the form data (e.g., send it to the server)
        setIsModalOpen(false); // Close the modal after saving
    };

    return (
        <div>
            <div>
                <h1 className="text-3xl font-semibold mt-6 ml-28">Clients Information</h1>
            </div>

            <div className="bg-gray-800 text-white p-4 rounded-lg flex items-center ml-28 mr-28 mt-4 h-16">
                <p>Clients Details</p>
                <input
                    type="text"
                    placeholder="Search..."
                    className="flex-grow px-4 py-2 border border-gray-700 rounded-3xl h-8 ml-4 mr-96"
                />

                <div className="ml-96">
                    <button className="text-xl text-white px-4 py-2 rounded-lg mr-2" onClick={handleOpenModal}>
                        <LuCirclePlus />
                    </button>
                    <button className="text-xl text-white px-4 py-2 rounded-lg mr-2">
                        <CgNotes />
                    </button>
                    <button className="text-xl text-white px-4 py-2 rounded-lg">
                        <IoMdRefresh />
                    </button>
                </div>
                <button className="text-xl text-white px-4 py-2 rounded-lg">
                    <BsDownload />
                </button>
            </div>

            {/* Call AddClientModal here */}
            <AddClientModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                onSave={handleSave}
            />
        </div>
    );
};

export default Dashboard;
