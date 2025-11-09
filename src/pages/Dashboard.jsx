import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PenSquare, Loader2, Search } from "lucide-react";
import Navbar from "../components/Navbar";
import PostCard from "../components/PostCard";
import usePosts from "../hooks/usePosts";
import useAuth from "../hooks/useAuth";
import { toast } from "sonner";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

const Dashboard = () => {
  const navigate = useNavigate();
  const { posts, loading, removePost } = usePosts();
  const { user } = useAuth();

  // 👇 Search and Pagination state
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const postsPerPage = 9;

  // 👇 Filtered posts (case-insensitive search)
  const filteredPosts = useMemo(() => {
    return posts.filter((post) => {
      const title = post?.title?.toLowerCase() || "";
      const content = post?.content?.toLowerCase() || "";
      const search = searchTerm.toLowerCase();

      return title.includes(search) || content.includes(search);
    });
  }, [posts, searchTerm]);

  const totalPages = Math.ceil(filteredPosts.length / postsPerPage);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const startIndex = (page - 1) * postsPerPage;
  const paginatedPosts = filteredPosts.slice(
    startIndex,
    startIndex + postsPerPage
  );

  const handleEdit = (postId) => {
    navigate(`/edit/${postId}`);
  };

  const handleDelete = async (postId) => {
    toast("Are you sure you want to delete this post?", {
      action: {
        label: "Delete",
        onClick: async () => {
          await removePost(postId);
        },
      },
      cancel: {
        label: "Cancel",
      },
    });
  };

  return (
    <div className="min-h-screen bg-linear-to-b from-background to-secondary">
      <Navbar />

      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">
              Welcome back, {user?.name}!
            </h1>
            <p className="text-muted-foreground text-lg">
              Manage your blog posts and create new content
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Search Input */}
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search posts..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setPage(1); // reset pagination when searching
                }}
                className="pl-8 w-48 md:w-64"
              />
            </div>

            <Button size="lg" onClick={() => navigate("/create")}>
              <PenSquare className="mr-2 h-5 w-5" />
              New Post
            </Button>
          </div>
        </div>

        {/* Posts Grid */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : filteredPosts.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <PenSquare className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-2xl font-semibold mb-2">No posts found</h3>
            <p className="text-muted-foreground mb-6">
              {searchTerm
                ? "Try adjusting your search term."
                : "Start creating amazing content for your readers."}
            </p>
            {!searchTerm && (
              <Button onClick={() => navigate("/create")}>
                <PenSquare className="mr-2 h-4 w-4" />
                Create Your First Post
              </Button>
            )}
          </div>
        ) : (
          <>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
              {paginatedPosts.map((post) => (
                <PostCard
                  key={post.id}
                  post={post}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              ))}
            </div>

            {/* 👇 Centered Pagination */}
            <div className="mt-8 flex justify-center">
              <Pagination className="w-fit p-2">
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      className="cursor-pointer"
                      onClick={() => handlePageChange(page - 1)}
                    />
                  </PaginationItem>

                  {[...Array(totalPages)].map((_, pageIndex) => (
                    <PaginationItem key={pageIndex}>
                      <PaginationLink
                        onClick={() => handlePageChange(pageIndex + 1)}
                        className={`${
                          page === pageIndex + 1
                            ? "bg-lexus/90 text-white dark:bg-lexusDark/90"
                            : ""
                        }`}
                      >
                        {pageIndex + 1}
                      </PaginationLink>
                    </PaginationItem>
                  ))}

                  <PaginationItem>
                    <PaginationNext
                      className="cursor-pointer"
                      onClick={() => handlePageChange(page + 1)}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
