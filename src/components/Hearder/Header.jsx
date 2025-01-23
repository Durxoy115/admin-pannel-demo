import React from 'react';

const Header = () => {
    return (
        <nav className=" top-0 left-0 w-full z-50 flex justify-between items-center bg-white shadow-md px-6 py-3">
            <div className="flex items-center w-20">
                <img
                    src="/src/assets/Images/Images-nav/images (1).jpeg" 
                    alt="Company Logo"
                    className="h-10"
                />
            </div>
            <div className="flex items-center space-x-3">
                <p className="text-gray-600 text-sm">Admin</p>
                <div className="flex items-center bg-gray-100 px-4 py-2 rounded-full space-x-2">
                    <p className="text-gray-700 text-sm font-medium">Durjoy</p>
                    <img
                        src="/src/assets/Images/Images-nav/images.png" 
                        className="h-8 w-8 rounded-full"
                    />
                </div>
            </div>
        </nav>
    );
};

export default Header;
