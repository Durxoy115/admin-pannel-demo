import React, { useState } from 'react';
import Modal from 'react-modal';

// Set the app element for accessibility
Modal.setAppElement('#root');

const AddClientModal = ({ isOpen, onClose, onSave }) => {
    const [formData, setFormData] = useState({
        clientName: '',
        clientMobile: '',
        clientEmail: '',
        country: '',
        companyName: '',
        companyUrl: '',
        clientId: '',
        currency: '',
        contactPerson: '',
        contactDocument: '',
        notes: '',
        address: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevState) => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData); // Pass form data to parent
    };

    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onClose}
            contentLabel="Add Client Info"
            className="modal-content"
            overlayClassName="modal-overlay"
        >
            <div className="modal-header">
                <h2 className="text-2xl font-semibold mb-4">Add New Client</h2>
            </div>
            <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-2 gap-4 mb-4">
                    {/* Left Column */}
                    <div>
                        <label className="block text-sm font-semibold">
                            Client Name <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            name="clientName"
                            value={formData.clientName}
                            onChange={handleChange}
                            className="w-full p-2 border border-gray-300 rounded"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold">
                            Client Mobile No <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            name="clientMobile"
                            value={formData.clientMobile}
                            onChange={handleChange}
                            className="w-full p-2 border border-gray-300 rounded"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold">
                            Client Email <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="email"
                            name="clientEmail"
                            value={formData.clientEmail}
                            onChange={handleChange}
                            className="w-full p-2 border border-gray-300 rounded"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold">
                            Country <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            name="country"
                            value={formData.country}
                            onChange={handleChange}
                            className="w-full p-2 border border-gray-300 rounded"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold">
                            Company Name <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            name="companyName"
                            value={formData.companyName}
                            onChange={handleChange}
                            className="w-full p-2 border border-gray-300 rounded"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold">
                            Company URL <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            name="companyUrl"
                            value={formData.companyUrl}
                            onChange={handleChange}
                            className="w-full p-2 border border-gray-300 rounded"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold">
                            Client ID <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            name="clientId"
                            value={formData.clientId}
                            onChange={handleChange}
                            className="w-full p-2 border border-gray-300 rounded"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold">
                            Currency <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            name="currency"
                            value={formData.currency}
                            onChange={handleChange}
                            className="w-full p-2 border border-gray-300 rounded"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold">
                            Contact Person <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            name="contactPerson"
                            value={formData.contactPerson}
                            onChange={handleChange}
                            className="w-full p-2 border border-gray-300 rounded"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold">
                            Contact Document
                        </label>
                        <input
                            type="file"
                            name="contactDocument"
                            onChange={handleChange}
                            className="w-full p-2 border border-gray-300 rounded"
                        />
                    </div>
                </div>
                {/* Full-Width Fields */}
                <div className="mb-4">
                    <label className="block text-sm font-semibold">Notes</label>
                    <textarea
                        name="notes"
                        value={formData.notes}
                        onChange={handleChange}
                        className="w-full p-2 border border-gray-300 rounded"
                        rows="4"
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-sm font-semibold">Address</label>
                    <textarea
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        className="w-full p-2 border border-gray-300 rounded"
                        rows="4"
                    />
                </div>
                {/* Action Buttons */}
                <div className="flex justify-end">
                    <button
                        type="button"
                        className="bg-gray-500 text-white px-4 py-2 rounded mr-2"
                        onClick={onClose}
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className="bg-blue-500 text-white px-4 py-2 rounded"
                    >
                        Save
                    </button>
                </div>
            </form>
        </Modal>
    );
};

export default AddClientModal;
