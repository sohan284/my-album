"use client";
import { useState, useEffect, useCallback, useRef } from "react";

import { useApi } from "../hooks/useApi";
import ApiService from "../services/api";
import AlbumCard from "../components/albums/AlbumCard";
import AlbumModal from "../components/albums/AlbumModal";
import Skeleton from "../components/ui/Skeleton";

const ALBUMS_PER_PAGE = 12;

const AlbumsPage = () => {
  const [users, setUsers] = useState({});
  const [selectedAlbum, setSelectedAlbum] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [displayedAlbums, setDisplayedAlbums] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const observer = useRef();

  const { data: albums, loading, error } = useApi(() => ApiService.getAlbums());

  useEffect(() => {
    if (albums) {
      fetchUsers();
      const initialAlbums = albums.slice(0, ALBUMS_PER_PAGE);
      setDisplayedAlbums(initialAlbums);
      setHasMore(albums.length > ALBUMS_PER_PAGE);
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

  const loadMoreAlbums = useCallback(() => {
    if (!albums || isLoadingMore || !hasMore) return;

    setIsLoadingMore(true);

    setTimeout(() => {
      const startIndex = currentPage * ALBUMS_PER_PAGE;
      const endIndex = startIndex + ALBUMS_PER_PAGE;
      const newAlbums = albums.slice(startIndex, endIndex);

      if (newAlbums.length > 0) {
        setDisplayedAlbums((prev) => [...prev, ...newAlbums]);
        setCurrentPage((prev) => prev + 1);
        setHasMore(endIndex < albums.length);
      } else {
        setHasMore(false);
      }

      setIsLoadingMore(false);
    }, 500);
  }, [albums, currentPage, isLoadingMore, hasMore]);

  const lastAlbumElementRef = useCallback(
    (node) => {
      if (loading || isLoadingMore) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting && hasMore) {
            loadMoreAlbums();
          }
        },
        {
          threshold: 0.1,
          rootMargin: "100px",
        }
      );

      if (node) observer.current.observe(node);
    },
    [loading, isLoadingMore, hasMore, loadMoreAlbums]
  );

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
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayedAlbums?.map((album, index) => {
              const isLastElement = index === displayedAlbums.length - 1;
              return (
                <div
                  key={album.id}
                  ref={isLastElement ? lastAlbumElementRef : null}
                >
                  <AlbumCard
                    album={album}
                    user={users[album.userId]}
                    onClick={() => handleAlbumClick(album)}
                  />
                </div>
              );
            })}
          </div>

          {isLoadingMore && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
              {[...Array(ALBUMS_PER_PAGE)].map((_, index) => (
                <div key={`loading-${index}`} className="space-y-3">
                  <Skeleton height="100px" />
                  <Skeleton height="20px" />
                  <Skeleton height="16px" width="60%" />
                </div>
              ))}
            </div>
          )}

          {!hasMore && displayedAlbums.length > 0 && (
            <div className="text-center mt-8 py-6">
              <p className="text-gray-500 text-lg">
                You've reached the end of all albums!
              </p>
              <p className="text-gray-400 text-sm mt-2">
                Showing {displayedAlbums.length} of {albums?.length || 0} albums
              </p>
            </div>
          )}
        </>
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
