import { Link, useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';

const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    Cookies.remove('jwt_token');
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-brand" aria-label="Go to dashboard home">
          Go Business
        </Link>
        <div className="navbar-links">
          <Link to="/" aria-label="Primary" className="nav-link">Home</Link>
          <button onClick={handleLogout} className="btn btn-logout">
            Log out
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
