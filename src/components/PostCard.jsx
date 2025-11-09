import { Link } from "react-router-dom";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit, Trash2, Eye } from "lucide-react";
import DOMPurify from "dompurify";

const PostCard = ({ post, onEdit, onDelete, showActions = true }) => {
  const truncateText = (text, maxLength) => {
    if (text.length <= maxLength) return text;
    return text.substr(0, maxLength) + "...";
  };

  return (
    <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
      <CardHeader>
        <h3 className="text-xl font-semibold line-clamp-2 group-hover:text-primary transition-colors">
          {post.title}
        </h3>
        {post.author && (
          <p className="text-sm text-muted-foreground mt-1">by {post.author}</p>
        )}
      </CardHeader>
      <CardContent>
        <p
          className="text-muted-foreground line-clamp-3"
          dangerouslySetInnerHTML={{ __html: truncateText(post.body, 150) }}
        />
      </CardContent>

      {showActions && (
        <CardFooter className="flex justify-between gap-2 mt-auto">
          <Link to={`/post/${post.id}`} className="flex-1">
            <Button
              variant="outline"
              className="w-full border-2 border-primary text-primary"
              size="sm"
            >
              <Eye className="mr-2 h-4 w-4 " />
              Read More
            </Button>
          </Link>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onEdit(post.id)}
            className="border-2 border-primary text-primary"
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onDelete(post.id)}
            className="hover:text-destructive-foreground border-2 border-primary text-primary"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};

export default PostCard;
