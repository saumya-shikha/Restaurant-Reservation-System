import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!user) return null;

  const isAdmin = user.role === 'admin';

  return (
    <nav className={`nav-bar ${isAdmin ? 'admin-nav' : 'customer-nav'}`}>
      <div className="nav-container">
        <span className="brand-logo">
          BistroBooker {isAdmin && <strong className="badge">ADMIN PORTAL</strong>}
        </span>
        <ul className="nav-links">
          {isAdmin ? (
            <>
              <li><Link to="/admin/reservations">All Reservations</Link></li>
              <li><Link to="/admin/tables">Manage Tables</Link></li>
            </>
          ) : (
            <>
              <li><Link to="/customer/book">Book Table</Link></li>
              <li><Link to="/customer/reservations">My Reservations</Link></li>
            </>
          )}
          <li className="user-info">Hello, {user.name}</li>
          <li><button onClick={handleLogout} className="logout-btn">Logout</button></li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;