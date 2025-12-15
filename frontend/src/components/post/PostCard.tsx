import { Link } from "react-router";
import { useState } from "react";
import type { Post } from "../../types";
import { useLike } from "../../hooks/useLikes";

export interface PostCardProps {
  post: Post;
  onClick?: () => void;
}

const trimText = (text: string, maxLength: number = 50): string => {
  if (text.length <= maxLength) return text;

  const trimmed = text.substr(0, maxLength);
  return trimmed.substr(0, Math.min(trimmed.length, trimmed.lastIndexOf(" "))) + "...";
};

export default function PostCard({ post, onClick }: PostCardProps) {
  const { likes, isLiked, isLoading, toggleLike } = useLike(post.id, post.likes);
  const [isExpanded, setIsExpanded] = useState(false);

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

  function toggleExpand(event: React.MouseEvent) {
    event.preventDefault();
    event.stopPropagation();
    setIsExpanded(!isExpanded);
  }

  const shouldTrim = post.text.length > 200;
  const displayText = isExpanded ? post.text : trimText(post.text);

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
        <p className="post-text">
          {displayText}
          {shouldTrim && (
            <button 
              className="read-more-btn"
              onClick={toggleExpand}
              aria-label={isExpanded ? "Show less" : "Read more"}
            >
              {isExpanded ? " Show less" : " Read more"}
            </button>
          )}
        </p>
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