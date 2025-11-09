import { useState, useEffect } from "react";
import * as api from "@/api/posts.api";

export const usePosts = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const res = await api.getPosts();
      setPosts(res.data.slice(0, 10));
    } catch (err) {
      setError("Failed to fetch posts");
    } finally {
      setLoading(false);
    }
  };

  const addNewPost = async (post) => {
    const res = await api.addPost(post);
    setPosts((prev) => [res.data, ...prev]);
  };

  const editPost = async (id, post) => {
    const res = await api.updatePost(id, post);
    setPosts((prev) => prev.map((p) => (p.id === id ? res.data : p)));
  };

  const removePost = async (id) => {
    await api.deletePost(id);
    setPosts((prev) => prev.filter((p) => p.id !== id));
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  return { posts, loading, error, addNewPost, editPost, removePost };
};
