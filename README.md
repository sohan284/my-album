# 🎵 Albums & Blogs App

A modern, responsive web application built with **Next.js** and **Tailwind CSS** that displays albums and blog posts from JSONPlaceholder API. Features infinite scrolling, interactive modals, and a clean, user-friendly interface.

## 🚀 Live Demo

[View Live Demo](#) https://my-album-neon.vercel.app/

## 📸 Screenshots

### Albums Page
![image](https://github.com/user-attachments/assets/8ebfea29-3d29-4562-b6d2-70e5f022ea98)


### Blog Posts
![image](https://github.com/user-attachments/assets/a2cdeed4-c14a-4933-8dc9-79205b8c2bae)


## ✨ Features

### 🎵 Albums Page (`/albums`)
- **Album Grid**: Displays all albums with titles and user information
- **Photo Modal**: Click any album to view the first 5 photos with thumbnails and full-size previews
- **Infinite Scrolling**: Loads 12 albums at a time for optimal performance
- **Skeleton Loading**: Smooth loading states while fetching data
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile

### 📝 Blogs Page (`/blogs`)
- **Blog Cards**: Clean card layout showing title, author, and content preview
- **Author Filtering**: Dropdown filter to view posts by specific authors
- **Full Post Modal**: View complete blog content with comments
- **Like System**: Like/unlike posts with local state persistence
- **Infinite Scrolling**: Progressive loading for better performance

### 🔧 Technical Features
- **Next.js 14**: App Router with server-side rendering
- **Tailwind CSS**: Utility-first styling with custom components
- **Custom Hooks**: Reusable API logic with `useApi` hook
- **Error Handling**: Comprehensive error states and user feedback

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS
- **Language**: JavaScript
- **API**: JSONPlaceholder (REST API)
- **State Management**: React Hooks (useState, useEffect, useCallback)
- **Routing**: Next.js App Router
- **UI Components**: Custom components with Tailwind

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/albums-blogs-app.git
   cd albums-blogs-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
albums-blogs-app/
├── app/
│   ├── albums/
│   │   └── page.js              # Albums page component
│   ├── blogs/
│   │   └── page.js              # Blogs page component
│   ├── components/
│   │   ├── albums/
│   │   │   ├── AlbumCard.js     # Album card component
│   │   │   └── AlbumModal.js    # Album photos modal
│   │   ├── blogs/
│   │   │   ├── BlogCard.js      # Blog post card
│   │   │   └── BlogModal.js     # Blog content modal
│   │   ├── ui/
│   │   │   ├── Card.js          # Reusable card component
│   │   │   ├── Skeleton.js      # Loading skeleton
│   │   │   └── Modal.js         # Modal wrapper
│   │   └── Navigation.js        # Navigation component
│   ├── hooks/
│   │   └── useApi.js            # Custom API hook
│   ├── services/
│   │   └── api.js               # API service functions
│   ├── layout.js                # Root layout
│   └── page.js                  # Home page
├── public/
│   └── screenshots/             # App screenshots
├── styles/
│   └── globals.css              # Global styles
├── tailwind.config.js           # Tailwind configuration
├── next.config.js               # Next.js configuration
├── package.json
└── README.md
```

## 🔌 API Endpoints

The app consumes the following JSONPlaceholder endpoints:

- **Albums**: `https://jsonplaceholder.typicode.com/albums`
- **Photos**: `https://jsonplaceholder.typicode.com/photos?albumId={id}`
- **Posts**: `https://jsonplaceholder.typicode.com/posts`
- **Users**: `https://jsonplaceholder.typicode.com/users`
- **Comments**: `https://jsonplaceholder.typicode.com/comments?postId={id}`

## 🎨 Design Decisions

### Component Architecture
- **Reusable Components**: Shared UI components like Card, Skeleton, and Modal
- **Page-Specific Components**: AlbumCard, BlogCard for specialized functionality
- **Custom Hooks**: useApi for consistent data fetching patterns
- **Service Layer**: Centralized API calls in services/api.js

### Performance Optimizations
- **Infinite Scrolling**: Loads content progressively to reduce initial bundle size
- **Intersection Observer**: Efficiently detects when to load more content
- **Lazy Loading**: Images and content load on demand
- **Memoization**: useCallback and useMemo for expensive operations

### User Experience
- **Loading States**: Skeleton loaders provide visual feedback
- **Error Handling**: Clear error messages and retry mechanisms
- **Responsive Design**: Mobile-first approach with Tailwind breakpoints
- **Accessibility**: Semantic HTML and keyboard navigation support

## 🚀 Deployment

### Vercel (Recommended)
```bash
npm run build
vercel --prod
```

**Sohanur Rahman Sohan**
- GitHub: [@sohan284](https://github.com/sohan284)
- Email: sr.sohan088@gmail.com
