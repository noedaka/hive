import type { Post } from "../../types"

export interface DetailedPostProps {
    post: Post
}

export default function DetailedPost({ post }: DetailedPostProps) {
    return (
        <div className="post detailed">
            <div className="post-header">
                <div className="post-author">{post.author.userName}</div>
                <div className="post-date">October 12, 2025 at 12:00</div>
            </div>
            <div className="post-content">
                <p className="post-text">{post.text}</p>
                {post.postImg && (
                    <img 
                        src={post.postImg} 
                        alt="post img" 
                        className="post-img"
                    />
                )}
            </div>
            <div className="post-footer">
                <button className="post-like-button">
                    <span className="post-likes-count">{post.likes}</span>
                </button>
            </div>
        </div>
    )
}