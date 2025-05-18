// BlogForm.jsx
import React, { useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import Select from "react-select";
import WordEditor from "./editor";

export default function BlogForm({ onSubmit }) {
  const {
    control,
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      title: "",
      category: "",
      status: "draft",
      isFeatured: false,
      metaDescription: "",
      metaKeywords: "",
      summary: "",
      tags: "",
      metaTags: "",
      image: null,
      imageAltText: "",
      postDescription: "",
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
  ];
  const editorRef = useRef(null);

  const updateEditorContent = (content) => {
    setValue("editorContent", content, { shouldValidate: true });
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-6 max-w-5xl mx-auto px-6 py-4 bg-white"
    >
      <h1 className="text-[32px] font-semibold text-center">Add Blog</h1>

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

      {/* Category */}
      <div>
        <label className="block mb-1 font-medium">
          Category <span className="text-red-500">*</span>
        </label>
        <Controller
          name="category"
          control={control}
          rules={{ required: "At least one category is required" }}
          render={({ field }) => (
            <Select
              {...field}
              isMulti
              options={categoryOptions}
              classNamePrefix="react-select"
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

      {/* Meta Keywords */}
      <div>
        <label className="block mb-1 font-medium">Meta Keywords</label>
        <input
          {...register("metaKeywords")}
          placeholder="Enter meta keywords, comma separated (e.g., blog,tech,react)"
          className="w-full p-2 border border-gray-300 rounded"
        />
        <p className="text-sm text-gray-500">
          Add comma-separated keywords for SEO
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

      {/* Tags */}
      <div>
        <label className="block mb-1 font-medium">Tags</label>
        <input
          {...register("tags")}
          placeholder="Enter tags, comma separated"
          className="w-full p-2 border border-gray-300 rounded"
        />
        <p className="text-sm text-gray-500">
          Press Enter or comma to separate tags
        </p>
      </div>

      {/* Meta Tags */}
      <div>
        <label className="block mb-1 font-medium">Meta Tags</label>
        <input
          {...register("metaTags")}
          placeholder="Enter meta tags, comma separated"
          className="w-full p-2 border border-gray-300 rounded"
        />
        <p className="text-sm text-gray-500">
          Press Enter or comma to separate meta tags
        </p>
      </div>

      {/* Upload Image */}
      <div>
        <label className="block mb-1 font-medium">
          Upload Image <span className="text-red-500">*</span>
        </label>
        <input
          type="file"
          accept="image/*"
          {...register("image", { required: "Image is required" })}
          className="w-full"
        />
        <p className="text-sm text-gray-500">(Only image files are allowed)</p>
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
      <WordEditor ref={editorRef} updateContent={updateEditorContent} />

      <div className="text-center mt-6">
        <button
          type="submit"
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
        >
          Submit Blog
        </button>
      </div>
    </form>
  );
}
