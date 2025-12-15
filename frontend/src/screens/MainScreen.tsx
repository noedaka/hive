import { useNavigate } from "react-router";
import Layout from "../components/layout/Layout";
import PostCard from "../components/post/PostCard";
import { usePosts } from "../hooks/usePosts";

export default function MainScreen() {
  const navigate = useNavigate();
  const { posts, error, refetch } = usePosts();

  function handlePostCardClick(post: { id: string | number }) {
    navigate(`/posts/${post.id}`);
  }

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
    );
  }

  if (posts.length === 0) {
    return (
      <Layout>
        <div className="empty-state">
          <h2>No posts yet</h2>
          <p>Be the first to create a post!</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="posts">
        {posts.map((post) => (
          <PostCard 
            key={post.id} 
            post={post} 
            onClick={() => handlePostCardClick(post)}
          />
        ))}
      </div>
    </Layout>
  );
}