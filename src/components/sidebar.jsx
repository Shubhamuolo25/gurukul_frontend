import './sidebar.css';
import { useNavigate, useLocation } from 'react-router-dom';
import React from 'react';
import { useLogout } from './header.jsx';

function Sidebar({ open, onClose }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { handleLogoutClick, logoutModals } = useLogout();

  // Determine which image to use for each nav item based on active route
  const isAllTeamActive = location.pathname === '/App';
  const isCreateProfileActive = location.pathname === '/createprofile';

  // Only show sidebar on mobile if open, always show on desktop
  const isMobile = window.innerWidth <= 720;
  let visible = true;
  if (isMobile) visible = open;

  // Overlay for mobile
  return (
    <>
      {isMobile && open && (
        <div
          className="sidebar-overlay"
          onClick={onClose}
        />
      )}
      {visible && (
        <div
          className={`sidebar${isMobile && open ? ' open' : ''}`}
          style={{ display: 'flex', flexDirection: 'column'}}
        >
          <div className="sidebar-content">
            {/* Show logo at top only on mobile */}
            {isMobile && (
              <div style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '24px 0 12px 0' }}>
                <img src="/uolo.svg" alt="Uolo Logo" style={{ width: 95, height: 32, objectFit: 'contain', marginTop: 15, marginBottom: 65 }} />
              </div>
            )}
            <ul className="nav-menu" style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
              <li
                className={`nav-item${isAllTeamActive ? ' active' : ''}`}
                onClick={() => { navigate('/App'); if (isMobile) onClose && onClose(); }}
                style={{ cursor: "pointer" }}
              >
                <img src={isAllTeamActive ? "/group.svg" : "/group_2.svg"} alt="Profile" className="pic" />
                <span>&emsp;All Team Member</span>
              </li>
              <li
                className={`nav-item${isCreateProfileActive ? ' active' : ''}`}
                onClick={() => { navigate('/createprofile'); if (isMobile) onClose && onClose(); }}
                style={{ cursor: "pointer" }}
              >
                <img src={isCreateProfileActive ? "/person_add_2.svg" : "/person_add.svg"} alt="Profile" className="pic" />
                <span>&emsp;Create Profile</span>
              </li>
            </ul>
          </div>
          {/* Logout button as sticky footer */}
          <button
            className="nav-item logout sidebar-logout-btn"
            onClick={handleLogoutClick}
          >
            <img src="/icon.svg" alt="Logout Icon" style={{ width: 16, height: 16 }} />
            Logout
          </button>
          {/* Render logout modals from useLogout hook */}
          {logoutModals}
        </div>
      )}
    </>
  );
}

export default Sidebar;
