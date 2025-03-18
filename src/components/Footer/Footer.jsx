import React from "react";

const Footer = () => {
  return (
    <footer className="w-full border-t border-gray-300 py-3 bg-white text-center">
      <p className="text-gray-500 text-sm">
        &copy; {new Date().getFullYear()} Zay Global Solutions
      </p>
    </footer>
  );
};

export default Footer;

