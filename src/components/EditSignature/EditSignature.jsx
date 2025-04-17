import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import useToken from '../hooks/useToken';

const EditSignature = () => {
  const [formData, setFormData] = useState({
    title: '',
    signature: null,
  });
  const [existingSignature, setExistingSignature] = useState('');
  const [fileName, setFileName] = useState('');
  const [successMessage, setSuccessMessage] = useState(null);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();
  const [url, getTokenLocalStorage] = useToken();
  const token = getTokenLocalStorage();

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(
          `${url}/company/authority-signature/?authority_signature_id=${id}`,
          {
            headers: {
              Authorization: `Token ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        if (data.success) {
          const fetchedData = data.data;
          setFormData({
            title: fetchedData?.title || '',
            signature: null,
          });
          setExistingSignature(fetchedData.signature || null);
          // Extract file name from URL (e.g., 'signature.jpg' from 'https://.../signature.jpg')
          if (fetchedData.signature) {
            const name = fetchedData.signature.split('/').pop().split('?')[0] || 'existing-signature';
            setFileName(name);
          }
        } else {
          setError(data.message || 'Failed to fetch signature data.');
        }
      } catch (error) {
        console.error('Error fetching signature data:', error);
        setError('An error occurred while fetching data. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [id, url, token]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData({ ...formData, signature: file });
    setExistingSignature('');
    setFileName(file ? file.name : '');
  };

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      if (isSubmitting) return;
      setIsSubmitting(true);
      setSuccessMessage(null);
      setError(null);

      if (!formData.title.trim()) {
        setError('Title is required.');
        setIsSubmitting(false);
        return;
      }

      try {
        const formDataPayload = new FormData();
        formDataPayload.append('title', formData.title);
        if (formData.signature) {
          formDataPayload.append('signature', formData.signature);
        }

        const response = await fetch(
          `${url}/company/authority-signature/?authority_signature_id=${id}`,
          {
            method: 'PUT',
            headers: {
              Authorization: `Token ${token}`,
            },
            body: formDataPayload,
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        if (data.success) {
          setSuccessMessage('Signature updated successfully!');
          setTimeout(() => {
            navigate('/profile');
            setIsSubmitting(false);
          }, 2000);
        } else {
          setError(data.message || 'Failed to update signature.');
          setIsSubmitting(false);
        }
      } catch (error) {
        console.error('Error updating signature:', error);
        setError('An error occurred. Please try again.');
        setIsSubmitting(false);
      }
    },
    [formData, isSubmitting, id, navigate, token, url]
  );

  const handleCancel = () => {
    navigate('/profile');
  };

  return (
    <div className="w-full mx-auto mt-4 sm:mt-6 md:mt-10 px-1 sm:px-6 md:px-10 py-6 sm:py-8 bg-gray-100 min-h-screen rounded-md">
      <h2 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8 mt-8">Edit Signature</h2>
      {isLoading ? (
        <p className="text-center text-gray-600">Loading...</p>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6 bg-white p-1 sm:p-8 rounded-lg">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4 sm:gap-6">
            <div>
              <label htmlFor="title" className="block text-gray-700 font-medium mb-1 sm:mb-2 text-sm sm:text-base">
                Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="title"
                id="title"
                value={formData.title}
                onChange={handleChange}
                required
                className="w-full p-2 sm:p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
              />
            </div>
            <div>
              <label htmlFor="signature" className="block text-gray-700 font-medium mb-1 sm:mb-2 text-sm sm:text-base">
                Signature
              </label>
              <div className="flex items-center space-x-2">
                <input
                  type="file"
                  id="signature"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="w-full p-2 sm:p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
                />
              </div>
              {fileName && (
                <p className="text-sm text-gray-600 mt-1">Selected: {fileName}</p>
              )}
            </div>
          </div>

          {successMessage && (
            <p className="text-green-500 text-center mt-4">{successMessage}</p>
          )}
          {error && (
            <p className="text-red-500 text-center mt-4">{error}</p>
          )}

          <div className="flex flex-col sm:flex-row justify-center space-y-3 sm:space-y-0 sm:space-x-4">
            <button
              type="button"
              onClick={handleCancel}
              className="w-full sm:w-48 bg-red-500 text-white py-2 sm:py-3 rounded-full hover:bg-red-600 focus:outline-none focus:ring-4 focus:ring-red-300 text-sm sm:text-base"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="w-full sm:w-48 bg-blue-600 text-white py-2 sm:py-3 rounded-full hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300 text-sm sm:text-base disabled:bg-blue-400 disabled:cursor-not-allowed"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Saving...' : 'Save'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default EditSignature;