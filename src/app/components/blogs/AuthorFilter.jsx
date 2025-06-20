"use client";

const AuthorFilter = ({ usersMap, selectedAuthor, onAuthorChange }) => {
  return (
    <div className="mb-6">
      <select
        className="border text-blue-500 rounded px-4 py-2 border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 transition-colors"
        aria-label="Filter by Author"
        value={selectedAuthor}
        onChange={(e) => onAuthorChange(e.target.value)}
      >
        <option value="">All Authors</option>
        {Object.values(usersMap).map((user) => (
          <option className="text-blue-500" key={user.id} value={user.id}>
            {user.name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default AuthorFilter;
