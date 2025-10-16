import { useParams } from "react-router"
import Layout from "../components/Layout"
import type { Post, Comment } from "../types"
import DetailedPost from "../components/DetailedPost"
import CommentItem from "../components/CommentItem"
import CommentForm from "../components/CommentForm"

export default function PostScreen() {
    const { postId } = useParams()

    const post: Post = {
        id: postId || "1",
        author: { userName: "Иван Иванов" },
        text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
        postImg: "/sunset.jpg",
        likes: 123
    }

    const comments: Comment[] = [
        {
            id: "1",
            author: { userName: "Иван Иванов" },
            text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
            date: "October 12, 2025 at 12:30"
        },
        {
            id: "2",
            author: { userName: "Иван Иванов" },
            text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
            date: "October 12, 2025 at 12:30"
        }
    ]

    function handleCommentSubmit(commentText: string) {
        console.log("Adding comment:", commentText)
    }

    return (
        <Layout>
            <div className="full-post">
                <DetailedPost post={post} />
                
                <div className="comment-section">
                    <h2 className="comments-title">Comments</h2>
                    <CommentForm onSubmit={handleCommentSubmit} />
                    <div className="comments">
                        {comments.map(comment => (
                            <CommentItem key={comment.id} comment={comment} />
                        ))}
                    </div>
                </div>
            </div>
        </Layout>
    )
}