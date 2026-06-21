import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-brand">
          Go Business
          <span className="copyright">© 2024 Go Business</span>
        </div>
        <nav aria-label="Footer" className="footer-nav">
          <Link to="#about">About</Link>
          <Link to="#privacy">Privacy</Link>
        </nav>
      </div>
    </footer>
  );
};

export default Footer;
