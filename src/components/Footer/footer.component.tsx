import React from 'react';
import { Link } from 'react-router-dom';

interface FooterProps {
  sidebarCollapsed: boolean;
}

const Footer: React.FC<FooterProps> = ({ sidebarCollapsed }) => {
  return (
    <footer className={`footer ${sidebarCollapsed ? 'expanded' : ''}`}>
      <div className="container-fluid py-3">
        <div className="row text-muted">
          <div className="col-lg-6 col-4 text-start">
            <p className="mb-0">
              <Link to="/" className="text-muted">
                <strong>Theranostics</strong>
              </Link>
            </p>
          </div>
          <div className="col-lg-6 col-8 text-end">
            <ul className="list-inline">
              <li className="list-inline-item">
                <Link to="/" className="text-muted">Terms and Conditions</Link>
              </li>
              <li className="list-inline-item">
                <Link to="/" className="text-muted">Privacy Policy</Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
