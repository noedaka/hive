import { useParams } from "react-router"
import { useState, useEffect } from "react"
import Layout from "../components/layout/Layout"
import DetailedPost from "../components/post/DetailedPost"
import CommentItem from "../components/comment/CommentItem"
import CommentForm from "../components/comment/CommentForm"
import { usePost } from "../hooks/usePost"
import { useComments } from "../hooks/useComments"
import type { Comment } from "../types"

export default function PostScreen() {
    const { postId } = useParams()
    const { post, comments: serverComments, error, refetch } = usePost(postId)
    
    const [comments, setComments] = useState<Comment[]>([])
    const [optimisticComments, setOptimisticComments] = useState<Comment[]>([])

    const { createComment, isSubmitting, error: commentError } = useComments(postId || '')

    useEffect(() => {
        if (serverComments && serverComments.length > 0) {
            setComments(serverComments)
        }
    }, [serverComments])

    async function handleCommentSubmit(commentText: string) {
        if (!postId) return
        
        // Создаем временный комментарий для оптимистичного обновления
        const tempComment: Comment = {
            id: `temp-${Date.now()}`,
            author: { 
                userName: localStorage.getItem('username') || 'You' 
            },
            text: commentText,
            date: new Date().toISOString(),
        }
        
        // Добавляем временный комментарий
        setOptimisticComments(prev => [...prev, tempComment])
        
        try {
            // Отправляем комментарий на сервер
            await createComment(commentText)
            
            // После успешной отправки обновляем пост
            await refetch()
            
            // Удаляем временный комментарий после обновления
            setOptimisticComments(prev => 
                prev.filter(comment => comment.id !== tempComment.id)
            )
            
        } catch (err) {
            // В случае ошибки удаляем временный комментарий
            setOptimisticComments(prev => 
                prev.filter(comment => comment.id !== tempComment.id)
            )
            console.error("Failed to create comment:", err)
        }
    }

    // Объединяем серверные и оптимистичные комментарии
    const allComments = [...optimisticComments, ...comments]

    if (error) {
        return (
            <Layout>
                <div className="error-container">
                    <div className="error-message">Error: {error}</div>
                    <button 
                        onClick={refetch}
                        className="auth-button"
                        style={{ marginTop: '20px' }}
                    >
                        Try Again
                    </button>
                </div>
            </Layout>
        )
    }

    if (!post) {
        return (
            <Layout>
                <div className="empty-state">
                    <h2>Post not found</h2>
                    <p>The post you're looking for doesn't exist.</p>
                </div>
            </Layout>
        )
    }

    return (
        <Layout>
            <div className="full-post">
                <DetailedPost post={post} />
                
                <div className="comment-section">
                    <h2 className="comments-title">
                        Comments ({allComments.length})
                    </h2>
                    
                    <CommentForm 
                        onSubmit={handleCommentSubmit}
                        isSubmitting={isSubmitting}
                        error={commentError}
                    />
                    
                    <div className="comments">
                        {allComments.length === 0 ? (
                            <div className="empty-comments">
                                <p>No comments yet. Be the first to comment!</p>
                            </div>
                        ) : (
                            allComments.map(comment => (
                                <CommentItem key={comment.id} comment={comment} />
                            ))
                        )}
                    </div>
                </div>
            </div>
        </Layout>
    )
}