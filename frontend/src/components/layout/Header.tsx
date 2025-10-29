import { Link } from "react-router";

export default function Header() {
    return(
        <header className="header">
        <div className="header-container">
            <Link to="/" className="header-name">
                Hive
            </Link>
            <nav className="header-nav">
                <Link to="/posts/new" className="header-button">Create Post</Link>
                <Link to="/auth/signIn" className="header-button">Sign In</Link>
            </nav>
        </div>
    </header>
    )
}