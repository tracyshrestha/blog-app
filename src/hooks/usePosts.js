import { useEffect } from 'react';
import { toast } from 'sonner';
import usePostsStore from '../stores/postsStore';
import useAuthStore from '../stores/authStore';

const API_URL = 'https://jsonplaceholder.typicode.com/posts';

const usePosts = () => {
  const { posts, loading, error, setPosts, addPost, updatePost, deletePost, setLoading, setError } = usePostsStore();
  const { user } = useAuthStore();

  const fetchPosts = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(API_URL);
      if (!response.ok) throw new Error('Failed to fetch posts');
      const data = await response.json();
      // Limit to 20 posts for better UX
      setPosts(data.slice(0, 20));
    } catch (err) {
      setError(err.message);
      toast.error('Failed to load posts');
    } finally {
      setLoading(false);
    }
  };

  const createPost = async (postData) => {
    setLoading(true);
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...postData,
          userId: user?.id || 1,
        }),
      });
      
      if (!response.ok) throw new Error('Failed to create post');
      const newPost = await response.json();
      
      // Add with generated id and current timestamp
      const postWithDetails = {
        ...newPost,
        id: Date.now(), // Use timestamp for unique ID in demo
        author: user?.name || 'Anonymous',
        createdAt: new Date().toISOString(),
      };
      
      addPost(postWithDetails);
      toast.success('Post created successfully!');
      return postWithDetails;
    } catch (err) {
      toast.error('Failed to create post');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const editPost = async (id, postData) => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(postData),
      });
      
      if (!response.ok) throw new Error('Failed to update post');
      const updatedData = await response.json();
      
      updatePost(id, updatedData);
      toast.success('Post updated successfully!');
      return updatedData;
    } catch (err) {
      toast.error('Failed to update post');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const removePost = async (id) => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) throw new Error('Failed to delete post');
      
      deletePost(id);
      toast.success('Post deleted successfully!');
    } catch (err) {
      toast.error('Failed to delete post');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (posts.length === 0) {
      fetchPosts();
    }
  }, []);

  return {
    posts,
    loading,
    error,
    fetchPosts,
    createPost,
    editPost,
    removePost,
  };
};

export default usePosts;
