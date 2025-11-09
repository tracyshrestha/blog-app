import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';
import Navbar from '../components/Navbar';
import usePosts from '../hooks/usePosts';
import RichTextEditor from '../components/RichTextEditor';

const CreatePost = () => {
  const navigate = useNavigate();
  const { createPost } = usePosts();
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

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
      await createPost({ title, body });
      navigate('/dashboard');
    } catch (error) {
      console.error('Failed to create post:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-b from-background to-secondary">
      <Navbar />
      
      <div className="container mx-auto px-4 py-12">
        <Button
          variant="ghost"
          onClick={() => navigate('/dashboard')}
          className="mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Button>

        <Card className="max-w-3xl mx-auto">
          <CardHeader>
            <CardTitle className="text-3xl">Create New Post</CardTitle>
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
                  {isSubmitting ? 'Publishing...' : 'Publish Post'}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate('/dashboard')}
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

export default CreatePost;
