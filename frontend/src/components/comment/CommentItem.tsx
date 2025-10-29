import type { Comment } from "../../types"

export interface CommentItemProps {
    comment: Comment
}

export default function CommentItem({ comment }: CommentItemProps) {
    return (
        <div className="comment">
            <div className="comment-header">
                <div className="comment-author">{comment.author.userName}</div>
                <div className="comment-date">{comment.date}</div>
            </div>
            <div className="comment-content">
                <p className="comment-text">{comment.text}</p>
            </div>
        </div>
    )
}