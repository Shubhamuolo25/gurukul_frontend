import React, { useState, useEffect } from "react";
import "./cards.css";
import { ConfirmDeleteModal } from "./modal";
import { ImageWithLoading } from './loadingState.jsx';

function Cards({ data, onDeleteRequest, error }) {
  const [teamMembers, setTeamMembers] = useState([]);
  const [hoveredIdx, setHoveredIdx] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  // Always update local state when data changes (including after search)
  useEffect(() => {
    if (Array.isArray(data)) {
      setTeamMembers(data);
    }
  }, [data]);

  const handleDeleteClick = (_id) => {
    setDeleteId(_id);
    setShowConfirm(true);
  };

  const handleConfirmDelete = () => {
    setShowConfirm(false);
    if (typeof onDeleteRequest === 'function' && deleteId) {
      onDeleteRequest(deleteId);
    }
  };

  const handleCancelDelete = () => {
    setShowConfirm(false);
    setDeleteId(null);
  };

  const filteredMembers = teamMembers.filter(
    (member) => (member.fullName || member.email || member.pic) && member.delete !== true
  );

  if (error) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "calc(100vh - 252px)",
          fontSize: "1.2rem",
          fontWeight: "bold",
        }}
      >
        Error loading team members.
      </div>
    );
  }

  return (
    <>
      <div className="cards-list">
        {filteredMembers.length === 0 ? (
          <div>No team members found.</div>
        ) : (
          filteredMembers.map((member, idx) => (
            <div
              key={member._id || member.id || idx}
              className="card"
              onMouseEnter={() => setHoveredIdx(idx)}
              onMouseLeave={() => setHoveredIdx(null)}
            >
              <button
                className="delete-btn"
                style={{ display: hoveredIdx === idx ? "flex" : "none" }}
                onClick={e => {
                  e.stopPropagation();
                  handleDeleteClick(member._id || member.id);
                }}
                aria-label="Delete"
              >
                ×
              </button>
              <div className="card-image">
                <ImageWithLoading src={member.signedPicUrl} />
              </div>
              <div className="card-info">
                <div className="card-name">{member.name || ""}</div>
                <div className="card-email">{member.email || ""}</div>
              </div>
            </div>
          ))
        )}
      </div>
      {/* Use reusable ConfirmDeleteModal for delete confirmation */}
      <ConfirmDeleteModal
        open={showConfirm}
        message="Are you sure you want to delete the user?"
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />
    </>
  );
}

export default Cards;