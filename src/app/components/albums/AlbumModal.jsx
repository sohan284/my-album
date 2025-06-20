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
      setPhotos(allPhotos.slice(0, 5)); // First 5 photos only
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
            <div
              key={photo.id}
              className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"
            >
              <div className="relative">
                <img
                  src={photo.thumbnailUrl}
                  alt={photo.thumbnailUrl}
                  className="w-full h-48 object-cover bg-gray-800"
                  loading="lazy"
                />
              </div>

              <div className="p-3 space-y-2">
                <h4 className="text-sm font-medium text-gray-900 line-clamp-2">
                  {photo.title}
                </h4>

                <div className="flex items-center justify-between">
                  <span className="text-xs text-blue-500">
                    url: {photo.url}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </Modal>
  );
};

export default AlbumModal;
