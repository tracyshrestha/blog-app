import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ArrowLeft, Edit, Trash2, Loader2 } from "lucide-react";
import Navbar from "../components/Navbar";
import usePostsStore from "../stores/postsStore";
import usePosts from "../hooks/usePosts";

const PostDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const posts = usePostsStore((state) => state.posts);
  const { removePost } = usePosts();
  const [post, setPost] = useState(null);

  useEffect(() => {
    const foundPost = posts.find((p) => p.id === parseInt(id));
    if (foundPost) {
      setPost(foundPost);
    } else {
      // If post not found in store, fetch from API
      fetchPost();
    }
  }, [id, posts]);

  const fetchPost = async () => {
    try {
      const response = await fetch(
        `https://jsonplaceholder.typicode.com/posts/${id}`,
      );
      const data = await response.json();
      setPost(data);
    } catch (error) {
      console.error("Failed to fetch post:", error);
      navigate("/dashboard");
    }
  };

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this post?")) {
      await removePost(parseInt(id));
      navigate("/dashboard");
    }
  };

  if (!post) {
    return (
      <div className="min-h-screen bg-linear-to-b from-background to-secondary">
        <Navbar />
        <div className="flex justify-center items-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-b from-background to-secondary">
      <Navbar />

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <Button
            variant="secondary"
            onClick={() => navigate("/dashboard")}
            className="mb-6"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>

          <Card>
            <CardHeader className="space-y-4">
              <div className="flex justify-between items-start gap-4">
                <h1 className="text-4xl font-bold leading-tight flex-1">
                  {post.title}
                </h1>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigate(`/edit/${post.id}`)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleDelete}
                    className="hover:bg-destructive hover:text-destructive-foreground"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              {post.author && (
                <p className="text-muted-foreground">By {post.author}</p>
              )}
            </CardHeader>
            <CardContent>
              <div className="prose prose-lg max-w-none">
                <p className="text-foreground leading-relaxed whitespace-pre-wrap">
                  {post.body}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PostDetail;
