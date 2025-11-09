import { create } from 'zustand';

const usePostsStore = create((set) => ({
  posts: [],
  loading: false,
  error: null,
  
  setPosts: (posts) => set({ posts }),
  
  addPost: (post) => set((state) => ({ 
    posts: [post, ...state.posts] 
  })),
  
  updatePost: (id, updatedPost) => set((state) => ({
    posts: state.posts.map(post => 
      post.id === id ? { ...post, ...updatedPost } : post
    )
  })),
  
  deletePost: (id) => set((state) => ({
    posts: state.posts.filter(post => post.id !== id)
  })),
  
  setLoading: (loading) => set({ loading }),
  
  setError: (error) => set({ error }),
}));

export default usePostsStore;
