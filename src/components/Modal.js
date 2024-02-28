import React from "react";

const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div
        className="fixed inset-0 bg-black opacity-75"
        onClick={onClose}
      ></div>
      <div className="relative flex items-center justify-between bg-white rounded-lg p-6 z-10 min-w-[40%]">
        <button
          className="text-gray-500 hover:text-gray-700 focus:outline-none absolute top-2 right-2 "
          onClick={onClose}
        >
          <svg
            className="h-5 w-5"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M12.707 10l4.647-4.646a.5.5 0 00-.708-.708L12 9.293 7.354 4.646a.5.5 0 00-.708.708L11.293 10l-4.647 4.646a.5.5 0 00.708.708L12 10.707l4.646 4.647a.5.5 0 00.708-.708L12.707 10z"
              clipRule="evenodd"
            />
          </svg>
        </button>
        <div className="w-full max-h-[600px] overflow-scroll scrollbar-hide flex flex-col justify-center">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;
