import { Link, useNavigate } from "react-router";
import { useAuth } from "../../hooks/useAuth";

export default function Header() {
  const navigate = useNavigate();
  const { isAuthenticated, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <header className="header">
      <div className="header-container">
        <Link to="/" className="header-name">
          Hive
        </Link>
        <nav className="header-nav">
          {isAuthenticated && (
            <Link to="/posts/new" className="header-button">
              Create Post
            </Link>
          )}
          
          {isAuthenticated ? (
            <button 
              onClick={handleLogout} 
              className="header-button"
              style={{ cursor: 'pointer' }}
            >
              Logout
            </button>
          ) : (
            <Link to="/auth/signin" className="header-button">
              Sign In
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}