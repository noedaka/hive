import type { Comment } from "../../types"

export interface CommentItemProps {
    comment: Comment
}

export default function CommentItem({ comment }: CommentItemProps) {
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const isTemporary = typeof comment.id === 'string' && comment.id.startsWith('temp-');

    return (
        <div className={`comment ${isTemporary ? 'comment-temporary' : ''}`}>
            <div className="comment-header">
                <div className="comment-author">
                    {comment.author.userName}
                    {isTemporary && (
                        <span className="comment-status"> (Sending...)</span>
                    )}
                </div>
                <div className="comment-date">{formatDate(comment.date)}</div>
            </div>
            <div className="comment-content">
                {comment.text}
            </div>
        </div>
    )
}