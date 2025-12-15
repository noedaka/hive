import { Link } from "react-router";
import type { Post } from "../../types";
import { useLike } from "../../hooks/useLikes";

export interface PostCardProps {
  post: Post;
  onClick?: () => void;
}

export default function PostCard({ post, onClick }: PostCardProps) {
  const { likes, isLiked, isLoading, toggleLike } = useLike(post.id, post.likes);

  function handleClick(event: React.MouseEvent<HTMLAnchorElement>) {
    event.preventDefault();
    if (onClick) {
      onClick();
    }
  }

  function handleLikeClick(event: React.MouseEvent<HTMLButtonElement>) {
    event.preventDefault();
    event.stopPropagation();
    toggleLike();
  }

  return (
    <div className="post">
      <div className="post-header">
        <div className="post-author">{post.author.userName}</div>
        {post.created_at && (
          <div className="post-date">
            {new Date(post.created_at).toLocaleDateString()}
          </div>
        )}
      </div>
      {post.title && (
        <h3 className="post-title">{post.title}</h3>
      )}
      <Link to={`/posts/${post.id}`} className="post-content" onClick={handleClick}>
        <p className="post-text">{post.text}</p>
        {post.postImg && (
          <div className="post-img">
            <img 
              src={post.postImg} 
              alt="post" 
              className="post-image"
            />
          </div>
        )}
      </Link>
      <div className="post-footer">
        <button 
          className={`post-like-button ${isLiked ? 'post-like-button--active' : ''}`}
          onClick={handleLikeClick}
          disabled={isLoading}
          aria-label={isLiked ? "Unlike this post" : "Like this post"}
        >
          <span className="post-likes-count">{likes}</span>
        </button>
      </div>
    </div>
  );
}