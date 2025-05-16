// src/components/SEOForm.jsx
import React, { useState } from "react";

const SEOForm = () => {
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    metaDescription: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form Data Submitted:", formData);
    // You can send this data to your backend here
  };

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-semibold mb-6 text-gray-800">SEO Form</h2>
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Title Field */}
        <div>
          <label
            className="block text-sm font-medium text-gray-700 mb-1"
            htmlFor="title"
          >
            Title
          </label>
          <input
            id="title"
            name="title"
            type="text"
            placeholder="Enter title"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={formData.title}
            onChange={handleChange}
          />
        </div>

        {/* Categories Field */}
        <div>
          <label
            className="block text-sm font-medium text-gray-700 mb-1"
            htmlFor="category"
          >
            Category
          </label>
          <select
            id="category"
            name="category"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={formData.category}
            onChange={handleChange}
          >
            <option value="">Select category</option>
            <option value="technology">Technology</option>
            <option value="fashion">Fashion</option>
            <option value="sports">Sports</option>
            <option value="education">Education</option>
          </select>
        </div>

        {/* Meta Description Field */}
        <div>
          <label
            className="block text-sm font-medium text-gray-700 mb-1"
            htmlFor="metaDescription"
          >
            Meta Description
          </label>
          <textarea
            id="metaDescription"
            name="metaDescription"
            placeholder="Enter meta description"
            rows="4"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={formData.metaDescription}
            onChange={handleChange}
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition duration-200"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default SEOForm;
