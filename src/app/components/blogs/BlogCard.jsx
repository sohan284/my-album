import Card from "../ui/Card";

const BlogCard = ({ post, user, onPostClick, liked, onLikeToggle }) => {
  const preview =
    post.body.substring(0, 100) + (post.body.length > 100 ? "..." : "");

  return (
    <Card className="relative">
      <div onClick={onPostClick}>
        <h3 className="font-semibold text-lg mb-2 line-clamp-2 cursor-pointer text-blue-500">
          {post.title}
        </h3>
        <p className="text-gray-600 mb-2">
          By: {user?.name || "Unknown Author"}
        </p>
        <p className="text-gray-700 mb-4">{preview}</p>
      </div>

      <div className="flex justify-between items-center">
        <span className="text-sm text-gray-500">{user?.email}</span>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onLikeToggle(post.id);
          }}
          className={`px-3 py-1 rounded-full text-sm transition-colors ${
            liked
              ? "bg-red-100 text-red-600 hover:bg-red-200"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }`}
        >
          {liked ? "❤️ Liked" : "🤍 Like"}
        </button>
      </div>
    </Card>
  );
};

export default BlogCard;
