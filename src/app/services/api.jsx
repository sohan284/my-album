const BASE_URL = "https://jsonplaceholder.typicode.com";

const get = async (endpoint) => {
  try {
    const response = await fetch(`${BASE_URL}${endpoint}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
};

const ApiService = {
  getAlbums: async () => {
    return get("/albums");
  },

  getAlbumPhotos: async (albumId) => {
    return get(`/photos?albumId=${albumId}`);
  },

  getUsers: async () => {
    return get("/users");
  },

  getUser: async (userId) => {
    return get(`/users/${userId}`);
  },

  getPosts: async () => {
    return get("/posts");
  },

  getPost: async (postId) => {
    return get(`/posts/${postId}`);
  },

  getPostComments: async (postId) => {
    return get(`/comments?postId=${postId}`);
  },
};

export default ApiService;
