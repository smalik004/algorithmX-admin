// form.jsx

export default function BlogForm({ errors, localFormData, setLocalFormData }) {
  console.log(localFormData, "localFormData");

  // Sample category for dropdown
  const availablecategory = [
    { id: 1, name: "Technology" },
    { id: 2, name: "Marketing" },
    { id: 3, name: "Design" },
    { id: 4, name: "Business" },
    { id: 5, name: "Productivity" },
    { id: 6, name: "Finance" },
  ];

  // Status options
  const statusOptions = [
    { value: "draft", label: "Draft" },
    { value: "published", label: "Published" },
    { value: "archived", label: "Archived" },
  ];

  const handleImageChange = (file) => {
    setLocalFormData(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    handleImageChange(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const updatedFormData = { ...localFormData, [name]: value };
    setLocalFormData(updatedFormData);
  };

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    const updatedFormData = { ...localFormData, [name]: checked };
    setLocalFormData(updatedFormData);
  };

  const handleCategoryToggle = (category) => {
    setLocalFormData((prev) => {
      const updatedFormData = prev.category.find(
        (cat) => cat.id === category.id
      )
        ? {
            ...prev,
            category: prev.category.filter((cat) => cat.id !== category.id),
          }
        : {
            ...prev,
            category: [...prev.category, category],
          };

      return updatedFormData;
    });
  };

  const handleTagKeyDown = (e) => {
    if (e.key === "Enter" && localFormData.currentTag.trim()) {
      e.preventDefault();
      addTag();
    }
  };

  const handleMetaTagKeyDown = (e) => {
    if (e.key === "Enter" && localFormData.currentMetaTag.trim()) {
      e.preventDefault();
      addMetaTag();
    }
  };

  const addTag = () => {
    if (localFormData.currentTag.trim()) {
      const updatedFormData = {
        ...localFormData,
        tags: [...localFormData.tags, localFormData.currentTag.trim()],
        currentTag: "",
      };
      setLocalFormData(updatedFormData);
    }
  };

  const removeTag = (indexToRemove) => {
    const updatedFormData = {
      ...localFormData,
      tags: localFormData.tags.filter((_, index) => index !== indexToRemove),
    };
    setLocalFormData(updatedFormData);
  };

  const addMetaTag = () => {
    if (localFormData.currentMetaTag.trim()) {
      const updatedFormData = {
        ...localFormData,
        metaTags: [
          ...localFormData.metaTags,
          localFormData.currentMetaTag.trim(),
        ],
        currentMetaTag: "",
      };
      setLocalFormData(updatedFormData);
    }
  };

  const removeMetaTag = (indexToRemove) => {
    const updatedFormData = {
      ...localFormData,
      metaTags: localFormData.metaTags.filter(
        (_, index) => index !== indexToRemove
      ),
    };
    setLocalFormData(updatedFormData);
  };

  return (
    <div className="bg-white px-6 py-4 w-full">
      <div className="space-y-6">
        <h1 className="text-[40px] text-black text-center"> ADD BLOG </h1>

        {/* Title Input */}
        <div>
          <label
            htmlFor="title"
            className="block text-sm font-medium text-black mb-1"
          >
            Title <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={localFormData.title}
            onChange={handleInputChange}
            className={`w-full px-4 py-2 border ${
              errors.title ? "border-red-500" : "border-gray-300"
            } rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500`}
            placeholder="Enter blog title"
          />
          {errors.title && (
            <p className="mt-1 text-sm text-red-500">{errors.title}</p>
          )}
        </div>

        {/* category Dropdown */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            category <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <div
              className={`p-2 border ${
                errors.category ? "border-red-500" : "border-gray-300"
              } rounded-md bg-white min-h-12`}
            >
              {localFormData.category?.length > 0 ? (
                <div className="flex flex-wrap gap-2 mb-2">
                  {localFormData.category.map((category) => (
                    <span
                      key={category.id}
                      className="bg-gray-100 text-gray-800 text-xs font-medium px-2.5 py-1 rounded flex items-center"
                    >
                      {category.name}
                      <button
                        type="button"
                        onClick={() => handleCategoryToggle(category)}
                        className="ml-1.5 text-gray-700 hover:text-gray-900"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-sm">Select category</p>
              )}

              <div className="relative mt-1">
                <select
                  className="appearance-none bg-transparent border border-gray-300 text-gray-700 py-2 px-4 pr-8 rounded-md w-full focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                  onChange={(e) => {
                    const selectedId = parseInt(e.target.value);
                    if (selectedId) {
                      const category = availablecategory.find(
                        (c) => c.id === selectedId
                      );
                      if (
                        category &&
                        !localFormData.category.find((c) => c.id === selectedId)
                      ) {
                        handleCategoryToggle(category);
                      }
                      e.target.value = ""; // Reset select after selection
                    }
                  }}
                  value=""
                >
                  <option value="">Select category</option>
                  {availablecategory.map((category) => (
                    <option
                      key={category.id}
                      value={category.id}
                      disabled={localFormData.category?.some(
                        (c) => c.id === category.id
                      )}
                    >
                      {category.name}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                  <svg
                    className="fill-current h-4 w-4"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                  </svg>
                </div>
              </div>
            </div>
            {errors.category && (
              <p className="mt-1 text-sm text-red-500">{errors.category}</p>
            )}
          </div>
        </div>

        {/* Status Dropdown - NEW */}
        <div>
          <label
            htmlFor="status"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Status <span className="text-red-500">*</span>
          </label>
          <select
            id="status"
            name="status"
            value={localFormData.status}
            onChange={handleInputChange}
            className={`w-full px-4 py-2 border ${
              errors.status ? "border-red-500" : "border-gray-300"
            } rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500`}
          >
            {statusOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          {errors.status && (
            <p className="mt-1 text-sm text-red-500">{errors.status}</p>
          )}
        </div>

        {/* Featured Post Checkbox - NEW */}
        <div className="flex items-center">
          <input
            type="checkbox"
            id="isFeatured"
            name="isFeatured"
            checked={localFormData.isFeatured}
            onChange={handleCheckboxChange}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label
            htmlFor="isFeatured"
            className="ml-2 block text-sm text-gray-700"
          >
            Featured post
          </label>
        </div>

        {/* Meta Description */}
        <div>
          <label
            htmlFor="metaDescription"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Meta Description <span className="text-red-500">*</span>
          </label>
          <textarea
            id="metaDescription"
            name="metaDescription"
            value={localFormData.metaDescription}
            onChange={handleInputChange}
            rows="3"
            className={`w-full px-4 py-2 border ${
              errors.metaDescription ? "border-red-500" : "border-gray-300"
            } rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500`}
            placeholder="Enter meta description (150-160 characters recommended)"
          ></textarea>
          <p className="text-xs text-gray-500 mt-1">
            {localFormData.metaDescription?.length}/160 characters
          </p>
          {errors.metaDescription && (
            <p className="mt-1 text-sm text-red-500">
              {errors.metaDescription}
            </p>
          )}
        </div>

        {/* Meta Keywords - NEW */}
        <div>
          <label
            htmlFor="metaKeywords"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Meta Keywords
          </label>
          <input
            type="text"
            id="metaKeywords"
            name="metaKeywords"
            value={localFormData.metaKeywords}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter meta keywords, comma separated (e.g., blog,tech,react)"
          />
          <p className="text-xs text-gray-500 mt-1">
            Add comma-separated keywords for SEO
          </p>
        </div>

        {/* Summary - NEW */}
        <div>
          <label
            htmlFor="summary"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Summary <span className="text-red-500">*</span>
          </label>
          <textarea
            id="summary"
            name="summary"
            value={localFormData.summary}
            onChange={handleInputChange}
            rows="3"
            className={`w-full px-4 py-2 border ${
              errors.summary ? "border-red-500" : "border-gray-300"
            } rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500`}
            placeholder="Enter a brief summary of the blog post"
          ></textarea>
          {errors.summary && (
            <p className="mt-1 text-sm text-red-500">{errors.summary}</p>
          )}
        </div>

        {/* Tags */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Tags
          </label>
          <div className="flex flex-wrap gap-2 p-2 border border-gray-300 rounded-md bg-white mb-2 min-h-12">
            {localFormData.tags.map((tag, index) => (
              <span
                key={index}
                className="bg-gray-100 text-gray-800 text-xs font-medium px-2.5 py-1 rounded flex items-center"
              >
                {tag}
                <button
                  type="button"
                  onClick={() => removeTag(index)}
                  className="ml-1.5 text-gray-700 hover:text-gray-900"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
          <div className="flex">
            <input
              type="text"
              value={localFormData.currentTag}
              onChange={(e) =>
                setLocalFormData({
                  ...localFormData,
                  currentTag: e.target.value,
                })
              }
              onKeyDown={handleTagKeyDown}
              className="flex-grow px-4 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Add a tag and press Enter"
            />
            <button
              type="button"
              onClick={addTag}
              className="bg-gray-100 px-4 border border-l-0 border-gray-300 rounded-r-md hover:bg-gray-200 focus:outline-none"
            >
              +
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Press Enter or click + to add a tag
          </p>
        </div>

        {/* Meta Tags */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Meta Tags
          </label>
          <div className="flex flex-wrap gap-2 p-2 border border-gray-300 rounded-md bg-white mb-2 min-h-12">
            {localFormData.metaTags.map((tag, index) => (
              <span
                key={index}
                className="bg-gray-100 text-gray-800 text-xs font-medium px-2.5 py-1 rounded flex items-center"
              >
                {tag}
                <button
                  type="button"
                  onClick={() => removeMetaTag(index)}
                  className="ml-1.5 text-gray-700 hover:text-gray-900"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
          <div className="flex">
            <input
              type="text"
              value={localFormData.currentMetaTag}
              onChange={(e) =>
                setLocalFormData({
                  ...localFormData,
                  currentMetaTag: e.target.value,
                })
              }
              onKeyDown={handleMetaTagKeyDown}
              className="flex-grow px-4 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Add a meta tag and press Enter"
            />
            <button
              type="button"
              onClick={addMetaTag}
              className="bg-gray-100 px-4 border border-l-0 border-gray-300 rounded-r-md hover:bg-gray-200 focus:outline-none"
            >
              +
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Press Enter or click + to add a meta tag
          </p>
        </div>

        {/* Image Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Upload Image <span className="text-red-500">*</span>
          </label>

          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            className="w-full flex items-center justify-center p-6 border-2 border-dashed border-gray-300 rounded-md cursor-pointer hover:border-blue-400 transition"
          >
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleImageChange(e.target.files[0])}
              className="hidden"
              id="imageUpload"
            />
            <label htmlFor="imageUpload" className="text-center text-gray-500">
              {localFormData.image ? (
                <div>
                  <p className="text-sm font-medium text-black">
                    {localFormData.image.name}
                  </p>
                  <img
                    src={URL.createObjectURL(localFormData.image)}
                    alt="Preview"
                    className="mt-2 max-h-40 mx-auto"
                  />
                </div>
              ) : (
                <>
                  <p className="text-sm">
                    Drag and drop an image here or{" "}
                    <span className="underline">browse</span>
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    (Only image files are allowed)
                  </p>
                </>
              )}
            </label>
          </div>
          {errors.image && (
            <p className="mt-1 text-sm text-red-500">{errors.image}</p>
          )}
        </div>

        {/* Image Alt Text - NEW */}
        <div>
          <label
            htmlFor="imageAlt"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Image Alt Text
          </label>
          <input
            type="text"
            id="imageAlt"
            name="imageAlt"
            value={localFormData.imageAlt}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter alt text for the image"
          />
          <p className="text-xs text-gray-500 mt-1">
            Describe the image for accessibility
          </p>
        </div>
      </div>
    </div>
  );
}
