import { usePosts } from "@/hooks/usePosts";

const Dashboard = () => {
  const { posts, loading, error, removePost } = usePosts();

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">My Posts</h1>
      <div className="grid gap-4">
        {posts.map((post) => (
          <div key={post.id} className="border p-3 rounded shadow-sm">
            <h2 className="font-semibold">{post.title}</h2>
            <p>{post.body}</p>
            <button
              onClick={() => removePost(post.id)}
              className="text-red-500 mt-2"
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
