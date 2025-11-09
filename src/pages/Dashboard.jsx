import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { PenSquare, Loader2 } from 'lucide-react';
import Navbar from '../components/Navbar';
import PostCard from '../components/PostCard';
import usePosts from '../hooks/usePosts';
import useAuth from '../hooks/useAuth';

const Dashboard = () => {
  const navigate = useNavigate();
  const { posts, loading, removePost } = usePosts();
  const { user } = useAuth();

  const handleEdit = (postId) => {
    navigate(`/edit/${postId}`);
  };

  const handleDelete = async (postId) => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      await removePost(postId);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary">
      <Navbar />
      
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">
              Welcome back, {user?.name}!
            </h1>
            <p className="text-muted-foreground text-lg">
              Manage your blog posts and create new content
            </p>
          </div>
          <Button size="lg" onClick={() => navigate('/create')}>
            <PenSquare className="mr-2 h-5 w-5" />
            New Post
          </Button>
        </div>

        {/* Posts Grid */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <PenSquare className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-2xl font-semibold mb-2">No posts yet</h3>
            <p className="text-muted-foreground mb-6">
              Start creating amazing content for your readers
            </p>
            <Button onClick={() => navigate('/create')}>
              <PenSquare className="mr-2 h-4 w-4" />
              Create Your First Post
            </Button>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <PostCard
                key={post.id}
                post={post}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
