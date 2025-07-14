import React from "react";
import "./modal.css";
import { useNavigate } from "react-router-dom";

const Modal = ({ open, onClose, children }) => {
    if (!open) return null;
    return (
        <div className="custom-modal-overlay" onClick={onClose}>
            <div className="custom-modal-content" onClick={e => e.stopPropagation()}>
                {children}
            </div>
        </div>
    );
};

export default Modal;

// SuccessModal component for use in forms
export const SuccessModal = ({ message }) => {
    const navigate = useNavigate();
    return (
        <Modal open={true} onClose={() => navigate('/App')}>
            <div className="success-modal">
                <img src="/success.svg" alt="Success" style={{ width: 400, height: 224, objectFit: "contain" }} />
                <p>{message}</p>
            </div>
        </Modal>
    );
};

//SuccessModal component for use logout Successful

export const LogoutSuccessModal = ({ message }) => {
    const navigate = useNavigate();
    React.useEffect(() => {
        const timer = setTimeout(() => {
            navigate('/');
        }, 3000);
        return () => clearTimeout(timer);
    }, [navigate]);
    const handleClose = () => navigate('/');
    return (
        <Modal open={true} onClose={handleClose}>
            <div className="logout-success-modal">
                <img src="/logoutModal.svg" alt="Success" style={{ width: 400, height: 224, objectFit: "contain" }} />
                <p>{message}</p>
            </div>
        </Modal>
    );
};

// Reusable ConfirmDeleteModal (for cards)
export const ConfirmDeleteModal = ({ open, message, onConfirm, onCancel }) => {
    if (!open) return null;
    return (
        <div className="delete-confirm-overlay" style={{zIndex: 2000}}>
          <div className="delete-confirm-modal" style={{minWidth: 340, maxWidth: '90vw', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
            <div className="delete-confirm-message" style={{fontSize: '1.15rem', fontWeight: 500, marginBottom: 24, color: '#222'}}>
              {message || 'Are you sure you want to delete the user?'}
            </div>
            <div className="delete-confirm-actions" style={{display: 'flex', gap: 18, justifyContent: 'center'}}>
              <button type="button" className="btnConfirmDelete" style={{padding: '8px 22px', borderRadius: 6, border: 'none', fontSize: '1rem', fontWeight: 500, cursor: 'pointer', background: '#e53935', color: '#fff'}} onClick={onConfirm} autoFocus>Yes</button>
              <button type="button" className="btnCancelDelete" style={{padding: '8px 22px', borderRadius: 6, border: 'none', fontSize: '1rem', fontWeight: 500, cursor: 'pointer', background: '#f1f1f1', color: '#333'}} onClick={onCancel}>No</button>
            </div>
          </div>
        </div>
    );
};

// Reusable ConfirmLogoutModal (for header)
export const ConfirmLogoutModal = ({ open, message, onConfirm, onCancel }) => {
    if (!open) return null;
    return (
        <div className="delete-confirm-overlay" style={{zIndex: 2000}}>
          <div className="delete-confirm-modal" style={{minWidth: 340, maxWidth: '90vw', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
            <div className="delete-confirm-message" style={{fontSize: '1.15rem', fontWeight: 500, marginBottom: 24, color: '#222'}}>
              {message || 'Are you sure you want to logout?'}
            </div>
            <div className="delete-confirm-actions" style={{display: 'flex', gap: 18, justifyContent: 'center'}}>
              <button type="button" className="btnConfirmDelete" style={{padding: '8px 22px', borderRadius: 6, border: 'none', fontSize: '1rem', fontWeight: 500, cursor: 'pointer', background: '#e53935', color: '#fff'}} onClick={onConfirm} autoFocus>Yes</button>
              <button type="button" className="btnCancelDelete" style={{padding: '8px 22px', borderRadius: 6, border: 'none', fontSize: '1rem', fontWeight: 500, cursor: 'pointer', background: '#f1f1f1', color: '#333'}} onClick={onCancel}>No</button>
            </div>
          </div>
        </div>
    );
};

// Modal for 'You have been logged out' with a single OK button
export const LoggedOutModal = ({ open, message, onOk }) => {
    if (!open) return null;
    return (
        <div className="delete-confirm-overlay" style={{zIndex: 2000}}>
          <div className="delete-confirm-modal" style={{minWidth: 340, maxWidth: '90vw', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
            <div className="delete-confirm-message" style={{fontSize: '1.15rem', fontWeight: 500, marginBottom: 24, color: '#222'}}>
              {message || 'You have been logged out.'}
            </div>
            <div className="delete-confirm-actions" style={{display: 'flex', gap: 18, justifyContent: 'center'}}>
              <button type="button" className="btnConfirmDelete" style={{padding: '8px 22px', borderRadius: 6, border: 'none', fontSize: '1rem', fontWeight: 500, cursor: 'pointer', background: '#5b17e7', color: '#fff'}} onClick={onOk} autoFocus>OK</button>
            </div>
          </div>
        </div>
    );
};