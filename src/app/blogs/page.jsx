"use client";
import { useState, useEffect, useCallback, useRef } from "react";
import { useApi } from "../hooks/useApi";
import ApiService from "../services/api";
import BlogCard from "../components/blogs/BlogCard";
import Skeleton from "../components/ui/Skeleton";
import BlogModal from "../components/blogs/BlogModal";
import AuthorFilter from "../components/blogs/AuthorFilter";

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
  const [selectedAuthor, setSelectedAuthor] = useState("");

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
    const storedLikes = localStorage.getItem("likedPosts");
    if (storedLikes) {
      setLikedPosts(new Set(JSON.parse(storedLikes)));
    }
  }, []);

  useEffect(() => {
    if (users) {
      const userMap = {};
      users.forEach((user) => {
        userMap[user.id] = user;
      });
      setUsersMap(userMap);
    }
  }, [users]);

  useEffect(() => {
    if (blogs && users) {
      const filteredBlogs = selectedAuthor
        ? blogs.filter((blog) => blog.userId === parseInt(selectedAuthor))
        : blogs;

      const initialBlogs = filteredBlogs.slice(0, BLOGS_PER_PAGE);
      setDisplayedBlogs(initialBlogs);
      setHasMore(filteredBlogs.length > BLOGS_PER_PAGE);
    }
  }, [blogs, users, selectedAuthor]);

  const loadMoreBlogs = useCallback(() => {
    if (!blogs || isLoadingMore || !hasMore) return;

    setIsLoadingMore(true);

    setTimeout(() => {
      const filteredBlogs = selectedAuthor
        ? blogs.filter((blog) => blog.userId === parseInt(selectedAuthor))
        : blogs;

      const startIndex = currentPage * BLOGS_PER_PAGE;
      const endIndex = startIndex + BLOGS_PER_PAGE;
      const newBlogs = filteredBlogs.slice(startIndex, endIndex);

      if (newBlogs.length > 0) {
        setDisplayedBlogs((prev) => [...prev, ...newBlogs]);
        setCurrentPage((prev) => prev + 1);
        setHasMore(endIndex < filteredBlogs.length);
      } else {
        setHasMore(false);
      }

      setIsLoadingMore(false);
    }, 500);
  }, [blogs, currentPage, isLoadingMore, hasMore, selectedAuthor]);

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

      // Store the liked posts in localStorage
      localStorage.setItem(
        "likedPosts",
        JSON.stringify(Array.from(newLikedPosts))
      );

      return newLikedPosts;
    });
  };

  const handleAuthorChange = (authorId) => {
    setSelectedAuthor(authorId);
    setCurrentPage(1); // Reset pagination
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

      {/* Author Filter */}
      <AuthorFilter
        usersMap={usersMap}
        selectedAuthor={selectedAuthor}
        onAuthorChange={handleAuthorChange}
      />

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

      <BlogModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        blog={selectedBlog}
        user={usersMap[selectedBlog?.userId]}
        liked={likedPosts.has(selectedBlog?.id)}
        onLikeToggle={handleLikeToggle}
      />
    </div>
  );
};

export default BlogsPage;
