import React from "react";

const InputField = ({ label, type = "text", value, onChange }) => (
  <div className="mb-4">
    <label className="block text-gray-700 mb-1">{label}</label>
    <input
      type={type}
      value={value}
      onChange={onChange}
      className="w-full p-2 border rounded-md focus:ring focus:ring-blue-300"
    />
  </div>
);

export default InputField;
