import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="not-found-container">
      <div className="not-found-content">
        <h1>404 - Page Not Found</h1>
        <p>The page you are looking for does not exist.</p>
        <Link to="/" className="btn btn-primary mt-4">
          Back to dashboard
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
