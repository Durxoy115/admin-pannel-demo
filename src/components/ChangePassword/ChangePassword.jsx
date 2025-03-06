import React from 'react';
import { useNavigate } from 'react-router-dom';

const NotFound = () => {
    const navigate = useNavigate();

    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-100 to-gray-300">
            <div className="text-center p-8 rounded-2xl shadow-xl bg-white max-w-md">
                <h1 className="text-8xl font-extrabold text-gray-800">404</h1>
                <h2 className="mt-4 text-2xl font-semibold text-gray-700">Page Not Found</h2>
                <p className="mt-2 text-gray-600">Oops! The page you are looking for does not exist or has been moved.</p>

                <div className="mt-6">
                    <button
                        onClick={() => navigate('/')}
                        className="px-6 py-3 text-white font-semibold bg-blue-600 hover:bg-blue-700 rounded-lg shadow transition-all"
                    >
                        Back to Home
                    </button>
                </div>

                <div className="mt-8">
                    <img
                        src="https://previews.123rf.com/images/kaymosk/kaymosk1804/kaymosk180400006/100130939-error-404-page-not-found-error-with-glitch-effect-on-screen-vector-illustration-for-your-design.jpg"
                        alt="Not Found Illustration"
                        className="mx-auto w-48"
                    />
                </div>
            </div>
        </div>
    );
};

export default NotFound;
