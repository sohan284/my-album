"use client";
import { useState, useEffect } from "react";

import { useApi } from "../hooks/useApi";
import ApiService from "../services/api";
import AlbumCard from "../components/albums/AlbumCard";
import AlbumModal from "../components/albums/AlbumModal";
import Skeleton from "../components/ui/Skeleton";

const AlbumsPage = () => {
  const [users, setUsers] = useState({});
  const [selectedAlbum, setSelectedAlbum] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const { data: albums, loading, error } = useApi(() => ApiService.getAlbums());

  useEffect(() => {
    if (albums) {
      fetchUsers();
    }
  }, [albums]);

  const fetchUsers = async () => {
    try {
      const usersData = await ApiService.getUsers();
      const usersMap = {};
      usersData.forEach((user) => {
        usersMap[user.id] = user;
      });
      setUsers(usersMap);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const handleAlbumClick = (album) => {
    setSelectedAlbum(album);
    setSelectedUser(users[album.userId]);
    setModalOpen(true);
  };

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center text-red-600">
          <h2 className="text-2xl font-bold mb-4">Error Loading Albums</h2>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl text-[purple] font-bold mb-8">Albums</h1>

      {loading ? (
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
          {albums?.map((album) => (
            <AlbumCard
              key={album.id}
              album={album}
              user={users[album.userId]}
              onClick={() => handleAlbumClick(album)}
            />
          ))}
        </div>
      )}

      <AlbumModal
        album={selectedAlbum}
        user={selectedUser}
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
      />
    </div>
  );
};

export default AlbumsPage;
