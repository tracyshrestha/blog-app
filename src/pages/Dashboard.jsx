import { useState, useMemo, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PenSquare, Loader2, Search, Mic, MicOff, X } from "lucide-react";
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

// ✨ Define 5 tag groups
const TAG_RANGES = [
  { label: "A–E", start: "A", end: "E" },
  { label: "F–J", start: "F", end: "J" },
  { label: "K–O", start: "K", end: "O" },
  { label: "P–T", start: "P", end: "T" },
  { label: "U–Z", start: "U", end: "Z" },
];

const SpeechRecognitionAPI =
  typeof window !== "undefined"
    ? window.SpeechRecognition || window.webkitSpeechRecognition
    : null;

const Dashboard = () => {
  const navigate = useNavigate();
  const { posts, loading, removePost } = usePosts();
  const { user } = useAuth();

  // 👇 States
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTag, setSelectedTag] = useState(null);
  const [page, setPage] = useState(1);
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef(null);
  const listenTimeoutRef = useRef(null);
  const postsPerPage = 6;
  const MAX_LISTEN_MS = 30_000;

  const stopSpeechToText = () => {
    if (listenTimeoutRef.current) {
      clearTimeout(listenTimeoutRef.current);
      listenTimeoutRef.current = null;
    }
    recognitionRef.current?.stop();
    setIsListening(false);
  };

  useEffect(() => {
    return () => {
      if (listenTimeoutRef.current) clearTimeout(listenTimeoutRef.current);
      recognitionRef.current?.stop();
    };
  }, []);

  const toggleSpeechToText = () => {
    if (!SpeechRecognitionAPI) {
      toast.error("Speech recognition is not supported in this browser.");
      return;
    }

    // Stop when mic is clicked again
    if (isListening) {
      stopSpeechToText();
      return;
    }

    const recognition = new SpeechRecognitionAPI();
    recognition.lang = "en-US";
    recognition.interimResults = true;
    recognition.continuous = true;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => setIsListening(true);

    recognition.onresult = (event) => {
      let transcript = "";
      for (let i = 0; i < event.results.length; i++) {
        transcript += event.results[i][0].transcript;
      }
      transcript = transcript.trim();
      if (transcript) {
        setSearchTerm(transcript);
        setPage(1);
      }
    };

    recognition.onerror = (event) => {
      stopSpeechToText();
      if (event.error === "not-allowed") {
        toast.error("Microphone access was denied.");
      } else if (event.error !== "aborted" && event.error !== "no-speech") {
        toast.error("Could not capture speech. Please try again.");
      }
    };

    recognition.onend = () => {
      if (listenTimeoutRef.current) {
        clearTimeout(listenTimeoutRef.current);
        listenTimeoutRef.current = null;
      }
      setIsListening(false);
    };

    recognitionRef.current = recognition;
    recognition.start();

    // Auto-stop after max 30 seconds
    listenTimeoutRef.current = setTimeout(() => {
      stopSpeechToText();
    }, MAX_LISTEN_MS);
  };

  // 👇 Filter posts safely
  const filteredPosts = useMemo(() => {
    const search = searchTerm.toLowerCase();

    return posts.filter((post) => {
      const title = post?.title?.toLowerCase() || "";
      const content =
        post?.content?.toLowerCase() || post?.body?.toLowerCase() || "";

      // ✅ Search filter
      const matchesSearch = title.includes(search) || content.includes(search);

      // ✅ Tag (A–Z range) filter
      let matchesTag = true;
      if (selectedTag) {
        const firstLetter = (post?.title?.[0] || "").toUpperCase();
        matchesTag =
          firstLetter >= selectedTag.start && firstLetter <= selectedTag.end;
      }

      return matchesSearch && matchesTag;
    });
  }, [posts, searchTerm, selectedTag]);

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
    startIndex + postsPerPage,
  );

  const handleEdit = (postId) => navigate(`/edit/${postId}`);

  const handleDelete = async (postId) => {
    toast("Are you sure you want to delete this post?", {
      action: {
        label: "Delete",
        onClick: async () => {
          await removePost(postId);
        },
      },
      cancel: { label: "Cancel" },
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
            {/* Search Input + Speech-to-Text */}
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder={isListening ? "Listening..." : "Search posts..."}
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setPage(1);
                }}
                className={`pl-8 w-48 md:w-64 ${searchTerm ? "pr-16" : "pr-10"}`}
              />
              <div className="absolute right-1.5 top-1/2 -translate-y-1/2 flex items-center">
                {searchTerm && (
                  <button
                    type="button"
                    onClick={() => {
                      setSearchTerm("");
                      setPage(1);
                    }}
                    aria-label="Clear search"
                    title="Clear search"
                    className="rounded-md p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
                <button
                  type="button"
                  onClick={toggleSpeechToText}
                  aria-label={
                    isListening ? "Stop voice search" : "Start voice search"
                  }
                  title={isListening ? "Stop listening" : "Search by voice"}
                  className={`rounded-md p-1.5 transition-colors ${
                    isListening
                      ? "text-destructive bg-destructive/10"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  }`}
                >
                  {isListening ? (
                    <MicOff className="h-4 w-4" />
                  ) : (
                    <Mic className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            <Button size="lg" onClick={() => navigate("/create")}>
              <PenSquare className="mr-2 h-5 w-5" />
              New Post
            </Button>
          </div>
        </div>

        {/* Tag Filter */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {TAG_RANGES.map((tag) => (
            <Button
              key={tag.label}
              variant={selectedTag?.label === tag.label ? "default" : "outline"}
              onClick={() => {
                setSelectedTag(selectedTag?.label === tag.label ? null : tag);
                setPage(1);
              }}
              className="rounded-full"
            >
              {tag.label}
            </Button>
          ))}
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
              {searchTerm || selectedTag
                ? "Try adjusting your filters."
                : "Start creating amazing content for your readers."}
            </p>
            {!searchTerm && !selectedTag && (
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

            {/* Pagination */}
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
                            ? "bg-primary/90 text-white dark:bg-primary/90"
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
