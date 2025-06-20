"use client";

import { useState, useEffect } from "react";
import Modal from "../ui/Modal";
import ApiService from "../../services/api";

const BlogModal = ({ isOpen, onClose, blog, user, liked, onLikeToggle }) => {
  const [comments, setComments] = useState([]);
  const [loadingComments, setLoadingComments] = useState(false);
  const [commentsError, setCommentsError] = useState(null);

  useEffect(() => {
    if (blog && isOpen) {
      fetchComments(blog.id);
    }
  }, [blog, isOpen]);

  const fetchComments = async (postId) => {
    try {
      setLoadingComments(true);
      setCommentsError(null);
      const commentsData = await ApiService.getPostComments(postId);
      setComments(commentsData);
    } catch (error) {
      setCommentsError(error.message);
    } finally {
      setLoadingComments(false);
    }
  };

  if (!blog) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={blog.title || "Blog Details"}
    >
      <div className="mb-4">
        <p className="text-gray-600 mb-2">
          <strong>Author:</strong> {user?.name || "Unknown"}
        </p>
        <p className="text-gray-500 text-sm">
          <strong>Email:</strong> {user?.email || "Unknown"}
        </p>
      </div>
      <div className="prose max-w-none">
        <p className="text-gray-700 leading-relaxed">{blog.body}</p>
      </div>
      <div className="flex justify-end items-center mt-6 pt-4 border-t">
        <button
          onClick={() => onLikeToggle(blog.id)}
          className={`px-4 py-2 rounded-full text-sm transition-colors ${
            liked
              ? "bg-red-100 text-red-600 hover:bg-red-200"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }`}
        >
          {liked ? "❤️ Liked" : "🤍 Like"}
        </button>
      </div>

      {/* Comments Section */}
      <div className="mt-6">
        <h3 className="text-lg font-bold mb-4 text-gray-800">Comments</h3>
        {loadingComments ? (
          <p className="text-gray-500">Loading comments...</p>
        ) : commentsError ? (
          <p className="text-red-500">Error: {commentsError}</p>
        ) : comments.length > 0 ? (
          <ul className="space-y-4">
            {comments.map((comment) => (
              <li key={comment.id} className="border rounded p-4">
                <p className="text-gray-600">
                  <strong>{comment.name}</strong> ({comment.email})
                </p>
                <p className="text-gray-500">{comment.body}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">No comments available.</p>
        )}
      </div>
      <div className="flex justify-end mt-3">
        <button
          className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          onClick={onClose}
        >
          Close
        </button>
      </div>
    </Modal>
  );
};

export default BlogModal;
