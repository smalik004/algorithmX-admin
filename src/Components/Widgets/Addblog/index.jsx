// index.js
import React, { Fragment } from "react";
import BlogForm from "./form";
import axiosHttp from "../../../utils/httpConfig";

const AddBlogComponent = () => {
  const handleBlogSubmit = async (data) => {
    // If image is uploaded:
    let imageFile;
    if (data.image && data.image.length > 0) {
      imageFile = data.image[0];
    }

    try {
      const URL = "/blog/add-blog";
      const selectedCategories = data.category?.map((item) => item.value) || [];

      const formData = new FormData();
      formData.append("title", data.title);
      formData.append("meta_description", data.metaDescription);
      formData.append("meta_tags", JSON.stringify(["sss"]));
      formData.append("meta_keywords", data.metaKeywords);
      formData.append("summary", data.summary);
      formData.append("content", data.editorContent);

      formData.append("category", JSON.stringify(selectedCategories));
      formData.append("tags", JSON.stringify([""]));
      formData.append("post_date", "2025-05-13");
      formData.append("author_id", "1");
      formData.append("author_name", "");
      formData.append("author_ip", "");
      formData.append("status", data.status);
      formData.append("is_featured", "false");
      formData.append("slug", "2");

      if (imageFile) {
        formData.append("blog_image", imageFile);
        formData.append("image_alt", data.imageAltText);
      }

      const result = await axiosHttp.post(URL, formData);
    } catch (err) {}
  };

  return (
    <Fragment>
      <BlogForm onSubmit={handleBlogSubmit} />;
    </Fragment>
  );
};

export default AddBlogComponent;
