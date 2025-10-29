import { useState } from "react"

export interface CommentFormProps {
    onSubmit: (commentText: string) => void
}

export default function CommentForm({ onSubmit }: CommentFormProps) {
    const [commentText, setCommentText] = useState("")

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        onSubmit(commentText)
        setCommentText("")
    }

    return (
        <div className="comment-form-section">
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <textarea 
                        name="comment-text" 
                        id="comment-text" 
                        className="form-textarea" 
                        required 
                        placeholder="Write your comment here..."
                        value={commentText}
                        onChange={(e) => setCommentText(e.target.value)}
                    />
                    <button type="submit" className="form-button">Send</button>
                </div>
            </form>
        </div>
    )
}