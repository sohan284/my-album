import Card from "../ui/Card";

const AlbumCard = ({ album, user, onClick }) => {
  return (
    <Card onClick={onClick}>
      <h3 className="font-semibold text-[purple] text-lg mb-2 line-clamp-2">
        {album.title}
      </h3>
      <p className="text-gray-600">By: {user?.name || "Unknown User"}</p>
      <p className="text-sm text-gray-500 mt-1">{user?.email}</p>
    </Card>
  );
};

export default AlbumCard;
