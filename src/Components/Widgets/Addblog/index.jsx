// index.js
import React, { Fragment, useState, useRef, useEffect } from "react";
import BlogForm from "./form";
import WordEditor from "./editor";
import axios from "axios"; // Import axios for API calls

const AddBlogComponent = () => {
  // State to store all form data
  const [formData, setFormData] = useState({
    title: "",
    category: [],
    metaDescription: "",
    metaKeywords: "",
    summary: "",
    tags: [],
    metaTags: [],
    currentTag: "",
    currentMetaTag: "",
    image: "",
    imageAlt: "",
    status: "draft", // Default status
    isFeatured: false,
  });

  const [localFormData, setLocalFormData] = useState(formData);

  // State for user data
  const [userData, setUserData] = useState({
    authorId: null,
    authorName: "",
    authorIp: "",
  });

  // State for error handling
  const [errors, setErrors] = useState({});

  // State for editor content
  const [editorContent, setEditorContent] = useState("");

  // Reference to the editor component
  const editorRef = useRef(null);

  // Toast state
  const [toast, setToast] = useState({ message: "", type: "" });

  // Loading state for form submission
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch user data when component mounts
  useEffect(() => {
    // In a real app, you would get this from authentication
    // This is just a placeholder
    const fetchUserData = async () => {
      try {
        // Replace with actual authentication data fetch
        // const response = await axios.get('/api/user');
        // const user = response.data;

        // For demo purposes, we'll use mock data
        const user = {
          id: 1,
          name: "John Doe",
          ip: "192.168.1.1", // In real app, this would be determined server-side
        };

        setUserData({
          authorId: user.id,
          authorName: user.name,
          authorIp: user.ip,
        });
      } catch (error) {
        console.error("Error fetching user data:", error);
        showToast("Failed to load user data", "error");
      }
    };

    fetchUserData();
  }, []);

  // Function to show toast
  const showToast = (message, type = "success") => {
    setToast({ message, type });

    // Hide after 5 seconds
    setTimeout(() => {
      setToast({ message: "", type: "" });
    }, 5000);
  };

  // Update editor content from WordEditor component
  const updateEditorContent = (content) => {
    console.log("Updated Editor:", content);
    setEditorContent(content);
  };

  // Generate a slug from the title
  const generateSlug = (title) => {
    return title
      .toLowerCase()
      .replace(/[^\w ]+/g, "")
      .replace(/ +/g, "-");
  };

  // Validate the entire form
  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = "Title is required";
    }

    if (formData.category?.length === 0) {
      newErrors.category = "At least one category is required";
    }

    if (!formData.metaDescription.trim()) {
      newErrors.metaDescription = "Meta description is required";
    }

    if (!formData.summary.trim()) {
      newErrors.summary = "Summary is required";
    }

    if (!editorContent.trim()) {
      newErrors.editorContent = "Post content is required";
    }

    if (!formData.status) {
      newErrors.status = "Status is required";
    }

    if (!formData.image) {
      newErrors.image = "Featured image is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors)?.length === 0;
  };

  // Submit all data
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validateForm()) {
      setIsSubmitting(true);

      try {
        // Prepare data for API submission
        const currentDate = new Date().toISOString().split("T")[0]; // Format: YYYY-MM-DD

        // Create FormData if we need to upload image
        let imageUrl = "";

        // In a real app, you would upload the image first and get the URL
        if (formData.image) {
          const imageFormData = new FormData();
          imageFormData.append("file", formData.image);

          // Upload image API call would go here
          // const imageResponse = await axios.post('/api/upload', imageFormData);
          // imageUrl = imageResponse.data.url;

          // For demo, we'll just use a placeholder
          imageUrl = URL.createObjectURL(formData.image);
        }

        // Prepare category from the selected objects
        const category = formData.category?.map((cat) => cat.name);

        // Prepare the API payload according to your specified format
        console.log(formData, "formData");
        const apiData = {
          slug: generateSlug(formData.title),
          title: formData.title,
          meta_description: formData.metaDescription,
          meta_tags: formData.metaTags,
          meta_keywords: formData.metaKeywords,
          summary: formData.summary,
          content: editorContent,
          image_url: formData.image,
          image_alt: formData.imageAlt,
          category: category,
          tags: formData.tags,
          post_date: currentDate,
          author_id: 1,
          author_name: "",
          author_ip: "",
          views: 0, // New post starts with 0 views
          status: formData.status,
          is_featured: formData.isFeatured,
        };

        console.log("Sending to API:", apiData);
        const token =
          "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImFkbWluQGdtYWlsLmNvbSIsInJvbGUiOiJhZG1pbiIsInBlcm1pc3Npb25zIjpbXSwiaXNMb2dnZWRJbiI6dHJ1ZSwiaXNBY3RpdmUiOnRydWUsImlhdCI6MTc0NzM4NTcxN30.nfS6Frd_m05_GqefyVwwy7oAXNIqhByh32RMrdUOGKA";
        const config = {
          headers: { Authorization: `Bearer ${token}` },
        };
        // Make the API call
        // Replace '/api/posts' with your actual API endpoint
        const response = await axios.post(
          "http://localhost:5000/api/blog/add-blog",
          apiData,
          config
        );

        console.log("API Response:", response.data);

        showToast("Blog post created successfully!", "success");
      } catch (error) {
        console.error("Error submitting blog post:", error);
        showToast(`Failed to create blog post: ${error.message}`, "error");
      } finally {
        setIsSubmitting(false);
      }
    } else {
      showToast("Please fix the errors before submitting.", "error");
    }
  };

  return (
    <Fragment>
      <BlogForm
        errors={errors}
        localFormData={localFormData}
        setLocalFormData={setLocalFormData}
      />
      <WordEditor ref={editorRef} updateContent={updateEditorContent} />

      {/* Submit Button at parent level */}
      <div className="bg-white px-6 py-4 w-full">
        <div className="pt-4">
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isSubmitting}
            className={`bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors ${
              isSubmitting ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {isSubmitting ? "Saving..." : "Save Blog Post"}
          </button>
        </div>
        {errors.editorContent && (
          <p className="mt-1 text-sm text-red-500">{errors.editorContent}</p>
        )}
      </div>
      {toast.message && (
        <div
          className={`fixed top-5 right-5 px-4 py-3 rounded shadow-lg text-white z-50 transition-all duration-300 ${
            toast.type === "success" ? "bg-green-600" : "bg-red-600"
          }`}
        >
          {toast.message}
        </div>
      )}
    </Fragment>
  );
};

export default AddBlogComponent;
