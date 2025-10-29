import { useNavigate } from "react-router";
import Layout from "../components/layout/Layout";
import PostCard from "../components/post/PostCard";
import type { Post } from "../types";

export default function MainScreen() {
    const navigate = useNavigate()

    const posts: Post[] = [
    {   
        id: "gfhf124",
        author: {userName: "Иван Иванович"},
        text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
        postImg: "",
        likes: 123
    },
    {   
        id: "qwf123",
        author: {userName: "Иван Иванович"},
        text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
        postImg: "/sunset.jpg",
        likes: 123
    },
    ]

    function handlePostCardClick(post: Post) {
        navigate(`posts/${post.id}`)
    }

    return(
        <Layout>
            <div className="posts">
                {posts.map((post, i) => <PostCard key={i} post={post} onClick={() => handlePostCardClick(post)}/>)}
            </div>
        </Layout>
    )
}