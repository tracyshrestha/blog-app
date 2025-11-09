import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Loader2 } from "lucide-react";
import Navbar from "../components/Navbar";
import usePosts from "../hooks/usePosts";
import usePostsStore from "../stores/postsStore";
import RichTextEditor from "@/components/RichTextEditor";

const EditPost = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { editPost } = usePosts();
  const posts = usePostsStore((state) => state.posts);

  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const post = posts.find((p) => p.id === parseInt(id));
    if (post) {
      setTitle(post.title);
      setBody(post.body);
      setIsLoading(false);
    } else {
      // If post not found, redirect to dashboard
      navigate("/dashboard");
    }
  }, [id, posts, navigate]);

  // Helper function to check if HTML content is empty
  const isContentEmpty = (html) => {
    if (!html) return true;
    // Create a temporary div to parse HTML and get text content
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = html;
    return !tempDiv.textContent || !tempDiv.textContent.trim();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim() || isContentEmpty(body)) {
      return;
    }

    setIsSubmitting(true);
    try {
      await editPost(parseInt(id), { title, body });
      navigate("/dashboard");
    } catch (error) {
      console.error("Failed to update post:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
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
        <Button
          variant="ghost"
          onClick={() => navigate("/dashboard")}
          className="mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Button>

        <Card className="max-w-3xl mx-auto">
          <CardHeader>
            <CardTitle className="text-3xl">Edit Post</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  placeholder="Enter your post title..."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  className="text-lg"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="body">Content</Label>
                <RichTextEditor content={body} setContent={setBody} />
              </div>

              <div className="flex gap-4">
                <Button
                  type="submit"
                  disabled={isSubmitting || !title.trim() || isContentEmpty(body)}
                  className="flex-1"
                >
                  {isSubmitting ? "Updating..." : "Update Post"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate("/dashboard")}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EditPost;
