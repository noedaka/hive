import { useState } from "react"

export interface CommentFormProps {
    onSubmit: (commentText: string) => Promise<void> | void;
    isSubmitting?: boolean;
    error?: string | null;
}

export default function CommentForm({ onSubmit, isSubmitting = false, error }: CommentFormProps) {
    const [commentText, setCommentText] = useState("")
    const [localError, setLocalError] = useState<string | null>(null)

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()

        if (!commentText.trim()) {
            setLocalError("Comment cannot be empty")
            return
        }
        
        if (commentText.length > 1000) {
            setLocalError("Comment must be less than 1000 characters")
            return
        }
        
        setLocalError(null)
        
        try {
            await onSubmit(commentText)
            setCommentText("")
        } catch (err) {
            console.error("Error submitting comment:", err)
        }
    }

    function handleChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
        setCommentText(e.target.value)
        
        if (localError) {
            setLocalError(null)
        }
    }

    return (
        <div className="comment-form-section">
            {(error || localError) && (
                <div className="auth-error" style={{ marginBottom: '15px' }}>
                    {error || localError}
                </div>
            )}
            
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <textarea 
                        name="comment-text" 
                        id="comment-text" 
                        className="form-textarea" 
                        required 
                        placeholder="Write your comment here... (max 1000 characters)"
                        value={commentText}
                        onChange={handleChange}
                        disabled={isSubmitting}
                        maxLength={1000}
                        rows={4}
                    />
                    <div className="comment-form-footer">
                        <div className="character-count">
                            {commentText.length}/1000
                        </div>
                        <button 
                            type="submit" 
                            className="form-button"
                            disabled={isSubmitting || !commentText.trim()}
                        >
                            {isSubmitting ? "Sending..." : "Send"}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    )
}