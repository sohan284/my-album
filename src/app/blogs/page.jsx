"use client";
import { useState, useEffect } from "react";
import { useApi } from "../hooks/useApi";
import ApiService from "../services/api";
import Skeleton from "../components/ui/Skeleton";

const BlogsPage = () => {
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const {
    data: blogs,
    loading: blogsLoading,
    error: blogsError,
  } = useApi(() => ApiService.getPosts());
  const {
    data: users,
    loading: usersLoading,
    error: usersError,
  } = useApi(() => ApiService.getUsers());

  const handleBlogClick = (blog) => {
    setSelectedBlog(blog);
    setModalOpen(true);
  };

  if (blogsError || usersError) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center text-red-600">
          <h2 className="text-2xl font-bold mb-4">Error Loading Blogs</h2>
          <p>{blogsError || usersError}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Blogs</h1>

      {blogsLoading || usersLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(12)].map((_, index) => (
            <div key={index} className="space-y-3">
              <Skeleton height="100px" />
              <Skeleton height="20px" />
              <Skeleton height="16px" width="60%" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {blogs?.map((blog) => (
            <div
              key={blog.id}
              className="border rounded p-4 shadow hover:shadow-lg transition"
              onClick={() => handleBlogClick(blog)}
            >
              <h2 className="text-lg font-bold">{blog.title}</h2>
              <p className="text-gray-600">
                Author:{" "}
                {users?.find((user) => user.id === blog.userId)?.name ||
                  "Unknown"}
              </p>
              <p className="text-gray-500 mt-2">{blog.body.slice(0, 100)}...</p>
            </div>
          ))}
        </div>
      )}

      {modalOpen && selectedBlog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded p-6 w-3/4 max-w-lg">
            <h2 className="text-xl font-bold mb-4">{selectedBlog.title}</h2>
            <p className="text-gray-600 mb-4">
              Author:{" "}
              {users?.find((user) => user.id === selectedBlog.userId)?.name ||
                "Unknown"}
            </p>
            <p className="text-gray-500">{selectedBlog.body}</p>
            <button
              className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              onClick={() => setModalOpen(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default BlogsPage;
