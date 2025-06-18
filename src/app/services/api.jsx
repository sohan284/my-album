const BASE_URL = 'https://jsonplaceholder.typicode.com';

class ApiService {
  async get(endpoint) {
    try {
      const response = await fetch(`${BASE_URL}${endpoint}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }

  // Albums API
  async getAlbums() {
    return this.get('/albums');
  }

  async getAlbumPhotos(albumId) {
    return this.get(`/photos?albumId=${albumId}`);
  }

  // Users API
  async getUsers() {
    return this.get('/users');
  }

  async getUser(userId) {
    return this.get(`/users/${userId}`);
  }

  // Posts API
  async getPosts() {
    return this.get('/posts');
  }

  async getPost(postId) {
    return this.get(`/posts/${postId}`);
  }

  async getPostComments(postId) {
    return this.get(`/comments?postId=${postId}`);
  }
}

export default new ApiService();