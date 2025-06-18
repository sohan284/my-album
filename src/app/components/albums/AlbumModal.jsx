"use client";
import { useState, useEffect } from "react";
import Modal from "../ui/Modal";
import ApiService from "../../services/api";
import Skeleton from "../ui/Skeleton";

const AlbumModal = ({ album, user, isOpen, onClose }) => {
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && album) {
      fetchPhotos();
    }
  }, [isOpen, album]);

  const fetchPhotos = async () => {
    try {
      setLoading(true);
      const allPhotos = await ApiService.getAlbumPhotos(album.id);
      setPhotos(allPhotos.slice(0, 5)); // First 5 photos
    } catch (error) {
      console.error("Error fetching photos:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`${album?.title} - by ${user?.name}`}
    >
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(5)].map((_, index) => (
            <div key={index} className="space-y-2">
              <Skeleton height="200px" />
              <Skeleton height="20px" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {photos.map((photo) => (
            <div key={photo.id} className="space-y-2">
              <img
                src={photo.thumbnailUrl}
                alt={photo.title}
                className="w-full h-48 object-cover rounded cursor-pointer hover:opacity-75 transition-opacity"
                onClick={() => window.open(photo.url, "_blank")}
              />
              <p className="text-sm text-gray-700 line-clamp-2">
                {photo.title}
              </p>
            </div>
          ))}
        </div>
      )}
    </Modal>
  );
};

export default AlbumModal;
