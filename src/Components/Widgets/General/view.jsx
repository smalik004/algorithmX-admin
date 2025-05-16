import React, { useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Edit,
  Trash2,
  Eye,
} from "lucide-react";

const BlogViewSection = () => {
  // Sample blog data - with correct image paths for each blog
  const blogsData = [
    {
      id: 1,
      title: "Getting Started with React and Tailwind",
      date: "2023/04/27",
      categories: ["Development", "Frontend"],
      metaDescription:
        "Learn how to setup and use React with Tailwind CSS for modern web development",
      tags: ["React", "Tailwind", "JavaScript"],
      metaTags: ["web development", "tutorial", "beginners"],
      description:
        "In this comprehensive guide, we explore how to set up a new React project with Tailwind CSS integration. We'll cover installation, configuration, and best practices for building responsive and beautiful user interfaces.",
      image: "/cuba-context/images/test.png",
      views: "4.3K",
    },
    {
      id: 2,
      title: "Advanced CSS Animation Techniques for Modern Websites",
      date: "2023/04/22",
      categories: ["CSS", "Animation"],
      metaDescription:
        "Master advanced CSS animations to create engaging user experiences",
      tags: ["CSS", "Animation", "Web Design"],
      metaTags: ["animations", "css tricks", "user experience"],
      description:
        "Dive deep into advanced CSS animation techniques that will take your websites to the next level. Learn about keyframes, transitions, and how to optimize animations for performance.",
      image: "/api/placeholder/800/400",
      views: "5.6K",
    },
  ];

  const [currentPage, setCurrentPage] = useState(1);
  const [selectedBlog, setSelectedBlog] = useState(null);
  const blogsPerPage = 10;

  // Get current blogs
  const indexOfLastBlog = currentPage * blogsPerPage;
  const indexOfFirstBlog = indexOfLastBlog - blogsPerPage;
  const currentBlogs = blogsData.slice(indexOfFirstBlog, indexOfLastBlog);

  // Change page
  const goToFirstPage = () => setCurrentPage(1);
  const goToLastPage = () =>
    setCurrentPage(Math.ceil(blogsData.length / blogsPerPage));
  const goToPreviousPage = () =>
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  const goToNextPage = () =>
    setCurrentPage((prev) =>
      Math.min(prev + 1, Math.ceil(blogsData.length / blogsPerPage))
    );

  // Truncate text to specific length
  const truncateText = (text, maxLength) => {
    if (!text) return "";
    return text.length > maxLength
      ? text.substring(0, maxLength) + "..."
      : text;
  };

  // Format categories or arrays as comma-separated string
  const formatArrayItems = (items) => {
    if (!items || items.length === 0) return "";
    return items.join(", ");
  };

  // Handle edit and delete actions
  const handleEdit = (id) => {
    console.log(`Editing blog with ID: ${id}`);
    // Implement edit functionality
  };

  const handleDelete = (id) => {
    console.log(`Deleting blog with ID: ${id}`);
    // Implement delete functionality
  };

  // View blog details
  const handleView = (blog) => {
    setSelectedBlog(blog);
  };

  // Close modal
  const closeModal = () => {
    setSelectedBlog(null);
  };

  return (
    <div className="w-full bg-white rounded-lg shadow">
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="text-gray-700 bg-gray-50 border-b">
            <tr>
              <th className="py-4 px-6">Title</th>
              <th className="py-4 px-6">Date</th>
              <th className="py-4 px-6">Categories</th>
              <th className="py-4 px-6">Tags</th>
              <th className="py-4 px-6">Description</th>
              <th className="py-4 px-6 text-center">Views</th>
              <th className="py-4 px-6 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {currentBlogs.map((blog) => (
              <tr key={blog.id} className="bg-white hover:bg-gray-50">
                <td className="py-4 px-6 font-medium">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full overflow-hidden ">
                      <img
                        src={blog.image}
                        alt={blog.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <span>{truncateText(blog.title, 30)}</span>
                  </div>
                </td>
                <td className="py-4 px-6">{blog.date}</td>
                <td className="py-4 px-6">
                  {truncateText(formatArrayItems(blog.categories), 20)}
                </td>
                <td className="py-4 px-6">
                  {truncateText(formatArrayItems(blog.tags), 25)}
                </td>
                <td className="py-4 px-6">
                  {truncateText(blog.description, 40)}
                </td>
                <td className="py-4 px-6 text-center">
                  <span
                    className={`font-medium ${
                      blog.views.startsWith("-")
                        ? "text-red-500"
                        : "text-green-500"
                    }`}
                  >
                    {blog.views.startsWith("-") ? "↓" : "↑"} {blog.views}
                  </span>
                </td>
                <td className="py-4 px-6 text-right">
                  <div className="flex justify-end space-x-2">
                    <button
                      onClick={() => handleView(blog)}
                      className="p-2 text-green-600 hover:text-green-800"
                      aria-label="View blog details"
                    >
                      <Eye size={16} />
                    </button>
                    <button
                      onClick={() => handleEdit(blog.id)}
                      className="p-2 text-blue-600 hover:text-blue-800"
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(blog.id)}
                      className="p-2 text-red-600 hover:text-red-800"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6">
        <div className="flex flex-1 items-center justify-between">
          <div>
            <p className="text-sm text-gray-700">
              Rows per page: <span className="text-blue-500"> 10</span>
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-700">
              <span className="font-medium">
                {indexOfFirstBlog + 1}-
                {Math.min(indexOfLastBlog, blogsData.length)}
              </span>{" "}
              of <span className="font-medium">{blogsData.length}</span>
            </p>
          </div>
          <div>
            <nav
              className="isolate inline-flex -space-x-px rounded-md shadow-sm"
              aria-label="Pagination"
            >
              <button
                onClick={goToFirstPage}
                className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
              >
                <span className="sr-only">First</span>
                <ChevronsLeft className="h-5 w-5" />
              </button>
              <button
                onClick={goToPreviousPage}
                className="relative inline-flex items-center px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
              >
                <span className="sr-only">Previous</span>
                <ChevronLeft className="h-5 w-5" />
              </button>

              {/* Page Numbers - implement if needed, simplified for now */}
              <span className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 focus:outline-offset-0">
                {currentPage}
              </span>

              <button
                onClick={goToNextPage}
                className="relative inline-flex items-center px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
              >
                <span className="sr-only">Next</span>
                <ChevronRight className="h-5 w-5" />
              </button>
              <button
                onClick={goToLastPage}
                className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
              >
                <span className="sr-only">Last</span>
                <ChevronsRight className="h-5 w-5" />
              </button>
            </nav>
          </div>
        </div>
      </div>

      {/* Blog Detail Modal */}
      {selectedBlog && (
        <div className="fixed inset-0 z-50 overflow-auto bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-screen overflow-auto">
            <div className="px-6 py-4 border-b flex justify-between items-center">
              <h3 className="text-xl font-semibold text-gray-900">
                Blog Details
              </h3>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-500"
              >
                &times;
              </button>
            </div>
            <div className="p-6">
              {/* Blog Image */}
              <div className="mb-6">
                <img
                  src={selectedBlog.image}
                  alt={selectedBlog.title}
                  className="w-full h-64 object-cover rounded-lg"
                />
              </div>

              {/* Blog Details */}
              <div className="space-y-4">
                <h2 className="text-2xl font-bold">{selectedBlog.title}</h2>

                <div className="flex items-center justify-between">
                  <p className="text-gray-600">
                    Published on: {selectedBlog.date}
                  </p>
                  <p className="text-green-600 font-medium">
                    Views: {selectedBlog.views}
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold">Meta Description</h3>
                  <p className="text-gray-700">
                    {selectedBlog.metaDescription}
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold">Description</h3>
                  <p className="text-gray-700">{selectedBlog.description}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-lg font-semibold">Categories</h3>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {selectedBlog.categories.map((category, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                        >
                          {category}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold">Tags</h3>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {selectedBlog.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold">Meta Tags</h3>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {selectedBlog.metaTags.map((metaTag, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm"
                      >
                        {metaTag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <div className="px-6 py-4 border-t flex justify-end">
              <button
                onClick={closeModal}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BlogViewSection;
