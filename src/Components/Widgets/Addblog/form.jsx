// BlogForm.jsx
import React, { useEffect, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import Select from "react-select";
import WordEditor from "./editor";
import axiosHttp from "../../../utils/httpConfig";
import { toast } from "react-toastify";

// Custom Tag Input component
const TagInput = ({ value = [], onChange, placeholder }) => {
  const [inputValue, setInputValue] = useState("");

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && inputValue.trim() !== "") {
      e.preventDefault();
      const newValue = [...value, inputValue.trim()];
      onChange(newValue);
      setInputValue("");
    }
  };

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleAddTag = () => {
    if (inputValue.trim() !== "") {
      const newValue = [...value, inputValue.trim()];
      onChange(newValue);
      setInputValue("");
    }
  };

  const handleRemoveTag = (index) => {
    const newValue = [...value];
    newValue.splice(index, 1);
    onChange(newValue);
  };

  return (
    <div>
      <div className="flex items-center gap-2 mb-2">
        <input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="flex-1 p-2 border border-gray-300 rounded"
        />
        <button
          type="button"
          onClick={handleAddTag}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Add
        </button>
      </div>
      <div className="flex flex-wrap gap-2 mt-2">
        {value.map((tag, index) => (
          <div
            key={index}
            className="bg-blue-100 px-3 py-1 rounded-full flex items-center gap-2"
          >
            <span>{tag}</span>
            <button
              type="button"
              onClick={() => handleRemoveTag(index)}
              className="text-red-500 font-bold"
            >
              ×
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default function BlogForm({ onSubmit, blogId }) {
  const [isEditMode, setIsEditMode] = useState(false);
  const [initialEditorContent, setInitialEditorContent] = useState("");
  const [currentImageUrl, setCurrentImageUrl] = useState(null);

  const {
    control,
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      title: "",
      category: "",
      status: "draft",
      isFeatured: "",
      metaDescription: "",
      metaKeywords: [],
      summary: "",
      tags: [],
      metaTags: [],
      image: null,
      imageAltText: "",
      editorContent: "",
    },
  });

  const metaDesc = watch("metaDescription") || "";

  const categoryOptions = [
    { value: "Technology", label: "Technology" },
    { value: "Marketing", label: "Marketing" },
    { value: "Design", label: "Design" },
    { value: "Business", label: "Business" },
    { value: "Productivity", label: "Productivity" },
    { value: "Finance", label: "Finance" },
    { value: "Accessiblity", label: "Accessiblity" },
    { value: "Andriod Dev", label: "Andriod Dev" },
    { value: "Blockchain", label: "Blockchain" },
    { value: "Gadgets", label: "Gadgets" },
  ];
  const editorRef = useRef(null);

  const updateEditorContent = (content) => {
    setValue("editorContent", content, { shouldValidate: true });
  };

  const getBlogById = async () => {
    try {
      const response = await axiosHttp.get(`/blog/${blogId}`);
      if (response?.status === 200) {
        setIsEditMode(true);
        const blogData = response.data.data;

        // Set current image URL
        setCurrentImageUrl(blogData.image_url || null);

        reset({
          title: blogData.title || "",
          category: blogData.category || "",
          status: blogData.status || "draft",
          isFeatured: blogData.is_featured,
          metaDescription: blogData.meta_description || "",
          metaKeywords: Array.isArray(blogData.meta_keywords)
            ? blogData.meta_keywords
            : [],
          summary: blogData.summary || "",
          tags: Array.isArray(blogData.tags) ? blogData.tags : [],
          metaTags: Array.isArray(blogData.meta_tags) ? blogData.meta_tags : [],
          imageAltText: blogData.image_alt || "",
          editorContent: blogData.content || "",
        });

        toast.success(response?.data?.message || "Blog loaded successfully");
      }
    } catch (err) {
      toast.warning(err?.response?.data?.message || "Failed to load blog");
    }
  };

  useEffect(() => {
    if (blogId) {
      getBlogById();
    } else {
      setIsEditMode(false);
      setInitialEditorContent("");
      setCurrentImageUrl(null); // Reset image URL

      reset({
        title: "",
        category: "",
        status: "draft",
        isFeatured: false,
        metaDescription: "",
        metaKeywords: [],
        summary: "",
        tags: [],
        metaTags: [],
        image: null,
        imageAltText: "",
        editorContent: "",
      });
    }
  }, [blogId]);

  const handleFormKeyDown = (e) => {
    if (
      e.key === "Enter" &&
      e.target.tagName !== "TEXTAREA" &&
      e.target.type !== "submit"
    ) {
      e.preventDefault();
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      onKeyDown={handleFormKeyDown}
      className="space-y-6 max-w-5xl mx-auto px-6 py-4 bg-white"
    >
      <h1 className="text-[32px] font-semibold text-center">
        {isEditMode ? "Update Blog" : "Add Blog"}
      </h1>

      {/* Title */}
      <div>
        <label className="block mb-1 font-medium">
          Title <span className="text-red-500">*</span>
        </label>
        <input
          {...register("title", { required: "Title is required" })}
          placeholder="Enter blog title"
          className={`w-full p-2 border rounded ${
            errors.title ? "border-red-500" : "border-gray-300"
          }`}
        />
        {errors.title && (
          <p className="text-red-500 text-sm">{errors.title.message}</p>
        )}
      </div>

      {/* Category - Using react-select */}
      <div>
        <label className="block mb-1 font-medium">
          Category <span className="text-red-500">*</span>
        </label>
        <Controller
          name="category"
          control={control}
          rules={{ required: "Category is required" }}
          render={({ field }) => (
            <Select
              {...field}
              options={categoryOptions}
              classNamePrefix="react-select"
              isMulti={false}
              onChange={(selectedOption) =>
                field.onChange(selectedOption.value)
              }
              value={
                categoryOptions.find(
                  (option) => option.value === field.value
                ) || null
              }
            />
          )}
        />
        {errors.category && (
          <p className="text-red-500 text-sm">{errors.category.message}</p>
        )}
      </div>

      {/* Status */}
      <div>
        <label className="block mb-1 font-medium">
          Status <span className="text-red-500">*</span>
        </label>
        <select
          {...register("status", { required: "Status is required" })}
          className="w-full p-2 border rounded border-gray-300"
        >
          <option value="draft">Draft</option>
          <option value="published">Published</option>
          <option value="archived">Archived</option>
        </select>
      </div>

      {/* Featured */}
      <div className="flex items-center gap-2">
        <input type="checkbox" {...register("isFeatured")} />
        <label>Featured post</label>
      </div>

      {/* Meta Description */}
      <div>
        <label className="block mb-1 font-medium">
          Meta Description <span className="text-red-500">*</span>
        </label>
        <textarea
          {...register("metaDescription", {
            required: "Meta description is required",
          })}
          placeholder="Enter meta description (150-160 characters recommended)"
          rows={3}
          className={`w-full p-2 border rounded ${
            errors.metaDescription ? "border-red-500" : "border-gray-300"
          }`}
        />
        <p className="text-sm text-gray-500">
          {metaDesc.length}/160 characters
        </p>
        {errors.metaDescription && (
          <p className="text-red-500 text-sm">
            {errors.metaDescription.message}
          </p>
        )}
      </div>

      {/* Meta Keywords - Using Controller with custom TagInput component */}
      <div>
        <label className="block mb-1 font-medium">Meta Keywords</label>
        <Controller
          name="metaKeywords"
          control={control}
          render={({ field: { value, onChange } }) => (
            <TagInput
              value={value}
              onChange={onChange}
              placeholder="Type and press Enter to add keywords"
            />
          )}
        />
        <p className="text-sm text-gray-500 mt-1">
          Press Enter after each keyword
        </p>
      </div>

      {/* Summary */}
      <div>
        <label className="block mb-1 font-medium">
          Summary <span className="text-red-500">*</span>
        </label>
        <textarea
          {...register("summary", { required: "Summary is required" })}
          placeholder="Enter a brief summary of the blog post"
          rows={3}
          className={`w-full p-2 border rounded ${
            errors.summary ? "border-red-500" : "border-gray-300"
          }`}
        />
        {errors.summary && (
          <p className="text-red-500 text-sm">{errors.summary.message}</p>
        )}
      </div>

      {/* Tags - Using Controller with custom TagInput component */}
      <div>
        <label className="block mb-1 font-medium">Tags</label>
        <Controller
          name="tags"
          control={control}
          render={({ field: { value, onChange } }) => (
            <TagInput
              value={value}
              onChange={onChange}
              placeholder="Type and press Enter to add tags"
            />
          )}
        />
        <p className="text-sm text-gray-500 mt-1">Press Enter after each tag</p>
      </div>

      {/* Meta Tags - Using Controller with custom TagInput component */}
      <div>
        <label className="block mb-1 font-medium">Meta Tags</label>
        <Controller
          name="metaTags"
          control={control}
          render={({ field: { value, onChange } }) => (
            <TagInput
              value={value}
              onChange={onChange}
              placeholder="Type and press Enter to add meta tags"
            />
          )}
        />
        <p className="text-sm text-gray-500 mt-1">
          Press Enter after each meta tag
        </p>
      </div>

      {/* Upload Image */}
      {/* Upload Image */}
      <div>
        <label className="block mb-1 font-medium">
          Upload Image {!isEditMode && <span className="text-red-500">*</span>}
        </label>

        {/* Show current image in edit mode */}
        {isEditMode && currentImageUrl && (
          <div className="mb-3">
            <p className="text-sm text-gray-600 mb-2">Current image:</p>
            <img
              src={currentImageUrl}
              alt="Current blog image"
              className="max-w-xs max-h-32 object-cover border rounded"
              onError={(e) => {
                console.error("Image failed to load:", currentImageUrl);
                e.target.style.display = "none";
              }}
            />
          </div>
        )}

        <input
          type="file"
          accept="image/*"
          {...register("image", {
            required: isEditMode ? false : "Image is required",
          })}
          className="w-full"
        />
        <p className="text-sm text-gray-500">
          {isEditMode
            ? "(Leave empty to keep current image, or select a new image to replace)"
            : "(Only image files are allowed)"}
        </p>
        {errors.image && (
          <p className="text-red-500 text-sm">{errors.image.message}</p>
        )}
      </div>

      {/* Image Alt Text */}
      <div>
        <label className="block mb-1 font-medium">Image Alt Text</label>
        <input
          {...register("imageAltText")}
          placeholder="Describe the image for accessibility"
          className="w-full p-2 border border-gray-300 rounded"
        />
      </div>

      {/* Post Description */}
      <WordEditor
        ref={editorRef}
        updateContent={updateEditorContent}
        initialContent={watch("editorContent")}
      />

      <div className="text-center mt-6">
        <button
          type="submit"
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
        >
          {isEditMode ? "Update Blog" : "Submit Blog"}
        </button>
      </div>
    </form>
  );
}
