import React, { useState } from 'react';
import './header.css';
import network from '../libs/network.js';
import Sidebar from './sidebar.jsx';
import { LogoutSuccessModal, ConfirmLogoutModal } from './modal.jsx';

// Reusable logout hook
export function useLogout() {
  const [showLogout, setShowLogout] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  // Logout function
  const logout = async () => {
    try {
      await network.post('/auth/logout');
      localStorage.clear();
    } catch (err) {}
    setShowLogout(true);
  };

  // Confirm modal handlers
  const handleLogoutClick = () => setShowConfirm(true);
  const handleConfirmYes = () => {
    setShowConfirm(false);
    logout();
  };
  const handleConfirmNo = () => setShowConfirm(false);

  // Render modals (to be included in the component's JSX)
  const logoutModals = (
    <>
      <ConfirmLogoutModal
        open={showConfirm}
        message="Are you sure you want to logout?"
        onConfirm={handleConfirmYes}
        onCancel={handleConfirmNo}
      />
      {showLogout && <LogoutSuccessModal />}
    </>
  );

  return { handleLogoutClick, logoutModals };
}

function Header() {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  // Get user fullName and pic from localStorage/sessionStorage (set after login)
  let fullName = '';
  let profilePic = '/MaskGroup.svg';
  try {
    const userStr = localStorage.getItem('user') || sessionStorage.getItem('user');
    if (userStr) {
      const user = JSON.parse(userStr);
      fullName = user.fullName || user.name || user.email || '';
      if (user.picSignedUrl) {
        profilePic = user.picSignedUrl;
      } else if (user.signedPicUrl) {
        profilePic = user.signedPicUrl;
      }
    }
  } catch {}

  // Use the reusable logout hook
  const { handleLogoutClick, logoutModals } = useLogout();

  // Sidebar toggle handler
  const handleSidebarToggle = () => setSidebarOpen((open) => !open);
  const handleSidebarClose = () => setSidebarOpen(false);

  return (
    <header className="top-header">
      <button className="profile-right" onClick={handleSidebarToggle} style={{background: 'none', border: 'none', padding: 0, cursor: 'pointer'}}>
        <img src="menu.svg" alt="Open sidebar" />
      </button>
      <div className="logo-box">
        <img src="uolo.svg" alt="Logo" />
      </div>
      {/* <div className="profile-left">
        <img src="account_circle.svg" alt="Account" />
      </div> */}
      <div
        className="profile"
        onClick={() => setDropdownOpen((open) => !open)}
      >
        <img src={profilePic} alt="Profile" className="pic" />
        <span className="name">{fullName}</span>
        <span className="dropdown">
          <img src="/dropdown.svg" alt="Dropdown" style={{ width: 12, height: 8, verticalAlign: 'middle' }} />
        </span>
        <div className={`dropdown-menu${dropdownOpen ? ' open' : ''}`}>
          {/* Show confirm modal before logout */}
          <button type="button" className="logout" onClick={handleLogoutClick} style={{ color:'#667085',background: 'none', border: 'none', padding: 0, display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
            <img src="/icon.svg" alt="Logout Icon" style={{width: 16, height: 16}} />
            Logout
          </button>
        </div>
      </div>
      {/* Sidebar slide-out for mobile, controlled by sidebarOpen */}
      {typeof window !== 'undefined' && window.innerWidth <= 720 && (
        <Sidebar open={sidebarOpen} onClose={handleSidebarClose} />
      )}
      {/* Render logout modals from hook */}
      {logoutModals}
    </header>
  );
}

export default Header;