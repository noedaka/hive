import type { Post } from "../../types"

export interface PostCardProps {
    post: Post
    onClick: () => void
}

export default function PostCard({ post, onClick }: PostCardProps) {
    function handleClick(event: React.MouseEvent<HTMLAnchorElement>) {
        event.preventDefault()
        onClick()
    }

    return (
        <div className="post">
            <div className="post-header">
                <div className="post-author">{post.author.userName}</div>
            </div>
            <a className="post-content" onClick={handleClick}>
                <p className="post-text">{post.text}</p>
                {post.postImg && (
                    <img 
                        src={post.postImg} 
                        alt="post img" 
                        className="post-img"
                    />
                )}
            </a>
            <div className="post-footer">
                <button className="post-like-button">
                    <span className="post-likes-count">{post.likes}</span>
                </button>
            </div>
        </div>
    )
}