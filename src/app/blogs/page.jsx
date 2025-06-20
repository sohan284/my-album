"use client";
import { useState, useEffect, useCallback, useRef } from "react";
import { useApi } from "../hooks/useApi";
import ApiService from "../services/api";
import BlogCard from "../components/blogs/BlogCard";
import Skeleton from "../components/ui/Skeleton";

const BLOGS_PER_PAGE = 12;

const BlogsPage = () => {
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [displayedBlogs, setDisplayedBlogs] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [likedPosts, setLikedPosts] = useState(new Set());
  const [usersMap, setUsersMap] = useState({});

  const observer = useRef();

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

  useEffect(() => {
    if (users) {
      // Create users map for efficient lookup
      const userMap = {};
      users.forEach((user) => {
        userMap[user.id] = user;
      });
      setUsersMap(userMap);
    }
  }, [users]);

  useEffect(() => {
    if (blogs && users) {
      // Initialize with first page of blogs
      const initialBlogs = blogs.slice(0, BLOGS_PER_PAGE);
      setDisplayedBlogs(initialBlogs);
      setHasMore(blogs.length > BLOGS_PER_PAGE);
    }
  }, [blogs, users]);

  const loadMoreBlogs = useCallback(() => {
    if (!blogs || isLoadingMore || !hasMore) return;

    setIsLoadingMore(true);

    // Simulate network delay for better UX
    setTimeout(() => {
      const startIndex = currentPage * BLOGS_PER_PAGE;
      const endIndex = startIndex + BLOGS_PER_PAGE;
      const newBlogs = blogs.slice(startIndex, endIndex);

      if (newBlogs.length > 0) {
        setDisplayedBlogs((prev) => [...prev, ...newBlogs]);
        setCurrentPage((prev) => prev + 1);
        setHasMore(endIndex < blogs.length);
      } else {
        setHasMore(false);
      }

      setIsLoadingMore(false);
    }, 500);
  }, [blogs, currentPage, isLoadingMore, hasMore]);

  const lastBlogElementRef = useCallback(
    (node) => {
      if (blogsLoading || usersLoading || isLoadingMore) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting && hasMore) {
            loadMoreBlogs();
          }
        },
        {
          threshold: 0.1,
          rootMargin: "100px",
        }
      );

      if (node) observer.current.observe(node);
    },
    [blogsLoading, usersLoading, isLoadingMore, hasMore, loadMoreBlogs]
  );

  const handleBlogClick = (blog) => {
    setSelectedBlog(blog);
    setModalOpen(true);
  };

  const handleLikeToggle = (postId) => {
    setLikedPosts((prev) => {
      const newLikedPosts = new Set(prev);
      if (newLikedPosts.has(postId)) {
        newLikedPosts.delete(postId);
      } else {
        newLikedPosts.add(postId);
      }
      return newLikedPosts;
    });
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
      <h1 className="text-3xl font-bold mb-8 text-blue-500">Blogs</h1>

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
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayedBlogs?.map((blog, index) => {
              const isLastElement = index === displayedBlogs.length - 1;
              return (
                <div
                  key={blog.id}
                  ref={isLastElement ? lastBlogElementRef : null}
                >
                  <BlogCard
                    post={blog}
                    user={usersMap[blog.userId]}
                    onPostClick={() => handleBlogClick(blog)}
                    liked={likedPosts.has(blog.id)}
                    onLikeToggle={handleLikeToggle}
                  />
                </div>
              );
            })}
          </div>

          {/* Loading more indicator */}
          {isLoadingMore && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
              {[...Array(BLOGS_PER_PAGE)].map((_, index) => (
                <div key={`loading-${index}`} className="space-y-3">
                  <Skeleton height="100px" />
                  <Skeleton height="20px" />
                  <Skeleton height="16px" width="60%" />
                </div>
              ))}
            </div>
          )}

          {/* End of results message */}
          {!hasMore && displayedBlogs.length > 0 && (
            <div className="text-center mt-8 py-6">
              <p className="text-gray-500 text-lg">
                📚 You've reached the end of all blogs!
              </p>
              <p className="text-gray-400 text-sm mt-2">
                Showing {displayedBlogs.length} of {blogs?.length || 0} blogs
              </p>
            </div>
          )}
        </>
      )}

      {/* Modal */}
      {modalOpen && selectedBlog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-3/4 max-w-2xl max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-2xl font-bold pr-4">{selectedBlog.title}</h2>
              <button
                className="text-gray-500 hover:text-gray-700 text-xl font-bold"
                onClick={() => setModalOpen(false)}
              >
                ×
              </button>
            </div>
            <div className="mb-4">
              <p className="text-gray-600 mb-2">
                <strong>Author:</strong>{" "}
                {usersMap[selectedBlog.userId]?.name || "Unknown"}
              </p>
              <p className="text-gray-500 text-sm">
                <strong>Email:</strong>{" "}
                {usersMap[selectedBlog.userId]?.email || "Unknown"}
              </p>
            </div>
            <div className="prose max-w-none">
              <p className="text-gray-700 leading-relaxed">
                {selectedBlog.body}
              </p>
            </div>
            <div className="flex justify-between items-center mt-6 pt-4 border-t">
              <button
                onClick={() => handleLikeToggle(selectedBlog.id)}
                className={`px-4 py-2 rounded-full text-sm transition-colors ${
                  likedPosts.has(selectedBlog.id)
                    ? "bg-red-100 text-red-600 hover:bg-red-200"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {likedPosts.has(selectedBlog.id) ? "❤️ Liked" : "🤍 Like"}
              </button>
              <button
                className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                onClick={() => setModalOpen(false)}
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

export default BlogsPage;
